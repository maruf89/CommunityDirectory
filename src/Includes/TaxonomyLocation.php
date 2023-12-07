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
use Maruf89\CommunityDirectory\Includes\instances\Location;

class TaxonomyLocation extends Taxonomy {

    private static TaxonomyLocation $instance;
    public static string $name = 'location-type';
    public static string $taxonomy;
    public static string $slug;

    public static function get_instance():TaxonomyLocation {
        if ( !isset( static::$instance ) )
            static::$instance = new TaxonomyLocation();

        return static::$instance;
    }
    
    /**
     * Called via 'after_setup_theme' action
     * 
     * Gathers the categories to be added
     */
    public function register_taxonomy_terms() {
        $custom_taxonomy_args = array(
            'hierarchical' => true,
            'label' => __( 'Location Types', 'community-directory' ), // display name
            'query_var' => true,
            'show_in_nav_menus' => false,
            'show_in_menu' => false,
            'publicly_queryable' => true,
            'show_ui' => false,
            'public' => true,
            'rewrite' => array(
                'slug' => static::$slug,
                'with_front' => false  // Don't display the category base before
            )
        );

        register_taxonomy(
            static::$taxonomy,
            apply_filters( 'community_directory_register_taxonomy_cpt_' . static::$taxonomy, []),
            $custom_taxonomy_args
        );
    }

    public function new_location_created( Location $instance ) {
        return wp_insert_term( $instance->display_name, static::$taxonomy, array(
            'description' => "$instance->post_id",
            'slug' => $instance->slug
        ) );
    }
}