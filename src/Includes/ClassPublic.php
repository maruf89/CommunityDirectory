<?php

/**
 * The public-facing functionality of the plugin.
 * Handles URL rewrites and loading templates
 *
 * @since      2020.11
 *
 * @package    community-directory
 * @subpackage community-directory/includes
 */

namespace Maruf89\CommunityDirectory\Includes;

use Maruf89\CommunityDirectory\Includes\instances\{Entity, OfferNeed};

class ClassPublic {
    private static string $_post_type_prefix = 'cd-';
    private static string $_template_hook_prefix = 'community_directory_template_';
    private static string $_template_hook_admin_prefix = 'community_directory_admin_template_';
    private static int $_template_hook_prefix_len;
    private static int $_template_hook_admin_prefix_len;

    public function __construct() {
        static::$_template_hook_prefix_len = strlen( static::$_template_hook_prefix );
        static::$_template_hook_admin_prefix_len = strlen( static::$_template_hook_admin_prefix );
    }
    
    /**
     * Register the stylesheets for the public-facing side of the site.
     *
     * @since      2020.11
     */
    public function enqueue_styles() {
        wp_enqueue_style(
            COMMUNITY_DIRECTORY_NAME, COMMUNITY_DIRECTORY_PLUGIN_URL . 'assets/dist/community-directory.css',
            array(),
             WP_ENV == 'production' ? COMMUNITY_DIRECTORY_VERSION : date("ymd-Gis"),
             'all'
        );
    }

    /**
     * Register the JavaScript for the public-facing side of the site.
     *
     * @since      2020.11
     */
    public function enqueue_scripts() {

        $suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '';//'.min';

        if ( community_directory_settings_get( 'enable_open_street_map', false ) ) {
            wp_enqueue_script(
                'leaflet_js',
                COMMUNITY_DIRECTORY_PLUGIN_URL . 'lib/leaflet/leaflet' . $suffix . '.js', array(),
                COMMUNITY_DIRECTORY_VERSION,
                'all'
            );
        }

        // Core JS
        wp_enqueue_script(
            COMMUNITY_DIRECTORY_NAME, COMMUNITY_DIRECTORY_PLUGIN_URL . 'assets/dist/community-directory' . $suffix . '.js',
            array( 'jquery' ),
            WP_ENV == 'production' ? COMMUNITY_DIRECTORY_VERSION : date("ymd-Gis"),
            'all'
        );


        if ( community_directory_settings_get( 'enable_open_street_map', false ) ) {
            wp_enqueue_style(
                'leaflet_css',
                COMMUNITY_DIRECTORY_PLUGIN_URL . 'lib/leaflet/leaflet' . $suffix . '.css', array(),
                COMMUNITY_DIRECTORY_VERSION,
                'all'
            );
        }
        
    }

    public function global_js_variables() {?>
        <script type="text/javascript">
            window.cdData = <?= json_encode( array(
                'restBase' => '/wp-json/wp/v2/',
                'postType' => array(
                    'entity' => ClassEntity::$post_type,
                    'location' => ClassLocation::$post_type,
                ),
                'taxonomyType' => array(
                    'productService' => TaxonomyProductService::$taxonomy,
                    'location' => TaxonomyLocation::$taxonomy,
                ),
                'map' => array(
                    'accessToken' => defined( 'MAPBOX_API_KEY' ) ? MAPBOX_API_KEY : '',
                    'defaultCoords' => explode( ' ', community_directory_settings_get( 'default_location', '54.95 24.84' ) ),
                ),
                'events' => array(
                    'map' => array(
                        'popupOpen' => 'MapPopupOpen',
                        'popupClose' => 'MapPopupClose'
                    )
                )
            )); ?>
        </script><?php
    }

    /**
     * Client facing menu for logged in users with entities
     */
    public function custom_nav_menu( $items, $menu ) {
        $options = get_option( 'community_directory_settings' );

        // Enable custom menu only if the loaded menu is the one added in the settings
        if ( !arr_equals_val( $options, 'load_menu_slug', $menu->slug ))
            return $items;

        if ( arr_equals_val( $options, 'load_locations_nav_menu', 1 ) ) {
            // TODO Load all locations list
        }
        
        if ( ( $Entity = Entity::get_active_entity() ) &&
             arr_equals_val( $options, 'load_my_location_nav_menu', 1 )
        ) {
            // skip if invalid entity
            if ( !$Entity->is_valid() ) return $items;
            
            $top = community_directory_custom_nav_menu_item(
                $Entity->location_name,
                Entity::build_location_link(),
                100
            );
            $items[] = $top;
            $items[] = community_directory_custom_nav_menu_item(
                __( 'My Profile', 'community-directory' ),
                Entity::build_entity_link(),
                101,
                $top->ID
            );
            $items[] = community_directory_custom_nav_menu_item(
                __( 'Edit Profile', 'community-directory' ),
                Entity::build_edit_link(),
                102,
                $top->ID
            );

            $ON_top = community_directory_custom_nav_menu_item(
                __( 'Offers & Needs', 'community-directory' ),
                OfferNeed::get_view_all_link(),
                200
            );
            $items[] = $ON_top;
            $items[] = community_directory_custom_nav_menu_item(
                __( 'Create New', 'community-directory' ),
                OfferNeed::get_create_link(),
                201,
                $ON_top->ID
            );
            $items[] = community_directory_custom_nav_menu_item(
                __( 'View Mine', 'community-directory' ),
                OfferNeed::get_view_all_link(),
                202,
                $ON_top->ID
            );
        }

        return $items;
        
    }

    /**
     * Does URL routing magic to turn /location/person from a location cpt
     * to an entity cpt
     */
    public static function pre_get_posts( $query ) {
        // check if the user is requesting an admin page 
        // or current query is not the main query
        if ( is_admin() || ! $query->is_main_query() ){
            return;
        }

        // If we have a url like /location/detroit/ying-p/
        $type = get_query_var( 'post_type' ); // will be location
        $location = get_query_var( ClassLocation::$post_type ); // If so, it will have it's own query_var
        $name = get_query_var( 'name' ); // and this will be 'detroit/ying-p

        // If we have all these, and the name has a '/' in the middle, then do…
        if ( ClassLocation::$post_type == $type && !empty( $location ) && !!strpos( $name, '/' ) ) {
            global $wpdb;
            
            // Location will be the first part, post_name the second
            list( $location_name, $post_name ) = explode( '/', $name );
            // Get the location's post id given the location's post_name
            $location_post_id = community_directory_get_row_var( $location_name, 'ID', 'post_name', $wpdb->posts );
            // Update the query vars to load Entity post type requiring the post parent is the location
            set_query_var( 'post_type', ClassEntity::$post_type );
            set_query_var( 'post_parent', $location_post_id );
            set_query_var( 'name', $post_name );
        }
    }

    /**
     * Depending on the custom post type, loads templates from the plugin if 
     * they don't exist in the user's theme
     */
    public function load_custom_templates( $template ) {
        global $post;

        $post_types = apply_filters( 'community_directory_get_post_types', array() );

        $index = array_search( $post->post_type, $post_types );
        
        // Is this a "my-custom-post-type" post?
        if ( gettype( $index ) === 'integer' ) {

            $post_type = $post_types[ $index ];
    
            //Your plugin path 
            $plugin_path = COMMUNITY_DIRECTORY_TEMPLATES_PATH;
    
            // The name of custom post type single template
            $template_name = "single-$post_type.php";

            $theme_template_name = apply_filters(
                static::$_template_hook_prefix . 'single-post-type',
                $template_name,
                $post_type,
                \substr( $post_type, strlen( static::$_post_type_prefix ) )
            );

            if ( \file_exists( $theme_template_name ) ||
                 !file_exists( $plugin_path . $template_name )
            ) {
                //Then return "single.php" or "single-my-custom-post-type.php" from theme directory.
                return $theme_template_name;
            }
    
            // If not, return my plugin custom post type template.
            return $plugin_path . $template_name;
        }
    
        //This is not my custom post type, do nothing with $template
        return $template;
    }

    public static function get_post_type_prefix():string { return static::$_post_type_prefix; }

    public static function get_template_hook_prefix( string $type = ''):array {
        switch( $type ) {
            case 'admin':
                return [ static::$_template_hook_admin_prefix, static::$_template_hook_admin_prefix_len ];
            default:
                return [ static::$_template_hook_prefix, static::$_template_hook_prefix_len ];
        }
    }

    /**
     * Is loaded via a filter call
     */
    public function load_template( string $src ):string {
        // get name of current filter
        // Will look something like: "community_directory_template_something-list.php"
        $current = current_filter();
        $file = substr( $current, static::$_template_hook_prefix_len );

        return COMMUNITY_DIRECTORY_TEMPLATES_PATH . $file;
    }

    /**
     * Is loaded via a filter call
     */
    public function load_admin_template( string $src ):string {
        // get name of current filter
        // Will look something like: "community_directory_template_something-list.php"
        $current = current_filter();
        $file = substr( $current, static::$_template_hook_admin_prefix_len );

        return COMMUNITY_DIRECTORY_ADMIN_PATH . 'views/' . $file;
    }

}