<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @since      0.0.1
 *
 * @package    community-directory
 * @subpackage community-directory/includes
 */

namespace Maruf89\CommunityDirectory\Includes;

class ClassPublic {

    public function __construct() {
        add_action( 'wp_enqueue_scripts', array($this, 'enqueue_styles') );
        // add_action( 'wp_enqueue_scripts', array($this, 'enqueue_scripts') );
    }
    
    /**
     * Register the stylesheets for the public-facing side of the site.
     *
     * @since    0.0.1
     */
    public function enqueue_styles() {
        wp_enqueue_style( COMMUNITY_DIRECTORY_NAME, COMMUNITY_DIRECTORY_PLUGIN_URL . 'assets/css/community-directory.css', array(), WP_ENV == 'production' ? COMMUNITY_DIRECTORY_VERSION : date("ymd-Gis"), 'all' );
    }

    /**
     * Register the JavaScript for the public-facing side of the site.
     *
     * @since    0.0.1
     */
    public function enqueue_scripts() {

        $suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

        // Core JS
        wp_enqueue_script( COMMUNITY_DIRECTORY_NAME, COMMUNITY_DIRECTORY_PLUGIN_URL . 'assets/js/community-directory' . $suffix . '.js', array( 'jquery' ), COMMUNITY_DIRECTORY_VERSION, false );
        
    }

    function load_location_template($template) {
        global $post;

        $post_type = ClassLocation::$location_post_type;
    
        // Is this a "my-custom-post-type" post?
        if ( $post->post_type == $post_type ){
    
            //Your plugin path 
            $plugin_path = COMMUNITY_DIRECTORY_TEMPLATES_PATH;
    
            // The name of custom post type single template
            $template_name = "single-$post_type.php";
    
            // A specific single template for my custom post type exists in theme folder? Or it also doesn't exist in my plugin?
            if($template === get_stylesheet_directory() . '/' . $template_name
                || !file_exists( $plugin_path . $template_name )) {
    
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