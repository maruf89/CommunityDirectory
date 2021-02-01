<?php
/**
 * Community Directory General Settings
 *
 * @author      Maruf89
 * @category    Admin
 * @package     community-directory/Admin
 * @version     2020.11
 */

namespace Maruf89\CommunityDirectory\Admin\Settings;

use Maruf89\CommunityDirectory\Includes\instances\{Location, OfferNeed};
use Maruf89\CommunityDirectory\Includes\TaxonomyLocation;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

/**
 * ClassSettingsGeneral.
 */
class ClassSettingsGeneral extends AbstractClassSettingsPage {

    /**
     * Constructor.
     */
    public function __construct() {

        $this->id    = 'general';
        $this->label = __( 'General', 'community-directory' );

        add_filter( 'community_directory_settings_tabs_array', array( $this, 'add_settings_page' ), 99 );
        add_action( 'community_directory_settings_' . $this->id, array( $this, 'output' ) );
        add_action( 'community_directory_settings_save_' . $this->id, array( $this, 'save' ) );
        add_action( 'community_directory_sections_' . $this->id, array( $this, 'output_sections' ) );

    }

    /**
     * Output the settings.
     */
    public function output() {
        global $current_section;

        if ( isset( $_REQUEST[ 'action' ] ) && \method_exists( $this, 'action_' . $_REQUEST[ 'action' ] ) )
            \call_user_func( array($this, 'action_' . $_REQUEST[ 'action' ] ) );
        
        $settings = $this->get_settings( $current_section );

        ClassAdminSettings::output_fields( $settings );
    }

    /**
     * Save settings.
     */
    public function save() {
        global $current_section;

        $settings = $this->get_settings( $current_section );
        ClassAdminSettings::save_fields( $settings );
    }

    /**
     * Get sections.
     *
     * @return array
     */
    public function get_sections() {

        $sections = array(
            '' => __( 'General Settings', 'community-directory' ),
        );

        return apply_filters( 'community_directory_get_sections_' . $this->id, $sections );
    }

    public function get_settings( $current_section = '' ) {

        /**
         * Filter general settings array.
         *
         * @package community-directory
         */
        $settings = apply_filters( 'community_directory_general_options', array(
            array(
                'title' => __( 'General Settings', 'community-directory' ),
                'type'  => 'title',
                'id'    => 'general_options',
            ),
            array(
                'name' => __( 'Add \'Locations\' to the nav menu', 'community-directory' ),
                'desc' => __( 'Check this box if you would like Community Directory to add a link for the locations to the menu.', 'community-directory' ),
                'id'   => 'load_locations_nav_menu',
                'type' => 'checkbox',
            ),
            array(
                'name' => __( 'Add My Location to the nav menu', 'community-directory' ),
                'desc' => __( 'Check this box if you would like Community Directory to add a link for user\'s location to the menu.', 'community-directory' ),
                'id'   => 'load_my_location_nav_menu',
                'type' => 'checkbox',
            ),
            array(
                'name' => __( 'Menu Name Slug', 'community-directory' ),
                'desc' => __( 'If menus active, enter the slug name of the menu to add these links to.', 'community-directory' ),
                'id'   => 'load_menu_slug',
                'type' => 'text',
            ),
            array(
                'name' => __( 'Enable OpenStreetMap', 'community-directory' ),
                'desc' => __( 'If enabled, loads the OSM API.' ),
                'id'   => 'enable_open_street_map',
                'type' => 'checkbox',
            ),
            array(
                'name' => __( 'Reindex Active/Inactive Entities', 'community-directory' ),
                'desc' => __( 'Clicking this button updates the active/inactive inhabitants to reflect the actual count for each location (workaround)' ),
                'id'   => 'reindex_inhabitants',
                'type' => 'button',
                'action' => 'reindex_inhabitants',
                'text' => __( 'Reindex', 'community-directory' ),
            ),
            array(
                'name' => 'Add Location Tags',
                'desc' => 'Update DB. Loads location tags for each location and attaches them to each offer/need',
                'id'   => 'add_location_tags',
                'type' => 'button',
                'action' => 'add_location_tags',
                'text' => 'Go!',
            ),

            array( 'type' => 'sectionend', 'id' => 'general-options' ),
        ) );

        $settings = apply_filters( 'community_directory_get_settings_' . $this->id, $settings );

        $settings[] = array( 'type' => 'sectionend', 'id' => 'general_options' );

        return $settings;
    }

    /**
     * To be called once - Loads location tags for each location and attach them to each offer/need
     */
    public function action_add_location_tags() {
        global $wpdb;

        $table_name = COMMUNITY_DIRECTORY_DB_TABLE_LOCATIONS;
        $wpdb->query( "
            ALTER TABLE $table_name
            ADD COLUMN `taxonomy_id` BIGINT(20) UNSIGNED NOT NULL
        " );
        
        $locations = apply_filters( 'community_directory_get_locations', [], '', null, null );
        $locations = apply_filters( 'community_directory_format_locations', $locations, 'instance' );

        foreach ( $locations as $location ) {
            $term_ids = TaxonomyLocation::get_instance()->new_location_created( $location );
            if ( $term_ids instanceof \WP_Error )
                $term_ids = (array) get_term_by( 'slug', $location->slug, TaxonomyLocation::$taxonomy );

            $location->update_cd_row( [ 'taxonomy_id' => $term_ids[ 'term_taxonomy_id' ] ] );
        }

        $offers_needs = apply_filters( 'community_directory_get_offers_needs', [], null, null, null );

        foreach( $offers_needs as $on ) OfferNeed::after_save( $on->ID );
    }

    /**
     * Parses all Locations and Entities and rebuilds the active/inactive inhabitants
     */
    public function action_reindex_inhabitants() {
        $locations = apply_filters( 'community_directory_get_locations', [], '', null, null );
        $locations = apply_filters( 'community_directory_format_locations', $locations, 'post_id' );

        $inhabitants_count = [];

        // Entities that don't belong to any found locations
        $without_location = [];
        
        // reset inhabitants count
        foreach ( $locations as $loc )
            $inhabitants_count[ (int) $loc->post_id ] = [ 'active_inhabitants' => 0, 'inactive_inhabitants' => 0 ];
        
        // get entities
        $entities = apply_filters( 'community_directory_get_entities', [], null, null, null );
        
        foreach ( $entities as $entity ) {
            $location_id = $entity->post_parent ?? '';

            // If entity doesn't have a loc_id, or the loc doesn't exist, add to problem array
            if ( empty( $location_id ) ||
                 !isset( $inhabitants_count[ (int) $location_id ] )
            ) {
                $without_location[] = $entity;
                continue;
            }
            
            $loc =& $inhabitants_count[ (int) $location_id ];
            
            // Only increment if post statuses match one of (publish|draft|pending|inactive)
            switch ( $entity->post_status ) {
                case 'publish':
                    $key = 'active_inhabitants';
                    break;
                case 'draft':
                case 'pending':
                case 'inactive':
                    $key = 'inactive_inhabitants';
                    break;
                default:
                    break;
            }

            if ( !isset( $key ) ) continue;
            
            $loc[ $key ]++;
        }

        foreach ( $inhabitants_count as $location_post_id => $changes ) {
            $Location = new Location( $locations[ $location_post_id ]->id, $location_post_id );
            $Location->update_cd_row( $changes );
        }
        
        ClassAdminSettings::add_message( sprintf( __( '%d locations have be reindexed', 'community-directory' ), count( $inhabitants_count ) ) );
    }
}