<?php

namespace Maruf89\CommunityDirectory\Admin;

use Maruf89\CommunityDirectory\Admin\Settings\ClassUWPFormBuilder;
use Maruf89\CommunityDirectory\Includes\{ClassLocation, ClassActivator};
use Maruf89\CommunityDirectory\Includes\instances\Entity;

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

        if ( isset( $data[ClassUWPFormBuilder::$location_not_listed_name] ) ) {
            if ( (int) $data[ClassUWPFormBuilder::$location_not_listed_name] === 0 &&
                empty( $data[ClassUWPFormBuilder::$community_directory_location_name] ) )
                    $errors->add( 'Missing Field', __( 'You must select your village, town, or city from the options', 'community-directory' ) );
            else if ( (int) $data[ClassUWPFormBuilder::$location_not_listed_name] === 1 ) {
                $new_loc = $data[ClassUWPFormBuilder::$community_directory_location_name];

                if ( empty( $new_loc ) )
                    $errors->add( 'Missing Field', __( 'Your location field cannot be left blank.', 'community-directory', ) );
                
                if ( !community_directory_is_valid_location_name( $new_loc ) )
                    $errors->add( 'Invalid Field', __( 'The location name field you entered is invalid. It cannot contain any numbers or special characters.', 'community-directory', ) );
            }
        }

        return $errors;
    }

    /**
     * Upon registration submission, field values are validated. Here we validate the location field.
     * 
     * @param           $data               ARRAY_A     the validated form data, minus any extra fields not
     *                                                  correlating to something in the uwp form
     * @param           $validation_type    STRING      uwp validation type
     * @param           $user_id            INTEGER      
     * @return                              ARRAY_A     $result
     */
    public static function save_data_to_user_meta( $data, $validation_type, $user_id ) {
        // return if validating something else
        if ( $validation_type !== 'register' ||
             !isset( $data[ ClassUWPFormBuilder::$community_directory_location_name ] ) )
                return $data;
                
        $location_name = sanitize_text_field( $data[ ClassUWPFormBuilder::$community_directory_location_name ] );
        self::create_loc_and_entity( $location_name, $data, $user_id );

        // Set this so we can trigger actions on the user's first login
        update_user_meta($user_id, 'prefix_first_login', '1');

        return $data;
    }

    /**
     * Given a location display_name and a user_id creates a location if it doesn't exist, then an entity, and 
     * then updates the user's roles to entity_subscriber
     * 
     * @param       $location_name      string       
     * @param       $user_data          array       must contain: 'first_name', 'last_name'
     * @param       $user_id            int
     */
    public static function create_loc_and_entity( string $location_name, array $data, int $user_id ) {
        $loc_data = array( 'display_name' => $location_name, 'user_id' => $user_id );
        if ( isset( $data[ 'status' ] ) ) $loc_data[ 'status' ] = $data[ 'status' ];
        
        // Create a location if it doesn't exist
        $Location = apply_filters( 'community_directory_create_location_if_doesnt_exist', $loc_data );

        $Entity = new Entity( null, $user_id );
        $Entity->insert_into_db( array(
            'user_id'                   => $user_id,
            'first_name'                => $data[ 'first_name' ],
            'last_name'                 => $data[ 'last_name' ],
            'location_id'               => $Location->location_id,
            'location_display_name'     => $Location->display_name,
            'location_post_id'          => $Location->post_id,
            'status'                    => isset( $data[ 'status' ] ) ? $data[ 'status' ] : COMMUNITY_DIRECTORY_ENUM_PENDING,
        ) );

        // Set the user's role to entity-subscriber
        $user = new \WP_User( $user_id );
        $user->set_role( ClassActivator::$role_entity );
    }

    /**
     * Action hook that returns the link to redirect to on first login
     */
    public function get_first_entity_login_link( string $redirect, \WP_User $user, Entity $Entity ):string {
        return Entity::build_edit_link( $Entity->post_id );
    }

    /**
     * Checks whether an entity user is logging in for the first time
     */
    public function check_first_login( string $user_login, \WP_User $user ) {
        $user_id = $user->ID;
        // getting prev. saved meta
        $first_login = get_user_meta($user_id, 'prefix_first_login', true);
        // if first time login
        if ( $first_login == '1' ) {
            $Entity = Entity::get_instance( null, $user_id );
            
            if ( $Entity ) {
                do_action( 'community_directory_first_entity_login_before', $user, $Entity );

                // update meta after first login
                update_user_meta($user_id, 'prefix_first_login', '0');

                // redirect to given URL
                $redirect_link = apply_filters( 'community_directory_first_entity_login_link', '', $user, $Entity );
                if ( !empty( $redirect_link ) )
                    wp_redirect( $redirect_link );

                do_action( 'community_directory_first_entity_login_after', $user, $Entity );
                exit;
            }
        }
    }
    
}