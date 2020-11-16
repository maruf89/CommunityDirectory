<?php
/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    community-directory
 * @subpackage community-directory/admin
 * @author     GeoDirectory Team <info@wpgeodirectory.com>
 */
class Community_Directory_Admin {

    /**
     * Register all of the hooks related to the admin area functionality
     * of the plugin.
     *
     * @since    1.0.0
     */
    public function __construct() {
        // add_action( 'admin_init', array($this, 'activation_redirect'));
        add_action( 'admin_enqueue_scripts', array($this, 'enqueue_styles') );
        add_action( 'admin_enqueue_scripts', array($this, 'enqueue_scripts') );
    }

    /**
     * Redirects to UsersWP info page after plugin activation.
     *
     * @since       1.0.0
     * @package     community-directory
     * @return      void
     */
    public function activation_redirect() {

    }


    /**
     * Register the stylesheets for the admin area.
     *
     * @since    1.0.0
     * @param $hook_suffix
     */
    public function enqueue_styles( $hook_suffix ) {

        die($hook_suffix);

        wp_enqueue_style( "community-directory_admin_css", USERSWP_PLUGIN_URL . 'admin/assets/css/community-directory-admin.css', array(), USERSWP_VERSION, 'all' );

    }

    /**
     * Register the JavaScript for the admin area.
     *
     * @since    1.0.0
     * @param $hook_suffix
     */
    public function enqueue_scripts($hook_suffix) {

        $suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

        

    }
}