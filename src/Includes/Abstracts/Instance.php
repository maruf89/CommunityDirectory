<?php

namespace Maruf89\CommunityDirectory\Includes\Abstracts;

abstract class Instance {

    public static string $post_type;
    
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

    /**
     * array( '/location/(?P<id>\d+)' => array(
     *      'methods' => 'GET',
     *      'callback' => 'my_awesome_func',
     *    )
     * )
     */
    protected static function _get_instance( int $post_id = null, \WP_Post $post = null ):?Instance {
        if ( $post_id || ( $post && ( $post_id = $post->ID ) ) )
            if ( isset( self::$_post_id_cache[ $post_id ] ) )
                return self::$_post_id_cache[ $post_id ];

        return null;
    }

    /////////////////////////////////////
    /////////////   Update   ////////////
    /////////////////////////////////////

    public function update_post( array $changes ):int {
        if ( !$this->post ) $this->load_from_db();
        
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
             ( $loaded = $this->from_post( \WP_Post::get_instance( $this->post_id ) ) )
        ) {
            $this->_save_to_cache();    
        }
            
        return $loaded;
    }

    /**
     * Fills the entity object from a passed in post object
     */
    protected function from_post_obj( object $post ):bool {
        return $this->from_post( new \WP_Post( $post ) );
    }

    /**
     * Fleshes an entity out from a passed in WP Post instance
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

    /////////////////////////////////////
    /////////////   Cache    ////////////
    /////////////////////////////////////

    private static array $_post_id_cache = [];

    protected function _save_to_cache() {
        self::$_post_id_cache[ $this->post_id ] = $this;
    }
}