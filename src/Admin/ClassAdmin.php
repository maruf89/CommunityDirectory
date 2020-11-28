<?php

namespace Maruf89\CommunityDirectory\Admin;

use Stylus\Stylus;

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    community-directory
 * @subpackage community-directory/admin
 * @author     Marius Miliunas
 */
class ClassAdmin {

    /**
     * Register all of the hooks related to the admin area functionality
     * of the plugin.
     *
     * @since    1.0.0
     */
    public function __construct() {
        add_action( 'admin_enqueue_scripts', array($this, 'enqueue_styles') );
        add_action( 'admin_enqueue_scripts', array($this, 'enqueue_scripts') );
    }


    /**
     * Register the stylesheets for the admin area.
     *
     * @since    1.0.0
     * @param $hook_suffix
     */
    public function enqueue_styles( $hook_suffix ) {

        if ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) {
            $stylus = new Stylus();
            $stylus->setReadDir( COMMUNITY_DIRECTORY_ADMIN_PATH . 'assets/css/styl' );
            $stylus->setWriteDir( COMMUNITY_DIRECTORY_ADMIN_PATH . 'assets/css' );
            $stylus->assign( 'base-font-size', '14px' );
            $stylus->parseFiles(true);
        }

        wp_enqueue_style( 'community-directory_admin_css', COMMUNITY_DIRECTORY_PLUGIN_URL . 'src/Admin/assets/css/community-directory-admin.css', array(), WP_ENV == 'production' ? COMMUNITY_DIRECTORY_VERSION : date("ymd-Gis"), 'all' );

        

    }

    /**
     * Register the JavaScript for the admin area.
     *
     * @since    1.0.0
     * @param $hook_suffix
     */
    public function enqueue_scripts($hook_suffix) {

        $suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

        wp_enqueue_script(
            'community_directory_admin_js',
            COMMUNITY_DIRECTORY_PLUGIN_URL . 'src/Admin/assets/js/community-directory-admin' . $suffix . '.js', array(),
            WP_ENV == 'production' ? COMMUNITY_DIRECTORY_VERSION : date("ymd-Gis"),
            'all'
        );

        wp_localize_script( 'community_directory_admin_js', 'ajaxObject', array(
            'ajax_url' => admin_url( 'admin-ajax.php' ),
            'translations' => array(
                'deleteLocation' => __( 'Are you sure you want to delete this row?', 'community-directory' ) )
            )
        );

    }
}