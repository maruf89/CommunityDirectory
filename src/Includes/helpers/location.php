<?php

function community_directory_get_locations( $status = '' ) {
    global $wpdb;

    $where = '';
    if ( !empty( $status ) ) $where = " WHERE status = '$status'";

    return $wpdb->get_results( "SELECT * FROM " . COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS . $where );
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

// Converts to lower case and replaces all letters to roman safe characters
function community_directory_location_name_to_slug( $location ) {
    return strtolower( transliterate_string( $location ) );
}

// Capitalizes first letter of location name
function community_directory_format_display_name( $location ) {
    return ucwords( strtolower( $location ) );
}