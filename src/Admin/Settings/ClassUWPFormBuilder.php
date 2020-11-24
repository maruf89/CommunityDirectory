<?php

namespace Maruf89\CommunityDirectory\Admin\Settings;
 
/**
 * The UsersWP custom field form builder functionaly of the plugin.
 * 
 * Registers custom predefined fields
 *
 * @since      0.0.1
 *
 * @package    community-directory
 * @subpackage community-directory/includes
 */
class ClassUWPFormBuilder {

    public static $community_directory_location_name = 'community_directory_location';
    public static $location_not_listed_name = 'location_not_listed';
    public static $new_location_name = 'new_location';

    public static function load_uwp_form_fields( $custom_fields, $type ) {
        $custom_fields['community_directory_location'] = array( // The key value should be unique and not contain any spaces.
            'field_type'  =>  'locationselect',
            'class'       =>  'community-directory-location',
            'icon'        =>  'location',
            'name'        =>  __( 'Community Directory Location', 'community-directory' ),
            'description' =>  __( 'Adds an input for Location field.', 'community-directory' ),
            'defaults'    => array(
                'admin_title'         =>  'Location',
                'site_title'          =>  'Location',
                'htmlvar_name'        =>  'community_directory_location',
                'is_active'           =>  1,
                'default_value'       =>  '',
                'is_required'         =>  0,
                'option_values'       =>  __( 'Options will be generated automatically', 'community-directory' ),
                'required_msg'        =>  '',
                'field_icon'          =>  'location',
                'css_class'           =>  ''
            )
        );

        return $custom_fields;
    }
    
 }