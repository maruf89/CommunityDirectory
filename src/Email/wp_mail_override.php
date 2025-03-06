<?php

/**
 * This file overrides the WP mail
 * It is to be required from the class that overrides the wp_mail functionality and it must implement IMailer
 */

if ( !function_exists( 'wp_mail' ) &&
     isset( $mailer_instance) &&
     ( $implements = class_implements( get_class( $mailer_instance ) ) ) &&
     isset( $implements[ 'Maruf89\CommunityDirectory\Email\Interfaces\IMailer' ] )
) {
    class Mail_Instance_Holder {
        public static Maruf89\CommunityDirectory\Email\Interfaces\IMailer $mailer;
        public function __construct( Maruf89\CommunityDirectory\Email\Interfaces\IMailer &$mailer ) {
            static::$mailer =& $mailer;
        }
    };
    new Mail_Instance_Holder( $mailer_instance );
    
    function wp_mail( $to, $subject, $message, $headers = '', $attachments = array() ):bool {
        if ( isset( Mail_Instance_Holder::$mailer ) && method_exists( Mail_Instance_Holder::$mailer, 'send_mail' ) )
            return Mail_Instance_Holder::$mailer->send_mail( $to, $subject, $message, $headers, $attachments );
        return false;
    }

    
}