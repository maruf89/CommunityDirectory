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

        $offers_and_needs = apply_filters(
            'community_directory_get_latest_offers_and_needs',
            array(),
            $type,
            $entity_id,
            $location_id
        );

        $offers_and_needs = ClassOffersNeeds::format_to_instances( $offers_and_needs );

        if ( !count( $offers_and_needs ) ) {
            $template_file = apply_filters( 'community_directory_template_offers-and-needs-no-results.php', '' );
            load_template( $template_file, false, array(
                'attrs' => $attrs,
            ) );
        } else {
            $template_file = apply_filters( 'community_directory_template_offers-and-needs-list.php', '' );
            load_template( $template_file, false, array(
                'offers_and_needs' => $offers_and_needs,
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

        $offers_and_needs = apply_filters(
            'community_directory_get_latest_offers_and_needs',
            array(),
            $type,
            $entity_id,
            $location_id
        );

        if ( count( $offers_and_needs ) ) {
            $offers_and_needs = ClassOffersNeeds::format_to_instances( $offers_and_needs );
            
            $template_file = apply_filters( 'community_directory_template_offers_needs_hashtag_list.php', '' );
            load_template( $template_file, false, array(
                'offers_and_needs' => $offers_and_needs,
                'attrs' => array( 'type' => $type ),
            ) );
        }
    }

    public function list_entities( array $attrs ) {
        $location_id = isset( $attrs[ 'location_id' ] ) && !empty( $attrs[ 'location_id' ] )
            ? (int) $attrs[ 'location_id' ] : null;
        $show_title = isset( $attrs[ 'show_title' ] ) && !empty( $attrs[ 'show_title' ] )
            ? (bool) $attrs[ 'show_title' ] : false;

        $entities = apply_filters(
            'community_directory_get_entities',
            array(),
            $location_id,
            'location',
        );

        if ( count( $entities ) ) {
            $entities = ClassEntity::format_to_instances( $entities );
            $template_file = apply_filters( 'community_directory_template_entity-list.php', '' );
            load_template( $template_file, false, array(
                'entities' => $entities,
                'show_title' => $show_title,
            ) );
        } else {
            // ToDo: We shouldn't get here, but just in case show a template saying there are no entities here
        }
    }

}