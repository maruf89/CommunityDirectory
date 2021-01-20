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

use Maruf89\CommunityDirectory\Includes\instances\Entity;
use Maruf89\CommunityDirectory\Includes\instances\OfferNeed;

class ClassShortcodes {

    public function list_offers_needs( array $attrs ) {
        $entity_id = isset( $attrs[ 'entity_id' ] ) && !empty( $attrs[ 'entity_id' ] )
            ? $attrs[ 'entity_id' ] : null;
        $location_id = isset( $attrs[ 'location_id' ] ) && !empty( $attrs[ 'location_id' ] )
            ? $attrs[ 'location_id' ] : null;
        $type = isset( $attrs[ 'type' ] ) && !empty( $attrs[ 'type' ] )
            ? $attrs[ 'type' ] : 'need';
        $count = isset( $attrs[ 'count' ] ) && !empty( $attrs[ 'count' ] )
            ? $attrs[ 'count' ] : 20;

        $instances = apply_filters(
            'community_directory_get_latest_offers_needs',
            array(),
            $type,
            $entity_id,
            $location_id
        );

        $instances = ClassOffersNeeds::format_to_instances( $instances );

        if ( !count( $instances ) ) {
            $template_file = apply_filters( 'community_directory_template_offer-need/offer-need-no-results.php', '' );
            load_template( $template_file, false, array(
                'attrs' => $attrs,
            ) );
        } else {
            $template_file = apply_filters( 'community_directory_template_offer-need/offer-need-list.php', '' );
            $single_template = 
            load_template( $template_file, false, array(
                'instances' => $instances,
                'attrs' => $attrs,
            ) );
        }
    }

    public function list_offers_needs_hashtag( array $attrs ) {
        $entity_id = isset( $attrs[ 'entity_id' ] ) && !empty( $attrs[ 'entity_id' ] )
            ? (int) $attrs[ 'entity_id' ] : null;
        $location_id = isset( $attrs[ 'location_id' ] ) && !empty( $attrs[ 'location_id' ] )
            ? (int) $attrs[ 'location_id' ] : null;
        $type = isset( $attrs[ 'type' ] ) && !empty( $attrs[ 'type' ] )
            ? $attrs[ 'type' ] : 'need';
        $count = isset( $attrs[ 'count' ] ) && !empty( $attrs[ 'count' ] )
            ? (int) $attrs[ 'count' ] : 20;

        $instances = apply_filters(
            'community_directory_get_latest_offers_needs',
            array(),
            $type,
            $entity_id,
            $location_id
        );

        if ( count( $instances ) ) {
            $instances = ClassOffersNeeds::format_to_instances( $instances );
            
            $template_file = apply_filters( 'community_directory_template_offer-need/offer-need-hashtag-list.php', '' );
            load_template( $template_file, false, array(
                'instances' => $instances,
                'attrs' => array( 'type' => $type ),
            ) );
        }
    }
    
    private static array $templates = [
        'entity-list' => 'community_directory_template_entity/entity-list.php',
        'entity-map' => 'community_directory_template_map/instance-map.php',
    ];

    public function list_entities( array $attrs ) {
        $location_id = $attrs[ 'location_id' ] ?? null;
        $show_title = $attrs[ 'show_title' ] ?? false;
        $type = $attrs[ 'type' ] ?? 'list';

        if ( !isset( static::$templates[ "entity-$type" ] ) ) die( 'Invalid type passed to `list_entities` shortcode, must be one of (list|map)' );
        $template_filter = static::$templates[ "entity-$type" ];

        $instances = apply_filters(
            'community_directory_get_entities',
            array(),
            'publish',
            [ 'location_id' => $location_id ],
            $location_id,
            null
        );

        if ( count( $instances ) ) {
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
            ) );
        } else {
            ?>
                <h1><?= __( 'Uh oh…', 'community-directory' ) ?></h1>
                <p><?= __( 'You should\'nt be seeing this page. Something went wrong.', 'community-directory' ) ?></p>
            <?php
        }
    }

}