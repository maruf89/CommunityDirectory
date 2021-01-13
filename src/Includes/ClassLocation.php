<?php
/**
 * Community Directory location related functions
 *
 * @since      2020.11
 * @author     Marius Miliunas
 */

namespace Maruf89\CommunityDirectory\Includes;

use Maruf89\CommunityDirectory\Includes\Abstracts\Routable;
use Maruf89\CommunityDirectory\Includes\instances\Location;
use Maruf89\CommunityDirectory\Includes\Traits\PostTypeMethods;

class ClassLocation extends Routable {

    use PostTypeMethods;
    
    private static ClassLocation $instance;
    private static string $instance_class = Location::class;

    public static function get_instance() {
        if ( !isset( self::$instance ) ) {
            self::$instance = new ClassLocation();
        }
 
        return self::$instance;
    }

    public static string $post_type = 'cd-location';
    protected string $router_ns = 'location';

    public function __construct() {
        parent::__construct( $this );
    }

    public static function register_post_type() {
        $custom_post_type_args = array(
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
            'show_in_rest' => true,
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
        );
         
        // Post type, $args - the Post Type string can be MAX 20 characters
        register_post_type( self::$post_type, $custom_post_type_args );
    }

    /**
     * Get's all locations based on passed in vars
     * 
     * @param       $results            ?array           an array which to merge with passed in results
     * @param       $status_type        ?string          optional status value to match against (default: COMMUNITY_DIRECTORY_ENUM_ACTIVE)
     *                                                   one of (''|COMMUNITY_DIRECTORY_ENUM_ACTIVE|COMMUNITY_DIRECTORY_ENUM_INACTIVE)
     * @param       $where_match        ?array           optional array with fields to match against
     * @param       $output             ?string          one of (sql|OBJECT|ARRAY_A|ARRAY_N)
     */
    function get(
        array $results = [],
        string $status_type = null,
        array $where_match = null,
        string $output = null
    ) {
        global $wpdb;

        if ( null === $status_type ) $status_type = COMMUNITY_DIRECTORY_ENUM_ACTIVE;
        if ( null === $where_match ) $where_match = [];
        if ( null === $output ) $output = OBJECT;

        $where = [];
        
        if ( !empty( $status_type ) )
            $where[] = "status = '$status_type'";

        if ( count( $where_match ) ) {
            foreach ( $where_match as $key => $match ) {
                switch ( $key ) {
                    case 'active_inhabitants':
                    case 'inactive_inhabitants':
                        if ( gettype( $match ) === 'boolean' ) {
                            $operator = $match ? '>' : '<=';
                            $where[] = "$key $operator 0";
                        }
                        else if ( gettype( $match ) === 'string' )
                            $where[] = "$key $match";
                        else /** int */ $where[] = "$key > $match";
                        break;
                    default:
                        $where[] = "$key = '$match'";
                }
            }
        }
                    
        $where_clauses = count( $where ) ? 'WHERE ' . implode( ' AND ', $where) : '';

        $sql = 'SELECT * FROM ' . COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS . "
                $where_clauses";
        
        if ( $output === 'sql' ) return $sql;
        
        return array_merge( $wpdb->get_results( $sql, $output ), $results );
    }

    /**
     * @deprecated
     * Accepts an array of location 'id' values and returns the rows
     * 
     * @param       $field_values   array           array of values to get (could be location ids)
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
     * Formats passed in locations based on second argument
     * 
     * @param $results          array           the rows to format
     * @param $format           ?string         an location field to format the key, 'instance' to return Location instances (default: 'id')
     * @return                  array           formatted rows
     */
    public static function format( array $results, string $format = 'id' ) {
        if ( !count( $results ) ) return $results;
        
        if ( $format === 'instance' ) return self::format_to_instances( $results );
        if ( gettype( $format ) === 'boolean' ) return self::format_row_locations( $results );
        // Otherwise $format is a string
        return self::format_row_locations( $results, $format );
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

    public static function format_to_instances( $rows ) {
        foreach ( (object) $rows as $key => $loc_data ) {
            $rows[ $key ] = new Location();
            $rows[ $key ]->fill_with_data( $loc_data );
        }

        return $rows;
    }

    /**
     * Creates a new location if it doesn't already exist in the DB, and returns it
     */
    public static function create_if_doesnt_exist( array $data ):Location {
        if ( !isset( $data[ 'display_name' ] ) )
            die( 'Cannot call ClassLocation::create_if_doesnt_exist without providing array argument containing (string) display_name' );

        $slug = isset( $data[ 'slug' ] ) ? $data[ 'slug' ] : '';
        $Location = new Location();
            
        if ( $loc_data = self::get_by_name( $data[ 'display_name' ], $slug ) ) {
            $Location->fill_with_data( $loc_data );
        } else {
            $Location->insert_into_db( $data );
        }

        return $Location;
    }

    /**
     * Get's a location row from the DB by its slug or display_name if not set
     */
    public static function get_by_name( string $display_name, string $slug = '' ) {
        global $wpdb;

        $table = COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS;
        $slug = empty( $slug ) ? community_directory_string_to_slug( $display_name ) : $slug;
    
        return $wpdb->get_row( "SELECT * FROM $table WHERE slug = '$slug'" );
    }

    /**
     * @deprecated
     * -> delete after removal from ClassSettingsLocation
     * 
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
                $row = apply_filters( 'community_directory_prepare_location_for_creation', $row, null );

            $row['post_id'] = self::create_new_post( $row );
            $create_array[] = $row;
        }

        if ( !count( $create_array ) ) return false;
        
        $result = wp_insert_rows( $create_array, COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS );
        return $result;
    }

    /**
     * @deprecated
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
                $display_name = community_directory_format_uc_first( $row['display_name'] );
                if ( community_directory_values_differ( $display_name, $db_row['display_name'] )) {
                    $data['display_name'] = $display_name;
                    $data['slug'] = community_directory_string_to_slug( $display_name );
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
     * Gathers passed in POST data to delet a location and it's corresponding wp post
     */
    public static function delete_location_ajax() {
        if ( !isset( $_POST['location_id'] ) || empty( $_POST['location_id'] ) ) {
            die( wp_send_json_error( 'Error: missing location_id' ) );
        }

        $post_id = community_directory_get_row_var( $_POST['location_id'], 'post_id' );
        $Location = Location::get_instance( $post_id );
        $Location->delete_self();

        if ( $deleted_rows = ClassLocation::delete_location( (int) $_POST['location_id'] ) ) {
            die( sprintf( __( 'Successfully deleted %s location(s)', 'community-directory' ), $deleted_rows ) );
        } else {
            die( wp_send_json_error( 'Error occurred deleting location' ) );
        }
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

    public function update_coords( int $location_id, float $lat, float $lon ):bool {
        $Location = Location::get_instance( null, $location_id );
        return $Location->update_cd_row( array( 'coords' => "$lat,$lon" ) );
    }

    protected array $route_map = [
        '/update-coords' => array(
            'callback'  => 'update_coords',
            'args'      => array(
                'location_id'   => 'integer',
                'lat'           => 'float',
                'lon'           => 'float',
            )
        ),
        '/get'      => array(
            'callback'  => 'get',
            'args'      => array(
                'results'           => '?array',
                'status_type'       => '?string',
                'with_inhabitants'  => '?boolean',
                'formatted'         => '?boolean',
            )
        )
    ];

    /**
     * array( '/location/(?P<id>\d+)' => array(
     *      'methods' => 'GET',
     *      'callback' => 'my_awesome_func',
     *    )
     * )
     */
    public static function get_router_end_points( array $callback ):array {
        return array(
            '/update-coords' => array(
                'methods'   => 'POST',
                'callback'  => $callback,
                'permission_callback' => function ( $request ):bool {
                    $params = $request->get_params();
                    return current_user_can( 'edit_others_entities' ) || ClassEntity::user_can_edit_entity( $params['entity'] );
                },
            ),
            '/get' => array(
                'methods'   => \WP_REST_Server::READABLE,
                'callback'  => $callback,
                'permission_callback' => function ( $request ) { return true; },
            )
        );
    }
}