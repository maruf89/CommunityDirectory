<?php

namespace Maruf89\CommunityDirectory\Admin;

use Maruf89\CommunityDirectory\Includes\ClassEntity;

/**
 * Eases Testing with test users and so on…
 *
 * @package    community-directory
 * @subpackage community-directory/admin
 * @author     Marius Miliunas
 */
class ClassTest {

    private static $instance;
    private $first_names = array(
        'Mariah', 'Phil',
        'Sofia', 'Ted',
        'Jonas', 'Emma',
        'Ximena', 'Josef',
        'Eduardo', 'Catalina',
        'Zoe', 'Omar',
        'Yusif', 'Elchin',
        'Fatima', 'Leyla',
        'Oisha', 'Azra',
        'Noah', 'Li',
        'Tal', 'Ying',
        'Oliver', 'Hito',
        'Sofiya', 'Maya'
    );

    private $last_names = array(
        'Bektashi', 'Thanasi',
        'Frasheri', 'Schwarz',
        'Zimmer', 'Guliyev',
        'Maes', 'Peeters',
        'Salihović', 'Đukić',
        'Novak', 'Madsen',
        'Olsen', 'Pärn',
        'Pavlov', 'Roux',
        'Fischer', 'Bonik',
        'Hé', 'Zhào',
        'Peretz', 'Suzuki',
        'Takahashi', 'Han',
        'Rojas', 'Araya',
        'Pérez', 'Peña',
        'Ruíz', 'Jones',
        'Taylor', 'White',
        'Kumar', 'Reddy'
    );

    private $locations = array(
        'Detroit', 'Moscow',
        'Musninkai', 'Farmington',
        'Pujinamba', 'Dakra',
        'Villanova', 'Coimbra',
        'Valensa', 'Schwarzfeld',
        'Žirmūnai', 'Rytan',
        'Buyaki', 'Bridgenorth',
        'Claverly', 'Kilreekil',
        'Gurtymadden', 'Tazirbu',
        'Dachla', 'Ad Dilam',
        'Al Amaaria', 'Berana',
        'Kurgan', 'Galuut',
        'Zarechny', 'Mogsokhon',
        'Suihua', 'Qinggang',
        'Saporo', 'Asahimachi',
        'Furano', 'Eagle Village',
        'Tanana', 'Pine Point'
    );

    public static function get_instance() {
        if (self::$instance == null) {
            self::$instance = new ClassTest();
        }
 
        return self::$instance;
    }

    private function generate_first_name() {
        return $this->first_names[array_rand( $this->first_names )];
    }

    private function generate_last_name() {
        return $this->last_names[array_rand( $this->last_names )];
    }

    private function generate_username( $first, $last ) {
        $f = substr( $first, 0, 1 );
        $l_str_len = strlen( $last );
        $l_len = rand( 1, $l_str_len );
        $l = substr( $last, 0, $l_len );
        $numbers = (string) rand( 100, 1000 );
        return $f . $l . $numbers;
    }

    private function generate_new_wp_user() {
        $first = $this->generate_first_name();
        $last = $this->generate_last_name();
        $username = $this->generate_username( $first, $last );

        return array(
            'first_name'    => $first,
            'last_name'     => $last,
            'display_name'  => "$first $last",
            'user_login'    => $username,
            'user_email'    => "$username@test.com",
            'user_pass'     => 'morcon123',
            'user_url'      => "www.$username.com",
        );
    }

    /**
     * Generates new users
     *
     * @since    2020.11
     * 
     * @param       $num_users          integer         The number of users to generate
     * @param       $make_active        boolean         Whether to activate the users (makes them visible)
     * @param       $generate_locations boolean         Whether to generate new locations for the users
     * @return                          integer         The # of generated users
     */
    public function generate_test_users( $num_users = 1, $make_active = true, $generate_locations = false ) {
        $generated_count = 0;

        // If we're not generating locations, get the existing ones
        if ( !$generate_locations ) {
            $db_locations = apply_filters( 'community_directory_get_locations', [], null, ARRAY_A );
            $db_locations = apply_filters( 'community_directory_format_locations', $db_locations, 'display_name' );
            $locations = array_keys( $db_locations );
        } else
            // Otherwise get from our own test location names
            $locations = $this->locations;
        
        $status = $make_active ? COMMUNITY_DIRECTORY_ENUM_ACTIVE : COMMUNITY_DIRECTORY_ENUM_INACTIVE;
        
        $i = 0;
        while ( $i++ < $num_users ) {
            $rand_loc_name = $locations[array_rand( $locations )];
            
            if ( $generate_locations )
                $rand_loc = apply_filters( 'community_directory_prepare_location_for_creation', array(
                    'display_name'  => $rand_loc_name,
                    'status'        => $status,
                ), null );
            else
                $rand_loc = $db_locations[$rand_loc_name];
            
            $wp_user = $this->generate_new_wp_user();
            $user_id = wp_insert_user( $wp_user );

            $loc_data = $wp_user;
            $loc_data[ 'status' ] = $status;
            ClassAccount::create_loc_and_entity( $rand_loc_name, $loc_data, $user_id );

            $generated_count++;
        }
        
        return $generated_count;
    }

    /**
     * Deletes all subscribers
     * 
     * @return      int         number of deleted users
     */
    public function delete_subscribers() {
        $subscribers = get_users( array( 'role' => ClassEntity::$role_entity ) );
        
        $deleted = 0;
        
        foreach ( $subscribers as $subscriber ) {
            if ( wp_delete_user( $subscriber->ID ) ) $deleted++;
            $entity_post_id = community_directory_get_post_var_by_field(
                'ID', 'post_author', $subscriber->ID, ClassEntity::$post_type
            );
            
            if ( $entity_post_id ) {
                wp_delete_post( $entity_post_id, true );
            }
        }
        
        return $deleted;
    }

}