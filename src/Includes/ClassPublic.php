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

use Maruf89\CommunityDirectory\Includes\ClassEntity;
use Maruf89\CommunityDirectory\Includes\ClassLocation;
use Maruf89\CommunityDirectory\Includes\instances\Entity;

class ClassPublic {

    public function __construct() {

    }
    
    /**
     * Register the stylesheets for the public-facing side of the site.
     *
     * @since      2020.11
     */
    public function enqueue_styles() {
        wp_enqueue_style( COMMUNITY_DIRECTORY_NAME, COMMUNITY_DIRECTORY_PLUGIN_URL . 'assets/css/community-directory.css', array(), WP_ENV == 'production' ? COMMUNITY_DIRECTORY_VERSION : date("ymd-Gis"), 'all' );
    }

    /**
     * Register the JavaScript for the public-facing side of the site.
     *
     * @since      2020.11
     */
    public function enqueue_scripts() {

        $suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '';//'.min';

        // Core JS
        wp_enqueue_script( COMMUNITY_DIRECTORY_NAME, COMMUNITY_DIRECTORY_PLUGIN_URL . 'assets/js/community-directory' . $suffix . '.js', array( 'jquery' ), COMMUNITY_DIRECTORY_VERSION, false );

        wp_localize_script( 'community_directory_admin_js', 'cdData',
            array(
                'restBase' => '/wp-json/wp/v2/',
                'postType' => array(
                    'entity' => ClassEntity::$post_type,
                    'location' => ClassLocation::$post_type,
                )
            )
        );
        
    }

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
            $top = community_directory_custom_nav_menu_item(
                $Entity->location_name,
                Entity::get_location_link(),
                100
            );
            $items[] = $top;
            $items[] = community_directory_custom_nav_menu_item(
                __( 'My Profile', 'community-directory' ),
                Entity::get_display_link(),
                101,
                $top->ID
            );
            $items[] = community_directory_custom_nav_menu_item(
                __( 'Edit Profile', 'community-directory' ),
                Entity::get_edit_link(),
                102,
                $top->ID
            );
        }

        return $items;
        
    }

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
    
            // A specific single template for my custom post type exists in theme folder? Or it also doesn't exist in my plugin?
            if ( $template === get_stylesheet_directory() . '/' . $template_name
                 || !file_exists( $plugin_path . $template_name ) ) {
    
                //Then return "single.php" or "single-my-custom-post-type.php" from theme directory.
                return $template;
            }
    
            // If not, return my plugin custom post type template.
            return $plugin_path . $template_name;
        }
    
        //This is not my custom post type, do nothing with $template
        return $template;
    }
    

}