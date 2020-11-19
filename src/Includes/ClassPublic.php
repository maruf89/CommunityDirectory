<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       http://wpgeodirectory.com
 * @since      1.0.0
 *
 * @package    community-directory
 * @subpackage community-directory/includes
 */

namespace Maruf89\CommunityDirectory\Includes;

class ClassPublic {

    
    /**
     * Register the stylesheets for the public-facing side of the site.
     *
     * @since    1.0.0
     */
    public function enqueue_styles() {
        wp_enqueue_style( COMMUNITY_DIRECTORY_NAME, COMMUNITY_DIRECTORY_PLUGIN_URL . 'assets/css/community-directory.css', array(), COMMUNITY_DIRECTORY_VERSION, 'all' );
        // wp_register_style( 'uwp-authorbox', COMMUNITY_DIRECTORY_PLUGIN_URL . 'assets/css/authorbox.css', array(), COMMUNITY_DIRECTORY_VERSION, 'all' );
    }

    /**
     * Register the JavaScript for the public-facing side of the site.
     *
     * @since    1.0.0
     */
    public function enqueue_scripts() {

        $suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

        // Core JS
        wp_enqueue_script( COMMUNITY_DIRECTORY_NAME, COMMUNITY_DIRECTORY_PLUGIN_URL . 'assets/js/community-directory' . $suffix . '.js', array( 'jquery' ), COMMUNITY_DIRECTORY_VERSION, false );
        
    }

}