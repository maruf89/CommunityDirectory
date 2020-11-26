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
 * ClassSettingsTags.
 */
class ClassSettingsTags extends AbstractClassSettingsPage {

    private $settings;

    private $edit_display_name = 'display_name-';
    private $edit_display_name_new = 'new_tag-';

    /**
     * Constructor.
     */
    public function __construct() {
        $this->id    = 'tag';
        $this->label = __( 'Tags', 'community-directory' );

        add_filter( 'community_directory_settings_tabs_array', array( $this, 'add_settings_page' ), 20 );
        add_action( 'community_directory_settings_' . $this->id, array( $this, 'output' ) );
        // add_action( 'community_directory_sections_' . $this->id, array( $this, 'output_toggle_advanced' ) );
        add_action( 'community_directory_settings_save_' . $this->id, array( $this, 'save' ) );
        add_action( 'community_directory_sections_' . $this->id, array( $this, 'output_sections' ) );
        add_action( 'community_directory_admin_field_tag_list', array( $this, 'output_tag_list' ) );
        add_action( 'community_directory_admin_field_edit_tag_list', array( $this, 'output_edit_tag_list' ) );
        add_action( 'community_directory_settings_save_edit_tag_list', array( $this, 'save_edit_tag' ) );
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
                        'attr' => array( 'class="edit-tags-table form-table"' ),
                        'desc'  => __( 'Edit existing tags or add new ones', 'community-directory' ),
                        'desc_tip' => true,
                    ),
                    array(
                        'name' => __( 'Edit Tags', 'community-directory' ),
                        'desc'     => __( 'These are the tags currently active and selectable', 'community-directory' ),
                        'id'    => 'edit_tag',
                        'type'  => 'edit_tag_list',
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
                        'desc'  => 'Everything dealing with tags',
                        'desc_tip' => true,
                    ),
                    array(
                        'name'     => __( 'Tags', 'community-directory' ),
                        'desc'     => __( 'These are the tags currently active and selectable', 'community-directory' ),
                        'id'       => 'tags',
                        'type'     => 'tag_list',
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
            ''      => __( 'Tags', 'community-directory' ),
            'edit'      => __( 'Edit Tags', 'community-directory' ),
        );

        return apply_filters( 'community_directory_get_sections_' . $this->id, $sections );
    }

    /**
     * Save settings.
     */
    public function save() {
        global $current_section;

        $settings = $this->get_settings( $current_section );
        
        if ( $current_section === 'edit' ) do_action( 'community_directory_settings_save_edit_tag_list' );
        else ClassAdminSettings::save_fields( $settings );
    }

    public function output_tag_list( $value ) {
        $tags = community_directory_get_tags( $value['status'] );

        ?>
            <tr>
                <th><?= __( 'Location', 'community-directory' );?></th>
                <th><?= __( 'Slug', 'community-directory' );?></th>
                <th><?= __( 'Active Inhabitants', 'community-directory' );?></th>
            </tr>
        <?php

        foreach ( $tags as $tag ): ?>

            <tr data-tag-id="<?= $tag->id ?>">
                <td><?= $tag->display_name ?></td>
                <td><?= $tag->slug ?></td>
                <td><?= $tag->active_inhabitants ?></td>
            </tr>

        <?php endforeach;
    }

    public function output_edit_tag_list( $value ) {
        $tags = community_directory_get_tags();

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

                    foreach ( $tags as $tag ): ?>

                        <tr class="tag-row" data-tag-id="<?= $tag->id ?>">
                            <td>
                                <input  type="text"
                                        name="display_name[<?= $tag->id ?>]" 
                                        class="edit-name edit-field" 
                                        data-original-value="<?= $tag->display_name ?>"
                                        value="<?= $tag->display_name ?>" /></td>
                            <td class="slug-value"><?= $tag->slug ?></td>
                            <td>
                                <select class="edit-status edit-field"
                                        name="status[<?= $tag->id ?>]"
                                        data-original-value="<?= $tag->status ?>"
                                        value=<?= $tag->status ?>>
                                    <option value="<?= COMMUNITY_DIRECTORY_ENUM_ACTIVE ?>"
                                            <?= $this->is_loc_active( $tag->status, 'selected', '') ?>>
                                                <?= __( 'Active', 'community-directory' ) ?>
                                    </option>
                                    <option value="<?= COMMUNITY_DIRECTORY_ENUM_PENDING ?>"
                                            <?= $this->is_loc_active( $tag->status, '', 'selected') ?>>
                                        <?= __( 'Pending', 'community-directory' ) ?>
                                    </option>
                                </select>
                            </td>
                            <td><?= $tag->active_inhabitants ?></td>
                            <td>
                              <span class="table-remove dashicons dashicons-remove"></span>
                            </td>
                        </tr>

                    <?php endforeach;

                ?>

                  
                  <!-- This is our clonable table line -->
                  <tr class="hide tag-row">
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

    public function save_edit_tag() {
        $array_ignore = array( '_wpnonce', '_wp_http_referer' );
        $data = $_POST;

        if ( empty( $data ) ) {
            return false;
        }

        // Preapre Update Tags Data
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

        // Prepare Create Tags Data
        $merged_create_arr = array();
        if ( isset ( $data['new_loc_display_name'] ) )
            foreach ( $data['new_loc_display_name'] as $id => $display_name ){
                $merged_create_arr[$id] = array(
                    'display_name' => $display_name
                );
            }
            
        if ( isset ( $data['new_loc_status'] ) )
            foreach ( $data['new_loc_status'] as $id => $status ){
                // Cannot create new tag without an existing display_name set
                if ( !isset( $merged_create_arr[$id] ) ) continue;
                $merged_create_arr[$id]['status'] = $status;
            }

        // Will hold the messages for each kind of change
        $updated_message_arr = array();

        $updated_loc_count = count( $merged_update_arr );
        if ( $updated_loc_count ) {
            do_action( 'community_directory_update_tags', $merged_update_arr );
            array_push( $updated_message_arr, sprintf( __( 'Updated %d tag(s)', 'community-directory' ), $updated_loc_count ) );
        }
        
        $created_loc_count = count( $merged_create_arr );
        if ( $created_loc_count ) {
            do_action( 'community_directory_create_tags', $merged_create_arr );
            array_push( $updated_message_arr, sprintf( __( 'Created %d tag(s)', 'community-directory' ), $created_loc_count ) );
        }

        if ( count( $updated_message_arr ) )
            ClassAdminSettings::add_message( implode( __( ' and ', 'community-directory' ), $updated_message_arr ) );
    }
}