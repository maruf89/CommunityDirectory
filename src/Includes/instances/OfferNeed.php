<?php
/**
 *
 * OffferNeed instance
 *
 * @since      1.0.0
 * @author     Marius Miliunas
 */

namespace Maruf89\CommunityDirectory\Includes\instances;

use Maruf89\CommunityDirectory\Includes\{ClassACF, ClassOffersNeeds, ClassErrorHandler, TaxonomyLocation, TaxonomyProductService};
use Maruf89\CommunityDirectory\Includes\Abstracts\Instance;
use Maruf89\CommunityDirectory\Includes\instances\ProductServiceTerm;
use Maruf89\CommunityDirectory\Includes\Traits\EntityChildInstanceMethods;

class OfferNeed extends Instance {
    use EntityChildInstanceMethods;

    public static string $post_type;
    public static string $post_slug;
    protected static string $link_identifier;

    protected static string $acf_prefix = 'offers_needs_';
    protected static string $acf_active_key = 'offers_needs_active_key';
    protected static string $acf_active = 'offers_needs_active';

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

    //////////////////////////////////
    ////////     Update      /////////
    //////////////////////////////////

    /** Moved to EntityChildInstanceMethods trait */

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

    protected function load_taxonomy():bool {
        $this->category = $this->category ?? null;
        if ( $this->_taxonomy_loaded ) return true;
        
        $terms = get_the_terms( $this->post_id, TaxonomyProductService::$taxonomy );
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
        $owner = $instance->get_entity();
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

}