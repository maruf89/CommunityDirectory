<?php

use Maruf89\CommunityDirectory\Includes\ClassLocation;
use Maruf89\CommunityDirectory\Includes\instances\Location;

/**
 * Returns a variable from a table
 * 
 * @param       $where_val          any         the value to check against
 * @param       $var                string      the variable to get
 * @param       $where_var          string      the field to check $where_val against
 *                                              (if empty: returns 'id' if $where_val is an int, otherwise 'slug')
 * @param       $table              string      the table to query on
 * @return                          any
 */
function community_directory_get_row_var( $where_val, string $var, string $where_var = '', string $table = COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS ) {
    global $wpdb;
    if ( empty( $where_var ) )
        $where_var = gettype( $where_val ) === 'integer' ? 'id' : 'slug';

    return $wpdb->get_var( $wpdb->prepare( "SELECT $var FROM $table WHERE $where_var = %s", $where_val ) );
}

function community_directory_locations_exist() {
    global $wpdb;

    $result = $wpdb->get_row( 'SELECT COUNT(*) AS count FROM ' . COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS );

    return $result->count > 0;
}

/**
 * See class field for description
 */
function community_directory_update_locations( $data, $update_by = 'id' ) {
    $Location = ClassLocation::get_instance();
    return $Location::update_locations( $data, $update_by );
}

/**
 * See class field for description
 */
function community_directory_add_inhabitant( $loc_or_post_id, $which, $status, $count = 1 ) {
    $Location = ClassLocation::get_instance();
    return $Location::add_inhabitant( $loc_or_post_id, $which, $status, $count );
}

function community_directory_status_to_enum( $status = 'active' ) {
    
    switch (strtoupper($status)) {
        case 'PENDING':
            return COMMUNITY_DIRECTORY_ENUM_PENDING;
            break;
        case 'ACTIVE':
        default:
            return COMMUNITY_DIRECTORY_ENUM_ACTIVE;
            break;
    }
}