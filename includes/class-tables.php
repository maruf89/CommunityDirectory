<?php
/**
 * Community Directory table related functions
 *
 * @since      1.0.0
 * @author     GeoDirectory Team <info@wpgeodirectory.com>
 */
class Community_Directory_Tables {

    static $table_places;

    public function __construct() {
        global $wpdb;

        Community_Directory_Tables::$table_places = $wpdb->prefix . 'community_directory_places';
    }
    
    /**
     * Creates Community Directory related tables.
     *
     * @since       0.0.1
     * @package     community-directory
     *
     * @return      void
     */
    public function create_tables() {
        global $wpdb;

        // $wpdb->hide_errors();

      $table_name = Community_Directory_Tables::$table_places;
      $charset_collate = $wpdb->get_charset_collate();

      if ( $wpdb->get_var( "SHOW TABLES LIKE '{$table_name}'" ) != $table_name ) {
         $sql = "CREATE TABLE $table_name (
          id smallint(4) NOT NULL AUTO_INCREMENT,
          `display_name` varchar(20) NOT NULL,
          `slug` varchar(20) NOT NULL,
          `active_inhabitants` int(4) NOT NULL,
          PRIMARY KEY  (id)
          )    $charset_collate;";

         require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
         dbDelta($sql);
         add_option( 'community_directory_db_version', COMMUNITY_DIRECTORY_DB_VERSION );
      } else {
         // update_option('community_directory_db_version', COMMUNITY_DIRECTORY_DB_VERSION );
      }

    }

    /**
     * Deleting the table whenever a blog is deleted
     *
     * @since       0.0.1
     * @package     community-directory
     *
     * @param       array       $tables     Tables to delete.
     *
     * @return      array                   Modified table array to delete
     */
    public function drop_tables_on_delete_blog( $tables ) {
        $tables[] = Community_Directory_Tables::$table_places;
        return $tables;
    }

    /**
     * Returns the table prefix based on the installation type.
     *
     * @since       0.0.1
     * @package     community-directory
     *
     * @return      string      Table prefix
     */
    public function get_table_prefix() {
        global $wpdb;
        return $wpdb->prefix;
    }

}