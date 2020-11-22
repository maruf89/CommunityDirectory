<?php

namespace Maruf89\CommunityDirectory\Admin;

use Maruf89\CommunityDirectory\Admin\Settings\ClassUWPFormBuilder;

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

    public static function validate_user_registration_before($errors, $data, $validation_type) {
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

    public static function save_data_to_user_meta($result, $validation_type, $user_id) {
        // return if validating something else
        if ( $validation_type !== 'register' ||
             !isset( $result[ClassUWPFormBuilder::$community_directory_location_name] ) )
                return $result;

        $location = $result[ClassUWPFormBuilder::$community_directory_location_name];

        // Only add new location if the user didn't enter an already existing location
        if ( !community_directory_location_exists( $location ) )
            do_action( 'community_directory_create_locations', array( array( 'display_name' => $location ) ) );

        // add_user_meta($user_id, ClassUWPFormBuilder::$community_directory_location_name, $location);

        return $result;
    }
    
}