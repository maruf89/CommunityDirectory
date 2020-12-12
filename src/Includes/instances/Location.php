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

    public function is_valid():bool {
        return $this->load_from_db();
    }

    public function get_featured( $size = 'medium' ):string {
        return get_the_post_thumbnail_url( $this->post_id, $size );
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

}