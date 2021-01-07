<?php

namespace Maruf89\CommunityDirectory\Email;

use Maruf89\CommunityDirectory\Includes\ClassErrorHandler;
use Maruf89\CommunityDirectory\Email\Interfaces\IMailer;
use \SendinBlue\Client\Configuration;
use \SendinBlue\Client\Api\TransactionalEmailsApi;
use \SendinBlue\Client\Model\{SendSmtpEmail, SendSmtpEmailTo, GetSmtpTemplateOverviewSender};

class ClassTransactionalMailer implements IMailer {
    private static ClassTransactionalMailer $instance;
    private string $api_key;
    private array $lists = [];
    private string $list_id;
    private string $server_prefix;
    private string $url;
    private TransactionalEmailsApi $transaction_api;

    private GetSmtpTemplateOverviewSender $sender;
    private array $templates;

    public static function get_instance():ClassTransactionalMailer {
        if ( isset( $instance ) ) return $instance;

        return static::$instance = new ClassTransactionalMailer();
    }

    public function __construct() {
        $this->api_key = SENDINBLUE_API_KEY;
        
        $mailer_instance =& $this;
        require_once( dirname(__FILE__) . '/wp_mail_override.php' );

        $this->load_actions_and_filters();

        $config = Configuration::getDefaultConfiguration()->setApiKey(
            'api-key',
            $this->api_key
        );

        $this->transaction_api = new TransactionalEmailsApi(
            new \GuzzleHttp\Client(),
            $config
        );
        
        try {
            $result = $this->transaction_api->getSmtpTemplatesWithHttpInfo();
            if ( $result[ 1 ] === 200) {
                $this->sender = $result[0]->getTemplates()[0]->getSender();
                foreach ( $result[0]->getTemplates() as $template )
                    $this->templates[ $template->getName() ] = $template->getId();
            }

        } catch (Exception $e) {
            ClassErrorHandler::handle_exception( new \WP_Error( '', 'Error loading templates from SendInBlue', $e->getMessage() ) );
        }

    }

    private function load_actions_and_filters() {
        add_action( 'retrieve_password_key', array( $this, 'send_forgotten_password_email' ), 10, 2 );
    }

    public function send_welcome_email(
        array $save_result,
        array $data,
        string $validation_type,
        int $user_id
    ) {
        if ( $validation_type !== 'register' )
                return $data;

        $user = new \WP_User( $user_id );
        $email_addr = $user->data->user_email;
        $email = new SendSmtpEmail( array(
            'to'            => [ $this->get_to_from_user( $user ) ],
            'subject'       => get_bloginfo() . __( ' - Account Activation', 'community-directory' ),
            'templateId'    => $this->templates[ 'signup' ],
            'params'        => (object) [
                'display_name' => $user->data->display_name,
                'activation_link' => uwp_get_activation_link( $user_id ),
                'site_name' => get_bloginfo()
            ]
        ) );

        try {
            $response = $this->transaction_api->sendTransacEmailWithHttpInfo( $email );
            if ( $response[ 1 ] !== 201 ) {
                ClassErrorHandler::handle_exception( new \WP_Error( '', "Unsuccessful attempt sending activation email to $email_addr", $response ) );
            }
        } catch ( Exception $e ) {
            ClassErrorHandler::handle_exception( new \WP_Error( '', "Error sending activation email to $email_addr", $e->getMessage() ) );
        }
        
        return $data;
    }

    public function send_forgotten_password_email( string $user_login, string $key ) {
        $user = get_user_by( 'login', $user_login );

        // forgot password link
        $link = home_url("reset?key=$key&login=" . rawurlencode($user_login), 'login');

        $user->data->user_email;
        $email = new SendSmtpEmail( array(
            'to'            => [ $this->get_to_from_user( $user ) ],
            'subject'       => get_bloginfo() . __( ' - Forgotten Password', 'community-directory' ),
            'templateId'    => $this->templates[ 'forgot-password' ],
            'params'        => (object) [
                'display_name' => $user->data->display_name,
                'user_name' => $user_login,
                'link' => $link,
                'site_name' => get_bloginfo()
            ]
        ) );

        try {
            $response = $this->transaction_api->sendTransacEmailWithHttpInfo( $email );
            if ( $response[ 1 ] !== 201 ) {
                ClassErrorHandler::handle_exception( new \WP_Error( '', "Unsuccessful attempt sending forgot password template to $email_addr", $response ) );
            }
        } catch ( Exception $e ) {
            ClassErrorHandler::handle_exception( new \WP_Error( '', "Error sending forgot password template to $email_addr", $e->getMessage() ) );
        }
    }

    /**
     * Overrides Wordpress' send mail
     */
    public function send_mail( $to, $subject, $message, $headers = '', $attachments = array() ):bool {
        return true;
    }

    private function get_to_from_user( \WP_User $user ):SendSmtpEmailTo {
        return new SendSmtpEmailTo( array(
            'name'          => $user->data->display_name,
            'email'         => $user->data->user_email
        ) );
    }

    public static function enabled():bool {
        if ( !defined( 'SENDINBLUE_ENABLE' ) ||
             !defined( 'SENDINBLUE_API_KEY' ) ||
             !SENDINBLUE_ENABLE
        ) return false;

        return true;
    }
    
    
}