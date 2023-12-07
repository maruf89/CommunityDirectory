<?php
/**
 *
 * Project instance
 *
 * @since      0.6.5
 * @author     Marius Miliunas
 */

namespace Maruf89\CommunityDirectory\Includes\instances;

use Maruf89\CommunityDirectory\Includes\{ClassACF, ClassProjects, ClassErrorHandler, TaxonomyLocation};
use Maruf89\CommunityDirectory\Includes\Abstracts\Instance;
use Maruf89\CommunityDirectory\Includes\Traits\EntityChildInstanceMethods;

class Project extends Instance {
    use EntityChildInstanceMethods;

    public static string $post_type;
    public static string $post_slug;
    protected static string $link_identifier;

    protected static string $acf_prefix = 'project_';
    protected static string $acf_active_key = 'project_active_key';
    protected static string $acf_active = 'project_active';
    
    protected ?ProductServiceTerm $category;

    protected ?array $acf_data = null;

    public function __construct( int $post_id = null, int $entity_post_id = null, object $post = null ) {
        if ( $post ) { $this->from_post_obj( $post ); return; }

        if ( $post_id ) $this->post_id = $post_id;
        if ( $entity_post_id ) $this->entity_post_id = $entity_post_id;
        $this->_save_to_cache();
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
        static $acf_loaded = false;
        if ( $acf_loaded ) return true;

        if ( $this->post_id || $this->load_post_from_db() ) {
            if ( $data = get_fields( $this->post_id ) ) {
                $this->acf_data = $data;
            }
            
            return $acf_loaded = !!$data;
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
        object $post = null
    ):Project {
        if ( !$post_id && !$post ) return null;
        
        $instance = parent::_get_instance( $post_id, $post );

        return $instance ? $instance : new Project( $post_id, $entity_id, $post );
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


}