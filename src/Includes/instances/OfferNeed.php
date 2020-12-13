<?php
/**
 *
 * OffferNeed instance
 *
 * @since      1.0.0
 * @author     Marius Miliunas
 */

namespace Maruf89\CommunityDirectory\Includes\instances;

use Maruf89\CommunityDirectory\Includes\ClassACF;
use Maruf89\CommunityDirectory\Includes\ClassOffersNeeds;
use Maruf89\CommunityDirectory\Includes\Abstracts\Instance;

class OfferNeed extends Instance {
    public static string $post_type = 'cd-offers-needs';
    protected bool $_acf_loaded = false;

    protected int $entity_post_id;

    protected ?array $acf_data = null;

    public function __construct( int $post_id = null, int $entity_post_id = null, object $post = null ) {
        if ( $post_id ) $this->post_id = $post_id;
        if ( $entity_post_id ) $this->entity_post_id = $entity_post_id;
        if ( $post ) $this->from_post( $post );
    }

    public function __get( $property ) {
        if ( $property === 'entity_post_id' && !isset( $this->entity_post_id ) ) {
            $this->entity_post_id = community_directory_get_post_var_by_field( 'post_parent', 'ID', $this->post_id );
            return $this->entity_post_id;
        }
        
        if ( $prop = parent::__get( $property ) ) return $prop;
    }

    public function get_description():string {
        if ( !$this->load_acf_from_db() || !isset( $this->acf_data[ClassACF::$offers_needs_description] ) )
            return '';

        return $this->acf_data[ClassACF::$offers_needs_description];
    }

    public function get_hashtag_title( bool $link = true ):string {
        if ( !$this->load_acf_from_db() || !isset( $this->acf_data[ClassACF::$offers_needs_hashtag_title] ) )
            return '';

        return $this->acf_data[ClassACF::$offers_needs_hashtag_title];
    }

    public function get_link():string {
        return Entity::get_display_link( $this->get_entity() );
    }

    public function get_entity():?Entity {
        return Entity::get_instance( $this->entity_post_id );
    }

    //////////////////////////////////
    //////// Loading from DB /////////
    //////////////////////////////////

    protected function load_from_db():bool {
        return $this->_has_loaded = $this->load_post_from_db() && $this->load_acf_from_db();
    }

    protected function from_post( \WP_Post $post ):bool {
        if ( parent::from_post( $post ) ) {
            $this->entity_post_id = $post->post_parent;
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

    public static function set_post_parent_on_save( int $post_id, \WP_Post $post, bool $update ) {
        if ( $update ) return;

        $parent_entity = Entity::get_instance( null, $post->post_author );
        // $parent_entity->is_valid();
        $instance = self::get_instance( $post_id, $parent_entity->post_id, $post );
        $instance->update_post( array( 'post_parent' => $parent_entity->post_id ) );
    }

}