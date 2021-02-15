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

    /////// Entity field keys and field names
    public static $entity_form_group_key = 'group_community_directory_entity';
    public static $entity_location_name_key = 'field_cd_entity_location_name';
    public static $entity_location_name = 'entity_location_name';
    public static $entity_active_key = 'field_cd_entity_active';
    public static $entity_active = 'entity_active';
    public static $entity_picture_key = 'field_cd_entity_picture';
    public static $entity_picture = 'entity_picture';
    public static $entity_about_key = 'field_cd_entity_about';
    public static $entity_about = 'entity_about';
    public static $entity_contact_method_key = 'field_cd_entity_contact_method';
    public static $entity_contact_method = 'entity_contact_method';
    public static $entity_email_key = 'field_cd_entity_email';
    public static $entity_email = 'entity_email';
    public static $entity_tel_key = 'field_cd_entity_tel';
    public static $entity_tel = 'entity_tel';
    public static $entity_website_key = 'field_cd_entity_website';
    public static $entity_website = 'entity_website';
    public static $entity_facebook_key = 'field_cd_entity_facebook';
    public static $entity_facebook = 'entity_facebook';
    public static $entity_youtube_key = 'field_cd_entity_youtube';
    public static $entity_youtube = 'entity_youtube';
    public static $entity_share_loc_key = 'field_cd_entity_share_loc';
    public static $entity_share_loc = 'entity_share_loc';
    public static $entity_visit_info_key = 'field_cd_entity_visit_info';
    public static $entity_visit_info = 'entity_visit_info';
    public static $entity_gmap_loc_key = 'field_cd_entity_gmap_loc';
    public static $entity_gmap_loc = 'entity_gmap_loc';

    /////// Offers & Needs field keys and field names
    public static $offers_needs_form_group_key = 'group_community_directory_offers_needs';
    public static $offers_needs_active_key = 'field_cd_offer_need_active';
    public static $offers_needs_active = 'offer_need_active';
    public static $offers_needs_product_or_service_key = 'field_cd_offer_need_product_or_service';
    public static $offers_needs_product_or_service = 'offer_need_product_or_service';
    public static $offers_needs_type_key = 'field_cd_offer_need_type';
    public static $offers_needs_type = 'offer_need_type';
    public static $offers_needs_description_key = 'field_cd_offer_need_description';
    public static $offers_needs_description = 'offer_need_description';
    public static $offers_needs_compensation_type_key = 'field_cd_offer_need_compensation_type';
    public static $offers_needs_compensation_type = 'offer_need_compensation_type';
    public static $offers_needs_compensation_key = 'field_cd_offer_need_compensation';
    public static $offers_needs_compensation = 'offer_need_compensation';
    public static $offers_needs_urgency_key = 'field_cd_offer_need_urgency';
    public static $offers_needs_urgency = 'offer_need_urgency';
    public static $offers_needs_image_key = 'field_cd_offer_need_image';
    public static $offers_needs_image = 'offer_need_image';
    public static $offers_needs_attachment_key = 'field_cd_offer_need_attachment';
    public static $offers_needs_attachment = 'offer_need_attachment';

    /////// Offers & Needs field keys and field names
    public static $projects_form_group_key = 'group_community_directory_projects';
    public static $projects_active_key = 'field_cd_project_active';
    public static $projects_active = 'project_active';
    public static $projects_description_key = 'field_cd_project_description';
    public static $projects_description = 'project_description';
    public static $projects_urgency_key = 'field_cd_project_urgency';
    public static $projects_urgency = 'project_urgency';
    public static $projects_image_key = 'field_cd_project_image';
    public static $projects_image = 'project_image';
    public static $projects_attachment_key = 'field_cd_project_attachment';
    public static $projects_attachment = 'project_attachment';

    private static $instance;

    public static function get_instance() {
        if (self::$instance == null) {
            self::$instance = new ClassACF();
        }

        return self::$instance;
    }

    public static function export_field_names():array {
        return array(
            'entity' => [
                'location_name_key' => static::$entity_location_name_key,
                'location_name' => static::$entity_location_name,
                'active_key' => static::$entity_active_key,
                'active' => static::$entity_active,
                'picture_key' => static::$entity_picture_key,
                'picture' => static::$entity_picture,
                'about_key' => static::$entity_about_key,
                'about' => static::$entity_about,
                'contact_method_key' => static::$entity_contact_method_key,
                'contact_method' => static::$entity_contact_method,
                'email_key' => static::$entity_email_key,
                'email' => static::$entity_email,
                'tel_key' => static::$entity_tel_key,
                'tel' => static::$entity_tel,
                'website_key' => static::$entity_website_key,
                'website' => static::$entity_website,
                'facebook_key' => static::$entity_facebook_key,
                'facebook' => static::$entity_facebook,
                'youtube_key' => static::$entity_youtube_key,
                'youtube' => static::$entity_youtube,
                'share_loc_key' => static::$entity_share_loc_key,
                'share_loc' => static::$entity_share_loc,
                'visit_info_key' => static::$entity_visit_info_key,
                'visit_info' => static::$entity_visit_info,
                'gmap_loc_key' => static::$entity_gmap_loc_key,
                'gmap_loc' => static::$entity_gmap_loc,
            ],
            'offers_needs' => [
                'active' => static::$offers_needs_active,
                'product_or_service' => static::$offers_needs_product_or_service,
                'type' => static::$offers_needs_type,
                'description' => static::$offers_needs_description,
                'compensation_type' => static::$offers_needs_compensation_type,
                'compensation' => static::$offers_needs_compensation,
                'urgency' => static::$offers_needs_urgency,
                'image' => static::$offers_needs_image,
                'attachment' => static::$offers_needs_attachment,
            ]
        );
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
        if ( !acf_get_field_group_post( self::$entity_form_group_key ) ) {
            acf_import_field_group(
                array(
                    'key' => self::$entity_form_group_key,
                    'title' => __( 'Community Directory Entity Fields', 'community-directory' ),
                    'fields' => apply_filters( 'community_directory_required_acf_entity_fields', array() ),
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
                    'active' => true,
                    'description' => __( 'The Community Directory generated form.', 'community-directory' ),
                )
            );
        }

        if ( !acf_get_field_group_post( self::$offers_needs_form_group_key ) ) {
            acf_import_field_group(
                array(
                    'key' => self::$offers_needs_form_group_key,
                    'title' => __( 'Community Directory Offers & Needs Custom Fields', 'community-directory' ),
                    'fields' => apply_filters( 'community_directory_required_acf_offers_needs_fields', array() ),
                    'location' => array(
                        array(
                            array(
                                'param' => 'post_type',
                                'operator' => '==',
                                'value' => ClassOffersNeeds::$post_type,
                            ),
                        ),
                    ),
                    'menu_order' => 1,
                    'position' => 'acf_after_title',
                    'style' => 'default',
                    'label_placement' => 'left',
                    'instruction_placement' => 'label',
                    'hide_on_screen' => '',
                    'active' => true,
                    'description' => __( 'The Community Directory generated form for Offers & Needs.', 'community-directory' ),
                )
            );
        }
    }

    public static function generate_required_entity_fields( $fields_arr ) {
        $fields_arr[] = array(
            'key'       => self::$entity_active_key,
			'label'     => __( 'Profile Active', 'community-directory' ),
			'name'      => self::$entity_active,
			'type'      => 'radio',
			'instructions' => __( 'Select \'Active\' to make your profile visible. If \'Inactive\', your profile will not be visible to others.', 'community-directory' ),
			'required' => 1,
			'choices'   => array(
				'true'      => __( 'Active', 'community-directory' ),
				'false'     => __( 'Inactive', 'community-directory' ),
			),
			'default_value' => 'false',
			'layout' => 'horizontal',
			'return_format' => 'value',
			'save_other_choice' => 0,
        );

        $fields_arr[] = array(
            'key' => self::$entity_location_name_key,
			'label' => __( 'Location Name', 'community-directory' ),
			'name' => self::$entity_location_name,
			'type' => 'text',
			'instructions' => __( 'This is how you will appear in the directory under your city or town.', 'community-directory' ),
			'required' => 1,
			'placeholder' => _x( 'Higgleby Ranch or Mary\'s Woodlands', 'placeholder', 'community-directory' ),
			'maxlength' => '50',
        );

        $fields_arr[] = array(
			'key' => self::$entity_picture_key,
			'label' => __( 'Picture', 'community-directory' ),
			'name' => self::$entity_picture,
			'type' => 'image',
			'instructions' => __( 'Upload a picture of yourselves', 'community-directory' ),
			'return_format' => 'array',
			'preview_size' => 'medium',
			'library' => 'uploadedTo',
			'min_width' => 300,
			'min_height' => 300,
			'max_size' => 5,
			'mime_types' => 'jpeg,jpg,png,gif',
		);

        $fields_arr[] = array(
            'key' => self::$entity_about_key,
			'label' => __( 'Bio', 'community-directory' ),
			'name' => self::$entity_about,
			'type' => 'wysiwyg',
            'instructions' => __( 'Write something about yourself or about your place. Don\'t know what to write about? Write about what you do, the history of your place, or what you would like to see more of around you.', 'community-directory' ),
            'placeholder' => _x( 'At Higgleby Ranch we pride ourselves in our livestock. We raise cattle, and train horses, as well as invite families to visit with their children where they can play with the animals and ride our ponies.', 'placeholder', 'community-directory' ),
			'required' => 0,
			'tabs' => 'all',
			'toolbar' => 'full',
			'media_upload' => 1,
			'delay' => 0,
        );

        $fields_arr[] = array(
			'key' => self::$entity_contact_method_key,
			'label' => __( 'Contact Method', 'community-directory' ),
			'name' => self::$entity_contact_method,
			'type' => 'text',
            'instructions' => __( 'What is the best way to get in contact with you?', 'community-directory' ),
            'placeholder' => _x( 'Email or Phone', 'placeholder', 'community-directory' ),
			'required' => 1,
		);

        $fields_arr[] = array(
            'key' => self::$entity_email_key,
			'label' => __( 'Contact Email', 'community-directory' ),
			'name' => self::$entity_email,
			'type' => 'email',
			'instructions' => __( 'Add an e-mail by which others can reach you.', 'community-directory' ),
			'placeholder' => __( 'email@example.com', 'community-directory' ),
        );

        $fields_arr[] = array(
            'key' => self::$entity_tel_key,
			'label' => __( 'Contact Telephone', 'community-directory' ),
			'name' => self::$entity_tel,
			'type' => 'number',
			'instructions' => __( 'Add a phone number by which you can be reached.', 'community-directory' ),
			'placeholder' => __( '248-851-6979', 'community-directory' ),
        );

        $fields_arr[] = array(
            'key' => self::$entity_website_key,
			'label' => __( 'Website', 'community-directory' ),
			'name' => self::$entity_website,
			'type' => 'url',
			'instructions' => __( 'Do you have a website?', 'community-directory' ),
			'placeholder' => __( 'https://www.website.com', 'community-directory' ),
        );

        $fields_arr[] = array(
            'key' => self::$entity_facebook_key,
			'label' => __( 'Facebook', 'community-directory' ),
			'name' => self::$entity_facebook,
			'type' => 'url',
			'instructions' => __( 'Are you reachable by Facebook?', 'community-directory' ),
            'placeholder' => __( 'https://www.facebook.com/182837282', 'community-directory' ),
            'prepend' => 'https://www.facebook.com/',
        );

        $fields_arr[] = array(
            'key' => self::$entity_youtube_key,
			'label' => __( 'Youtube Channel', 'community-directory' ),
			'name' => self::$entity_youtube,
			'type' => 'url',
			'instructions' => __( 'Do you have a YouTube channel?', 'community-directory' ),
            'placeholder' => 'https://www.youtube.com/channel/UCiiQgLrHKYPwcKFx24M7',
            'prepend' => 'https://www.youtube.com/channel/',
        );

		$fields_arr[] = array(
			'key' => self::$entity_share_loc_key,
			'label' => __( 'Share My Location', 'community-directory' ),
			'name' => self::$entity_share_loc_key,
			'type' => 'true_false',
			'instructions' => __( 'Do you want to share your location with others?', 'community-directory' ),
        );

        $fields_arr[] = array(
			'key' => self::$entity_visit_info_key,
			'label' => __( 'Visiting Information', 'community-directory' ),
			'name' => self::$entity_visit_info,
			'type' => 'text',
			'instructions' => __( 'Do you have any additional information for anyone wishing to visit your place?', 'community-directory' ),
			'required' => 0,
			'conditional_logic' => array(
				array(
					array(
						'field' => self::$entity_share_loc_key,
						'operator' => '==',
						'value' => '1',
					),
				),
			),
			'placeholder' => '',
		);

		$fields_arr[] = array(
			'key' => self::$entity_gmap_loc_key,
			'label' => __( 'Your Location', 'community-directory' ),
			'name' => self::$entity_gmap_loc,
			'type' => 'google_map',
			'instructions' => '',
			'required' => 1,
			'conditional_logic' => array(
				array(
					array(
						'field' => self::$entity_share_loc_key,
						'operator' => '==',
						'value' => '1',
					),
				),
			),
			'center_lat' => __( '40.730610', 'community-directory' ),
			'center_lng' => __( '-73.935242', 'community-directory' ),
			'zoom' => '7',
			'height' => '',
		);


        return $fields_arr;
    }

    public static function generate_required_offers_needs_fields( $fields_arr ) {
        $fields_arr[] = array(
            'key'       => self::$offers_needs_active_key,
			'label'     => __( 'Is Active', 'community-directory' ),
			'name'      => self::$offers_needs_active,
			'type'      => 'radio',
			'instructions' => __( 'Select \'Active\' to make your offer/need visible. If \'Inactive\', your offer/need will not be visible to others.', 'community-directory' ),
			'required' => 1,
			'choices'   => array(
				'true'      => __( 'Active', 'community-directory' ),
				'false'     => __( 'Inactive', 'community-directory' ),
			),
			'default_value' => 'false',
			'layout' => 'horizontal',
			'return_format' => 'value',
			'save_other_choice' => 0,
        );
        
        $fields_arr[] = array(
            'key' => self::$offers_needs_type_key,
            'label' => __( 'Type', 'community-directory' ),
            'name' => self::$offers_needs_type,
            'type' => 'radio',
            'instructions' => __( 'Is this something you are offering or you\'re looking for?', 'community-directory' ),
            'required' => 1,
            'choices' => array(
                'offer' => community_directory_offer_type_translated( 'offer' ),
                'need' => community_directory_offer_type_translated( 'need' ),
            ),
            'layout' => 'vertical',
            'return_format' => 'value',
            'save_other_choice' => 0,
        );

        $fields_arr[] = array(
            'key' => self::$offers_needs_product_or_service_key,
            'label' => __( 'Product or Service', 'community-directory' ),
            'name' => self::$offers_needs_product_or_service,
            'type' => 'radio',
            'instructions' => __( 'Is it a service or a product?', 'community-directory' ),
            'required' => 1,
            'choices' => array(
                'service' => __( 'Service', 'community-directory' ),
                'product' => __( 'Product', 'community-directory' ),
            ),
            'layout' => 'vertical',
            'return_format' => 'value',
            'save_other_choice' => 0,
        );

        $fields_arr[] = array(
            'key' => self::$offers_needs_description_key,
            'label' => __( 'Description', 'community-directory' ),
            'name' => self::$offers_needs_description,
            'type' => 'wysiwyg',
            'instructions' => __( "Describe what it is you're offering or seeking.", 'community-directory' ),
            'placeholder' => _x( 'We offer only freshly pressed apple juice, harvested from our own orchard, where we use only organic pesticides. We also offer apples if you like!', 'placeholder', 'community-directory' ),
            'required' => 1,
            'tabs' => 'all',
            'toolbar' => 'full',
            'media_upload' => 0,
            'delay' => 0,
        );

        $fields_arr[] = array(
			'key' => self::$offers_needs_compensation_type_key,
			'label' => __( 'Compensation Type', 'community-directory' ),
			'name' => self::$offers_needs_compensation_type,
			'type' => 'checkbox',
			'instructions' => __( 'Are you giving it away or you expect anything in return?', 'community-directory' ),
			'required' => 0,
			'conditional_logic' => array(
				array(
					array(
						'field' => self::$offers_needs_type_key,
						'operator' => '==',
						'value' => 'offer',
					),
				),
			),
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'choices' => array(
				'free' => _x( 'I ask for nothing', 'compensation type', 'community-directory' ),
				'barter' => _x( 'Barter', 'compensation type', 'community-directory' ),
				'payment' => _x( 'Payment', 'compensation type', 'community-directory' ),
			),
			'allow_custom' => 0,
			'default_value' => array(
			),
			'layout' => 'horizontal',
			'toggle' => 0,
			'return_format' => 'array',
			'save_custom' => 0,
        );
        
		$fields_arr[] = array(
			'key' => self::$offers_needs_compensation_key,
			'label' => __( 'Compensation', 'community-directory' ),
			'name' => self::$offers_needs_compensation,
			'type' => 'textarea',
			'instructions' => __( 'What do you ask for in exchange for your offer?', 'community-directory' ),
			'required' => 1,
			'conditional_logic' => array(
				array(
					array(
						'field' => self::$offers_needs_compensation_type_key,
						'operator' => '==',
						'value' => 'barter',
					),
				),
				array(
					array(
						'field' => self::$offers_needs_compensation_type_key,
						'operator' => '==',
						'value' => 'payment',
					),
				),
			),
			'placeholder' => _x( 'Example: I\'m looking for vegetable seeds or gardening tools OR: In the attached PDF, you\'ll find our price sheet', 'placeholder', 'community-directory' ),
			'maxlength' => 1000,
			'rows' => 4,
		);

        $fields_arr[] = array(
            'key' => self::$offers_needs_urgency_key,
            'label' => __( 'Urgency', 'community-directory' ),
            'name' => self::$offers_needs_urgency,
            'type' => 'radio',
            'instructions' => __( 'Is it time sensitive? Is it an urgent or very limited time offer, is it seasonal, or on-going?', 'community-directory' ),
            'choices' => array(
                'urgent' => __( 'Urgent/Limited Time', 'community-directory' ),
                'seasonal' => __( 'Seasonal', 'community-directory' ),
                'ongoing' => __( 'Ongoing', 'community-directory' ),
            ),
            'layout' => 'vertical',
            'return_format' => 'value',
        );

        $fields_arr[] = array(
            'key' => self::$offers_needs_image_key,
            'label' => __( 'Image', 'community-directory' ),
            'name' => self::$offers_needs_image,
            'type' => 'image',
            'instructions' => __( 'Do you have a featured image for this offer or need?', 'community-directory' ),
            'library' => 'uploadedTo',
            'return_format' => 'array',
            'preview_size' => 'medium',
            'max_size' => 5,
            'mime_types' => 'jpeg,png,jpg,gif',
        );

        $fields_arr[] = array(
            'key' => self::$offers_needs_attachment_key,
            'label' => __( 'Additonal Attachments', 'community-directory' ),
            'name' => self::$offers_needs_attachment,
            'type' => 'file',
            'instructions' => __( 'Here you can upload a PDF, image, or document with additional information or prices.', 'community-directory' ),
            'return_format' => 'array',
            'library' => 'uploadedTo',
            'max_size' => 10,
            'mime_types' => 'pdf,jpeg,jpg,gif,png',
        );

        return $fields_arr;
    }

    
    public function ajax_form_submit(  ) {
        $success = acf_save_post( $_POST[ 'post_id' ] );
        $slug = '';
        if ( $success )
            $slug = community_directory_get_post_var_by_field(
                'post_name', 'ID',
                (int) $_POST[ 'post_id' ]
            );

        die( json_encode( [ 'success' => $success, 'slug' => $slug ] ) );
    }

    /**
     * Creates a entity's initial field data in the ACF entity meta db
     *
     * @param       $entity_data        ARRAY_A     requires: 'first_name', 'last_name', 'entity_id' (post_id), 'status'
     */
    public static function initiate_entity( array $entity_data ) {
        // turn array vars into accessable vars
        extract( $entity_data );

        $update_values = array();
        $update_values[self::$entity_location_name_key] =
            community_directory_generate_display_name_from_user_name( $first_name, $last_name );
        $update_values[self::$entity_active_key] = isset( $status ) && $status === COMMUNITY_DIRECTORY_ENUM_ACTIVE ? 'true' :'false';

        acf_update_values( $update_values, $entity_id );
    }

    public static function update( int $post_id, array $entity_data ) {
        acf_update_values( $entity_data, $post_id );
    }

}

__( 'Category', 'community-directory' );