<?php
/**
 * 
 * This class creates the ACF form groups with the required fields and so on…
 *
 * @since      1.0.0
 * @author     Marius Miliunas
 */

namespace Maruf89\CommunityDirectory\Includes;

class ClassACF {

    public static $form_group_key = 'group_community_directory';
    public static $field_location_name_key = 'field_cd_location_name';
    public static $field_location_name = 'location_name';
    public static $field_is_active_key = 'field_cd_profile_active';
    public static $field_is_active = 'profile_active';

    /**
     * This method gets fired during plugin activation.
     *
     * @since       2020.11
     * @package     community-directory
     * @return      void
     */
    public function __construct() {
        add_action( 'acf/init', array( $this, 'initiate_plugin' ) );
        add_action( 'community_directory_acf_initiate_entity', array( $this, 'initiate_user' ) );

        add_filter( 'community_directory_required_acf_fields', array( $this, 'generate_required_fields' ), 10, 1 );
    }

    public static function initiate_plugin() {
        // if form already exists, do nothing
        if ( acf_get_field_group_post( self::$form_group_key ) ) return;

        $result = acf_import_field_group(array(
            'key' => self::$form_group_key,
            'title' => __( 'Community Directory Form', 'community-directory' ),
            'fields' => apply_filters( 'community_directory_required_acf_fields', array() ),
            'location' => array (
                // array (
                //     array (
                //         'param' => 'post_type',
                //         'operator' => '==',
                //         'value' => 'post',
                //     ),
                // ),
            ),
            'menu_order' => 0,
            'position' => 'normal',
            'style' => 'default',
            'label_placement' => 'top',
            'instruction_placement' => 'label',
            'hide_on_screen' => array(
                0 => 'permalink',
                1 => 'excerpt',
                2 => 'discussion',
                3 => 'comments',
                4 => 'revisions',
                5 => 'slug',
                6 => 'author',
                7 => 'format',
                8 => 'page_attributes',
                9 => 'categories',
                10 => 'tags',
                11 => 'send-trackbacks',
            ),
            'active' => true,
            'description' => __( 'The Community Directory generated form.', 'community-directory' ),
        ));

        if ( !$result ) {
            die( 'ERROR: creating ACF form field for Community Directory in ClassACF.php' );
        }
    }

    public static function generate_required_fields( $fields_arr ) {
        $fields_arr[] = array(
            'key'       => self::$field_is_active_key,
			'label'     => __( 'Profile Active', 'community-directory' ),
			'name'      => 'profile_active',
			'type'      => 'radio',
			'instructions' => __( 'Select \'Active\' to make your profile visible. If \'Inactive\', your profile will not be visible to others.', 'community-directory' ),
			'required' => 1,
			'choices'   => array(
				'true'      => __( 'Active', 'community-directory' ),
				'false'     => __( 'Inactive', 'community-directory' ),
			),
			'allow_null' => 0,
			'other_choice' => 0,
			'default_value' => 'false',
			'layout' => 'horizontal',
			'return_format' => 'value',
			'save_other_choice' => 0,
        );

        $fields_arr[] = array(
            'key' => self::$field_location_name_key,
			'label' => __( 'Location Name', 'community-directory' ),
			'name' => 'location_name',
			'type' => 'text',
			'instructions' => __( 'Does your place have a name? If not, your first name will be shown.', 'community-directory' ),
			'required' => 1,
			'wrapper' => array(
				'class' => 'cd-text',
			),
			'conditional_logic' => 0,
			'default_value' => '',
			'placeholder' => __( 'Hillsdale Farms', 'community-directory' ),
			'prepend' => '',
			'append' => '',
			'maxlength' => '50',
        );

        $fields_arr[] = array(
            'key' => 'field_cd_profile_picture',
			'label' => __( 'Profile Picture', 'community-directory' ),
			'name' => 'profile_picture',
			'type' => 'image',
			'instructions' => __( 'Upload a photo of your place, which will be displayed on your profile', 'community-directory' ),
			'required' => 0,
			'wrapper' => array(
				'class' => 'cd-image',
			),
			'conditional_logic' => 0,
			'return_format' => 'array',
			'preview_size' => 'medium',
			'library' => 'all',
			'min_width' => 300,
			'min_height' => 300,
			'min_size' => '',
			'max_width' => '',
			'max_height' => '',
			'max_size' => 15,
			'mime_types' => 'jpg,jpeg,png,gif',
        );

        $fields_arr[] = array(
            'key' => 'field_cd_user_about',
			'label' => 'Apie Mus',
			'name' => 'user_about',
			'type' => 'textarea',
			'instructions' => __( 'Write something about yourself or about your place. Don\'t know what to write about? Write about what you do, the history of your place, or what you would like to see more of around you.', 'community-directory' ),
			'required' => 0,
			'wrapper' => array(
				'class' => 'cd-text-area',
			),
			'maxlength' => '2000',
        );


        return $fields_arr;
    }

    public static function generate_loc_name_from_user_name( $first, $last ) {
        $l = substr( $last, 0, 1 ) . '.';
        return "$first $l";
    }

    /**
     * Creates a user's initial field data in the ACF user meta db
     * 
     * @param       $user_id        a_array     requires: 'first_name', 'last_name', 'user_id'
     */
    public static function initiate_user( $user_data ) {
        // turn array vars into accessable vars
        extract( $user_data );

        $update_values = array();
        $update_values[self::$field_location_name_key] =
            self::generate_loc_name_from_user_name( $first_name, $last_name );
        $update_values[self::$field_is_active_key] = 'false';
        
        acf_update_values( $update_values, "user_{$user_id}" );
    }

}