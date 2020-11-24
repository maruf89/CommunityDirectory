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