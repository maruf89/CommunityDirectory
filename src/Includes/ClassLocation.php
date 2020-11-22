<?php
/**
 * Community Directory table related functions
 *
 * @since      1.0.0
 * @author     GeoDirectory Team <info@wpgeodirectory.com>
 */

namespace Maruf89\CommunityDirectory\Includes;

class ClassLocation {

    public function __construct() {
        define( 'COMMUNITY_DIRECTORY_DISPLAY_NAME', 'display_name' );
        define( 'COMMUNITY_DIRECTORY_SLUG', 'slug' );
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
     * @param $new_locations a multi-dimensional of new locations
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

        foreach ( $new_locations as $row ) {
            if ( empty( $row['display_name'] ) ) continue;

            // If status isn't set, default is PENDING
            $status = isset( $row['status'] ) ? community_directory_status_to_enum( $row['status'] ) : COMMUNITY_DIRECTORY_ENUM_PENDING;

            $create_array[] = array(
                'display_name' => community_directory_format_display_name( $row['display_name'] ),
                'slug' => community_directory_location_name_to_slug( $row['display_name'] ),
                'status' => $status
            );
        }

        if ( !count( $create_array ) ) return false;
        
        $result = wp_insert_rows( $create_array, COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS );
        return $result;
    }

    public static function delete_location_ajax(  ) {
        if ( !isset( $_POST['location_id'] ) || empty( $_POST['location_id'] ) ) {
            die( wp_send_json_error( 'Error: missing location_id' ) );
        }

        if ( $deleted_rows = ClassLocation::delete_location( (int) $_POST['location_id'] ) ) {
            die( sprintf( __( 'Successfully deleted %s location(s) ', 'community-directory' ), $deleted_rows ) );
        } else {
            die( wp_send_json_error( 'Error occurred deleting rows' ) );
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
}