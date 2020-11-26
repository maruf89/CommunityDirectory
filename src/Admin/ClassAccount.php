<?php

namespace Maruf89\CommunityDirectory\Admin;

use Maruf89\CommunityDirectory\Admin\Settings\ClassUWPFormBuilder;
use Maruf89\CommunityDirectory\Includes\ClassLocation;

/**
 * The account and registration part of the plugin
 *
 * Configures the registration and validation logic
 *
 * @package    community-directory
 * @subpackage community-directory/admin
 * @author     Marius Miliunas <mvmiliunas@gmail.com>
 */
class ClassAccount {

    /**
     * Upon registration submission, field values are validated. Here we validate the location field.
     * 
     * @param           $errors             WP_Error
     * @param           $data               a_array     the $_POST data passed from the form
     * @param           $validation_type    string      uwp validation type
     * @return                              WP_Error    $errors obj
     */
    public static function validate_user_registration_before( $errors, $data, $validation_type ) {
        // return if validating something else
        if ( $validation_type !== 'register' ||
             !isset( $data[ClassUWPFormBuilder::$community_directory_location_name] ) )
                return $errors;

        if ( (int) $data[ClassUWPFormBuilder::$location_not_listed_name] === 0 &&
             empty( $data[ClassUWPFormBuilder::$community_directory_location_name] ) )
                $errors->add( 'Missing Field', __( 'You must select your village, town, or city from the options', 'community-directory' ) );
        else if ( (int) $data[ClassUWPFormBuilder::$location_not_listed_name] === 1 ) {
            if ( empty( $data[ClassUWPFormBuilder::$new_location_name] ) )
                $errors->add( 'Missing Field', __( 'Your location field cannot be left blank.', 'community-directory', ) );
        }

        return $errors;
    }

    /**
     * Upon registration submission, field values are validated. Here we validate the location field.
     * 
     * @param           $result             a_array     the validated form data, minus any extra fields not
     *                                                  correlating to something in the uwp form
     * @param           $validation_type    string      uwp validation type
     * @param           $user_id            int         
     * @return                              a_array     $result
     */
    public static function save_data_to_user_meta( $result, $validation_type, $user_id ) {
        // return if validating something else
        if ( $validation_type !== 'register' ||
             !isset( $result[ClassUWPFormBuilder::$community_directory_location_name] ) )
                return $result;

        // Get the location's display name
        $location = $result[ClassUWPFormBuilder::$community_directory_location_name];

        $loc_data = array( 'display_name' => $location, 'user_id' => $user_id );
        $loc_data = apply_filters( 'community_directory_prepare_location_for_creation', $loc_data );
        
        // Only add new location if the user didn't enter an already existing location
        if ( !community_directory_location_exists( $location ) ) {
            $inserted_data = community_directory_create_location( $loc_data );
            $loc_post_id = $inserted_data['post_id'];
        } else {
            $post = get_page_by_path( $loc_data['slug'], OBJECT, ClassLocation::$location_post_type );
            $loc_post_id = $post->ID;
        }

        $entity_post_id = community_directory_add_entity_location_data( array(
            'user_id' => $user_id,
            'first_name' => $result['first_name'],
            'last_name' => $result['last_name'],
            'location_id' => community_directory_get_row_var( $loc_data['slug'], 'id' ),
            'location_post_id' => $loc_post_id,
            'slug' => $loc_data['slug'],
        ) );

        // Save user meta to ACF
        do_action( 'community_directory_acf_initiate_entity', array(
            'entity_id' => $entity_post_id,
            'first_name' => $result['first_name'],
            'last_name' => $result['last_name'],
        ) );

        return $result;
    }
    
}