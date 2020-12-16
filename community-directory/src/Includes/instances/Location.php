<?php
/**
 *
 * Location instance
 *
 * @since      1.0.0
 * @author     Marius Miliunas
 */

namespace Maruf89\CommunityDirectory\Includes\instances;

use Maruf89\CommunityDirectory\Includes\ClassLocation;
use Maruf89\CommunityDirectory\Includes\Abstracts\Instance;

class Location extends Instance {
    public static string $post_type = 'cd-location';

    protected bool $cd_loaded = false;

    protected int $location_id;
    protected string $display_name;
    protected string $slug;
    protected int $active_inhabitants;
    protected int $inactive_inhabitants;
    protected string $status;

    public function __construct( $location_id = null, $post_id = null ) {
        if ( $location_id ) $this->location_id = $location_id;
        if ( $post_id ) $this->post_id = $post_id;
    }

    /////////////////////////////////////
    /////////////    Get     ////////////
    /////////////////////////////////////

    /**
     * Gets the entities status depending on the desired format
     */
    public function get_status( $format = 'bool' ) {
        if ( $this->load_from_db() ) {
            $status = $this->status;
            switch ( $format ) {
                case 'raw': return $status;
                case 'bool':
                case 'enum': return $status ? COMMUNITY_DIRECTORY_ENUM_ACTIVE : COMMUNITY_DIRECTORY_ENUM_PENDING;
                case 'display': return $status ?
                    __( 'Active', 'community-directory' ) : __( 'Pending', 'community-directory' );
            }
        }
        return null;
    }

    public function is_valid():bool {
        return $this->load_from_db();
    }

    public function get_featured( $size = 'medium' ):string {
        return get_the_post_thumbnail_url( $this->post_id, $size );
    }

    /////////////////////////////////////
    /////////////   Update   ////////////
    /////////////////////////////////////

    public function set_coords( float $lat, float $lon ):bool {

    }

    public function set_status( string $status ):bool {

    }

    public function update_row( array $changes ):bool {

    }

    /////////////////////////////////////
    /////////////   Create   ////////////
    /////////////////////////////////////

    /**
     * Creates a new Entity post with the user's info
     * 
     * @param       $data       ARRAY_A         fields:
     *                              array(
     *                                  'display_name' => ...,
     *                                  '?slug' => ...,
     *                                  'last_name' => ...,
     *                                  'location_id' => $location['id'],
     *                                  'location_display_name' => $location['display_name'],
     *                                  'location_post_id' => $location['post_id'],
     *                                  'status' => ENUM status
     *                              )
     * @return                   int|WP_Error    either the returned row id or error
     */
    public function insert_into_db( array $data ):int {
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

    //////////////////////////////////
    //////// Loading from DB /////////
    //////////////////////////////////

    protected function load_from_db():bool {
        if ( $this->_has_loaded ) return true;
        if ( !isset( $this->location_id ) && !isset( $this->post_id ) ) return false;
        
        global $wpdb;
        $loaded = false;

        if ( !isset( $this->location_id ) || !isset( $this->post_id ) ) {
            $where_key = isset( $this->post_id ) ? 'post_id' : 'id';
            $where_val = isset( $this->post_id ) ? $this->post_id : $this->location_id;
            $row = $wpdb->get_row( 'SELECT * FROM ' . COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS .
                            " WHERE $where_key = $where_val" );

            if ( $row ) {
                $this->fill_with_data( $row );
                $this->cd_loaded = true;
            }
        }

        $this->load_post_from_db();

        return $this->_has_loaded = $this->cd_loaded && $this->_post_loaded;
    }

    public function fill_with_data( object $data ) {
        $this->location_id = $data->id;
        $this->display_name = $data->display_name;
        $this->slug = $data->slug;
        $this->active_inhabitants = $data->active_inhabitants;
        $this->inactive_inhabitants = $data->inactive_inhabitants;
        $this->post_id = $data->post_id;
    }

    /////////////////////////////////////
    /////////////   Static   ////////////
    /////////////////////////////////////

    /**
     * A method to sanitize or fill out any fields for a location before adding it to the DB
     * 
     * @param           a_array         $data       must contain ('display_name' => string)
     * @return                          a_array
     */
    public static function prepare_for_creation( array $data ):array {
        if ( !isset( $data[ 'display_name' ] ) ) die( 'Invalid call to Location::prepare_location_for_creation. Argument 1 (array) requires (string) key \'display_name\'' );

        $default_loc = community_directory_settings_get( 'default_location', '0,0' );

        $default_args = array(
            'display_name'          => community_directory_format_uc_first( $data['display_name'] ),
            'slug'                  => community_directory_string_to_slug( $data['display_name'] ),
            'status'                => COMMUNITY_DIRECTORY_ENUM_PENDING,
            'active_inhabitants'    => 0,
            'inactive_inhabitants'  => 0,
            'coords'                => $default_loc,
        );

        return wp_parse_args( $data, $default_args );
    }

}