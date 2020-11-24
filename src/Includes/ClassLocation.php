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
            'show_ui' => true,
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
     * Updates an existing location's name and slug
     * 
     * @param $update_locations_array an array of [id] => array([display_name] => 'string', [status] => 'enum') modifications
     * @return true|false
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
            if ( isset( $row['status'] ) ) 
                $data['status'] = community_directory_status_to_enum( $row['status'] );

            $result = $wpdb->update(
                COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS,
                $data,
                array( 'id' => $id )
            );
        }
        
        return true;
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
     */
    public static function create_locations( $new_locations ) {
        if ( !count( $new_locations ) ) return false;
        
        $create_array = array();
        $posts_array = array();

        foreach ( $new_locations as $row ) {
            if ( empty( $row['display_name'] ) ) continue;

            // If status isn't set, default is PENDING
            $status = isset( $row['status'] ) ? community_directory_status_to_enum( $row['status'] ) : COMMUNITY_DIRECTORY_ENUM_PENDING;

            $this_row = array(
                'display_name' => community_directory_format_display_name( $row['display_name'] ),
                'slug' => community_directory_location_name_to_slug( $row['display_name'] ),
                'status' => $status,
            );

            $this_row['post_id'] = self::create_new_post( $this_row );
            $create_array[] = $this_row;
        }

        if ( !count( $create_array ) ) return false;
        
        $result = wp_insert_rows( $create_array, COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS );
        return $result;
    }

    public static function get_row_var( $id, $var ) {
        global $wpdb;
        $table = COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS;
        return $wpdb->get_var( $wpdb->prepare( "SELECT $var FROM $table WHERE id = %s", $id ) );
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
     * Converts a location status enum to a wp post status type
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

    public static function delete_location_ajax(  ) {
        if ( !isset( $_POST['location_id'] ) || empty( $_POST['location_id'] ) ) {
            die( wp_send_json_error( 'Error: missing location_id' ) );
        }

        $post_id = self::get_row_var( $_POST['location_id'], 'post_id' );
        self::delete_location_post( $post_id );

        if ( $deleted_rows = ClassLocation::delete_location( (int) $_POST['location_id'] ) ) {
            die( sprintf( __( 'Successfully deleted %s location(s) ', 'community-directory' ), $deleted_rows ) );
        } else {
            die( wp_send_json_error( 'Error occurred deleting location' ) );
        }
    }

    public static function delete_location( $location_id ) {
        global $wpdb;

        return $wpdb->delete(
            COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS,
            array( 'id' => $location_id ),
            '%d'
        );
    }

    public static function delete_location_post( $post_id ) {
        return wp_delete_post( $post_id, true );
    }
}