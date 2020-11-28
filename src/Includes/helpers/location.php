<?php

use Maruf89\CommunityDirectory\Includes\ClassLocation;

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

/**
 * Checks whether a location already exists with a given a locations slug
 * 
 * @param       $name       string      the slug of the location to check against
 * @return                  bool
 */
function community_directory_location_exists( $name ) {
    global $wpdb;

    $display_name = community_directory_format_display_name( $name );
    
    $table = COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS;
    $row = $wpdb->get_row(
        $wpdb->prepare( "SELECT display_name FROM $table WHERE display_name = %s", $display_name )
    );

    return !!$row;
}

function community_directory_locations_exist() {
    global $wpdb;

    $result = $wpdb->get_row( 'SELECT COUNT(*) AS count FROM ' . COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS );

    return $result->count > 0;
}

/**
 * Gets all locations based on parameters
 * 
 * @param       $status_active          bool|string     true: returns only activated
 *                                                      false: returns all locations
 *                                                      string: COMMUNITY_DIRECTORY_ENUM_(ACTIVE|PENDING)
 * @param       $with_inhabitants       bool            if true, only returns locatios with active inhabitants
 * @param       $formatted              bool|string     true: returns formatted by id
 *                                                      false: returns unformatted
 *                                                      string: field key to format the rows by 
 * @param       $output                 string          One of OBJECT, ARRAY_A, or ARRAY_N (Default value: OBJECT)
 * @return                              OJBECT|ARRAY
 */
function community_directory_get_locations(
        $status_active = false,
        $with_inhabitants = false,
        $formatted = false,
        $output = OBJECT
) {
    global $wpdb;

    $sql = 'SELECT * FROM ' . COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS;

    if ( gettype( $status_active ) === 'boolean' ) {
        if ( $status_active ) $sql .= " WHERE status = '" . COMMUNITY_DIRECTORY_ENUM_ACTIVE . "'";
    } else
        $sql .= " WHERE status = '$status_active'";
    
    if ( $with_inhabitants ) $sql .= ' AND active_inhabitants > 0';

    $results = $wpdb->get_results( $sql, $output );

    if ( !$formatted ) return $results;
    if ( gettype( $formatted ) === 'boolean' ) return community_directory_format_row_locations( $results );
    // Otherwise $formatted is a string
    return community_directory_format_row_locations( $results, $formatted );
}

function community_directory_format_row_locations( $rows, $format_by = 'id' ) {
    $Location = ClassLocation::get_instance();
    return $Location::format_row_locations( $rows, $format_by );
}

/**
 * Creates a new location in the DB if it doesn't exist
 * 
 * @return      false|int|WP_Error      if location exists, returns false, otherwise the wp_post id or error
 */
function community_directory_create_location_if_doesnt_exist( $data ) {
    return community_directory_location_exists( $data['slug'] ) ?
        false : community_directory_create_location( $data );

}

/**
 * Creates a new location in the db
 * 
 * @param           $data       ARRAY_A         Must contain 'display_name'
 * @return                      int             Returns the wp_post id upon create or WP_Error
 */
function community_directory_create_location( $data ) {
    $Location = ClassLocation::get_instance();
    return $Location::create_location( $data );
}

/**
 * See class field for description
 */
function community_directory_update_locations( $data, $update_by ) {
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

/**
 * See class field for description
 */
function community_directory_shift_inhabitants_count( $loc_or_post_id, $which, $increment ) {
    $Location = ClassLocation::get_instance();
    return $Location::shift_inhabitants_count( $loc_or_post_id, $which, $increment );
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
 * Prepares a location for slug
 */
function community_directory_location_name_to_slug( $location ) {
    $formatted = strtolower( transliterate_string( $location ) );
    $formatted = sanitize_title_with_dashes( $formatted );
    return $formatted;
}

// Capitalizes first letter of location name
function community_directory_format_display_name( $location ) {
    return ucwords( strtolower( $location ) );
}