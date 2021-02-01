<?php

namespace Maruf89\CommunityDirectory\Includes\Abstracts;

use Maruf89\CommunityDirectory\Includes\{ClassErrorHandler, ClassPublic};
use Maruf89\CommunityDirectory\Includes\instances\TermBlock;

abstract class Taxonomy {
    protected bool $_terms_loaded;
    
    protected array $terms;
    protected array $formatted_terms;

    public function __construct() {
        static::$slug = __( static::$name, 'community-directory' );
        static::$taxonomy = ClassPublic::get_post_type_prefix() . static::$name;
    }
    
    public function __get( $property ) {
        if ( $property === 'formatted_terms' ) {
            if ( !isset( $this->formatted_terms ) ) $this->format_hierarchy();
            return $this->formatted_terms;
        }
        
        if ( substr( $property, 0, 1 ) === '_' ) die( 'Cannot get private properties' );

        if ( property_exists( $this, $property ) )
            return $this->$property;
    }

    /**
     * Formats the taxonomy's terms into a hierarchy of term_blocks and saves the value as a property to the class
     * 
     * @return              array       an array of `[term_taxonomy_id:number] => term_block` like:
     *                                      array(
     *                                          array( // parent $term_block
     *                                              'term' => WP_Term,
     *                                              'children' => array( $term_blocks… )
     *                                          ),
     *                                          …$term_blocks…
     *                                      )
     */
    public function format_hierarchy():array {
        if ( !$this->_load_terms() ) return [];

        // Holds a reference to every category, parents and children
        $term_blocks = [];

        // Holds a reference to every top most level category
        $parents = [];

        foreach ( $this->terms as $term ) {
            if ( isset( $term_blocks[ $term->term_taxonomy_id ] ) )
                $term_block =& $term_blocks[ $term->term_taxonomy_id ];
            else
                $term_block = new TermBlock( static::$term_type, $term );
            
            // Add itself to the list of all categories
            if ( !isset( $term_blocks[ $term->term_taxonomy_id ] ) )
                $term_blocks[ $term->term_taxonomy_id ] =& $term_block;

            // set the term block's WP_Term property
            $term_blocks[ $term->term_taxonomy_id ]->set_term( $term );
            
            // If it's a child category
            if ( $term->parent !== 0 ) {
                // If the parent hasn't been created yet, create it
                if ( !isset( $term_blocks[ $term->parent ] ) )
                    $term_blocks[ $term->parent ] = new TermBlock( static::$term_type );
                    
                // And add it's reference
                $term_blocks[ $term->parent ]->add_child( $term_block );
            } else
                // Otherwise it's a parent
                $parents[ $term->term_taxonomy_id ] =& $term_blocks[ $term->term_taxonomy_id ];

            // This is needed so that the loop doesn't readd the same reference over and over again
            unset( $term ); unset( $term_block );
        }
        
        return $this->formatted_terms = $parents;
    }

    /**
     * Given a WP_Term property value, and a property key, recursively searches through all of the terms for it
     * 
     * @property    $term_val       mixed       The property value to find
     * @property    $prop           string      The property key for the value
     * @property    $with_parent    ?boolean    Whether to return the top level parent as well
     * @property    $term_blocks    ?array      Array of term blocks
     * @return                      array       If $with_parent is true, returns an [ $found_term_block, $top_level_parent ]
     *                                          Otherwise returns only the found term block
     */
    public function find_term_by(
        $term_val,
        string $prop,
        bool $with_parent = false,
        $term_blocks = null
    ) {
        if ( is_null( $term_blocks ) ) $term_blocks = $this->formatted_terms;
        foreach ( $term_blocks as $term_block ) {
            if ( $term_block->equals( $term_val, $prop ) ) return $term_block;
            if ( $term_block->has_children() &&
                ( $found = $this->find_term_by( $term_val, $prop, false, $term_block->children() ) )
            ) return $with_parent ? [ $found, $term_block ] : $found;
        }
        return null;
    }

    /**
     * Loads the taxonomy terms once from the DB
     */
    protected function _load_terms():bool {
        if ( isset( $this->_terms_loaded ) ) return $this->_terms_loaded;
        
        $this->terms = get_terms(
            array(static::$taxonomy),
            array(
                    'hide_empty'    => false,
                )
        );

        if ( !$this->terms ) {
            ClassErrorHandler::handle_exception(
                new \WP_Error( 500, 'Failed to load category terms: \'' . static::$taxonomy . '\'' )
            );
        }

        return $this->_terms_loaded = !!$this->terms;
    }

    /**
     * Registers Product/Service categories in WP
     */
    public function add_term_categories( array $categories, array $parent = null ) {
        foreach ( $categories as $key => $term_or_arr ) {
            $term_type = gettype( $term_or_arr );
            if ( $term_type === 'array' ) {
                $group_parent = $this->insert_term( $key, $parent );
                if ( $group_parent instanceof \WP_Error ) return;
                $this->add_term_categories( $term_or_arr, $group_parent );
            } else $this->insert_term( $term_or_arr, $parent );
        }
    }

    protected function insert_term( string $term, array $parent = null, string $description = '' ) {
        $translated = __( $term, 'community-directory' );
        $slug = sanitize_title_with_dashes( community_directory_function_transliterate_string( $translated ) );
        return wp_insert_term(
            mb_convert_case( $translated, MB_CASE_TITLE, 'UTF-8'),
            static::$taxonomy,
            array(
                'slug' => $slug,
                'parent' => gettype( $parent ) === 'array' ? $parent[ 'term_id' ] : 0,
                'description' => $description
            )
        );
    }
}