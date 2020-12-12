<?php

use Maruf89\CommunityDirectory\Includes\ClassEntity;

/**
 * Creates a new Entity post with the user's info
 * 
 * @param       $data       a_array         must contain: 'user_id', 'location_id', 'first_name', 'last_name', 'location_post_id'
 * return                   int|WP_Error    either the returned row id or error
 */
function community_directory_add_entity_location_data( $data ) {
    $Entity = ClassEntity::get_instance();
    
    return $Entity::add_entity_location_data( $data );
}