<?php
/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @author     Marius Miliunas
 */

namespace Maruf89\CommunityDirectory\Includes;

class ClassActivator {

    /**
     * This method gets fired during plugin activation.
     *
     * @since       1.0.0
     * @package     community-directory
     * @return      void
     */
    public static function activate($network_wide = false) {

        if (is_multisite()) {
            $main_site = get_network()->site_id;
            if($network_wide){

                update_network_option('', 'uwp_is_network_active', 1);
                switch_to_blog( $main_site );
                restore_current_blog();
                
                if (defined('COMMUNITY_DIRECTORY_ROOT_PAGES')) {
                    if (COMMUNITY_DIRECTORY_ROOT_PAGES == 'all') {
                        $blog_ids = self::get_blog_ids();

                        foreach ( $blog_ids as $blog_id ) {
                            switch_to_blog( $blog_id );
                            self::install();
                        }
                        restore_current_blog();
                    } else {
                        $blog_id = COMMUNITY_DIRECTORY_ROOT_PAGES;
                        switch_to_blog( $blog_id );
                        self::install();
                        restore_current_blog();
                    }
                } else {
                    switch_to_blog( $main_site );
                    self::install();
                    restore_current_blog();
                }

            } else {
                self::install();
            }
        } else {
            self::install();
        }

    }

    public static function install(){
        community_directory_create_tables();

        // update the version
        update_option('community_directory_db_version', COMMUNITY_DIRECTORY_DB_VERSION);
    }

    /**
     * Get all IDs of blogs that are not activated, not spam, and not deleted
     *
     * @global      object $wpdb
     * @return      array|false Array of IDs or false if none are found
     */
    public static function get_blog_ids() {
        global $wpdb;

        // Get an array of IDs
        $sql = "SELECT blog_id FROM $wpdb->blogs
                    WHERE archived = '0' AND spam = '0'
                    AND deleted = '0'";

        return $wpdb->get_col( $sql );
    }


    public static function deactivate($network_wide = false) {
        if (is_multisite()) {
            $main_site = get_network()->site_id;
            if($network_wide){

                update_network_option('', 'uwp_is_network_active', 1);
                switch_to_blog( $main_site );
                restore_current_blog();
                
                if (defined('COMMUNITY_DIRECTORY_ROOT_PAGES')) {
                    if (COMMUNITY_DIRECTORY_ROOT_PAGES == 'all') {
                        $blog_ids = self::get_blog_ids();

                        foreach ( $blog_ids as $blog_id ) {
                            switch_to_blog( $blog_id );
                            self::uninstall();
                        }
                        restore_current_blog();
                    } else {
                        $blog_id = COMMUNITY_DIRECTORY_ROOT_PAGES;
                        switch_to_blog( $blog_id );
                        self::uninstall();
                        restore_current_blog();
                    }
                } else {
                    switch_to_blog( $main_site );
                    self::uninstall();
                    restore_current_blog();
                }

            } else {
                self::uninstall();
            }
        } else {
            self::uninstall();
        }
    }

    public static function uninstall() {
        global $wpdb;
        $tables = community_directory_drop_tables_on_delete_blog(array());

        $wpdb->query( "DROP TABLE IF EXISTS " . implode(',', $tables) );

        delete_option('community_directory_db_version');
    }


    /**
     * Performs automatic upgrade
     *
     * @since       2.0.0
     * @package     community-directory
     * @return      void
     */
    public static function automatic_upgrade(){
        $uwp_db_version = get_option('community_directory_db_version');

        if ( $uwp_db_version != COMMUNITY_DIRECTORY_DB_VERSION ) {
            self::activate(is_plugin_active_for_network( 'community-directory/community-directory.php' ));
        }
    }



}