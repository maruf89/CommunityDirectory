<?php

namespace Maruf89\CommunityDirectory\Includes\Abstracts;

use Maruf89\CommunityDirectory\Includes\Interfaces\IInstance;

abstract class Instance implements IInstance {
    
    protected bool $_has_loaded = false;
    protected bool $_post_loaded = false;
    
    protected int $post_id;
    protected int $author_id;
    protected ?\WP_Post $post = null;

    abstract protected function load_from_db():bool;

    /////////////////////////////////////
    /////////////    Get     ////////////
    /////////////////////////////////////

    public function __get( $property ) {
        if ( substr( $property, 0, 1 ) === '_' ) die( 'Cannot get private properties' );
        
        if ( property_exists( $this, $property ) ) {
            if ( !isset( $this->$property ) && !$this->_has_loaded ) $this->load_from_db();
            if ( isset( $this->$property ) )
                return $this->$property;
        }

        // check the post obj
        if ( ( !$this->_has_loaded && $this->load_from_db() ) || $this->_has_loaded ) {
            if ( property_exists( $this->post, $property ) )
                return $this->post->$property;
        }
    }

    protected static function _get_instance( int $post_id = null, object $post = null ):?Instance {
        if ( $post_id || ( $post && ( $post_id = $post->ID ) ) )
            if ( isset( self::$_post_id_cache[ $post_id ] ) )
                return self::$_post_id_cache[ $post_id ];

        return null;
    }

    public function has_coords():bool {
        return $this->load_from_db() &&
               isset( $this->coords ) &&
               is_array( $this->coords ) &&
               gettype($this->coords['lat']) === 'double' &&
               gettype($this->coords['lon']) === 'double';
    }

    /////////////////////////////////////
    /////////////   Update   ////////////
    /////////////////////////////////////

    public function update_post( array $changes ):int {
        if ( !isset( $this->post_id ) || !$this->load_post_from_db() )
            die( 'Unable to update ' . __CLASS__ . '::update_post without having a post_id' );
        
        return wp_update_post(
            array_merge( $changes, array( 'ID' => $this->post_id ) )
        );
    }

    //////////////////////////////////
    //////// Loading from DB /////////
    //////////////////////////////////

    protected function load_post_from_db():bool {
        if ( $this->_post_loaded ) return true;
        
        $loaded = false;
        
        if ( !isset( $this->post_id ) || ( isset( $this->post_id ) && !$this->post_id ) ) {
            $post_id = (int) community_directory_get_post_var_by_field(
                'ID', 'post_author', $this->author_id, $this::$post_type
            );
            if ( $post_id ) $this->post_id = $post_id;
            else return false;
        }

        if ( $this->post_id &&
             ( $post = \WP_Post::get_instance( $this->post_id ) ) &&
             ( $loaded = $this->from_post( $post ) ) // _post_loaded gets set here
        ) $this->_save_to_cache(); 
            
        return $loaded;
    }

    /**
     * Fills the instance object from a passed in post object
     */
    protected function from_post_obj( object $post ):bool {
        $wp_post = $post instanceof \WP_Post ? $post : new \WP_Post( $post );
        return $this->from_post( $wp_post );
    }

    /**
     * Fleshes an instance out from a passed in WP Post instance
     */
    protected function from_post( \WP_Post $post ):bool {
        if ( $post ) {
            $this->post = $post;
            $this->_post_loaded = true;
            $this->post_id = $post->ID;
            return true;
        }
        return false;
    }

    //////////////////////////////////
    ////////     Delete     //////////
    //////////////////////////////////
    
    public function delete_self():bool {
        $this->load_post_from_db();

        if ( !$this->post_id ) return false;

        $deleted_post = wp_delete_post( $this->post_id, true );
        
        $this->_remove_from_cache();

        return !!$deleted_post;
    }

    /////////////////////////////////////
    /////////////   Cache    ////////////
    /////////////////////////////////////

    private static array $_post_id_cache = [];

    protected function _save_to_cache() {
        self::$_post_id_cache[ $this->post_id ] =& $this;
    }

    protected function _remove_from_cache() {
        if ( isset( self::$_post_id_cache[ $this->post_id ] ) )
            unset( self::$_post_id_cache[ $this->post_id ] );
    }

    /////////////////////////////////////
    /////////////   Static   ////////////
    /////////////////////////////////////

    public function get_edit_link():string { return static::build_edit_link( $this->post_id ); }
    public static function build_edit_link( int $post_id ):string {
        return admin_url( "post.php?post=$post_id&action=edit" );
    }

    public function get_display_link():string { return static::build_display_link( $this ); }
    public static function build_display_link( Instance $instance ):string {
        $link_identifier = $instance::$link_identifier;
        $id = $instance->__get( $link_identifier );
        $post_slug = $instance::$post_slug;

        return "/$post_slug/$id";
    }
}