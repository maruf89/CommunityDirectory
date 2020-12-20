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

    protected bool $_cd_loaded = false;

    protected int $location_id;
    protected string $display_name;
    protected string $slug;
    protected int $active_inhabitants;
    protected int $inactive_inhabitants;
    protected string $status;
    protected $coords;

    public function __construct( int $location_id = null, int $post_id = null, object $post = null ) {
        if ( $location_id ) $this->location_id = $location_id;
        if ( $post_id ) $this->post_id = $post_id;
        if ( $post ) $this->from_post( $post );
    }

    /////////////////////////////////////
    /////////////    Get     ////////////
    /////////////////////////////////////

    /**
     * Gets the entities status depending on the desired format
     */
    public function get_status( $format = 'bool' ) {
        if ( $this->load_cd_from_db() ) {
            switch ( $format ) {
                case 'raw': return $this->status;
                case 'bool': return $this->status === COMMUNITY_DIRECTORY_ENUM_ACTIVE;
                case 'enum': return $this->status;
                case 'display': return __( ucfirst( strtolower( $this->status ) ), 'community-directory' );
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
     * Creates a new Location post
     * 
     * @param       $data       ARRAY_A         fields:
     *     (string display_name|?string slug|?string status|?int active_inhabitants|?int inactive_inhabitants|?string coords)
     * @return                   int|WP_Error    either the returned row id or error
     */
    public function insert_into_db( array $data ):bool {
        if ( !isset( $data['display_name'] ) || empty( $data['display_name' ] ) ) {
            die( 'display_name must be set and cannot be empty' );
        }

        global $wpdb;

        // If we haven't set the properties on the Location object yet
        if ( !isset( $this->slug ) )
            $data = apply_filters( 'community_directory_prepare_location_for_creation', $data, $this );

        // If the loc doesn't have a post_id insert into db
        if ( !isset( $this->post_id ) || !$this->post_id )
            $this->create_new_post( isset( $data[ 'user_id' ] ) ? $data[ 'user_id' ] : 0 );

        $table = COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS;
        $sql = $wpdb->prepare(
            "
                INSERT INTO $table
                ( display_name, slug, status, post_id, active_inhabitants, inactive_inhabitants, coords )
                VALUES( %s, %s, %s, %d, %d, %d, ST_PointFromText('POINT($this->coords)'))
            ",
            $this->display_name,
            $this->slug,
            $this->status,
            $this->post_id,
            $this->active_inhabitants,
            $this->inactive_inhabitants
        );

        $result = $wpdb->query( $sql );
        
        $this->load_from_db();
        $this->_save_to_cache();

        return !!$result;
    }
    
    /**
     * Creates a new wp post for the location and set's the post_id to the newly inserted row
     * 
     * @param       $data       array       an associative array with 'display_name', and 'slug' required
     */
    public function create_new_post( int $optional_user_id = 0 ) {
        // Create post object
        $my_post = array(
            'post_title'    => $this->display_name,
            'post_status'   => $this->status,
            'post_type'     => self::$post_type,
            'post_author'   => $optional_user_id,
        );
        
        // Insert the post into the database
        $this->post_id = wp_insert_post( $my_post );

        // For some reason the post_name doesn't save upon insertion so we update it afterwards
        $this->update_post( array(
            'post_name' => $this->slug
        ) );

        return $this->post_id;
    }

    /////////////////////////////////////
    /////////////   Update   ////////////
    /////////////////////////////////////

    /**
     * Updates the Community Directory Locations table
     */
    public function update_cd_row( array $changes ):bool {
        if ( !count( $changes ) ) die( 'Location::update_cd_row must be passed an array argument with values' );
        
        $table = COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS;
        
        $update = [];

        foreach ( $changes as $key => $value ) {
            switch ( $key ) {
                case 'id':
                    die( 'Cannot alter the id of an existing location' );
                case 'active_inhabitants':
                case 'inactive_inhabitants':
                    $update[] = "$key = $value";
                case 'status':
                    $update[] = "$key = '" . community_directory_status_to_enum( $value ) . "'";
                    break;
                case 'coords':
                    $update[] = "$key = " . community_directory_coords_to_mysql_point( $value );
                    break;
                default:
                    $update[] = "$key = '$value'";
            }
        }

        $update_clause = implode( ', ', $update );

        if ( isset( $this->location_id ) ) {
            $which = 'id';
            $id = $this->location_id;
        } else {
            $which = 'post_id';
            $id = $this->post_id;
        }

        global $wpdb;

        $sql = "
            UPDATE $table
            SET $update_clause
            WHERE $which = $id
        ";
        
        return !!$wpdb->query( $sql );
    }
    
    /**
     * Activates/Deactivates a location and it's post
     */
    public function activate_deactivate( bool $activate ):bool {
        $this->load_from_db();

        $cd_status = community_directory_bool_to_status( $activate, 'location' );
        $cd_updated = $this->update_cd_row( array( 'status' => $cd_status ) );

        $post_status = community_directory_bool_to_status( $activate, 'location', 'post' );
        $post_updated = $this->update_post( array( 'status' => $post_status ) );

        return $cd_updated && $post_updated;
    }

    /////////////////////////////////////
    /////////////   Delete   ////////////
    /////////////////////////////////////

    /**
     * Delete its own cd row, post, and remove itself from caches
     */
    public function delete_self():bool {
        if ( !$this->load_cd_from_db() ) return false;

        global $wpdb;
        
        $cd_delete = $wpdb->delete(
            COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS,
            array( 'id' => $this->location_id ),
            '%d'
        );
        
        $deleted_post = wp_delete_post( $this->post_id, true );

        $this->_remove_from_cache();

        return !!$cd_delete && !!$deleted_post;
    }

    //////////////////////////////////
    //////// Loading from DB /////////
    //////////////////////////////////

    protected function load_from_db():bool {
        if ( $this->_has_loaded ) return true;
        if ( !isset( $this->location_id ) && !isset( $this->post_id ) ) return false;

        return $this->_has_loaded = $this->load_cd_from_db() && $this->load_post_from_db();
    }

    protected function load_cd_from_db() {
        if ( $this->_cd_loaded ) return true;

        global $wpdb;

        if ( !isset( $this->location_id ) || !isset( $this->post_id ) || !$this->_check_cd_fields() ) {
            $where_key = isset( $this->post_id ) ? 'post_id' : 'id';
            $where_val = isset( $this->post_id ) ? $this->post_id : $this->location_id;
            $row = $wpdb->get_row( 'SELECT *
                                    FROM ' . COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS . "
                                    WHERE $where_key = $where_val"
            );

            return $row && $this->fill_with_data( $row );
        }
        return false;
    }

    public function fill_with_data( object $data ) {
        $this->display_name = $data->display_name;
        $this->slug = $data->slug;
        $this->active_inhabitants = $data->active_inhabitants;
        $this->inactive_inhabitants = $data->inactive_inhabitants;
        $this->status = $data->status;

        if ( isset( $data->id ) )
            $this->location_id = $data->id;
        else if ( isset( $data->location_id ) )
            $this->location_id = $data->location_id;
            
        if ( isset( $data->post_id ) )
            $this->post_id = $data->post_id;

        if ( isset( $data->coords ) && !empty( $data->coords ) )
            $this->coords = unpack('x/x/x/x/corder/Ltype/dlat/dlon', $data->coords );

        return $this->_check_cd_fields();
    }

    /**
     * Check whether all of the cd db row fields are set
     */
    private function _check_cd_fields():bool {
        $fields = [
            'location_id' => 'integer',
            'display_name' => 'string',
            'slug' => 'string',
            'status' => 'string',
            'active_inhabitants' => 'integer',
            'inactive_inhabitants' => 'integer',
            'coords' => 'array',
        ];

        foreach ( $fields as $prop => $type )
            if ( !isset( $this->{$prop} ) || gettype( $this->{$prop} ) !== $type ) return false;


        // If we got this far then, everything is set
        return $this->_cd_loaded = true;
    }
    
    protected static array $_location_id_cache = [];

    protected function _save_to_cache() {
        if ( isset( $this->post_id ) )
            parent::_save_to_cache();
        if ( isset( $this->location_id ) )
            self::$_location_id_cache[ $this->location_id ] = $this;
    }

    protected function _remove_from_cache() {
        if ( isset( $this->post_id ) )
            parent::_remove_from_cache();
        if ( isset( $this->location_id ) && isset( self::$_location_id_cache[ $this->location_id ] ) )
            unset( self::$_location_id_cache[ $this->location_id ] );
    }

    /////////////////////////////////////
    /////////////   Static   ////////////
    /////////////////////////////////////

    /**
     * If a cached version exists, gets an entity, otherwise creates a new one
     */
    public static function get_instance(
        int $post_id = null,
        int $location_id = null,
        object $post = null
    ):?Location {
        if ( !$post_id && !$location_id && !$post ) return null;
        
        $instance = parent::_get_instance( $post_id, $post );

        if ( $instance ) return $instance;
        else if ( $location_id && isset( self::$_location_id_cache[ $location_id ] ) )
            return self::$_location_id_cache[ $location_id ];

        return new Location( $location_id, $post_id, $post );
    }

    /**
     * A method to sanitize or fill out any fields for a location before adding it to the DB
     * 
     * @param           a_array         $data       must contain ('display_name' => string)
     * @return                          a_array
     */
    public static function prepare_for_creation( array $data, Location $instance = null ):array {
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

        $prepared = wp_parse_args( $data, $default_args );

        if ( $instance ) $instance->fill_with_data( (object) $prepared );
        
        return $prepared;
    }
    
    /**
     * Adds to the active/inactive inhabitants count based on the status and count
     */
    public static function add_inhabitant( $loc_or_post_id, $which, $status, $count = 1 ) {
        if ( $which !== 'id' && $which != 'post_id' ) die( 'Invalid which statement passed' );
        $post_id = $which === 'post_id' ? $loc_or_post_id : null;
        $location_id = $which === 'id' ? $loc_or_post_id : null;

        global $wpdb;

        $field = $status === COMMUNITY_DIRECTORY_ENUM_ACTIVE ? 'active_inhabitants' : 'inactive_inhabitants';
        $changes = array();
        $changes[ $field ] = "$field + $count";
        $Location = Location::get_instance( $post_id, $location_id );
        
        return $Location->update_cd_row( $changes );
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

}