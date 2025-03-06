<?php
/**
 * UsersWP General Settings
 *
 * @author      Marius Miliunas
 * @category    Admin
 * @package     community-directory/Admin
 * @version     2020.11
 */

namespace Maruf89\CommunityDirectory\Admin\Settings;

use Maruf89\CommunityDirectory\Includes\ClassEntity;
use Maruf89\CommunityDirectory\Includes\instances\Entity;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

/**
 * ClassSettingsEntity.
 */
class ClassSettingsEntity extends AbstractClassSettingsPage {

    private $settings;

    // private $edit_display_name = 'display_name-';
    // private $edit_display_name_new = 'new_entity-';

    /**
     * Constructor.
     */
    public function __construct() {
        $this->id    = 'entity';
        $this->label = __( 'Entities', 'community-directory' );

        add_filter( 'community_directory_settings_tabs_array', array( $this, 'add_settings_page' ), 20 );
        add_action( 'community_directory_settings_' . $this->id, array( $this, 'output' ) );
        add_action( 'community_directory_settings_save_' . $this->id, array( $this, 'save' ) );
        add_action( 'community_directory_sections_' . $this->id, array( $this, 'output_sections' ) );
        add_action( 'community_directory_admin_field_entity_list', array( $this, 'output_entity_list' ) );
        add_action( 'community_directory_admin_field_entityless_users_list', array( $this, 'output_entityless_users_list' ) );
    }

    /**
     * Output the settings.
     */
    public function output() {
        global $current_section, $community_directory_hide_save_button;

        $this->settings = $this->get_settings( $current_section );

        $community_directory_hide_save_button = true;

        ClassAdminSettings::output_fields( $this->settings );
    }

    /**
     * Get general settings array.
     *
     * @return array
     */
    public function get_settings( $current_section = '' ) {
        $settings = array();

        $title = $this->get_sections()[$current_section];

        switch ($current_section) {
            case 'entityless':
                $settings = array(
                    array(
                        'name' => __( 'Entityless Users', 'community-directory' ),
                        'desc'     => __( 'These are all of the users without entities', 'community-directory' ),
                        'id'    => 'entityless_users_list',
                        'type'  => 'entityless_users_list',
                    ),
                );
                break;
            default:
                $cur = empty( $current_section ) ? 'all' : $current_section;

                $settings = array(
                    array(
                        'name' => __( 'All Entities', 'community-directory' ),
                        'desc'     => __( 'These are all of the entities', 'community-directory' ),
                        'id'    => "${cur}_entities",
                        'type'  => 'entity_list',
                        'type_display' => $current_section,
                    ),
                );
                break;
        }

        

        return apply_filters( 'community_directory_get_settings_' . $this->id, $settings );
    }

    /**
     * Get sections.
     *
     * @return array
     */
    public function get_sections() {

        $sections = array(
            ''      => __( 'All Entities', 'community-directory' ),
            'active'      => __( 'Active Entities', 'community-directory' ),
            'inactive'      => __( 'Inactive Entities', 'community-directory' ),
            'entityless'      => __( 'Entityless Users', 'community-directory' ),
        );

        return apply_filters( 'community_directory_get_sections_' . $this->id, $sections );
    }

    /**
     * Save settings.
     */
    public function save() {
        global $current_section;

        $settings = $this->get_settings( $current_section );
        
        // if ( $current_section === 'options' )
        //     do_action( 'community_directory_settings_save_entity_options' );
    }
    
    public function output_entity_list( $value ) {
        $wp_list_table = new ClassEntityListTable( $this->id, $value['type_display'] );
        $wp_list_table->prepare_items();

        //Table of elements
        $wp_list_table->display();
    }

    public function output_entityless_users_list() {
        $wp_list_table = new ClassEntitylessUserListTable();
        $wp_list_table->prepare_items();

        //Table of elements
        $wp_list_table->display();
    }
}