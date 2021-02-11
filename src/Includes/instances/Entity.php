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
use Maruf89\CommunityDirectory\Includes\Abstracts\Instance;

class Entity extends Instance {

    public static string $post_type;
    public static string $post_slug;
    protected static string $link_identifier;

    private static $active_entity;
    
    private bool $_acf_loaded = false;
    private bool $_is_valid;

    private ?Location $location = null;
    private ?array $acf_data = null;
    private ?\WP_User $author = null;

    // Saved meta data
    public static $post_meta_loc_name = '_cd_location_display_name';
    private string $location_name;
    public static $post_meta_loc_id = '_cd_location_id';
    private int $location_id;


    public function __construct( int $post_id = null, int $author_id = null, object $post = null ) {
        if ( $post && $this->from_post_obj( $post ) ) return;
        
        if ( !$post_id && !$author_id )
            die( 'Entity construct requires atleast a post_id, or author_id at minimum' );
        if ( $post_id ) $this->post_id = $post_id;
        if ( $author_id ) {
            $this->author_id = $author_id;
            if ( !$post_id ) $this->load_post_from_db();
        }
    }

    /////////////////////////////////////
    /////////////    Get     ////////////
    /////////////////////////////////////
    
    public function __get( $property ) {
        if ( $property === 'post_id' && !$this->post_id ) {
            $this->load_post_from_db();
        }
        
        if ( $property === 'acf_data' ) {
            $this->load_acf_from_db();
        }
        
        if ( $property === 'location_name' ) {
            $loc_name = '';
            if ( isset( $this->location_name ) ) $loc_name = $this->location_name;
            else if ( isset( $this->location ) ) $loc_name = $this->location->display_name;
            else if ( ( !$this->_post_loaded && $this->load_post_from_db() ) || $this->_post_loaded ) {
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

            if ( !$loc_name ) {
                $this->_is_valid = false;
                $loc_name = '';
            }
            
            return $this->location_name = $loc_name;
        }

        if ( $property === 'location_id' ) {
            $loc_id = 0;
            if ( isset( $this->location_id ) ) $loc_id = $this->location_id;
            else if ( isset( $this->location ) ) $loc_id = $this->location->location_id;
            else if ( ( !$this->_post_loaded && $this->load_post_from_db() ) || $this->_post_loaded ) {
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
            if ( !isset( $this->$property ) && !$this->_post_loaded ) $this->load_post_from_db();
            return $this->$property;
        }

        // check the post obj
        if ( ( !$this->_post_loaded && $this->load_post_from_db() ) || $this->_post_loaded ) {
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
     * Checks whether the entity matches a passed in status
     * 
     * @param       $enum_status    string      The enum's matching the status type
     * @param       $is_acf         bool        whether checking against acf or post_status
     * @return                      bool
     */
    public function is_status( string $enum_status, bool $is_acf = false ):bool {
        if ( $is_acf ) {
            if ( $this->acf_data || $this->load_acf_from_db() ) {
                $active = $this->acf_data[ClassACF::$entity_active] === 'true';
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

    /**
     * TODO: Refactor away to Instance parent class
     * 
     * Gets the entities status depending on the desired format
     */
    public function get_status( $format = 'bool' ) {
        if ( $this->acf_data || $this->load_acf_from_db() ) {
            $active = $this->acf_data[ClassACF::$entity_active] === 'true';
            switch ( $format ) {
                case 'raw': return $this->acf_data[ClassACF::$entity_active];
                case 'bool': return $active;
                case 'enum': return $active ? COMMUNITY_DIRECTORY_ENUM_ACTIVE : COMMUNITY_DIRECTORY_ENUM_INACTIVE;
                case 'display': return $active ?
                    __( 'Active', 'community-directory' ) : __( 'Inactive', 'community-directory' );
            }
        }
        return null;
    }

    public function get_author():\WP_User {

        if ( isset( $this->author ) ) return $this->author;
        
        if ( !$this->author_id ) $this->load_post_from_db();

        return $this->author = new \WP_User( $this->author_id );
    }

    public function get_location_name():string {
        if ( $this->get_location() ) return $this->location->get_display_name();

        return '';
    }

    public function share_location():bool {
        if ( !$this->load_acf_from_db() ) return false;

        return $this->acf_data[ClassACF::$entity_share_loc_key] ?? false;
    }

    public function get_location():?Location {
        if ( $this->location ) return $this->location;

        if ( $this->load_post_from_db() && !$this->post_parent ) {
            $this->_is_valid = false;
            return null;
        }

        return $this->location = new Location( null, $this->post_parent );
    }

    /**
     * Returns the featured image
     */
    public function get_featured( string $type = 'src' ) {
        if ( !$this->load_acf_from_db() ||
             !isset( $this->acf_data[ClassACF::$entity_picture] ) ||
             !$this->acf_data[ClassACF::$entity_picture]
        ) return '';

        $img_arr = $this->acf_data[ClassACF::$entity_picture];
        switch ( $type ) {
            case 'src': return $img_arr[ 'url' ];
            case 'raw':
            default: return $img_arr;
        }
    }

    public function get_link():string {
        return static::build_entity_link( $this );
    }

    private static string $_get_acf = 'get_acf_';
    private static int $_get_acf_len = 8; // Must equal strlen of $_get_acf
    public function __call( $name, $arguments ) {
        if ( substr( $name, 0, self::$_get_acf_len ) !== self::$_get_acf )
            die( 'Invalid method called ' . __CLASS__ . '::' . $name );

        $field = substr( $name, self::$_get_acf_len );
        $acf_field = "entity_$field";

        if ( !$this->load_acf_from_db() || !isset( $this->acf_data[ClassACF::${$acf_field}] ) ) return '';

        return $this->acf_data[ClassACF::${$acf_field}];
    }

    /////////////////////////////////////
    /////////////   Update   ////////////
    /////////////////////////////////////

    /**
     * Does the obvious, and triggers other actions that rely on
     * an entities state, like:
     *      - change post_status of Entity cpt
     *      - hides any offers/needs that would be otherwise seen (via hook)
     * 
     * @param   $activate       boolean         Whether to activate/deactivate
     * @param   $status_only    boolean         Whether to ONLY update the post's post_status
     * @param   $force          boolean         Whether to force the action and ignore the entity's current state
     * @return                  boolean         Whether it was successfull (in updating the post_status)
     */
    public function activate_deactivate(
        bool $activate = true,
        bool $status_only = false,
        bool $force = false
    ):bool {
        // If we can't load the data, return false
        if ( !$this->load_post_from_db() || !$this->load_acf_from_db() ) return false;

        $active_state =& $this->acf_data[ClassACF::$entity_active];

        // If already set, don't do anything
        if ( !$force ) {
            if ( ( $activate && $active_state === 'true' ) ||
                 ( !$activate && $active_state === 'false' ) ) return false;
        }

        // update the local variable
        $active_state = $activate ? 'true' : 'false';

        // In cases where user manually updates the field, we don't need to do it again
        if ( !$status_only ) {
            // Update the user's active field in ACF
            $acf_updates = array();
            $acf_updates[ClassACF::$entity_active_key] = $active_state;
            do_action( 'community_directory_acf_update', $this->post_id, $acf_updates );

            do_action( 'community_directory_shift_inhabitants_count',
                $this->get_location()->location_id,
                'id',
                $this->get_status(),
            );
        }

        // Update the post_status
        $post_status = community_directory_bool_to_status( $activate, 'entity', 'post' );
        $saved = !!$this->update_post( array( 'post_status' => $post_status ) );

        // Broadcast that the change occured
        if ( $saved ) do_action( 'community_directory_entity_changed_activation', $this, $activate, $status_only );

        return $saved;
    }

    public function set_location( Location $location ):bool {
        if ( !$location->is_valid() ) return false;

        add_post_meta( $this->post_id, ClassEntity::$post_meta_loc_id, $location->location_id );
        add_post_meta( $this->post_id, ClassEntity::$post_meta_loc_name, $location->display_name );

        // Update the count
        do_action( 'community_directory_add_inhabitant',
                   $location->location_id,
                   'id',
                   $this->get_status( 'enum' ),
                   1
        );

        return !!$this->update_post( array( 'post_parent' => $location->post_id ) );
    }

    //////////////////////////////////
    ///////////// Create /////////////
    //////////////////////////////////

    /**
     * Creates a new Entity post with the user's info
     * 
     * @param       $data       ARRAY_A         required fields
     *                              array(
     *                                  'user_id' => ...,
     *                                  'first_name' => ...,
     *                                  'last_name' => ...,
     *                                  'location_id' => $location['id'],
     *                                  'location_display_name' => $location['display_name'],
     *                                  'location_post_id' => $location['post_id'],
     *                                  'status' => ENUM status
     *                              )
     * @return                   int|WP_Error    either the returned row id or error
     */
    public function insert_into_db( array $data ):int {
        if ( !isset( $data['user_id'] ) ||
             !isset( $data['first_name'] ) ||
             !isset( $data['last_name'] )
        )
            die( 'Entity->insert_into_db requires user_id, first_name, last_name' );
        
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
            'post_name'     => community_directory_string_to_slug( $title ),
            'post_type'     => self::$post_type,
            'meta_input'    => $meta,
        );

        if ( isset( $data['location_post_id'] ) ) {
            $args['post_parent'] = $data['location_post_id'];

            if ( isset( $data[ 'status' ] ) && gettype( $data[ 'status' ] === 'string' ) ) {
                // Update the count
                $args[ 'post_status' ] = community_directory_enum_status_to_post_status( $data[ 'status' ] );
                do_action( 'community_directory_add_inhabitant',
                        $data['location_post_id'],
                        'post_id',
                        $data[ 'status' ],
                        1
                );
            }
        }
        
        $entity_post_id = wp_insert_post( $args );

        // Save user meta to ACF
        do_action( 'community_directory_acf_initiate_entity', array(
            'entity_id' => $entity_post_id,
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'status'    => isset( $data['status'] ) ? $data[ 'status' ] : '',
        ) );

        return $entity_post_id;
    }

    //////////////////////////////////
    //////// Loading from DB /////////
    //////////////////////////////////

    protected function load_from_db():bool {
        return $this->_has_loaded = $this->load_post_from_db() && $this->load_acf_from_db();
    }

    protected function from_post( \WP_Post $post ):bool {
        if ( parent::from_post( $post ) ) {
            $this->author_id = $post->post_author;
            return true;
        }
        return false;
    }

    protected function load_acf_from_db():bool {
        if ( $this->_acf_loaded ) return true;

        if ( $this->post_id || $this->load_post_from_db() ) {
            if ( $data = get_fields( $this->post_id ) ) {
                $this->acf_data = $data;
            }

            if ( isset( $data[ ClassACF::$entity_gmap_loc ] ))
                $this->coords = array(
                    'lat' => $data[ ClassACF::$entity_gmap_loc ][ 'lat' ],
                    'lon' => $data[ ClassACF::$entity_gmap_loc ][ 'lng' ],
                );
            
            return $this->_acf_loaded = !!$data;
        }

        return false;
    }
    
    protected static array $_author_id_cache = [];

    protected function _save_to_cache() {
        parent::_save_to_cache();
        self::$_author_id_cache[ $this->post->post_author ] = $this;
    }

    //////////////////////////////////
    ////////     Delete     //////////
    //////////////////////////////////
    
    public function delete_permanently( bool $with_user = false ):array {
        if ( !$this->load_post_from_db() ) return [ 'success' => false ];

        global $wpdb;
        
        // Delete all posts of this this post_author
        $self_delete_sql = "
            DELETE FROM $wpdb->posts
            WHERE post_author = $this->post_author
        ";
        $deleted_self = $wpdb->query( $self_delete_sql );

        $response = [ 'success' => $deleted_self ];

        if ( $with_user && $response[ 'success' ] ) {
            $meta_delete = "
                DELETE FROM $wpdb->usermeta
                WHERE user_id = $this->post_author
            ";

            $meta_deleted = $wpdb->query( $meta_delete );

            $user_delete = "
                DELETE FROM $wpdb->users
                WHERE ID = $this->post_author
            ";

            $user_deleted = $wpdb->query( $user_delete );

            $response[ 'success' ] = $meta_deleted && $user_deleted;
        }

        return $response;
    }

    //////////////////////////////////
    //////// Static Methods //////////
    //////////////////////////////////

    /**
     * Attempts to return the entity created by the logged in user
     */
    public static function get_active_entity():?Entity {
        if ( Entity::$active_entity != null ) return Entity::$active_entity;

        if ( !( $author_id = get_current_user_id() ) ) {
            return null;
        }

        $entity_post_id = community_directory_get_post_var_by_field(
            'ID', 'post_author', $author_id, ClassEntity::$post_type
        );

        if ( isset( self::$_post_id_cache[ $entity_post_id ] ) )
            return self::$_post_id_cache[ $entity_post_id ];

        if ( $entity_post_id )
            return Entity::$active_entity = new Entity( $entity_post_id, $author_id );

        return null;
    }

    /**
     * If a cached version exists, gets an entity, otherwise creates a new one
     */
    public static function get_instance(
        int $post_id = null,
        int $author_id = null,
        object $post = null
    ):?Entity {
        if ( !$post_id && !$author_id && !$post ) return null;
        
        $instance = parent::_get_instance( $post_id, $post );

        if ( $instance ) return $instance;
        else if ( $author_id || ( $post && ( $author_id = $post->post_author ) ) )
            if ( isset( self::$_author_id_cache[ $author_id ] ) )
                return self::$_author_id_cache[ $author_id ];

        return new Entity( $post_id, $author_id, $post );
    }

    public static function build_location_link( Location $location = null ):string {
        if ( !$location ) {
            if ( !self::$active_entity || !( $location = self::$active_entity->get_location() ) )
                return '';
        }

        return $location->get_display_link();
    }

    public static function build_entity_link( Entity $entity = null ):string {
        if ( !$entity ) {
            if ( self::$active_entity ) $entity = self::$active_entity;
            else return '';
        }

        if ( !( $location = $entity->get_location() ) ) return '';

        $location_post_slug = $location::$post_slug;
        $location_name_slug = $entity->location->slug;

        return "/$location_post_slug/$location_name_slug/$entity->post_name";
    }

    public static function build_edit_link( int $post_id = null ):string {
        if ( !$post_id ) {
            if ( self::$active_entity ) $post_id = self::$active_entity->post_id;
            else return '';
        }
        
        return parent::build_edit_link( $post_id );
    }

    /**
     * An ACF hook that gets notified when the profile_active field gets changed
     * Updates the count and updates the post's status to reflect it
     * 
     * Do not call directly!
     */
    public static function acf_shift_inhabitants_count( $value, $entity_post_id, $field ) {
        if ( !isset( $_POST['acf'][ClassACF::$entity_active_key] ) ) return $value;
        
        global $post;
        
        // get the old (saved) value
        $was_active = get_field( ClassACF::$entity_active, $entity_post_id ) === 'true';

        $is_active = $_POST['acf'][ClassACF::$entity_active_key] === 'true';
        
        if ( $was_active == $is_active ) return $value;

        $post_parent = $post->post_parent;

        do_action( 'community_directory_shift_inhabitants_count', $post_parent, 'post_id', $is_active );

        // Update the post's status
        $instance = self::get_instance( $entity_post_id );
        $instance->activate_deactivate( $is_active, true, false );
        
        return $value;
    }

    public static function acf_update_title_with_loc_name( $title, $post_id, $field ) {
        $instance = self::get_instance( $post_id );
        $instance->update_post( array(
            'post_title' => sanitize_text_field( $title ),
            'post_name' => community_directory_string_to_slug( $title ),
        ) );

        return $title;
    }

    /**
     * Activates or deactivates an entity in ACF and the post's status
     * 
     * @param           $activate       bool        Whether to activate
     * @param           $id             int         Either 'post_id' or 'user_id'
     * @param           $id_for_what    string      If searching user_id, searches on the post_author field, otherwise on the post's ID (optional default: 'post_id')
     * @param           $status_only    bool        Whether to only update the post's status, and not the ACF field
     */
    public static function activate_deactivate_entity(
        bool $activate,
        int $id,
        string $id_for_what = '',
        bool $status_only = false
    ):bool {
        if ( $id_for_what === 'post_id' ) $entity_post_id = $id;
        else if ( $id_for_what === 'user_id' ) {
            $entity_post_id = community_directory_get_post_var_by_field(
                'ID', 'post_author', $id, self::$post_type
            );
        } else die( 'Invalid "id_for_what" passed into Entity::activate_deactivate_entity().' );
        
        $instance = self::get_instance( $entity_post_id );

        return $instance->activate_deactivate( $activate, $status_only );
    }

    /**
     * To be called upon post type registration long before any instance is required
     */
    public static function define_post_type(
        string $post_type,
        string $post_slug,
        string $link_identifier = 'post_name'
    ) {
        self::$post_type = $post_type;
        self::$post_slug = $post_slug;
        self::$link_identifier = $link_identifier;
    }
}