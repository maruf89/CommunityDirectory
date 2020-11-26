<?php

use Maruf89\CommunityDirectory\Includes\ClassLocation;

/**
 * Creates a new location in the db
 * 
 * @param           $data       a_array         Must contain 'display_name'
 * @return          Returns the wp_post id upon create or WP_Error
 */
function community_directory_create_location( $data ) {
    $Location = ClassLocation::get_instance();
    return $Location::create_location( $data );
}

function community_directory_get_locations( $active = false, $with_inhabitants = false ) {
    global $wpdb;

    $sql = 'SELECT * FROM ' . COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS;
    $where = '';
    if ( $active ) $sql .= " WHERE status = '" . COMMUNITY_DIRECTORY_ENUM_ACTIVE . "'";
    if ( $with_inhabitants ) $sql .= ' AND active_inhabitants > 0';

    return $wpdb->get_results( $sql );
}

function community_directory_update_locations( $data ) {
    $Location = ClassLocation::get_instance();
    return $Location::update_locations( $data );
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

/**
 * Returns a variable from a table
 * 
 * @param       $where_val          any         the value to check agaist
 * @param       $var                string      the variable to get
 * @param       $where_var          string      the field to check $where_val against
 *                                              (if empty: returns 'id' if $where_val is an int, otherwise 'slug')
 * @param       $table              string      the table to query on
 * @return                          any
 */
function community_directory_get_row_var( $where_val, $var, $where_var = '', $table = COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS ) {
    global $wpdb;
    if ( empty( $where_var ) )
        $where_var = gettype( $where_val ) === 'integer' ? 'id' : 'slug';

    return $wpdb->get_var( $wpdb->prepare( "SELECT $var FROM $table WHERE $where_var = %s", $where_val ) );
}

/**
 * Checks whether a location already exists with a given display name
 * 
 * @param $name 'string' value that gets converted to a display_name and checked against that value
 */
function community_directory_location_exists( $name ) {
    global $wpdb;

    $display_name = community_directory_format_display_name( $name );
    
    $row = $wpdb->get_row(
        $wpdb->prepare( "SELECT display_name FROM " . COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS . " WHERE display_name = %s", $display_name )
    );

    return !!$row;
}

// Converts to lower case and replaces all letters to roman safe characters
function community_directory_location_name_to_slug( $location ) {
    return strtolower( transliterate_string( $location ) );
}

// Capitalizes first letter of location name
function community_directory_format_display_name( $location ) {
    return ucwords( strtolower( $location ) );
}