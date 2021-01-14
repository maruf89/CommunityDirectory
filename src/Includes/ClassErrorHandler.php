<?php


namespace Maruf89\CommunityDirectory\Includes;


class ClassErrorHandler {

    private static ClassErrorHandler $instance;
    private static object $logger;

    public static function get_instance():ClassErrorHandler {
        if ( !isset( self::$instance ) ) {
            self::$instance = new ClassErrorHandler();
        }
 
        return self::$instance;
    }

    public function __construct() {
        do_action( 'community_directory_register_error_handler', ClassErrorHandler::class, 'register_logger' );
    }

    public static function register_logger( $logger ) {
        if ( !\method_exists( $logger, 'handle_exception' ) )
            throw new \Exception( 'ClassErrorHandler::register_logger requires the passed in logger to have a ::handle_exception method.' );
        self::$logger = $logger;
    }

    public static function handle_exception( \WP_Error $error ):\WP_Error {
        if ( isset( self::$logger ) &&  self::$logger ) self::$logger->handle_exception( $error );
        return $error;
    }
    
}