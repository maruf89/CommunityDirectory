<?php
/**
 * UsersWP General Settings
 *
 * @author      AyeCode
 * @category    Admin
 * @package     userswp/Admin
 * @version     1.0.24
 */

namespace Maruf89\CommunityDirectory\Admin\Settings;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

/**
 * ClassSettingsLocation.
 */
class ClassSettingsLocation extends AbstractClassSettingsPage {

    private $settings;

    /**
     * Constructor.
     */
    public function __construct() {
        $this->id    = 'location';
        $this->label = __( 'Locations', 'community-directory' );

        add_filter( 'community_directory_settings_tabs_array', array( $this, 'add_settings_page' ), 20 );
        add_action( 'community_directory_settings_' . $this->id, array( $this, 'output' ) );
        // add_action( 'community_directory_sections_' . $this->id, array( $this, 'output_toggle_advanced' ) );
        add_action( 'community_directory_settings_save_' . $this->id, array( $this, 'save' ) );
        add_action( 'community_directory_sections_' . $this->id, array( $this, 'output_sections' ) );
        add_action( 'community_directory_admin_field_location_list', array( $this, 'output_location_list' ) );
        add_action( 'community_directory_admin_field_edit_location_list', array( $this, 'output_edit_location_list' ) );
    }

    /**
     * Output the settings.
     */
    public function output() {
        global $current_section;

        $this->settings = $this->get_settings( $current_section );

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
            case 'edit':
                $settings = array(
                    array(
                        'title' => $title,
                        'type'  => 'title',
                        'desc'  => __( 'Edit existing locations or add new ones', 'community-directory' ),
                        'desc_tip' => true,
                    ),
                    array(
                        'name' => __( 'Edit Locations', 'community-directory' ),
                        'desc'     => __( 'These are the locations currently active and selectable', 'community-directory' ),
                        'type'  => 'edit_location_list',
                        'desc'  => __( 'temp', 'community-directory' ),
                        'desc_tip' => true,
                    ),
                );
                break;
            default:
                $settings = array(
                    array(
                        'title' => $title,
                        'type'  => 'title',
                        'desc'  => 'Everything dealing with locations',
                        'desc_tip' => true,
                    ),
                    array(
                        'name'     => __( 'Locations', 'community-directory' ),
                        'desc'     => __( 'These are the locations currently active and selectable', 'community-directory' ),
                        'id'       => 'locations',
                        'type'     => 'location_list',
                        'status'   => community_directory_status_to_enum( $current_section ),
                        'desc_tip' => true,
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
            ''      => __( 'Active Locations', 'community-directory' ),
            'pending'      => __( 'Pending Locations', 'community-directory' ),
            'edit'      => __( 'Edit Locations', 'community-directory' ),
        );

        return apply_filters( 'community_directory_get_sections_' . $this->id, $sections );
    }


    /**
     * Save settings.
     */
    public function save() {
        global $current_section;

        $settings = $this->get_settings( $current_section );
        ClassAdminSettings::save_fields( $settings );
    }

    public function output_location_list( $value ) {
        $locations = community_directory_get_locations( $value['status'] );

        ?>
            <table id="locationList">
                <tr>
                    <th><?= __( 'Location', 'community-directory' );?></th>
                    <th><?= __( 'Slug', 'community-directory' );?></th>
                    <th><?= __( 'Active Inhabitants', 'community-directory' );?></th>
                </tr>
        <?php

        foreach ( $locations as $location ): ?>

                <tr data-location-id="<?= $location->id ?>">
                    <td><?= $location->display_name ?></td>
                    <td><?= $location->slug ?></td>
                    <td><?= $location->active_inhabitants ?></td>
                </tr>

        <?php endforeach;

        ?>
            </table>
        <?php
    }

    public function output_edit_location_list( $value ) {
        $locations = community_directory_get_locations();

        ?>
            <div id="<?=$value['id']?>" class="table-editable">
                <span class="table-add dashicons dashicons-plus"></span>
                <table class="table">
                  <tr>
                    <th><?= __( 'Location', 'community-directory' );?></th>
                    <th><?= __( 'Slug', 'community-directory' );?></th>
                    <th><?= __( 'Active Inhabitants', 'community-directory' );?></th>
                    <th></th>
                  </tr>

                <?php

                    foreach ( $locations as $location ): ?>

                        <tr data-location-id="<?= $location->id ?>">
                            <td contenteditable="true"><?= $location->display_name ?></td>
                            <td contenteditable="true"><?= $location->slug ?></td>
                            <td contenteditable="true"><?= $location->active_inhabitants ?></td>
                            <td>
                              <span class="table-remove dashicons dashicons-remove"></span>
                            </td>
                        </tr>

                    <?php endforeach;

                ?>

                  
                  <!-- This is our clonable table line -->
                  <tr class="hide">
                    <td contenteditable="true">Untitled</td>
                    <td contenteditable="true">undefined</td>
                    <td contenteditable="true">0</td>
                    <td>
                      <span class="table-remove dashicons dashicons-remove"></span>
                    </td>
                  </tr>
                </table>
            </div>
        <?php
    }
}