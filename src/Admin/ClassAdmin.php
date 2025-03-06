<?php

namespace Maruf89\CommunityDirectory\Admin;

use Maruf89\CommunityDirectory\Includes\{ClassEntity, ClassLocation, ClassOffersNeeds, ClassRestEndPoints, ClassACF, TaxonomyProductService, TaxonomyLocation};

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

        $suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';


        wp_enqueue_style( 'community-directory_admin_css', COMMUNITY_DIRECTORY_PLUGIN_URL . 'assets/dist/community-directory-admin.css', array(), WP_ENV == 'production' ? COMMUNITY_DIRECTORY_VERSION : date("ymd-Gis"), 'all' );

        if ( community_directory_settings_get( 'enable_open_street_map', false ) ) {
            wp_enqueue_style(
                'leaflet_css',
                COMMUNITY_DIRECTORY_PLUGIN_URL . 'lib/leaflet/leaflet.css', array(),
                COMMUNITY_DIRECTORY_VERSION,
                'all'
            );
        }

    }

    /**
     * Register the JavaScript for the admin area.
     *
     * @since    1.0.0
     * @param $hook_suffix
     */
    public function enqueue_scripts( $hook_suffix ) {

        $suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '';// '.min';
        
        if ( community_directory_settings_get( 'enable_open_street_map', false ) ) {
            wp_enqueue_script(
                'leaflet_js',
                COMMUNITY_DIRECTORY_PLUGIN_URL . 'lib/leaflet/leaflet' . $suffix . '.js', array(),
                COMMUNITY_DIRECTORY_VERSION,
                'all'
            );
        }

        wp_enqueue_script(
            'community_directory_admin_js',
            COMMUNITY_DIRECTORY_PLUGIN_URL . 'assets/dist/community-directory-admin' . $suffix . '.js', array(),
            WP_ENV == 'production' ? COMMUNITY_DIRECTORY_VERSION : date("ymd-Gis"),
            'all'
        );

        wp_localize_script( 'community_directory_admin_js', 'cdData',
            array(
                'ajax_url' => admin_url( 'admin-ajax.php' ),
                'translations' => array(
                    'deleteLocation' => __( 'Are you sure you want to delete this row?', 'community-directory' ),
                    'setCenter' => __( 'Set Center', 'community-directory' ),
                    'viewOnMap' => __( 'View on Map', 'community-directory' ),
                ),
                'restBase' => '/wp-json/' . ClassRestEndPoints::get_instance()->rest_base,
                'postType' => array(
                    'entity' => ClassEntity::$post_type,
                    'location' => ClassLocation::$post_type,
                    'offersNeeds' => ClassOffersNeeds::$post_type
                ),
                'pages' => array(
                    'offersNeeds' => array()
                ),
                'taxonomyType' => array(
                    'productService' => TaxonomyProductService::$taxonomy,
                    'location' => TaxonomyLocation::$taxonomy,
                ),
                'map' => array(
                    'accessToken' => defined( 'MAPBOX_API_KEY' ) ? MAPBOX_API_KEY : '',
                    'defaultCoords' => explode( ' ', community_directory_settings_get( 'default_location', '54.95 24.84' ) ),
                ),
                'wp_nonce' => wp_create_nonce( 'wp_rest' ),
                'edit_others_entities' => current_user_can( 'edit_others_entities' ),
            )
        );

    }
}