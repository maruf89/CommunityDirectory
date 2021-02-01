<?php

namespace Maruf89\CommunityDirectory\Includes\instances;

use Maruf89\CommunityDirectory\Includes\Abstracts\Term;

class TermBlock {
    private string $term_type;
    private array $children = [];
    private object $term;

    public function __construct( string $term_type, ?\WP_Term &$term = null ) {
        $this->term_type = $term_type;
        if ( isset( $term ) ) $this->term = $term_type::get_instance( null, $term );
    }

    public function __get( string $property ) {
        if ( isset( $this->term ) && property_exists( $this->term, $property ) )
            return $this->term->$property;
    }

    public function __call( $name, $arguments ) {
        if ( isset( $this->term )  && method_exists( $this->term, $name ) )
            return call_user_func( array( $this->term, $name ), ...$arguments );
    }

    public function set_term( \WP_Term &$term ) {
        $this->term = $this->term_type::get_instance( null, $term );
    }

    public function add_child( TermBlock &$child ) {
        $this->children[ $child->term->term_taxonomy_id ] =& $child;
    }

    public function has_children():bool {
        return !!count( $this->children );
    }

    public function equals( $value, string $prop = '' ):bool {
        if ( empty( $prop ) ) {
            switch ( gettype( $value ) ) {
                case 'integer':
                    $prop = 'term_taxonomy_id';
                    break;
                case 'string':
                    $prop = 'slug';
                    break;
                case 'object':
                    return $this === $value;
            }
        }
        return $this->$prop === $value;
    }

    public function children():array {
        return $this->children;
    }
}