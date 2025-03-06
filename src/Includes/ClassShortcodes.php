<?php

/**
 * The shortcode functionality of the plugin.
 *
 * @since      2020.11
 *
 * @package    community-directory
 * @subpackage community-directory/includes
 */

namespace Maruf89\CommunityDirectory\Includes;

use Maruf89\CommunityDirectory\Includes\instances\{OfferNeed, Entity};

class ClassShortcodes {

    public function list_offers_needs( array $attrs ) {
        $minified = $attrs[ 'minified' ] ?? false;
        $title = $attrs[ 'title' ] ?? '';
        $entity_id = $attrs[ 'entity_id' ] ?? 0;
        $location_id = $attrs[ 'location_id' ] ?? 0;
        $type =  $attrs[ 'type' ] ?? 'need';
        $product_service_id = $attrs[ 'product_service_id' ] ?? 0;
        $show_empty = $attrs[ 'show_empty' ] ?? false;
        $classes = $attrs[ 'classes' ] ?? '';
        // todo
        $count = $attrs[ 'count' ] ?? 10;

        $instances = apply_filters(
            'community_directory_get_latest_offers_needs',
            array(),
            $type,
            array(
                'entity_post_id' => $entity_id,
                'location_post_id' => $location_id,
                'product_service_id' => $product_service_id,
            )
        );

        $instances = ClassOffersNeeds::format_to_instances( $instances );

        // No results template
        if ( !count( $instances ) ) {
            if ( $show_empty ) {
                    $template_file = apply_filters(
                        'community_directory_template_offers-needs/offers-needs-no-results.php', ''
                    );
                load_template( $template_file, false, array(
                    'attrs' => $attrs,
                ) );
            }
        } else {
            // With results
            $template_file = apply_filters( 'community_directory_template_offers-needs/offers-needs-list.php', '' );
            $maybe_minified = $minified ? 'minified-' : '';
            $single_template = apply_filters(
                "community_directory_template_offers-needs/offers-needs-${maybe_minified}single.php", ''
            );
            load_template( $template_file, false, array(
                'instances' => $instances,
                'title' => $title,
                'single_template' => $single_template,
                'single_template_args' => array(
                    'hide_location' => !!$location_id,
                    'hide_product_service' => !!$product_service_id,
                ),
                'classes' => $classes,
                'attrs' => $attrs,
            ) );
        }
    }
    
    private static array $templates = [
        'entity-list' => 'community_directory_template_entity/entity-list.php',
        'entity-map' => 'community_directory_template_map/instance-map.php',
    ];

    public function list_entities( array $attrs ) {
        $location_id = $attrs[ 'location_id' ] ?? null;
        $entity_id = $attrs[ 'entity_id' ] ?? null;
        $show_title = $attrs[ 'show_title' ] ?? false;
        $type = $attrs[ 'type' ] ?? 'list';
        $classes = $attrs[ 'classes' ] ?? '';

        if ( !isset( static::$templates[ "entity-$type" ] ) ) die( 'Invalid type passed to `list_entities` shortcode, must be one of (list|map)' );
        $template_filter = static::$templates[ "entity-$type" ];

        if ( $entity_id )
            $instances = [ Entity::get_instance( $entity_id ) ];
        else
            $instances = apply_filters(
                'community_directory_get_entities',
                array(),
                'publish',
                [ 'location_id' => $location_id ],
                $location_id,
                null
            );

        if ( count( $instances ) ) {
            if ( !( $instances[ 0 ] instanceof Entity ) )
                $instances = ClassEntity::format_to_instances( $instances );

            if ( $type === 'list' )
                \usort( $instances, 'cd_sort_instances_by_has_photo' );
            else if ( $type === 'map' ) {
                $instances = \array_filter( $instances, 'cd_filter_instances_by_has_coords' );
                if ( !count( $instances ) ) return;
            }
            
            $template_file = apply_filters( $template_filter, '' );
            $single_template = apply_filters( 'community_directory_template_entity/entity-single.php', '' );
            load_template( $template_file, false, array(
                'instances' => $instances,
                'show_title' => $show_title,
                'single_template' => $single_template,
                'single_template_args' => array(
                    'hide_popup' => !!$entity_id,
                ),
                'classes' => $classes,
            ) );
        } else {
            ?>
                <h1><?= __( 'Uh oh…', 'community-directory' ) ?></h1>
                <p><?= __( 'You should\'nt be seeing this page. Something went wrong.', 'community-directory' ) ?></p>
            <?php
        }
    }

}