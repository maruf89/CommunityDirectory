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
            array( 'type' => 'sectionend', 'id' => 'general-options' ),
        ) );

        $settings = apply_filters( 'community_directory_get_settings_' . $this->id, $settings );

        $settings[] = array( 'type' => 'sectionend', 'id' => 'general_options' );

        return $settings;
    }
}