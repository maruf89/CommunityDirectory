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

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

/**
 * ClassSettingsLocation.
 */
class ClassSettingsLocation extends AbstractClassSettingsPage {

    private $settings;

    private $edit_display_name = 'display_name-';
    private $edit_display_name_new = 'new_location-';

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
        add_action( 'community_directory_settings_save_edit_location_list', array( $this, 'save_edit_location' ) );
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
                        'attr' => array( 'class="edit-locations-table form-table"' ),
                        'desc'  => __( 'Edit existing locations or add new ones', 'community-directory' ),
                        'desc_tip' => true,
                    ),
                    array(
                        'name' => __( 'Edit Locations', 'community-directory' ),
                        'desc'     => __( 'These are the locations currently active and selectable', 'community-directory' ),
                        'id'    => 'edit_location',
                        'type'  => 'edit_location_list',
                        'desc'  => __( 'temp', 'community-directory' ),
                        'desc_tip' => true,
                    ),
                    array( 'type' => 'sectionend', 'id' => 'edit_options' ),
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
                    array( 'type' => 'sectionend' ),
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

    private function is_loc_active( $status, $ifTrue = true, $ifFalse = false ) {
        return $status === COMMUNITY_DIRECTORY_ENUM_ACTIVE ? $ifTrue : $ifFalse;
    }

    /**
     * Save settings.
     */
    public function save() {
        global $current_section;

        $settings = $this->get_settings( $current_section );
        
        if ( $current_section === 'edit' ) do_action( 'community_directory_settings_save_edit_location_list' );
        else ClassAdminSettings::save_fields( $settings );
    }

    public function output_location_list( $value ) {
        $locations = community_directory_get_locations(
            $value['status'] === COMMUNITY_DIRECTORY_ENUM_ACTIVE, false, false
        );

        ?>
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

    }

    public function output_edit_location_list( $value ) {
        $locations = community_directory_get_locations();

        ?>
                  <tr>
                    <th><?= __( 'Location', 'community-directory' ) ?></th>
                    <th><?= __( 'Slug', 'community-directory' ) ?></th>
                    <th><?= __( 'Active', 'community-directory' ) ?></th>
                    <th><?= __( 'Active Inhabitants', 'community-directory' ) ?></th>
                    <th style="position:relative">
                        <span class="table-add">
                            <span><?= __( 'Insert Location', 'community-directory' ) ?>
                            <span class="dashicons dashicons-plus"></span>
                        </span>
                    </th>
                  </tr>

                <?php

                    foreach ( $locations as $location ): ?>

                        <tr class="location-row" data-location-id="<?= $location->id ?>">
                            <td>
                                <input  type="text"
                                        name="display_name[<?= $location->id ?>]" 
                                        class="edit-name edit-field" 
                                        data-original-value="<?= $location->display_name ?>"
                                        value="<?= $location->display_name ?>" /></td>
                            <td class="slug-value"><?= $location->slug ?></td>
                            <td>
                                <select class="edit-status edit-field"
                                        name="status[<?= $location->id ?>]"
                                        data-original-value="<?= $location->status ?>"
                                        value=<?= $location->status ?>>
                                    <option value="<?= COMMUNITY_DIRECTORY_ENUM_ACTIVE ?>"
                                            <?= $this->is_loc_active( $location->status, 'selected', '') ?>>
                                                <?= __( 'Active', 'community-directory' ) ?>
                                    </option>
                                    <option value="<?= COMMUNITY_DIRECTORY_ENUM_PENDING ?>"
                                            <?= $this->is_loc_active( $location->status, '', 'selected') ?>>
                                        <?= __( 'Pending', 'community-directory' ) ?>
                                    </option>
                                </select>
                            </td>
                            <td><?= $location->active_inhabitants ?></td>
                            <td>
                              <span class="table-remove dashicons dashicons-remove"></span>
                            </td>
                        </tr>

                    <?php endforeach;

                ?>

                  
                  <!-- This is our clonable table line -->
                  <tr class="hide location-row">
                    <td>
                        <input  type="text"
                                name="new_loc_display_name[]" 
                                class="edit-name edit-field"
                                placeholder="<?=__( 'New Place', 'community-directory' ) ?>"
                                value="" /></td>
                    <td>–––</td>
                    <td>
                        <select class="edit-status edit-field"
                                name="new_loc_status[]">
                            <option value="<?= COMMUNITY_DIRECTORY_ENUM_ACTIVE ?>"><?= __( 'Active', 'community-directory' ) ?></option>
                            <option value="<?= COMMUNITY_DIRECTORY_ENUM_PENDING ?>" selected><?= __( 'Pending', 'community-directory' ) ?></option>
                        </select>
                    </td>
                    <td>0</td>
                    <td>
                      <span class="table-remove dashicons dashicons-remove"></span>
                    </td>
                  </tr>
        <?php
    }

    public function save_edit_location() {
        $array_ignore = array( '_wpnonce', '_wp_http_referer' );
        $data = $_POST;

        if ( empty( $data ) ) {
            return false;
        }

        // Preapre Update Locations Data
        $merged_update_arr = array();
        if ( isset( $data['display_name'] ) )
            foreach ( $data['display_name'] as $id => $display_name ) {
                if ( !isset( $merged_update_arr[$id] ) ) $merged_update_arr[$id] = array();
                $merged_update_arr[$id]['display_name'] = $display_name;
            }

        if ( isset( $data['status'] ) )
            foreach ( $data['status'] as $id => $status ) {
                if ( !isset( $merged_update_arr[$id] ) ) $merged_update_arr[$id] = array();
                $merged_update_arr[$id]['status'] = $status;
            }

        // Prepare Create Locations Data
        $merged_create_arr = array();
        if ( isset ( $data['new_loc_display_name'] ) )
            foreach ( $data['new_loc_display_name'] as $id => $display_name ){
                $merged_create_arr[$id] = array(
                    'display_name' => $display_name
                );
            }
            
        if ( isset ( $data['new_loc_status'] ) )
            foreach ( $data['new_loc_status'] as $id => $status ){
                // Cannot create new location without an existing display_name set
                if ( !isset( $merged_create_arr[$id] ) ) continue;
                $merged_create_arr[$id]['status'] = $status;
            }

        // Will hold the messages for each kind of change
        $updated_message_arr = array();
        
        if ( count( $merged_update_arr ) ) {
            $updated_loc_count = community_directory_update_locations( $merged_update_arr );
            array_push( $updated_message_arr, sprintf( __( 'Updated %d location(s)', 'community-directory' ), $updated_loc_count ) );
        }
        
        $created_loc_count = count( $merged_create_arr );
        if ( $created_loc_count ) {
            do_action( 'community_directory_create_locations', $merged_create_arr );
            array_push( $updated_message_arr, sprintf( __( 'Created %d location(s)', 'community-directory' ), $created_loc_count ) );
        }

        if ( count( $updated_message_arr ) )
            ClassAdminSettings::add_message( implode( __( ' and ', 'community-directory' ), $updated_message_arr ) );
    }
}