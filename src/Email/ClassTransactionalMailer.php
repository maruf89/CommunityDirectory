<?php

namespace Maruf89\CommunityDirectory\Email;

use Maruf89\CommunityDirectory\Includes\ClassErrorHandler;
use Maruf89\CommunityDirectory\Email\Interfaces\IMailer;
use \Brevo\Client\Configuration;
use \Brevo\Client\Api\TransactionalEmailsApi;
use \Brevo\Client\Model\{SendSmtpEmail, SendSmtpEmailTo, GetSmtpTemplateOverviewSender};

class ClassTransactionalMailer implements IMailer {
    private static ClassTransactionalMailer $instance;
    private string $api_key;
    private array $lists = [];
    private string $list_id;
    private string $server_prefix;
    private string $url;
    private TransactionalEmailsApi $transaction_api;

    private GetSmtpTemplateOverviewSender $sender;
    private bool $_templates_loaded = false;
    private array $templates;

    public static function get_instance():ClassTransactionalMailer {
        if ( isset( $instance ) ) return $instance;

        return static::$instance = new ClassTransactionalMailer();
    }

    public function __construct() {
        $this->api_key = BREVO_API_KEY;
        
        require_once( dirname(__FILE__) . '/wp_mail_override.php' );
    }

    private function _templates_loaded():bool {
        if ( isset( $this->templates ) ) return true;

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
            return true;
        } catch (Exception $e) {
            ClassErrorHandler::handle_exception( new \WP_Error( '', 'Error loading templates from SendInBlue', $e->getMessage() ) );
        }
        return false;
    }

    public function send_welcome_email( string $user_login, string $key ) {
        if ( !$this->_templates_loaded() ) return false;

        $user = get_user_by( 'login', $user_login );
        
        $activation_link = add_query_arg(
            array(
                'uwp_activate' => 'yes',
                'key' => $key,
                'login' => $user_login
            ),
            site_url()
        );
        
        $email_addr = $user->data->user_email;
        $email = new SendSmtpEmail( array(
            'to'            => [ $this->get_to_from_user( $user ) ],
            'subject'       => get_bloginfo() . __( ' - Account Activation', 'community-directory' ),
            'templateId'    => $this->templates[ 'signup' ],
            'params'        => (object) [
                'display_name' => $user->data->display_name,
                'activation_link' => $activation_link,
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
    }

    public function send_forgotten_password_email( string $user_login, string $key ) {
        if ( !$this->_templates_loaded() ) return false;

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
        if ( !defined( 'BREVO_ENABLE' ) ||
             !defined( 'BREVO_API_KEY' ) ||
             !BREVO_ENABLE
        ) return false;

        return true;
    }
    
    
}