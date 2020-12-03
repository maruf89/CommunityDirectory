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
    public static $field_location_name_key = 'field_cd_entity_location_name';
    public static $field_location_name = 'entity_location_name';
    public static $field_is_active_key = 'field_cd_profile_active';
    public static $field_is_active = 'profile_active';

    private static $instance;

    public static function get_instance() {
        if (self::$instance == null) {
            self::$instance = new ClassACF();
        }

        return self::$instance;
    }

    /**
     * This method gets fired during plugin activation.
     *
     * @since       2020.11
     * @package     community-directory
     * @return      void
     */
    public static function initiate_plugin() {
        // if form already exists, do nothing
        if ( acf_get_field_group_post( self::$form_group_key ) ) return;

        $result = acf_import_field_group(array(
            'key' => self::$form_group_key,
            'title' => __( 'Community Directory Form', 'community-directory' ),
            'fields' => apply_filters( 'community_directory_required_acf_fields', array() ),
            'location' => array (
                array (
                    array (
                        'param' => 'post_type',
                        'operator' => '==',
                        'value' => ClassEntity::$post_type,
                    ),
                ),
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
            'key' => 'field_cd_user_about',
			'label' => __( 'Bio', 'community-directory' ),
			'name' => 'user_about',
			'type' => 'textarea',
			'instructions' => __( 'Write something about yourself or about your place. Don\'t know what to write about? Write about what you do, the history of your place, or what you would like to see more of around you.', 'community-directory' ),
			'required' => 0,
			'wrapper' => array(
				'class' => 'cd-text-area',
			),
			'maxlength' => '2000',
        );

        $fields_arr[] = array(
            'key' => 'field_cd_contact_email',
			'label' => __( 'Contact Email', 'community-directory' ),
			'name' => 'contact_email',
			'type' => 'email',
			'instructions' => __( 'Add an e-mail by which others can reach you.', 'community-directory' ),
			'wrapper' => array(
				'class' => 'cd-email cd-text',
			),
			'placeholder' => __( 'email@example.com', 'community-directory' ),
        );

        $fields_arr[] = array(
            'key' => 'field_cd_contact_tel',
			'label' => __( 'Contact Telephone', 'community-directory' ),
			'name' => 'contact_tel',
			'type' => 'number',
			'instructions' => __( 'Add a phone number by which you can be reached.', 'community-directory' ),
			'wrapper' => array(
				'class' => 'cd-number cd-text',
			),
			'placeholder' => __( '248-851-6979', 'community-directory' ),
        );

        $fields_arr[] = array(
            'key' => 'field_cd_offering',
			'label' => __( 'Offering', 'community-directory' ) ,
			'name' => 'offering',
			'type' => 'true_false',
			'instructions' => __( 'Do you offer a product, service, or anything people may find useful?', 'community-directory' ),
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => 'cd-number cd-text',
				'id' => '',
			),
			'message' => '',
			'default_value' => 0,
			'ui' => 0,
			'ui_on_text' => '',
			'ui_off_text' => '',
        );

        $fields_arr[] = array(
			'key' => 'field_cd_offering_category',
			'label' => __( 'Offering Category', 'community-directory' ),
			'name' => 'offering_category',
			'type' => 'taxonomy',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => array(
				array(
					array(
						'field' => 'field_cd_offering',
						'operator' => '==',
						'value' => '1',
					),
				),
			),
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'taxonomy' => 'category',
			'field_type' => 'checkbox',
			'add_term' => 1,
			'save_terms' => 1,
			'load_terms' => 0,
			'return_format' => 'id',
			'multiple' => 0,
			'allow_null' => 0,
        );

		$fields_arr[] = array(
			'key' => 'field_cd_offering_description',
			'label' => __( 'Offering Description', 'community-directory' ),
			'name' => 'offering_description',
			'type' => 'wysiwyg',
			'instructions' => __( 'Write a description of the offer or service for your potential clients or customers', 'community-directory' ),
			'required' => 0,
			'conditional_logic' => array(
				array(
					array(
						'field' => 'field_cd_offering',
						'operator' => '==',
						'value' => '1',
					),
				),
			),
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'default_value' => '',
			'tabs' => 'all',
			'toolbar' => 'full',
			'media_upload' => 1,
			'delay' => 0,
        );

		$fields_arr[] = array(
			'key' => 'field_cd_share_location',
			'label' => __( 'Share My Location', 'community-directory' ),
			'name' => 'share_my_location',
			'type' => 'true_false',
			'instructions' => __( 'Do you want to share your location with others?', 'community-directory' ),
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'message' => '',
			'default_value' => 0,
			'ui' => 0,
			'ui_on_text' => '',
			'ui_off_text' => '',
        );

		$fields_arr[] = array(
			'key' => 'field_cd_gmap_location',
			'label' => __( 'Your Location', 'community-directory' ),
			'name' => 'your_location',
			'type' => 'google_map',
			'instructions' => '',
			'required' => 1,
			'conditional_logic' => array(
				array(
					array(
						'field' => 'field_cd_share_location',
						'operator' => '==',
						'value' => '1',
					),
				),
			),
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'center_lat' => '',
			'center_lng' => '',
			'zoom' => '',
			'height' => '',
		);


        return $fields_arr;
    }

    /**
     * Creates a user's initial field data in the ACF user meta db
     *
     * @param       $entity_data        ARRAY_A     requires: 'first_name', 'last_name', 'entity_id' (post_id)
     */
    public static function initiate_entity( $entity_data ) {
        // turn array vars into accessable vars
        extract( $entity_data );

        $update_values = array();
        $update_values[self::$field_location_name_key] =
            community_directory_generate_display_name_from_user_name( $first_name, $last_name );
        $update_values[self::$field_is_active_key] = 'false';

        acf_update_values( $update_values, $entity_id );
    }

    public static function update_entity( $entity_post_id, $entity_data ) {
        acf_update_values( $entity_data, $entity_post_id );
    }

}