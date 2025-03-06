<?php

namespace Maruf89\CommunityDirectory\Admin\Scripts;

use Maruf89\CommunityDirectory\Includes\instances\{Location};

class ClassScripts {
    public static function reindex_inhabitants():array {
        $locations = apply_filters( 'community_directory_get_locations', [], '', null, null );
        $locations = apply_filters( 'community_directory_format_locations', $locations, 'post_id' );

        $inhabitants_count = [];

        // Entities that don't belong to any found locations
        $without_location = [];
        
        // reset inhabitants count
        foreach ( $locations as $loc )
            $inhabitants_count[ (int) $loc->post_id ] = [ 'active_inhabitants' => 0, 'inactive_inhabitants' => 0 ];
        
        // get entities
        $entities = apply_filters( 'community_directory_get_entities', [], null, null, null );
        
        foreach ( $entities as $entity ) {
            $location_id = $entity->post_parent ?? '';

            // If entity doesn't have a loc_id, or the loc doesn't exist, add to problem array
            if ( empty( $location_id ) ||
                 !isset( $inhabitants_count[ (int) $location_id ] )
            ) {
                $without_location[] = $entity;
                continue;
            }
            
            $loc =& $inhabitants_count[ (int) $location_id ];
            
            // Only increment if post statuses match one of (publish|draft|pending|inactive)
            switch ( $entity->post_status ) {
                case 'publish':
                    $key = 'active_inhabitants';
                    break;
                case 'draft':
                case 'pending':
                case 'inactive':
                    $key = 'inactive_inhabitants';
                    break;
                default:
                    break;
            }

            if ( !isset( $key ) ) continue;
            
            $loc[ $key ]++;
        }

        foreach ( $inhabitants_count as $location_post_id => $changes ) {
            $Location = new Location( $locations[ $location_post_id ]->id, $location_post_id );
            $Location->update_cd_row( $changes );
        }

        return $inhabitants_count;
    }
}