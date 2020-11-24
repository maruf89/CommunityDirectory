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
     * @since       2020.11
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
        self::add_default_options();
        
        do_action( 'community_directory_create_tables' );

        do_action( 'community_directory_flush_rewrite_rules' );
        update_option('community_directory_flush_rewrite', 1);

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

    /**
     * Adds default settings during plugin activation.
     *
     * @since       2020.11
     * @package     community-directory
     * @return      void
     */
    public static function add_default_options() {
        $settings = get_option( 'community_directory_settings', array());

        $options = array(
            'uninstall_erase_data' => 0,
        );

        foreach ($options as $option => $value){
            if (!isset($settings[$option])) {
                $settings[$option] = $value;
            }
        }

        update_option( 'community_directory_settings', $settings );
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
        $options = get_option( 'community_directory_settings' );
    
        if ( isset($options['uninstall_erase_data']) &&
            $options['uninstall_erase_data'] == '1'
        ) {
            global $wpdb;

            $tables = ClassTables::drop_tables_on_delete_blog( array() );
            foreach ( $tables as $table_name ) {
                $sql        = "DROP TABLE IF EXISTS $table_name";
                $wpdb->query( $sql );
            }

            // Delete all location post type posts
            $custom_post_type = ClassLocation::$location_post_type;
            $sql = "DELETE FROM wp_posts WHERE post_type='$custom_post_type'";
            $wpdb->query( $sql );
            $sql = "DELETE FROM wp_postmeta WHERE post_id NOT IN (SELECT id FROM wp_posts)";
            $wpdb->query( $sql );
            $sql = "DELETE FROM wp_term_relationships WHERE object_id NOT IN (SELECT id FROM wp_posts)";
            $wpdb->query( $sql );

            // Delete options
            delete_option( 'community_directory_settings' );
            delete_option( 'community_directory_activation_redirect' );
            delete_option( 'community_directory_flush_rewrite' );
            delete_option( 'community_directory_default_data_installed' );
            delete_option( 'community_directory_db_version' );
        }
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