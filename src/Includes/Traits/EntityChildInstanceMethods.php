<?php
/**
 * Methods that pertain to shared logic across post types that fall under a entity ownership
 */
namespace Maruf89\CommunityDirectory\Includes\Traits;

use Maruf89\CommunityDirectory\Includes\{ClassACF, ClassProjects, ClassErrorHandler, TaxonomyLocation};
use Maruf89\CommunityDirectory\Includes\Abstracts\Instance;
use Maruf89\CommunityDirectory\Includes\instances\{Entity, Location, OfferNeed, Project};

trait EntityChildInstanceMethods {
    protected int $entity_post_id;
    protected int $location_post_id;

    protected bool $_acf_loaded = false;
    protected bool $_taxonomy_loaded = false;

    public function get_entity():?Entity {
        return Entity::get_instance( $this->entity_post_id );
    }

    public function get_featured( string $size = 'medium' ):string {
        $image = $this->__call( 'get_acf_image', array() );

        return  wp_get_attachment_image( $image[ 'ID' ], $size );
    }

    public function get_location():?Location {
        return Location::get_instance( $this->__get( 'location_post_id' ) );
    }


    /**
     * Gets the entities status depending on the desired format
     */
    public function get_status( $format = 'bool' ) {
        if ( $this->acf_data || $this->load_acf_from_db() ) {
            $active = $this->acf_data[ClassACF::${static::$acf_active}] === 'true';
            switch ( $format ) {
                case 'raw': return $this->acf_data[ClassACF::${static::$acf_active}];
                case 'bool': return $active;
                case 'enum': return $active ? COMMUNITY_DIRECTORY_ENUM_ACTIVE : COMMUNITY_DIRECTORY_ENUM_INACTIVE;
                case 'display': return $active ?
                    __( 'Active', 'community-directory' ) : __( 'Inactive', 'community-directory' );
            }
        }
        return null;
    }
     
    protected static string $_get_acf = 'get_acf_';
    protected static int $_get_acf_len = 8; // Must equal strlen of $_get_acf
    protected static string $_has_acf = 'has_acf_';
    protected static int $_has_acf_len = 8; // Must equal strlen of $_has_acf
    public function __call( $name, $arguments ) {
        $type;
        $len;

        // Get
        if ( substr( $name, 0, static::$_get_acf_len ) === static::$_get_acf ) {
            $type = 'get';
            $len = static::$_get_acf_len;
        } else if ( substr( $name, 0, static::$_has_acf_len ) === static::$_has_acf ) {
            $type = 'has';
            $len = static::$_has_acf_len;
        } else
            return ClassErrorHandler::handle_exception( new \WP_Error(
                'Invalid method called ' . __CLASS__ . '::' . $name
            ) );
        
        $acf_field = static::$acf_prefix . substr( $name, $len );
        $acf_loaded = $this->load_acf_from_db();

        switch ( $type ) {
            case 'get':
                if ( $acf_loaded ) return $this->acf_data[ClassACF::${$acf_field}] ?? '';
                return '';
            case 'has':
                return $acf_loaded && isset( $this->acf_data[ClassACF::${$acf_field}] ) && !empty( $this->acf_data[ClassACF::${$acf_field}] );
        }
    }
     
    //////////////////////////////////
    ////////     Update      /////////
    //////////////////////////////////

    public function activate_deactivate(
        bool $activate = true,
        bool $status_only = false,
        bool $force = false
    ):bool {
        // If we can't load the data, return false
        if ( !$this->load_post_from_db() || !$this->load_acf_from_db() ) return false;

        $active_state =& $this->acf_data[ ClassACF::${static::$acf_active} ];

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
            $acf_updates[ ClassACF::${static::$acf_active_key} ] = $active_state;
            do_action( 'community_directory_acf_update', $this->post_id, $acf_updates );
        }

        $owner = $this->get_entity();
        $post_status_count = $activate ? 1 : 0;
        // If owner entity is inactive, increment status count so it get's a different post_status
        if ( !$owner->get_status() ) $post_status_count += 2;
        
        // Update the post_status
        $post_status = community_directory_bool_to_status( $post_status_count, 'entity_child', 'post' );
        $saved = !!$this->update_post( array( 'post_status' => $post_status ) );

        // Broadcast that the change occured
        $type = static::$acf_prefix;
        if ( $saved ) do_action( "community_directory_${type}changed_activation", $this, $activate, $status_only );

        return $saved;
    }

    protected function load_acf_from_db():bool {
        if ( $this->_acf_loaded ) return true;

        if ( $this->post_id || $this->load_post_from_db() ) {
            if ( $data = get_fields( $this->post_id ) ) {
                $this->acf_data = $data;
            }
            
            return $this->_acf_loaded = !!$data;
        }

        return false;
    }

    /**
     * Hook: `save_post`
     * 
     * Adds the location tag to the post upon initial save to make it filterable by location
     */
    public static function after_save( int $post_id, object $post, bool $update ) {
        if ( $post->post_status !== 'publish' || $update ) return;
        $instance = static::get_instance( $post_id, null, $post );
        $Location = $instance->get_location();
        $res = wp_set_post_terms( $post_id, [ $Location->taxonomy_id ], TaxonomyLocation::$taxonomy, true );
        
        if ( $res instanceof \WP_Error ) ClassErrorHandler::handle_exception( $res );
    }

    public static function acf_activation_changed( $value, $post_id, $field ) {
        if ( !isset( $_POST['acf'][ClassACF::${static::$acf_active_key}] ) ) return $value;
        
        global $post;
        
        // get the old (saved) value
        $was_active = get_field( ClassACF::${static::$acf_active}, $post_id ) === 'true';

        $is_active = $_POST['acf'][ClassACF::${static::$acf_active_key}] === 'true';
        
        if ( $was_active == $is_active ) return $value;

        // Update the post's status
        $instance = self::get_instance( $post_id );
        $instance->activate_deactivate( $is_active, true, false );
        
        return $value;
    }

    /**
     * To be called upon post type registration long before any instance is required
     */
    public static function define_post_type(
        string $post_type,
        string $post_slug,
        string $link_identifier = 'post_name'
    ) {
        static::$post_type = $post_type;
        static::$post_slug = $post_slug;
        static::$link_identifier = $link_identifier;
    }
 }