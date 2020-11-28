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

    /**
     * Add rewrite tags
     *
     * @link https://codex.wordpress.org/Rewrite_API/add_rewrite_tag
     */
    public static function community_directory_rewrite_tag() {
        add_rewrite_tag( '%location%', '([^&/]+)' );
    }

    /**
     * Add rewrite rules
     *
     * @link https://codex.wordpress.org/Rewrite_API/add_rewrite_rule
     */
    public static function community_directory_rewrite_rule() {
        $post_type = ClassEntity::$post_type;
        $pre = __( 'location', 'community-directory' );
        
        add_rewrite_rule(
            "^$pre/([^/]*)/entity/([^/]*)/?", "index.php?post_type=$post_type&location=\$matches[1]&postname=\$matches[2]", 'top'
        );
    }


    // public function prefix_register_query_var( $qvars ) {
    //     $qvars[] = 'location';
    //     $qvars[] = 'post_name';
    //     return $qvars;
    // }

    public static function pre_get_posts( $query ) {
        // check if the user is requesting an admin page 
        // or current query is not the main query
        if ( is_admin() || ! $query->is_main_query() ){
            return;
        }

        $type = get_query_var( 'post_type' );
        $location = get_query_var( ClassLocation::$post_type );
        $name = get_query_var( 'name' );

        if ( ClassLocation::$post_type == $type && !empty( $location ) && !!strpos( $name, '/' ) ) {
            global $wpdb;
            
            $vars = explode( '/', $name );
            $location_name = $vars[0];
            $location_post_id = community_directory_get_row_var( $location_name, 'ID', 'post_name', $wpdb->posts );
            $post_name = $vars[1];
            set_query_var( 'post_type', ClassEntity::$post_type );
            set_query_var( 'name', $post_name );
            set_query_var( 'post_parent', $location_post_id );
        }
    }

    public function prefix_url_rewrite_templates() {

        die(dump(var_dump()));
 
        if ( get_query_var( 'location' ) && is_singular( 'entity' ) ) {
            add_filter( 'template_include', function() {
                return get_template_directory() . '/single-movie-image.php';
            });
        }
     
        if ( get_query_var( 'videos' ) && is_singular( 'movie' ) ) {
            add_filter( 'template_include', function() {
                return get_template_directory() . '/single-movie-video.php';
            });
        }
    }

    public function load_location_template( $template ) {
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