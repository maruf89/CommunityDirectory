<?php
/**
 * Community Directory table related functions
 *
 * @since      0.0.1
 * @author     Marius Miliunas <mvmiliunas@gmail.com>
 */

namespace Maruf89\CommunityDirectory\Includes;

class ClassTables {

    public function __construct() {
        global $wpdb;

        define( 'COMMUNITY_DIRECTORY_ENUM_PENDING', 'PENDING' );
        define( 'COMMUNITY_DIRECTORY_ENUM_ACTIVE', 'ACTIVE' );
        define( 'COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS', $wpdb->prefix . 'community_directory_locations' );
        define( 'COMMUNITY_DIRECTORY_DB_TABLE_USERS', $wpdb->prefix . 'community_directory_users' );
        define( 'COMMUNITY_DIRECTORY_DB_TABLE_TAGS', $wpdb->prefix . 'community_directory_tags' );
    }
    
    /**
     * Creates Community Directory related tables.
     *
     * @since       2020.11
     * @package     community-directory
     *
     * @return      void
     */
    public function create_tables() {
        global $wpdb;

        // $wpdb->hide_errors();
        

        $table_name = COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS;
        $charset_collate = $wpdb->get_charset_collate();

        if ( $wpdb->get_var( "SHOW TABLES LIKE '{$table_name}'" ) != $table_name ) {
            require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
          
            $sql = "CREATE TABLE $table_name (
                id bigint(20) NOT NULL AUTO_INCREMENT,
                `status` ENUM('PENDING','ACTIVE') NOT NULL DEFAULT 'PENDING',
                `display_name` varchar(35) NOT NULL,
                `slug` varchar(35) NOT NULL,
                `active_inhabitants` int(4) NOT NULL DEFAULT '0',
                `inactive_inhabitants` int(4) NOT NULL DEFAULT '0',
                `post_id` BIGINT(20) UNSIGNED NOT NULL,
                UNIQUE `unique_index`(`slug`, `post_id`),
                PRIMARY KEY  (id)
                )    $charset_collate;";

         
            dbDelta( $sql );

            $table_name = COMMUNITY_DIRECTORY_DB_TABLE_USERS;
            $sql = "CREATE TABLE $table_name (
                bigint smallint(20) NOT NULL,
                `status` ENUM('INACTIVE','ACTIVE') NOT NULL DEFAULT 'INACTIVE',
                `location_id` bigint(20) NOT NULL,
                `slug` varchar(35) NOT NULL,
                PRIMARY KEY  (user_id)
                )    $charset_collate;";

            dbDelta( $sql );

            $table_name = COMMUNITY_DIRECTORY_DB_TABLE_TAGS;
            $sql = "CREATE TABLE $table_name (
                id bigint(20) NOT NULL,
                `name` varchar(50) NOT NULL,
                `slug` varchar(50) NOT NULL,
                `parent_id` bigint(20) NOT NULL,
                PRIMARY KEY  (id)
                )    $charset_collate;";

            dbDelta( $sql );
         
            add_option( 'community_directory_db_version', COMMUNITY_DIRECTORY_DB_VERSION );
        } else {
            update_option('community_directory_db_version', COMMUNITY_DIRECTORY_DB_VERSION );
        }

    }

    /**
     * Deleting the table whenever a blog is deleted
     *
     * @since       2020.11
     * @package     community-directory
     *
     * @param       array       $tables     Tables to delete.
     *
     * @return      array                   Modified table array to delete
     */
    public static function drop_tables_on_delete_blog( $tables ) {
        $tables[] = COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS;
        $tables[] = COMMUNITY_DIRECTORY_DB_TABLE_USERS;
        return $tables;
    }

    /**
     * Returns the table prefix based on the installation type.
     *
     * @since       2020.11
     * @package     community-directory
     *
     * @return      string      Table prefix
     */
    public function get_table_prefix() {
        global $wpdb;
        return $wpdb->prefix;
    }

}