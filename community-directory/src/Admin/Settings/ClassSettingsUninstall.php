<?php
/**
 * Community Directory Uninstall Settings
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
 * ClassSettingsUninstall.
 */
class ClassSettingsUninstall extends AbstractClassSettingsPage {

    /**
     * Constructor.
     */
    public function __construct() {

        $this->id    = 'uninstall';
        $this->label = __( 'Uninstall', 'community-directory' );

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
            '' => __( 'Uninstall Settings', 'community-directory' ),
        );

        return apply_filters( 'community_directory_get_sections_' . $this->id, $sections );
    }

    public function get_settings( $current_section = '' ) {

        /**
         * Filter uninstall settings array.
         *
         * @package community-directory
         */
        $settings = apply_filters( 'community_directory_uninstall_options', array(
            array(
                'title' => __( 'Uninstall Settings', 'community-directory' ),
                'type'  => 'title',
                'desc'  => __( 'Options to remove data upon uninstall', 'community-directory' ),
                'id'    => 'uninstall_options',
            ),

            array(
                'name' => __( 'Remove Data on Uninstall?', 'community-directory' ),
                'desc' => __( 'Check this box if you would like Community Directory to completely remove all of its data when the plugin is deleted.', 'community-directory' ),
                'id'   => 'uninstall_erase_data',
                'type' => 'checkbox',
            ),

        ) );

        $settings = apply_filters( 'community_directory_get_settings_' . $this->id, $settings );

        $settings[] = array( 'type' => 'sectionend', 'id' => 'uninstall_options' );

        return $settings;
    }
}