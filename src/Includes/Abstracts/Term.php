<?php

namespace Maruf89\CommunityDirectory\Includes\Abstracts;

abstract class Term {
    
    protected \WP_Term $_term;

    public function __construct( \WP_Term $term ) {
        $this->_term = $term;

        $this->_save_to_cache();
    }
    
    public static string $term_type = 'cd-product-service-type';

    public function __get( $property ) {
        if ( substr( $property, 0, 1 ) === '_' ) die( 'Cannot get private properties' );

        if ( property_exists( $this->_term, $property ) )
            return $this->_term->$property;
    }

    public function get_link( string $class_names = '' ):string {
        $slug = static::$slug;
        return "<a class='$class_names' href='/$slug/$this->slug'>$this->name</a>";
    }

    /////////////////////////////////////
    /////////////   Static   ////////////
    /////////////////////////////////////

    public static function get_instance( int $term_id = null, \WP_Term $term = null ):?Term {
        if ( $term_id || ( $term && ( $term_id = $term->ID ) ) )
            if ( isset( self::$_term_id_cache[ $term_id ] ) )
                return self::$_term_id_cache[ $term_id ];

        return new static( $term );
    }

    /////////////////////////////////////
    /////////////   Cache    ////////////
    /////////////////////////////////////

    private static array $_term_id_cache = [];

    protected function _save_to_cache() {
        self::$_term_id_cache[ $this->term_id ] = $this;
    }

    protected function _remove_from_cache() {
        if ( isset( self::$_term_id_cache[ $this->term_id ] ) )
            unset( self::$_term_id_cache[ $this->term_id ] );
    }

}