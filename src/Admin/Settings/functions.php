<?php
/**
 * Gets CommunityDirectory setting value using key.
 *
 * @since       2020.11
 * @package     community-directory
 *
 * @param       string          $key        Setting Key.
 * @param       bool|string     $default    Default value.
 * @param       bool            $cache      Use cache to retrieve the value?.
 *
 * @return      string                      Setting Value.
 */
function community_directory_get_option( $key = '', $default = false, $cache = true ) {

    if ($cache) {
        global $community_directory_options;
    } else {
        $community_directory_options = get_option( 'community_directory_settings' );
    }

    $value = isset( $community_directory_options[ $key ] ) ? $community_directory_options[ $key ] : $default;
    $value = apply_filters( 'community_directory_get_option', $value, $key, $default );
    return apply_filters( 'community_directory_get_option_' . $key, $value, $key, $default );

}

/**
 * Updates CommunityDirectory setting value using key.
 *
 * @since       2020.11
 * @package     community-directory
 *
 * @param       string|bool     $key        Setting Key.
 * @param       string          $value      Setting Value.
 *
 * @return      bool                        Update success or not?.
 */
function community_directory_update_option( $key = false, $value = '') {

    if (!$key ) {
        return false;
    }

    $settings = get_option( 'community_directory_settings', array());

    if( !is_array( $settings ) ) {
        $settings = array();
    }

    $settings[ $key ] = $value;

    $settings = apply_filters( 'community_directory_update_option', $settings, $key, $value );
    $settings =  apply_filters( 'community_directory_update_option_' . $key, $settings, $key, $value );

    $updated = update_option( 'community_directory_settings', $settings );

    if ( $updated ) {
        global $community_directory_options;
        $community_directory_options[ $key ] = $value;
    }

    return $updated;

}

/**
 * Deletes CommunityDirectory setting value using key.
 *
 * @package     community-directory
 *
 * @param       string|bool     $key        Setting Key.
 *
 * @return      bool                        delete success or not?.
 */
function community_directory_delete_option( $key = '' ) {

    if ( empty( $key ) ) {
        return false;
    }

    $options = get_option( 'community_directory_settings' );
    if ( empty( $options ) ) {
        $options = array();
    }

    if ( isset( $options[ $key ] ) ) {
        unset( $options[ $key ] );
    }

    $updated = update_option( 'community_directory_settings', $options );

    if ( $updated ) {
        global $community_directory_options;
        $community_directory_options = $options;
    }

    return $updated;
}

/**
 * Get Community Directory Settings.
 *
 * Retrieves all plugin settings.
 *
 * @return array Community Directory settings
 */
function community_directory_get_settings() {
    $settings = get_option( 'community_directory_settings' );

    if ( empty( $settings ) ) {
        // Update old settings with new single option.
        $settings = array();

        update_option( 'community_directory_settings', $settings );
    }

    return apply_filters( 'community_directory_get_settings', $settings );
}