<?php

function community_directory_get_locations( $status = COMMUNITY_DIRECTORY_ENUM_ACTIVE ) {
    global $wpdb;

    return $wpdb->get_results( "SELECT * FROM " . COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS . " WHERE status = '$status'" );
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