<?php
/**
 * UsersWP General Settings
 *
 * @author      AyeCode
 * @category    Admin
 * @package     userswp/Admin
 * @version     1.0.24
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

if ( ! class_exists( 'Community_Directory_Settings_Location', false ) ) :

/**
 * Community_Directory_Settings_Location.
 */
class Community_Directory_Settings_Location extends Community_Directory_Settings_Page {

    /**
     * Constructor.
     */
    public function __construct() {

        $this->id    = 'locations';
        $this->label = __( 'Locations', 'community-directory' );

        add_filter( 'community_directory_settings_tabs_array', array( $this, 'add_settings_page' ), 20 );
        add_action( 'community_directory_settings_' . $this->id, array( $this, 'output' ) );
        add_action( 'community_directory_sections_' . $this->id, array( $this, 'output_toggle_advanced' ) );
        add_action( 'community_directory_settings_save_' . $this->id, array( $this, 'save' ) );
        add_action( 'community_directory_sections_' . $this->id, array( $this, 'output_sections' ) );
    }

    /**
     * Output the settings.
     */
    public function output() {
        global $current_section;

        $settings = $this->get_settings( $current_section );

        Community_Directory_Admin_Settings::output_fields( $settings );
    }


    /**
     * Save settings.
     */
    public function save() {
        global $current_section;

        $settings = $this->get_settings( $current_section );
        Community_Directory_Admin_Settings::save_fields( $settings );
    }
}

endif;

return new Community_Directory_Settings_Location();
