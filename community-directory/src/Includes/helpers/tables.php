<?php

/**
 * Returns the installation type.
 *
 * @since       2020.11
 * @package     community-directory
 *
 * @return      string      Installation type.
 */
function community_directory_get_installation_type() {
    // *. Single Site
    if (!is_multisite()) {
        return "single";
    } else {
        // Multisite
        if ( ! function_exists( 'is_plugin_active_for_network' ) ) {
            require_once( ABSPATH . '/wp-admin/includes/plugin.php' );
        }

        // Network active.
        if ( is_plugin_active_for_network( 'community-directory/community-directory.php' ) ) {
            if (defined('COMMUNITY_DIRECTORY_ROOT_PAGES')) {
                if (COMMUNITY_DIRECTORY_ROOT_PAGES == 'all') {
                    // *. Multisite - Network Active - Pages on all sites
                    return "multi_na_all";
                } else {
                    // *. Multisite - Network Active - Pages on specific site
                    return "multi_na_site_id";
                }
            } else {
                // Multi - network active - default
                // *. Multisite - Network Active - Pages on main site
                return "multi_na_default";
            }
        } else {
            // * Multisite - Not network active
            return "multi_not_na";
        }
    }
}