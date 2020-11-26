<?php

function community_directory_get_locations( $status = '' ) {
    global $wpdb;

    $where = '';
    if ( !empty( $status ) ) $where = " WHERE status = '$status'";

    return $wpdb->get_results( "SELECT * FROM " . COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS . $where );
}

function community_directory_get_location_names( $status = '' ) {
    $locations = community_directory_get_locations( $status );
    $locations_by_name = array();

    foreach ( $locations as $row ) {
        $locations_by_name[$row->slug] = $row->display_name;
    }

    return $locations_by_name;
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