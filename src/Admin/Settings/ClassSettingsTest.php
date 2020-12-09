<?php
/**
 * Community Directory Test Settings
 *
 * @author      Maruf89
 * @category    Admin
 * @package     community-directory/Admin
 * @version     2020.11
 */

namespace Maruf89\CommunityDirectory\Admin\Settings;

use Maruf89\CommunityDirectory\Admin\ClassTest;
use Maruf89\CommunityDirectory\Includes\ClassACF;
use Maruf89\CommunityDirectory\Includes\ClassEntity;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

/**
 * ClassSettingsTest.
 */
class ClassSettingsTest extends AbstractClassSettingsPage {

    
    
    /**
     * Constructor.
     */
    public function __construct() {

        $this->id    = 'testing';
        $this->label = __( 'Testing', 'community-directory' );

        add_filter( 'community_directory_settings_tabs_array', array( $this, 'add_settings_page' ), 99 );
        add_action( 'community_directory_settings_' . $this->id, array( $this, 'output' ) );
        add_action( 'community_directory_settings_save_' . $this->id, array( $this, 'save' ) );
        add_action( 'community_directory_sections_' . $this->id, array( $this, 'output_sections' ) );

        add_action( 'community_directory_settings_save_modify_users', array( $this, 'save_modify_subscribers' ), 10, 1 );

        $this->Test = ClassTest::get_instance();
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

        do_action( 'community_directory_settings_save_modify_users', $current_section );
    }

    /**
     * Get sections.
     *
     * @return array
     */
    public function get_sections() {

        $sections = array(
            '' => __( 'Generate Subscribers', 'community-directory' ),
            'delete-users' => __( 'Delete Subscribers', 'community-directory' ),
        );

        return apply_filters( 'community_directory_get_sections_' . $this->id, $sections );
    }

    public function get_settings( $current_section = '' ) {
        $settings = array();

        $title = $this->get_sections()[$current_section];

        switch ($current_section) {
            case '':
                $settings = array(
                    array(
                        'title' => $title,
                        'type'  => 'title',
                        'desc'  => __( 'Generate Subscribers', 'community-directory' ),
                        'desc_tip' => true,
                    ),
                    array(
                        'name' => __( 'Generate New Locations', 'community-directory' ),
                        'desc'     => __( 'Generate New Locations', 'community-directory' ),
                        'id'    => 'generate_new_locations',
                        'type'  => 'checkbox',
                        'desc'  => __( 'Check if you would like the new users to be generated to new locations', 'community-directory' ),
                        'desc_tip' => true,
                    ),
                    array(
                        'name' => __( 'New Subscribers Inactive', 'community-directory' ),
                        'desc'     => __( 'Whether to set the new users as inactive', 'community-directory' ),
                        'id'    => 'generate_subscribers_inactive',
                        'type'  => 'checkbox',
                        'desc'  => __( 'Check this if you want the news users to be inactive (default: active)', 'community-directory' ),
                        'desc_tip' => true,
                    ),
                    array(
                        'name' => __( 'Subscriber Count', 'community-directory' ),
                        'id'    => 'new_subscriber_count',
                        'type'  => 'number',
                        'desc'  => __( 'Enter the number of new users you want to generate.', 'community-directory' ),
                        'desc_tip' => true,
                    ),
                    array( 'type' => 'sectionend', 'id' => 'generate-options' ),
                );
                break;
            case 'delete-users':
                $settings = array(
                    array(
                        'title' => $title,
                        'type'  => 'title',
                        'desc'  => __( 'Delete Subscribers', 'community-directory' ),
                        'desc_tip' => true,
                    ),
                    array(
                        'name' => __( 'Delete Subscribers', 'community-directory' ),
                        'desc'     => __( 'Delete all subscribers.', 'community-directory' ),
                        'id'    => 'delete_subscribers',
                        'type'  => 'checkbox',
                        'desc'  => __( 'By checking this box and saving, all subscribers will be cleansed', 'community-directory' ),
                        'desc_tip' => true,
                    ),
                    array( 'type' => 'sectionend', 'id' => 'delete-options' ),
                );
                break;
        }

        return apply_filters( 'community_directory_get_settings_' . $this->id, $settings );
    }

    /**
     * Modifies the users based on response
     * 
     * @param       $current_section    string          either 'delete-users' or ''
     */
    public function save_modify_subscribers( $current_section ) {
        $array_ignore = array( '_wpnonce', '_wp_http_referer' );
        $data = $_POST;

        if ( empty( $data ) ) {
            return false;
        }
        
        if ( isset( $data['delete_subscribers'] ) && $data['delete_subscribers'] == 1 ) {
            $rows = $this->Test->delete_subscribers();
            ClassAdminSettings::add_message(
                sprintf( __( 'Deleted %d subscribers.', 'community-directory' ), $rows )
            );
        }

        if ( isset( $data['new_subscriber_count'] ) &&
             !empty( $data['new_subscriber_count'] ) &&
             intval( $data['new_subscriber_count'] )
        ) {
            if ( !isset( $data['generate_new_locations'] ) && !community_directory_locations_exist() )
                return ClassAdminSettings::add_error( __( "There are no locations to generate users to. Either create some locations or check the 'Generate New Locations' checkbox.", 'community-directory' ) );

            $count = intval( $data['new_subscriber_count'] );
            
            $make_active = !isset( $data['generate_subscribers_inactive'] ) ||
                $data['generate_subscribers_inactive'] != 1;

            $generate_locations = isset( $data['generate_new_locations'] ) && $data['generate_new_locations'] == 1;

            $created_count = $this->Test->generate_test_users( $count, $make_active, $generate_locations );

            ClassAdminSettings::add_message(
                sprintf( __( 'Generated %d subscribers.', 'community-directory' ), $created_count )
            );
        }
    }
}