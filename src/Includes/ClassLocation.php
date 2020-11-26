<?php
/**
 * Community Directory location related functions
 *
 * @since      2020.11
 * @author     GeoDirectory Team <info@wpgeodirectory.com>
 */

namespace Maruf89\CommunityDirectory\Includes;

class ClassLocation {

    public static $location_post_type = 'location';

    public function __construct() {
        define( 'COMMUNITY_DIRECTORY_DISPLAY_NAME', 'display_name' );
        define( 'COMMUNITY_DIRECTORY_SLUG', 'slug' );
    }

    public static function register_location_post_type() {
        $customPostTypeArgs = array(
            'label' => __( 'Locations', 'community-directory' ),
            'labels' =>
                array(
                    'name' => __( 'Locations', 'community-directory' ),
                    'singular_name' => __( 'Location', 'community-directory' ),
                    'add_new' => __( 'Add Location', 'community-directory' ),
                    'add_new_item' => __( 'Add New Location', 'community-directory' ),
                    'edit_item' => __( 'Edit Location', 'community-directory' ),
                    'new_item' => __( 'New Location', 'community-directory' ),
                    'view_item' => __( 'View Location', 'community-directory' ),
                    'search_items' => __( 'Search Location', 'community-directory' ),
                    'not_found' => __( 'No Locations Found', 'community-directory' ),
                    'not_found_in_trash' => __( 'No Locations Found in Trash', 'community-directory' ),
                    'menu_name' => __( 'Locations', 'community-directory' ),
                    'name_admin_bar'     => __( 'Locations', 'community-directory' ),
                ),
            'public' => true,
            'description' => __( 'Community Directory Locations', 'community-directory' ), 
            'exclude_from_search' => false,
            'show_ui' => false,
            'show_in_menu' => COMMUNITY_DIRECTORY_NAME,
            'capability_type' => array( 'location', 'locations' ),
            'capabilities' => array(
                'edit_post'          => 'edit_location', 
                'read_post'          => 'read_location', 
                'delete_post'        => 'delete_location', 
                'edit_posts'         => 'edit_locations', 
                'edit_others_posts'  => 'edit_others_locations', 
                'publish_posts'      => 'publish_locations',       
                'read_private_posts' => 'read_private_locations', 
                'create_posts'       => 'edit_locations', 
                ),
            'supports' => array(
                'title',
                'thumbnail',
                'custom_fields',
                'page-attributes'
            ),
            'rewrite' => array(
                'slug' => __( 'location', 'community-directory' ),
                'with_front' => false,
            )
            // 'taxonomies' => array('category','post_tag')
        );
         
        // Post type, $args - the Post Type string can be MAX 20 characters
        register_post_type( self::$location_post_type, $customPostTypeArgs );
    }

    /**
     * Add custom taxonomies
     *
     * Additional custom taxonomies can be defined here
     * http://codex.wordpress.org/Function_Reference/register_taxonomy
     */
    public static function add_custom_location_taxonomy() {
        // Not currently used
        
        // Add new "Locations" taxonomy to Posts 
        register_taxonomy('location', 'post', array(
            // Hierarchical taxonomy (like categories)
            'hierarchical' => true,
            // This array of options controls the labels displayed in the WordPress Admin UI
            'labels' => array(
                'name' => __( 'Locations', 'taxonomy general name', 'community-directory' ),
                'singular_name' => __( 'Location', 'taxonomy singular name', 'community-directory' ),
                'search_items' =>  __( 'Search Locations', 'community-directory' ),
                'all_items' => __( 'All Locations', 'community-directory' ),
                'parent_item' => __( 'Parent Location', 'community-directory' ),
                'parent_item_colon' => __( 'Parent Location:', 'community-directory' ),
                'edit_item' => __( 'Edit Location', 'community-directory' ),
                'update_item' => __( 'Update Location', 'community-directory' ),
                'add_new_item' => __( 'Add New Location', 'community-directory' ),
                'new_item_name' => __( 'New Location Name', 'community-directory' ),
                'menu_name' => __( 'Locations', 'community-directory' ),
            ),
            // Control the slugs used for this taxonomy
            'rewrite' => array(
                'slug' => __( 'location', 'community-directory' ), // This controls the base slug that will display before each term
                'with_front' => false, // Don't display the category base before "/locations/"
                'hierarchical' => true // This will allow URL's like "/locations/boston/cambridge/"
            ),
        ));
    }

    /**
     * Updates an existing location's name and slug
     * 
     * @param           $update_locations_array     array   [id] => array([display_name] => 'string', [status] => 'enum') modifications
     * @return                                      true|false
     */
    public static function update_locations( $update_locations_array ) {
        if ( !count( $update_locations_array ) ) return false;

        global $wpdb;
        $update_array = array();

        foreach ( $update_locations_array as $id => $row ) {
            $data = array();
            if ( isset( $row['display_name'] ) ) {
                $data['display_name'] = community_directory_format_display_name( $row['display_name'] );
                $data['slug'] = community_directory_location_name_to_slug( $row['display_name'] );
            }
            if ( isset( $row['status'] ) ) {
                $data['status'] = community_directory_status_to_enum( $row['status'] );
                $post_id = community_directory_get_row_var( $id, 'post_id' );
                self::update_post_status( $post_id, $data['status'] );
            }

            $result = $wpdb->update(
                COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS,
                $data,
                array( 'id' => $id )
            );
        }
        
        return true;
    }

    /**
     * A method to sanitize or fill out any fields for a location before adding it to the DB
     * 
     * @param           a_array         $location_arr       must contain ('display_name' => string)
     * @return                          a_array
     */
    public static function prepare_location_for_creation( $location_arr ) {
        
        $location_arr['display_name'] = community_directory_format_display_name( $location_arr['display_name'] );
        $location_arr['slug'] = community_directory_location_name_to_slug( $location_arr['display_name'] );
        // If status isn't set, default is PENDING
        $location_arr['status'] = isset( $location_arr['status'] ) ?
        community_directory_status_to_enum( $location_arr['status'] ) : COMMUNITY_DIRECTORY_ENUM_PENDING;
        
        return $location_arr;
    }

    /**
     * Adds new locations to the locations table
     * 
     * @param       $new_locations  array       a multi-dimensional of new locations
     *      array(
     *          array(
     *              [display_name] => 'string',
     *              [status] => 'enum' (default: 'PENDING')
     *          ),
     *          ...
     *      )
     * @return                      (int|bool)  returns false if no change, or number of created rows
     */
    public static function create_locations( $new_locations ) {
        if ( !count( $new_locations ) ) return false;
        
        $create_array = array();
        $posts_array = array();

        foreach ( $new_locations as $row ) {
            if ( empty( $row['display_name'] ) ) continue;

            if ( !isset( $row['slug'] ) )
                $row = apply_filters( 'community_directory_prepare_location_for_creation', $row );

            $row['post_id'] = self::create_new_post( $row );
            $create_array[] = $row;
        }

        if ( !count( $create_array ) ) return false;
        
        $result = wp_insert_rows( $create_array, COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS );
        return $result;
    }

    /**
     * Creates a new wp post for the location
     * 
     * @param       $data       array       an associative array with 'display_name', and 'slug' required
     */
    public static function create_new_post( $data ) {
        // Create post object
        $my_post = array(
            'post_title'    => $data['display_name'],
            'post_content'  => '',
            'post_status'   => self::location_status_to_post_status( $data['status'] ),
            'post_type'     => self::$location_post_type,
        );
        
        // Insert the post into the database
        return wp_insert_post( $my_post );
    }

    /**
     * Gathers passed in POST data to delet a location and it's corresponding wp post
     */
    public static function delete_location_ajax() {
        if ( !isset( $_POST['location_id'] ) || empty( $_POST['location_id'] ) ) {
            die( wp_send_json_error( 'Error: missing location_id' ) );
        }

        $post_id = community_directory_get_row_var( $_POST['location_id'], 'post_id' );
        self::delete_location_post( $post_id );

        if ( $deleted_rows = ClassLocation::delete_location( (int) $_POST['location_id'] ) ) {
            die( sprintf( __( 'Successfully deleted %s location(s) ', 'community-directory' ), $deleted_rows ) );
        } else {
            die( wp_send_json_error( 'Error occurred deleting location' ) );
        }
    }

    /**
     * Deletes an individual location from MySQL
     * 
     * @param           $location_id        int
     */
    public static function delete_location( $location_id ) {
        global $wpdb;

        return $wpdb->delete(
            COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS,
            array( 'id' => $location_id ),
            '%d'
        );
    }

/////////// Wordpress Methods //////////

    /**
     * Converts a location status enum to a wp post status type
     * 
     * @param           $status         string      COMMUNITY_DIRECTORY_ENUM_(PENDING|ACTIVE)
     * @return                          string      returns the corresponding wp post status type
     */
    public static function location_status_to_post_status( $status = '' ) {
        switch ( $status ) {
            case COMMUNITY_DIRECTORY_ENUM_PENDING:
                return 'pending';
            case COMMUNITY_DIRECTORY_ENUM_ACTIVE:
                return 'publish';
            default:
                return 'draft';
        }
    }

    /**
     * Updates the status of a wp post
     * 
     * @param           $post_id        int             ID of the wp post to update
     * @param           $status         string          COMMUNITY_DIRECTORY_ENUM_(PENDING|ACTIVE)
     * @return                          (int|WP_Error)  The post ID on success, or error
     */
    public static function update_post_status( $post_id, $status ) {
        return wp_update_post(
            array(
                'ID' => $post_id,
                'post_status' => self::location_status_to_post_status( $status )
            )
        );
    }

    /**
     * Force deletes an individual post
     */
    public static function delete_location_post( $post_id ) {
        return wp_delete_post( $post_id, true );
    }
}