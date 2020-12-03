<?php
/**
 *
 * Entity instance
 *
 * @since      1.0.0
 * @author     Marius Miliunas
 */

namespace Maruf89\CommunityDirectory\Includes\instances;

use Maruf89\CommunityDirectory\Includes\ClassEntity;

class Entity {
    private static $active_entity;
    
    private bool $has_loaded = false;
    private bool $is_active;
    private Location $location;

    private int $post_id;
    private int $author_id;

    // WP_Post object
    private object $post;

    // Saved meta data
    public static $post_meta_loc_name = '_cd_location_display_name';
    private string $location_name;
    public static $post_meta_loc_id = '_cd_location_id';
    private int $location_id;


    public function __construct( $post_id, $author_id = null ) {
        $this->post_id = $post_id;
        if ( isset( $author_id ) ) $this->author_id = $author_id;
    }

    public function __get( $property ) {
        if ( $property === 'location_name' ) {
            $loc_name = '';
            if ( isset( $this->location_name ) ) $loc_name = $this->location_name;
            else if ( isset( $this->location ) ) $loc_name = $this->location->display_name;
            else if ( ( !$this->has_loaded && $this->load_from_db() ) || $this->has_loaded ) {
                $meta = get_post_meta( $this->post_id, self::$post_meta_loc_name );
                if ( count( $meta ) ) $loc_name = $meta[0];
                else {
                    // Entity does not have location meta data saved
                    $this->get_location();
                    $loc_name = $this->location->display_name;
                    // Save for future
                    add_post_meta( $this->post_id, self::$post_meta_loc_name, $loc_name, true );
                    add_post_meta( $this->post_id, self::$post_meta_loc_id, $this->location->location_id, true );
                }
            }
            
            return $this->location_name = $loc_name;
        }

        if ( $property === 'location_id' ) {
            $loc_id = 0;
            if ( isset( $this->location_id ) ) $loc_id = $this->location_id;
            else if ( isset( $this->location ) ) $loc_id = $this->location->location_id;
            else if ( ( !$this->has_loaded && $this->load_from_db() ) || $this->has_loaded ) {
                $meta = get_post_meta( $this->post_id, self::$post_meta_loc_id );
                if ( count( $meta ) ) $loc_id = $meta[0];
                else {
                    // Entity does not have location meta data saved
                    $this->get_location();
                    $loc_id = $this->location->location_id;
                    // Save for future
                    add_post_meta( $this->post_id, self::$post_meta_loc_name, $loc_id, true );
                    add_post_meta( $this->post_id, self::$post_meta_loc_id, $this->location->location_id, true );
                }
            }
            
            return $this->location_name = $loc_id;
        }
        
        if ( $property === 'location' ) {
            return $this->get_location();
        }
        
        if ( property_exists( $this, $property ) ) {
            if ( !isset( $this->$property ) && !$this->has_loaded ) $this->load_from_db();
            return $this->$property;
        }

        // check the post obj
        if ( ( !$this->has_loaded && $this->load_from_db() ) || $this->has_loaded ) {
            if ( property_exists( $this->post, $property ) )
                return $this->post->$property;
        }
    }

    public function activate() {
        $this->load_from_db();

        return $this->post->status === 'publish';
    }

    public static function get_active_entity():Entity {
        if ( Entity::$active_entity != null ) return Entity::$active_entity;

        if ( !( $author_id = get_current_user_id() ) ) {
            die( 'Cannot get active entity of non-logged in user.' );
        }

        $entity_post_id = community_directory_get_post_var_by_field(
            'ID', 'post_author', $author_id, ClassEntity::$post_type
        );

        if ( $entity_post_id )
            return Entity::$active_entity = new Entity( $entity_post_id, $author_id );

        return null;
    }

    public function get_location_name():string {
        if ( $this->get_location() ) return $this->location->get_display_name();
    }

    private function get_location():Location {
        if ( isset( $this->location ) ) return $this->location;

        if ( $this->location = Location::get_active_location( $this->post_parent ) ) return $this->location;
    }

    private function load_from_db():bool {
        if ( $this->has_loaded ) return true;
        
        $loaded = false;
        
        if ( isset( $this->post_id ) ) {
            $this->post = \WP_Post::get_instance( $this->post_id );
            if ( $this->post ) {
                $this->has_loaded = true;
                $loaded = true;
            }
        }



        return $loaded;
    }
}