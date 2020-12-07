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
use Maruf89\CommunityDirectory\Includes\ClassACF;

class Entity {
    public static $post_type = 'cd-entity';
    private static $active_entity;
    
    private bool $post_loaded = false;
    private bool $acf_loaded = false;
    private bool $_is_valid;

    private int $post_id;
    private int $author_id;

    private ?Location $location = null;
    private ?array $acf_data = null;
    private ?\WP_Post $post = null;
    private ?\WP_User $author = null;

    // Saved meta data
    public static $post_meta_loc_name = '_cd_location_display_name';
    private string $location_name;
    public static $post_meta_loc_id = '_cd_location_id';
    private int $location_id;


    public function __construct( int $post_id = null, int $author_id = null, object $post = null ) {
        if ( $post && $this->from_post_obj( $post ) ) return;
        
        if ( !$post_id && !$author_id ) die( 'Entity construct requires atleast a post_id, or author_id at minimum' );
        if ( $post_id ) $this->post_id = $post_id;
        if ( $author_id )$this->author_id = $author_id;
    }

    public function __get( $property ) {
        if ( $property === 'acf_data' ) {
            $this->load_acf_from_db();
        }
        
        if ( $property === 'location_name' ) {
            $loc_name = '';
            if ( isset( $this->location_name ) ) $loc_name = $this->location_name;
            else if ( isset( $this->location ) ) $loc_name = $this->location->display_name;
            else if ( ( !$this->post_loaded && $this->load_post_from_db() ) || $this->post_loaded ) {
                $meta = get_post_meta( $this->post_id, self::$post_meta_loc_name );
                if ( count( $meta ) && $meta[0] ) $loc_name = $meta[0];
                else if ( $this->get_location() ) {
                    // If we got here then entity does not have location meta data saved
                    $loc_name = $this->location->display_name;
                    // Save for future
                    add_post_meta( $this->post_id, self::$post_meta_loc_name, $loc_name, true );
                    add_post_meta( $this->post_id, self::$post_meta_loc_id, $this->location->location_id, true );
                }
            }

            if ( !$loc_name ) $this->_is_valid = false;
            
            return $this->location_name = $loc_name;
        }

        if ( $property === 'location_id' ) {
            $loc_id = 0;
            if ( isset( $this->location_id ) ) $loc_id = $this->location_id;
            else if ( isset( $this->location ) ) $loc_id = $this->location->location_id;
            else if ( ( !$this->post_loaded && $this->load_post_from_db() ) || $this->post_loaded ) {
                $meta = get_post_meta( $this->post_id, self::$post_meta_loc_id );
                if ( count( $meta ) ) $loc_id = $meta[0];
                else if ( $this->get_location() ) {
                    // If we got here then entity does not have location meta data saved
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
            if ( !isset( $this->$property ) && !$this->post_loaded ) $this->load_post_from_db();
            return $this->$property;
        }

        // check the post obj
        if ( ( !$this->post_loaded && $this->load_post_from_db() ) || $this->post_loaded ) {
            if ( property_exists( $this->post, $property ) )
                return $this->post->$property;
        }
    }

    /**
     * Loads data from the db, if it exists, it's valid
     * 
     * @return      bool        Whether it's valid or not
     */
    public function is_valid():bool {
        if ( isset( $this->_is_valid ) ) return $this->_is_valid;

        return $this->_is_valid = !!(
            $this->get_location() &&
            $this->load_post_from_db() &&
            $this->load_acf_from_db()
        );
    }

    /**
     * 
     */
    public function is_status( string $enum_status, bool $is_acf = false ):bool {
        if ( $is_acf ) {
            if ( $this->acf_data || $this->load_acf_from_db() ) {
                $active = $this->acf_data[ClassACF::$field_is_active] === 'true';
                switch ( $enum_status ) {
                    case COMMUNITY_DIRECTORY_ENUM_INACTIVE:
                        return !$active;
                    case COMMUNITY_DIRECTORY_ENUM_ACTIVE:
                        return $active;
                }
            }
        } else {
            $this_status = $this->post->post_status ;
            switch ( $enum_status ) {
                case COMMUNITY_DIRECTORY_ENUM_INACTIVE:
                    return $this_status === 'pending' || $this_status === 'draft';
                case COMMUNITY_DIRECTORY_ENUM_ACTIVE:
                    return $this_status === 'publish';
            }
        }

        return false;
    }

    public function display_status():string {
        if ( $this->acf_data || $this->load_acf_from_db() ) {
            return $this->acf_data[ClassACF::$field_is_active] === 'true' ?
                __( 'Active', 'community-directory' ) : __( 'Inactive', 'community-directory' );
        }

        return __( 'Incomplete Entity (missing entity info)', 'community-directory' );
    }

    public function activate_deactivate(
        bool $activate = true,
        bool $status_only = false,
        bool $force = false
    ):bool {
        // If we can't load the data, return false
        if ( !$this->load_post_from_db() || !$this->load_acf_from_db() ) return false;

        $current_state = $this->acf_data[ClassACF::$field_is_active];

        // If already set, don't do anything
        if ( !$force ) {
            if ( ( $activate && $current_state === 'true' ) ||
                 ( !$activate && $current_state === 'false' ) ) return false;
        }

        // In cases where user manually updates the field, we don't need to do it again
        if ( !$status_only ) {
            // Update the user's active field in ACF
            $acf_updates = array();
            $acf_updates[ClassACF::$field_is_active_key] = $activate ? 'true' : 'false';
            community_directory_acf_update_entity( $this->post_id, $acf_updates );
        }

        // Update the post_status
        $status = $activate ? COMMUNITY_DIRECTORY_ENUM_ACTIVE : COMMUNITY_DIRECTORY_ENUM_PENDING;
        community_directory_update_post_status( $this->post_id, $status );
        return true;
    }

    public function get_author():\WP_User {

        if ( isset( $this->author ) ) return $this->author;
        
        if ( !$this->author_id ) $this->load_post_from_db();

        return $this->author = new \WP_User( $this->author_id );
    }

    /**
     * Attempts to return the entity created by the logged in user
     */
    public static function get_active_entity():?Entity {
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

        return '';
    }

    private function get_location():?Location {
        if ( $this->location ) return $this->location;

        if ( !$this->post_parent ) {
            $this->_is_valid = false;
            return null;
        }

        return $this->location = new Location( null, $this->post_parent );
    }

    /**
     * Instantiates a new entity to the DB
     */
    public function insert_into_db( array $data ):int {
        if ( !isset( $data['user_id'] ) ||
             !isset( $data['first_name'] ) ||
             !isset( $data['last_name'] )
        ) {
            dump($data);
            die( 'Entity->insert_into_db requires user_id, first_name, last_name' );
        }
        
        $title = community_directory_generate_display_name_from_user_name(
            $data['first_name'], $data['last_name']
        );

        $meta = array();
        
        if ( isset( $data['location_id'] ) ||
             isset( $data['location_display_name'] )
        ) {
            $meta[self::$post_meta_loc_id] = $data['location_id'];
            $meta[self::$post_meta_loc_name] = $data['location_display_name'];
        }

        $args = array(
            'post_author'   => $data['user_id'],
            'post_title'    => $title,
            'post_name'     => strtolower( $title ),
            'post_type'     => self::$post_type,
            'meta_input'    => $meta,
        );

        if ( isset( $data['location_post_id'] ) )
            $args['post_parent'] = $data['location_post_id'];
        
        $entity_post_id = wp_insert_post( $args );

        // Save user meta to ACF
        do_action( 'community_directory_acf_initiate_entity', array(
            'entity_id' => $entity_post_id,
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
        ) );

        return $entity_post_id;
    }

    private function load_post_from_db():bool {
        if ( $this->post_loaded ) return true;
        
        $loaded = false;
        
        if ( !$this->post_id )
            $this->post_id = community_directory_get_post_var_by_field(
                'ID', 'post_author', $author_id, ClassEntity::$post_type
            );

        if ( $this->post_id )
            $loaded = $this->from_post( \WP_Post::get_instance( $this->post_id ) );

        return $loaded;
    }

    /**
     * Fills the entity object from a passed in post object
     */
    private function from_post_obj( object $post ):bool {
        return $this->from_post( new \WP_Post( $post ) );
    }

    /**
     * Fleshes an entity out from a passed in WP Post instance
     */
    private function from_post( \WP_Post $post ):bool {
        if ( $post ) {
            $this->post = $post;
            $this->post_loaded = true;
            $this->post_id = $post->ID;
            $this->author_id = $post->post_author;
            return true;
        }
        return false;
    }

    private function load_acf_from_db():bool {
        if ( $this->acf_loaded ) return true;

        if ( $this->post_id || $this->load_post_from_db() ) {
            if ( $data = get_fields( $this->post_id ) ) {
                $this->acf_data = $data;
            }
            

            return $this->acf_loaded = !!$data;
        }

        return false;
    }

    public static function get_location_link( Location $location = null ):string {
        if ( !$location ) {
            if ( !self::$active_entity || !( $location = self::$active_entity->get_location() ) )
                return '';
        }

        $_location = __( 'location', 'community-directory' );

        return "/$_location/$location->slug/" . __( 'single', 'community-directory' );
    }

    public static function get_display_link( Entity $entity = null ):string {
        if ( !$entity ) {
            if ( self::$active_entity ) $entity = self::$active_entity;
            else return '';
        }

        $_location = __( 'location', 'community-directory' );
        $slug = $entity->location->slug;

        return "/$_location/$slug/$entity->post_name";
    }

    public static function get_edit_link( int $post_id = null ):string {
        if ( !$post_id ) {
            if ( self::$active_entity ) $post_id = self::$active_entity->post_id;
            else return '';
        }

        return admin_url( "post.php?post=$post_id&action=edit" );
    }
}