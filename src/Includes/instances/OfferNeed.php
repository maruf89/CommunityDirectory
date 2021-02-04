<?php
/**
 *
 * OffferNeed instance
 *
 * @since      1.0.0
 * @author     Marius Miliunas
 */

namespace Maruf89\CommunityDirectory\Includes\instances;

use Maruf89\CommunityDirectory\Includes\{ClassACF, ClassOffersNeeds, ClassErrorHandler, TaxonomyLocation};
use Maruf89\CommunityDirectory\Includes\Abstracts\Instance;
use Maruf89\CommunityDirectory\Includes\instances\ProductServiceTerm;

class OfferNeed extends Instance {

    public static string $post_type;
    public static string $post_slug;
    protected static string $link_identifier;

    protected bool $_acf_loaded = false;
    protected bool $_taxonomy_loaded = false;
    public static string $entity_loc_separator = '1100';

    protected int $entity_post_id;
    protected int $location_post_id;
    protected ?ProductServiceTerm $category;

    protected ?array $acf_data = null;

    public function __construct( int $post_id = null, int $entity_post_id = null, object $post = null ) {
        if ( $post ) { $this->from_post_obj( $post ); return; }

        if ( $post_id ) $this->post_id = $post_id;
        if ( $entity_post_id ) $this->entity_post_id = $entity_post_id;
        $this->_save_to_cache();
    }

    
    private static string $_get_acf = 'get_acf_';
    private static int $_get_acf_len = 8; // Must equal strlen of $_get_acf
    private static string $_has_acf = 'has_acf_';
    private static int $_has_acf_len = 8; // Must equal strlen of $_has_acf
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
        
        $acf_field = 'offers_needs_' . substr( $name, $len );
        $acf_loaded = $this->load_acf_from_db();

        switch ( $type ) {
            case 'get':
                if ( $acf_loaded ) return $this->acf_data[ClassACF::${$acf_field}] ?? '';
                return '';
            case 'has':
                return $acf_loaded && isset( $this->acf_data[ClassACF::${$acf_field}] ) && !empty( $this->acf_data[ClassACF::${$acf_field}] );
        }
    }

    /**
     * Returns Translated
     */
    public function get_offer_need_type():string {
        $options = [
            'service' => 'Service',
            'product' => 'Product',
        ];

        $which = $this->__call( 'get_acf_product_or_service', array() );
        $which = !empty( $which ) ? $which : 'service';

        return __( $options[ $which ], 'community-directory' );
    }

    /**
     * Returns Translated
     */
    public function get_urgency():string {
        $options = [
            'urgent' => 'Urgent/Limited Time',
            'seasonal' => 'Seasonal',
            'ongoing' => 'Ongoing',
        ];

        $which = $this->__call( 'get_acf_urgency', array() );

        return isset( $options[ $which ] ) ? __( $options[ $which ], 'community-directory' ) : '';
    }

    public function get_link():string {
        return static::build_offers_needs_link( $this );
    }

    public function get_id():string {
        $type = $this->get_acf_type();
        return "$type-$this->post_id";
    }

    public function get_entity():?Entity {
        return Entity::get_instance( $this->entity_post_id );
    }

    public function get_featured( string $size = 'medium' ):string {
        $image = $this->__call( 'get_acf_image', array() );

        return  wp_get_attachment_image( $image[ 'ID' ], $size );
    }

    public function get_product_or_service( bool $translated = true ):string {
        $type = $this->__call( 'get_acf_product_or_service', array() );
        return $translated ? __( ucfirst( $type ), 'community-directory' ) : $type;
    }

    public function get_product_service_type( string $return_type = '', $default = null ):?ProductServiceTerm {
        return $this->load_taxonomy() ? $this->category : $default;
    }

    public function get_product_service_link( string $class_names = '', $default = null ):?string {
        if ( !$this->load_taxonomy() || !$this->category ) return $default;
        return $this->category->get_link( $class_names );
    }

    public function get_location():?Location {
        return Location::get_instance( $this->__get( 'location_post_id' ) );
    }

    /**
     * Gets the entities status depending on the desired format
     */
    public function get_status( $format = 'bool' ) {
        if ( $this->acf_data || $this->load_acf_from_db() ) {
            $active = $this->acf_data[ClassACF::$offers_needs_active] === 'true';
            switch ( $format ) {
                case 'raw': return $this->acf_data[ClassACF::$offers_needs_active];
                case 'bool': return $active;
                case 'enum': return $active ? COMMUNITY_DIRECTORY_ENUM_ACTIVE : COMMUNITY_DIRECTORY_ENUM_INACTIVE;
                case 'display': return $active ?
                    __( 'Active', 'community-directory' ) : __( 'Inactive', 'community-directory' );
            }
        }
        return null;
    }

    /**
     * Returns the owner Entity of this cpt
     */
    public function get_owner():Entity {
        return Entity::get_instance( $this->entity_post_id );
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

        $active_state =& $this->acf_data[ ClassACF::$offers_needs_active ];

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
            $acf_updates[ ClassACF::$offers_needs_active_key ] = $active_state;
            do_action( 'community_directory_acf_update', $this->post_id, $acf_updates );
        }

        $owner = $this->get_owner();
        $post_status_count = $activate ? 1 : 0;
        // If owner entity is inactive, increment status count so it get's a different post_status
        if ( !$owner->get_status() ) $post_status_count += 2;
        
        // Update the post_status
        $post_status = community_directory_bool_to_status( $post_status_count, 'offer_need', 'post' );
        $saved = !!$this->update_post( array( 'post_status' => $post_status ) );

        // Broadcast that the change occured
        if ( $saved ) do_action( 'community_directory_offer_need_changed_activation', $this, $activate, $status_only );

        return $saved;
    }

    //////////////////////////////////
    //////// Loading from DB /////////
    //////////////////////////////////

    protected function load_from_db():bool {
        return $this->_has_loaded = $this->load_post_from_db() && $this->load_acf_from_db() && $this->load_taxonomy();
    }

    protected function from_post( \WP_Post $post ):bool {
        if ( parent::from_post( $post ) ) {
            list( $entity_id, $location_id ) = self::get_entity_loc_id( $post->post_parent );
            $this->entity_post_id = $entity_id;
            $this->location_post_id = $location_id;
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
            
            return $this->_acf_loaded = !!$data;
        }

        return false;
    }

    protected function load_taxonomy():bool {
        if ( $this->_taxonomy_loaded ) return true;
        
        $terms = get_the_terms( $this->post_id, ClassOffersNeeds::$taxonomy );
        if ( gettype( $terms ) !== 'array' || !count( $terms ) ) $this->category = null;
        else
            $this->category = ProductServiceTerm::get_instance( null, $terms[ 0 ] );

        return $this->_taxonomy_loaded = true;
    }

    //////////////////////////////////
    //////// Static Methods //////////
    //////////////////////////////////

    /**
     * If a cached version exists, gets an entity, otherwise creates a new one
     */
    public static function get_instance(
        int $post_id = null,
        int $entity_id = null,
        object $post = null
    ):OfferNeed {
        if ( !$post_id && !$post ) return null;
        
        $instance = parent::_get_instance( $post_id, $post );

        return $instance ? $instance : new OfferNeed( $post_id, $entity_id, $post );
    }

    public static function build_offers_needs_link( OfferNeed $instance ):string {
        $owner = $instance->get_owner();
        try {
            $owner_link = $owner->get_link();
        } catch ( Exception $err ) {
            ClassErrorHandler::handle_exception( new \WP_Error( 500, "Error loading non-existent entity post_id: $owner->post_id" ) );
            return '';
        }
        
        $id = $instance->get_id();

        return "$owner_link#$id";
    }

    public static function build_edit_link( int $post_id ):string {
        return admin_url( "post.php?post=$post_id&action=edit" );
    }

    public static function get_create_link():string {
        $post_type = ClassOffersNeeds::$post_type;
        return admin_url( "post-new.php?post_type=$post_type");
    }

    public static function get_view_all_link():string {
        $post_type = ClassOffersNeeds::$post_type;
        return admin_url( "edit.php?post_type=$post_type");
    }

    /**
     * Here we're hacking the wp_post field by setting the `post_excerpt` field as the `type` (offer|need)
     * Upon updating the type field, we update the post_excerpt
     * 
     * Gets called as a filter on ACF post save/update
     */
    public static function update_post_excerpt_with_type( $value, $post_id, $field ) {
        global $post;
        
        // get the old (saved) value
        $old_val = get_field( ClassACF::$offers_needs_type, $post_id );
        $new_val = $_POST['acf'][ClassACF::$offers_needs_type_key];

        if ( $old_val == $new_val ) return $value;

        $instance = self::get_instance( $post->ID, null, $post );
        $instance->update_post( array( 'post_excerpt' => $value ) );

        return $value;
    }

    /**
     * Generates an id from an entity_id and a location_id (if given) by adding a separator
     */
    protected static function generate_entity_loc_id( int $entity_id, int $location_id = 0 ):int {
        $loc_id = $location_id ? $location_id : '';
        $separator = self::$entity_loc_separator;

        return (int) "$entity_id${separator}$loc_id";
    }

    protected static function get_entity_loc_id( int $id ):array {
        // Since locations are less numerous than entities and they can't begin with a zero
        // we reverse the id and search from behind
        $separator_rev = strrev( (string) self::$entity_loc_separator );
        // 9661100952 -> 25090011669
        $str_id = strrev( (string) $id );
        // find where the separator is
        $separator_pos = strpos( $str_id, $separator_rev, 1 );
        // extract the id's, reverse them, and convert to ints
        $loc_id = (int) strrev( substr( $str_id, 0, $separator_pos ) );
        $entity_id = (int) strrev( substr( $str_id, ( $separator_pos + strlen( $separator_rev ) ) ) );
        return array( $entity_id, $loc_id );
    }

    /**
     * Hook: Called before saving to DB
     * 
     * Modifies an OfferNeed, updates the 'post_parent' field like:
     * "${entity_post_id}1100${location_post_id}
     */
    public static function set_post_props_on_save( array $sanitized, array $unsanitized, array $unprocessed ) {
        $status = [ 'publish', 'inactive' ];
        if ( !in_array( $sanitized[ 'post_status' ], $status ) ||
             $sanitized[ 'post_type' ] !== ClassOffersNeeds::$post_type
        )
            return $sanitized;

        $Entity = Entity::get_instance( null, $sanitized[ 'post_author' ] );

        // If the entity is inactive
        if ( $Entity->get_acf_active() === 'false' ) {
            $sanitized[ 'post_status' ] = 'inactive';
        }
        
        // Get location, and if set, set the post parent to it's post id
        $Location = $Entity->get_location();
        $loc_id = $Location ? $Location->post_id : 0;
        $sanitized[ 'post_parent' ] = self::generate_entity_loc_id( $Entity->post_id, $loc_id );

        return $sanitized;
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
        if ( !isset( $_POST['acf'][ClassACF::$offers_needs_active_key] ) ) return $value;
        
        global $post;
        
        // get the old (saved) value
        $was_active = get_field( ClassACF::$offers_needs_active, $post_id ) === 'true';

        $is_active = $_POST['acf'][ClassACF::$offers_needs_active_key] === 'true';
        
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