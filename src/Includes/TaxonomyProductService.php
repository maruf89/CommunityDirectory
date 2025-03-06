<?php
/**
 *
 * Entity instance
 *
 * @since      0.6.4
 * @author     Marius Miliunas
 */

namespace Maruf89\CommunityDirectory\Includes;

use Maruf89\CommunityDirectory\Includes\Abstracts\Taxonomy;
use Maruf89\CommunityDirectory\Includes\instances\ProductServiceTerm;

class TaxonomyProductService extends Taxonomy {

    private static TaxonomyProductService $instance;
    public static string $term_type = ProductServiceTerm::class;
    public static string $name = 'product-service-type';
    public static string $taxonomy;
    public static string $slug;

    private bool $_replacing_checkboxes = false;

    public static function get_instance():TaxonomyProductService {
        if ( !isset( static::$instance ) )
            static::$instance = new TaxonomyProductService();

        return static::$instance;
    }

    // Called on activation so we can call one time setup methods
    public function register_activated() {
        community_directory_update_option( 'taxonomy_product_service_init', 'true' );
    }

    /**
     * Called via 'after_setup_theme' action
     * 
     * Gathers the categories to be added
     */
    public function register_taxonomy_terms() {
        $custom_taxonomy_args = array(
            'hierarchical' => true,
            'label' => __( 'Product & Service Types', 'community-directory' ), // display name
            'query_var' => true,
            'labels' => array(
                'name' => __( 'Product & Service Types', 'community-directory' ),
                'singular_name' => __( 'Product & Service Type', 'community-directory' ),
                'search_items' =>  __( 'Search Product & Service Types' ),
                'all_items' => __( 'All Product & Service Types', 'community-directory' ),
                'parent_item' => __( 'Parent Product & Service Type', 'community-directory' ),
                'parent_item_colon' => __( 'Parent Product & Service Type:', 'community-directory' ),
                'edit_item' => __( 'Edit Product & Service Type' , 'community-directory'), 
                'update_item' => __( 'Update Product & Service Type', 'community-directory' ),
                'add_new_item' => __( 'Add New Product & Service Type', 'community-directory' ),
                'new_item_name' => __( 'New Product & Service Type Name', 'community-directory' ),
                'menu_name' => __( 'Product & Service Types', 'community-directory' ),
            ),
            'capabilities' => array(
                'manage_terms' => 'manage_product_service_type',
                'edit_terms' => 'edit_product_service_type',
                'delete_terms' => 'delete_product_service_type',
                'assign_terms' => 'assign_product_service_type',
            ),
            'rewrite' => array(
                'slug' => static::$slug,
                'hierarchical' => true,
                'with_front' => false  // Don't display the category base before
            )
        );

        register_taxonomy(
            static::$taxonomy,
            apply_filters( 'community_directory_register_taxonomy_cpt_' . static::$taxonomy, []),
            $custom_taxonomy_args
        );
        ProductServiceTerm::define_taxonomy_term( static::$slug );
        
        if ( community_directory_get_option( 'taxonomy_product_service_init', 'false' ) == 'true' ) {
            $categories = $this->_default_categories;
            $categories = apply_filters( 'community_directory_offers_needs_default_categories', $categories );
            $this->add_term_categories( $categories );
            community_directory_delete_option( 'taxonomy_product_service_init' );
        }
    }

    /**
     * Filters the HTML on the edit OffersNeeds cpt to replace the category checkboxes with radio buttons
     */
    public function replace_terms_to_radio_start( string $post_type, \WP_Post $post ) {
        if ( in_array( $post_type, apply_filters( 'community_directory_taxonomy_product_service_type_cpt', []) ) ) {
            $this->_replacing_checkboxes = true;
            ob_start();
        }
    }

    public function replace_terms_to_radio_end() {
        if ( $this->_replacing_checkboxes ) {
            $this->_replacing_checkboxes = false;
            echo str_replace( '"checkbox"', '"radio"', ob_get_clean() );
        }
    }

    /**
     * To be called upon taxonomy registration long before any instance is required
     */
    public static function define_taxonomy( string $slug, string $taxonomy ) {
        static::$slug = $slug;
        static::$taxonomy = $taxonomy;
    }

    protected array $_default_categories = [
        'food & drink' => array(
            'ingredients',
            'vegetables',
            'fruit',
            'meat',
            'mushrooms',
            'grains',
            'dairy products',
            'desert',
            'fish',
            'drinks',
            'services' => array(
                'catering',
            ),
            'other',
        ),
        'home & construction' => array(
            'furniture',
            'kitchen',
            'flowers',
            'bathroom',
            'bedroom & sleeping',
            'services' => array(
                'handyman',
                'cleaning',
                'carpentry',
                'plumbing',
                'electric work',
            ),
            'other',
        ),
        'garden, farm, forest' => array(
            'flowers',
            'seeds',
            'trees & plants',
            'animals',
            'equipment',
            'services' => array(
                'landscaping',
                'farm help',
            ),
            'other',
        ),
        'real-estate' => array(
            'apartment',
            'land',
            'rent',
            'cottage',
            'services' => array( 
                'realty',
            ),
            'other',
        ),
        'transportas' => array(
            'bikes',
            'vehicles',
            'courier',
            'carpooling',
            'services',
            'other',
        ),
        'technology' => array(
            'phones',
            'tablets',
            'computers',
            'accessories',
            'services' => array(
                'technical repair',
                'web consulting & websites',
            ),
            'other',
        ),
        'entertainment' => array(
            'books & movies',
            'hunting & fishing',
            'music',
            'games',
            'services' => array(
                'musical performance',
                'acting performance',
            ),
            'other',
        ),
        'clothing' => array(
            "men's clothing",
            "women's clothing",
            'special occasion',
            'services',
            'other',
        ),
        'children' => array(
            "children's clothing",
            'toys',
            'school supplies',
            'accessories',
            'services',
            'other',
        ),
        'personal development & health' => array(
            'coaching, therapy, psychiatry',
            'doctor',
            'beauty',
            'education' => array(
                'math',
                'science',
                'spiritual',
                'healthy eating',
            ),
            'sports & exercise',
            'other',
        ),
        'work' => array(
            'accounting',
            'legal',
            'other',
        ),
        'arts & crafts' => array(
            'services',
            'other',
        ),
        'give away' => array()
    ];
}

__( 'product-service-type', 'community-directory' );
// Category translations
__( 'food & drink', 'community-directory' );
    __( 'ingredients', 'community-directory' );
    __( 'vegetables', 'community-directory' );
    __( 'fruit', 'community-directory' );
    __( 'meat', 'community-directory' );
    __( 'mushrooms', 'community-directory' );
    __( 'grains', 'community-directory' );
    __( 'dairy products', 'community-directory' );
    __( 'desert', 'community-directory' );
    __( 'fish', 'community-directory' );
    __( 'drinks', 'community-directory' );
    __( 'services', 'community-directory' );
        __( 'catering', 'community-directory' );
    __( 'other', 'community-directory' );
__( 'home & construction', 'community-directory' );
    __( 'furniture', 'community-directory' );
    __( 'kitchen', 'community-directory' );
    __( 'flowers', 'community-directory' );
    __( 'bathroom', 'community-directory' );
    __( 'bedroom & sleeping', 'community-directory' );
        __( 'handyman', 'community-directory' );
        __( 'cleaning', 'community-directory' );
        __( 'carpentry', 'community-directory' );
        __( 'plumbing', 'community-directory' );
        __( 'electric work', 'community-directory' );
__( 'garden, farm, forest', 'community-directory' );
    __( 'flowers', 'community-directory' );
    __( 'seeds', 'community-directory' );
    __( 'trees & plants', 'community-directory' );
    __( 'animals', 'community-directory' );
    __( 'equipment', 'community-directory' );
        __( 'landscaping', 'community-directory' );
        __( 'farm help', 'community-directory' );
__( 'real-estate', 'community-directory' );
    __( 'apartment', 'community-directory' );
    __( 'land', 'community-directory' );
    __( 'rent', 'community-directory' );
    __( 'cottage', 'community-directory' );
        __( 'realty', 'community-directory' );
__( 'transportation', 'community-directory' );
    __( 'bikes', 'community-directory' );
    __( 'vehicles', 'community-directory' );
    __( 'courier', 'community-directory' );
    __( 'carpooling', 'community-directory' );
__( 'technology', 'community-directory' );
    __( 'phones', 'community-directory' );
    __( 'tablets', 'community-directory' );
    __( 'computers', 'community-directory' );
    __( 'accessories', 'community-directory' );
        __( 'technical repair', 'community-directory' );
        __( 'web consulting & websites', 'community-directory' );
__( 'entertainment', 'community-directory' );
    __( 'books & movies', 'community-directory' );
    __( 'hunting & fishing', 'community-directory' );
    __( 'music', 'community-directory' );
    __( 'games', 'community-directory' );
        __( 'musical performance', 'community-directory' );
        __( 'acting performance', 'community-directory' );
__( 'clothing', 'community-directory' );
    __( "men's clothing", 'community-directory' );
    __( "women's clothing", 'community-directory' );
    __( 'special occasion', 'community-directory' );
__( 'children', 'community-directory' );
    __( "children's clothing", 'community-directory' );
    __( 'toys', 'community-directory' );
    __( 'school supplies', 'community-directory' );
    __( 'accessories', 'community-directory' );
__( 'personal development & health', 'community-directory' );
    __( 'coaching, therapy, psychiatry', 'community-directory' );
    __( 'doctor', 'community-directory' );
    __( 'beauty', 'community-directory' );
    __( 'education', 'community-directory' );
        __( 'math', 'community-directory' );
        __( 'science', 'community-directory' );
        __( 'spiritual', 'community-directory' );
        __( 'healthy eating', 'community-directory' );
    __( 'sports & exercise', 'community-directory' );
__( 'work', 'community-directory' );
    __( 'accounting', 'community-directory' );
    __( 'legal', 'community-directory' );
__( 'arts & crafts', 'community-directory' );
__( 'give away', 'community-directory' );