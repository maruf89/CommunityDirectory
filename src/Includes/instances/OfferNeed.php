<?php
/**
 *
 * OffferNeed instance
 *
 * @since      1.0.0
 * @author     Marius Miliunas
 */

namespace Maruf89\CommunityDirectory\Includes\instances;

use Maruf89\CommunityDirectory\Includes\{ClassACF, ClassOffersNeeds, ClassErrorHandler};
use Maruf89\CommunityDirectory\Includes\Abstracts\Instance;

class OfferNeed extends Instance {
    public static string $post_type = 'cd-offers-needs';
    protected bool $_acf_loaded = false;
    protected bool $_taxonomy_loaded = false;
    protected static string $entity_loc_separator = '1100';

    protected int $entity_post_id;
    protected int $location_post_id;
    protected ?\WP_Term $category;

    protected ?array $acf_data = null;

    public function __construct( int $post_id = null, int $entity_post_id = null, object $post = null ) {
        if ( $post_id ) $this->post_id = $post_id;
        if ( $entity_post_id ) $this->entity_post_id = $entity_post_id;
        if ( $post ) $this->from_post( $post );
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

    public function get_acf_hashtag_title() {
        $title = $this->__call( 'get_acf_hashtag_title', array() );
        
        if ( substr( $title, 0, 1 ) !== '#' ) $title = "#$title";
        $title = mb_convert_case( $title, MB_CASE_TITLE, 'UTF-8');
        $title = implode( explode( ' ', $title ) );
        
        return $title;
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

        return __( $options[ $which ], 'community-directory' );
    }

    public function get_link():string {
        $link = Entity::get_display_link( $this->get_entity() );
        return empty( $link ) ? '' : "$link/#" . $this->get_id();
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

    public function get_category( bool $return_obj = false ) {
        if ( !$this->load_taxonomy() || !$this->category ) return $return_obj ? (object) null : '';

        return $return_obj ? $this->category : $this->category->name;
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
        else {
            $this->category = $terms[ 0 ];
        }
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
        \WP_Post $post = null
    ):OfferNeed {
        if ( !$post_id && !$post ) return null;
        
        $instance = parent::_get_instance( $post_id, $post );

        return $instance ? $instance : new OfferNeed( $post_id, $entity_id, $post );
    }

    public static function get_location_link( Location $location = null ):string {
        return 'To Do';
    }

    public static function get_display_link( OfferNeed $entity = null ):string {
        return 'To Do';
    }

    public static function get_edit_link( int $post_id ):string {
        return admin_url( "post.php?post=$post_id&action=edit" );
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
     * Upon publishing an OfferNeed updates the 'post_parent' with the "${entity_post_id}1100${location_post_id},
     * and set's the 'post_parent' to the location's post id
     */
    public static function set_post_props_on_save( array $sanitized, array $unsanitized, array $unprocessed ) {
        $status = [ 'publish', 'inactive' ];
        if ( !in_array( $sanitized[ 'post_status' ], $status ) || $sanitized[ 'post_type' ] !== self::$post_type )
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