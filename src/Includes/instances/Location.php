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

class Location extends ClassLocation {
    private static ?Location $active_location = null;

    private bool $has_loaded = false;

    private int $location_id;
    private string $display_name;
    private string $slug;
    private int $post_id;
    private int $active_inhabitants;
    private int $inactive_inhabitants;
    private string $status;

    private ?\WP_Post $post = null;

    public static function get_active_location( int $location_post_id = null ):?Location {
        if ( Location::$active_location != null ) return Location::$active_location;

        if ( $location_post_id ) return Location::$active_location = new Location( null, $location_post_id );

        return new Location();
    }

    public function __construct( $location_id = null, $post_id = null ) {
        if ( $location_id ) $this->location_id = $location_id;
        if ( $post_id ) $this->post_id = $post_id;
    }

    public function __get( $property ) {
        if ( property_exists( $this, $property ) ) {
            if ( !isset( $this->$property ) && !$this->has_loaded ) $this->load_from_db();
            if ( isset( $this->$property ) )
                return $this->$property;
        }

        // check the post obj
        if ( ( !$this->has_loaded && $this->load_from_db() ) || $this->has_loaded ) {
            if ( property_exists( $this->post, $property ) )
                return $this->post->$property;
        }
    }

    private function load_from_db():bool {
        if ( $this->has_loaded ) return true;
        if ( !isset( $this->location_id ) && !isset( $this->post_id ) ) return false;
        
        global $wpdb;
        $loaded = false;

        if ( !isset( $this->location_id ) ) {
            $row = $wpdb->get_row( 'SELECT * FROM ' . COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS .
                            " WHERE post_id = $this->post_id"
            , ARRAY_A);

            if ( $row ) {
                $this->fill_with_data( $row );
                $loaded = true;
            }
        }

        if ( !isset( $this->post ) ) {
            $this->post = \WP_Post::get_instance( $this->post_id );
            if ( $this->post ) {
                $this->has_loaded = true;
                $loaded = true;
            }
        }

        return $loaded;
    }

    public function fill_with_data( $data ) {
        $this->location_id = $data['id'];
        $this->display_name = $data['display_name'];
        $this->slug = $data['slug'];
        $this->active_inhabitants = $data['active_inhabitants'];
        $this->inactive_inhabitants = $data['inactive_inhabitants'];
        $this->post_id= $data['post_id'];
    }

}