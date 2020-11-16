<?php
/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    userswp
 * @subpackage userswp/admin/settings
 * @author     GeoDirectory Team <info@wpgeodirectory.com>
 */
class Community_Directory_Admin_Settings {

    /**
     * Setting pages.
     *
     * @var array
     */
    private static $settings = array();

    /**
     * Error messages.
     *
     * @var array
     */
    private static $errors   = array();

    /**
     * Update messages.
     *
     * @var array
     */
    private static $messages = array();
    
    public function __construct() {

    }

    /**
     * Include the settings page classes.
     */
    public static function get_settings_pages() {
        if ( empty( self::$settings ) ) {
            $settings = array();

            $settings[] = include( 'class-settings-location.php' );
            // $settings[] = include( 'class-uwp-settings-emails.php' );
            // $settings[] = include( 'class-uwp-settings-import-export.php' );
            // $settings[] = include( 'class-uwp-settings-addons.php' );
            // $settings[] = include( 'class-uwp-settings-uninstall.php' );

            self::$settings = apply_filters( 'community_directory_get_settings_pages', $settings );
        }

        return self::$settings;
    }

    /**
     * Save the settings.
     */
    public static function save() {
        global $current_tab;

        if ( empty( $_REQUEST['_wpnonce'] ) || ! wp_verify_nonce( $_REQUEST['_wpnonce'], 'userswp-settings' ) ) {
            die( __( 'Action failed. Please refresh the page and retry.', 'userswp' ) );
        }

        // Trigger actions
        do_action( 'community_directory_settings_save_' . $current_tab );
        do_action( 'community_directory_update_options_' . $current_tab );
        do_action( 'community_directory_update_options' );

        self::add_message( __( 'Your settings have been saved.', 'userswp' ) );

        // Clear flush rules
        wp_schedule_single_event( time(), 'community_directory_flush_rewrite_rules' );

        do_action( 'community_directory_settings_saved' );
    }

    /**
     * Add a message.
     * @param string $text
     */
    public static function add_message( $text ) {
        self::$messages[] = $text;
    }

    /**
     * Add an error.
     * @param string $text
     */
    public static function add_error( $text ) {
        self::$errors[] = $text;
    }

    /**
     * Output messages + errors.
     */
    public static function show_messages() {
        if ( sizeof( self::$errors ) > 0 ) {
            foreach ( self::$errors as $error ) {
                echo '<div id="message" class="error inline"><p><strong>' . esc_html( $error ) . '</strong></p></div>';
            }
        } elseif ( sizeof( self::$messages ) > 0 ) {
            foreach ( self::$messages as $message ) {
                echo '<div id="message" class="updated inline"><p><strong>' . esc_html( $message ) . '</strong></p></div>';
            }
        }
    }


    /**
     * Settings page.
     *
     * Handles the display of the main userswp settings page in admin.
     */
    public static function output($tab = '') {
        global $current_section, $current_tab;

        do_action( 'community_directory_settings_start' );

        // Include settings pages
        self::get_settings_pages();

        // Get current tab/section
        if($tab){
            $current_tab = sanitize_title( $tab);

        }else{
            $current_tab = empty( $_GET['tab'] ) ? 'location' : sanitize_title( $_GET['tab'] );

        }
        $current_section = empty( $_REQUEST['section'] ) ? '' : sanitize_title( $_REQUEST['section'] );

        // Save settings if data has been posted
        if ( ! empty( $_POST ) ) {
            self::save();
        }

        // Add any posted messages
        if ( ! empty( $_GET['community_directory_error'] ) ) {
            self::add_error( stripslashes( $_GET['community_directory_error'] ) );
        }

        if ( ! empty( $_GET['community_directory_message'] ) ) {
            self::add_message( stripslashes( $_GET['community_directory_message'] ) );
        }

        // Get tabs for the settings page
        $tabs = apply_filters( 'community_directory_settings_tabs_array', array() );

        include( USERSWP_PATH . '/admin/views/html-admin-settings.php' );
    }
}