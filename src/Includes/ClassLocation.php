<?php
/**
 * Community Directory location related functions
 *
 * @since      2020.11
 * @author     Marius Miliunas
 */

namespace Maruf89\CommunityDirectory\Includes;

class ClassLocation {

    private static $instance;

    public static function get_instance() {
        if (self::$instance == null) {
            self::$instance = new ClassLocation();
        }
 
        return self::$instance;
    }

    public static $post_type = 'cd-location';

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
            'hierarchical' => true,
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
                'delete_posts'       => 'delete_locations',
                'delete_others_posts'=> 'delete_others_locations',
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
        register_post_type( self::$post_type, $customPostTypeArgs );
    }

    public static function add_post_type( $arr ) {
        $arr[] = self::$post_type;
        return $arr;
    }

    /**
     * Accepts an array of location 'id' values and returns the rows
     * 
     * @param       $field_values   array           array of location ids
     * @param       $field_key      string          the field key to test the values against
     * @param       $formatted      string|bool     if string, will use that as the key to format rows by
     *                                              if true, defaults to default key, if false - returns raw
     * @return                      ARRAY_A         the rows
     */
    public static function get_locations_by_fields( $field_values, $field_key = 'id', $formatted = false ) {
        if ( gettype( $field_values ) !== 'array' ) $field_values = array( $field_values );

        if ( !count( $field_values ) ) return false;

        $table = COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS;

        $field_values_str = "'" . implode( "', '", $field_values ) . "'";
        
        global $wpdb;
        if ( $results = $wpdb->get_results("
            SELECT *
            FROM $table
            WHERE $field_key IN ($field_values_str)
        ", ARRAY_A) ) {
            switch ( gettype( $formatted ) ) {
                case 'string':
                    return self::format_row_locations( $results, $formatted );
                default:
                    return $formatted ? self::format_row_locations( $results ) : $results;
            }
            
        } else return false;
    }

    /**
     * Formats location rows based on the second parameter
     * 
     * @param       $rows       OBJECT|ARRAY        location row data
     * @param       $format_by  string              which field to use as the key
     * @return                  ARRAY_A             formatted location array
     */
    public static function format_row_locations( $rows, $format_by = 'id' ) {
        $formatted = array();
        foreach ( $rows as $row )
            if ( gettype( $row ) === 'object' )
                $formatted[$row->{$format_by}] = $row;
            else
                $formatted[$row[$format_by]] = $row;


        return $formatted;
    }

    /**
     * A method to sanitize or fill out any fields for a location before adding it to the DB
     * 
     * @param           a_array         $data       must contain ('display_name' => string)
     * @return                          a_array
     */
    public static function prepare_location_for_creation( $data ) {
        
        $data['display_name'] = community_directory_format_display_name( $data['display_name'] );
        $data['slug'] = community_directory_location_name_to_slug( $data['display_name'] );
        // If status isn't set, default is PENDING
        $data['status'] = isset( $data['status'] ) ?
            community_directory_status_to_enum( $data['status'] ) : COMMUNITY_DIRECTORY_ENUM_PENDING;
        $data['active_inhabitants'] = isset( $data['active_inhabitants'] ) ? $data['active_inhabitants'] : 0;
        $data['inactive_inhabitants'] = isset( $data['inactive_inhabitants'] ) ? $data['inactive_inhabitants'] : 0;
        return $data;
    }

    /**
     * Creates a new location in the db
     * 
     * @param           $data       ARRAY_A         Must contain 'display_name'
     * @return                      int             Returns the wp_post id upon create or WP_Error
     */
    public static function create_location ( $data ) {

        if ( !isset( $data['display_name'] ) || empty( $data['display_name' ] ) ) {
            die( 'display_name must be set and cannot be empty' );
        }

        global $wpdb;

        if ( !isset( $data['slug'] ) )
            $data = apply_filters( 'community_directory_prepare_location_for_creation', $data );

        $post_id = self::create_new_post( $data );
        
        $wpdb->insert( 
            COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS,
            array(
                'display_name'          => $data['display_name'],
                'slug'                  => $data['slug'],
                'status'                => $data['status'],
                'post_id'               => $post_id,
                'active_inhabitants'    => $data['active_inhabitants'],
                'inactive_inhabitants'  => $data['inactive_inhabitants'],
            ),
            array(
                '%s',
                '%s',
                '%s',
                '%d',
            )
        );

        return $post_id;
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
     * Updates any number of locations
     * 
     * @param           $update_locations_array     ARRAY_A     A hash array structured like
     *                                      array(
     *                                          [$update_by] => array(
     *                                              [display_name] => 'string',
     *                                              [status] => 'enum'
     *                                              ...
     *                                          )
     *                                      )
     * @param           $update_by                  string      if set, the field to update by
     * @return                                      int         Returns number of changed rows 
     */
    public static function update_locations( $update_locations_array, $update_by = 'id' ) {
        if ( !count( $update_locations_array ) ) return 0;

        global $wpdb;
        $update_array = array();

        $updated_rows = 0;

        // return the existing rows
        $db_rows = self::get_locations_by_fields( array_keys( $update_locations_array ), $update_by, true );

        foreach ( $update_locations_array as $id => $row ) {
            
            // changes will go here
            $data = array();
            // the existing db row
            $db_row =& $db_rows[$id];
            
            // Check if the display_name needs changing
            if ( isset( $row['display_name'] ) ) {
                $display_name = community_directory_format_display_name( $row['display_name'] );
                if ( community_directory_values_differ( $display_name, $db_row['display_name'] )) {
                    $data['display_name'] = $display_name;
                    $data['slug'] = community_directory_location_name_to_slug( $display_name );
                }
                
            }

            // Check if status needs changing
            if ( isset( $row['status'] ) ) {
                $status = community_directory_status_to_enum( $row['status'] );
                if ( community_directory_values_differ( $status, $db_row['status'] ) ) {
                    $data['status'] = $status;
                }
            }

            if ( isset( $row['active_inhabitants'] ) ) {
                $active_count = $db_row['active_inhabitants'];
                if ( community_directory_values_differ( $row['active_inhabitants'], $active_count ) ) {
                    $data['active_inhabitants'] = $row['active_inhabitants'];
                }
            }

            if ( isset( $row['inactive_inhabitants'] ) ) {
                $inactive_count = $db_row['inactive_inhabitants'];
                if ( community_directory_values_differ( $row['inactive_inhabitants'], $inactive_count ) ) {
                    $data['inactive_inhabitants'] = $row['inactive_inhabitants'];
                }
            }

            if ( isset( $row['post_id'] ) ) {
                if ( community_directory_values_differ( $row['post_id'], $row['post_id'] ) ) {
                    $data['post_id'] = $row['post_id'];
                }
            }

            // Check what changed so that we update the corresponding custom post type
            $changes = array_keys( $data );
            
            if ( count( $changes ) ) {
                self::update_post_with_changes( $db_row['post_id'], $data );

                if ( $updated_num = $wpdb->update(
                    COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS,
                    $data,
                    array( 'id' => $id )
                ) ) {
                    $updated_rows += $updated_num;
                }
            }
        }
        
        return $updated_rows;
    }

    /**
     * Adds to the active/inactive inhabitants count based on the status and count
     */
    public static function add_inhabitant( $loc_or_post_id, $which, $status, $count = 1 ) {
        if ( $which !== 'id' && $which != 'post_id' ) die( 'Invalid which statement passed' );

        global $wpdb;

        $field = $status === COMMUNITY_DIRECTORY_ENUM_ACTIVE ? 'active_inhabitants' : 'inactive_inhabitants';

        $table = COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS;
        
        return $wpdb->query(
            "UPDATE $table SET 
            $field = $field + $count
            WHERE $which = $loc_or_post_id"
        );
    }

    /**
     * An ACF hook that gets notified when the profile_active field gets changed
     * Updates the count and updates the post's status to reflect it
     * 
     * Do not call directly!
     */
    public static function acf_shift_inhabitants_count( $value, $entity_post_id, $field ) {
        if ( !isset( $_POST['acf'][ClassACF::$field_is_active_key] ) ) return $value;
        
        global $post;
        
        // get the old (saved) value
        $was_active = get_field( ClassACF::$field_is_active, $entity_post_id ) === 'true';

        $is_active = $_POST['acf'][ClassACF::$field_is_active_key] === 'true';
        
        if ( $was_active == $is_active ) return $value;

        $post_parent = $post->post_parent;

        self::shift_inhabitants_count( $post_parent, 'post_id', $is_active );

        // Update the post's status
        community_directory_activate_deactivate_entity( $is_active, $entity_post_id, 'post_id', true );
        
        return $value;
    }

    /**
     * Shifts the active/inactive inhabitants count in the location table
     * 
     * @param       $loc_id_or_post_id      int     either the location id, or post_id
     * @param       $which                  string  either 'id' or 'post_id'
     * @param       $increment              bool    whether to increment active_inhabitants
     */
    public static function shift_inhabitants_count( $loc_id_or_post_id, $which, $increment ) {
        if ( $which !== 'id' && $which != 'post_id' ) die( 'Invalid which statement passed' );

        global $wpdb;

        $table = COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS;
        $sql = "UPDATE $table SET ";
        $plus_minus_active = $increment ? '+' : '-';
        $active_inhabitants = "active_inhabitants = active_inhabitants $plus_minus_active 1, ";
        $plus_minus_inactive = $increment ? '-' : '+';
        $inactive_inhabitants = "inactive_inhabitants = inactive_inhabitants $plus_minus_inactive 1 ";
        $where = "WHERE $which = $loc_id_or_post_id";
        
        return $wpdb->query( $sql . $active_inhabitants . $inactive_inhabitants . $where );
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
     * Creates a new wp post for the location
     * 
     * @param       $data       array       an associative array with 'display_name', and 'slug' required
     */
    public static function create_new_post( $data ) {
        // Create post object
        $my_post = array(
            'post_title'    => $data['display_name'],
            'post_status'   => community_directory_enum_status_to_post_status( $data['status'] ),
            'post_type'     => self::$post_type,
            'post_author'   => isset( $data['user_id' ] ) ? $data['user_id'] : 0,
        );
        
        // Insert the post into the database
        $post_id = wp_insert_post( $my_post );

        // For some reason the post_name doesn't save upon insertion so we update it afterwards
        global $wpdb;
        $wpdb->query( $wpdb->prepare( "UPDATE $wpdb->posts SET post_name = %s where ID = $post_id", $data['slug'] ) );

        return $post_id;
    }

    /**
     * Updates the data of a wp post
     * 
     * @param           $post_id        int             ID of the wp post to update
     * @param           $data           ARRAY_A         containing any of the possible values
     * @return                          (int|WP_Error)  The post ID on success, or error
     */
    public static function update_post_with_changes( $post_id, $data ) {
        $update_data = array( 'ID' => $post_id );
        foreach ( $data as $key => $value ) {
            switch ( $key ) {
                case 'display_name':
                    $update_data['post_title'] = $data['display_name'];
                    break;
                case 'slug':
                    $update_data['post_name'] = $data['slug'];
                    break;
                case 'status':
                    $update_data['post_status'] = community_directory_enum_status_to_post_status( $data['status'] );
                    break;
            }
        }
        
        return wp_update_post( $update_data );
    }

    /**
     * Force deletes an individual post
     */
    public static function delete_location_post( $post_id ) {
        return wp_delete_post( $post_id, true );
    }
}