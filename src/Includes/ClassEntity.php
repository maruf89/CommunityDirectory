<?php
/**
 * Community Directory Entity aka User Profile related functions
 *
 * @since      2020.11
 * @author     Marius Miliunas <mvmiliunas@gmail.com>
 */

namespace Maruf89\CommunityDirectory\Includes;

class ClassEntity {

    public static $entity_post_type = 'cd-entity';

    public static function register_entity_post_type() {
        $customPostTypeArgs = array(
            'label' => __( 'Entities', 'community-directory' ),
            'labels' =>
                array(
                    'name' => __( 'Entities', 'community-directory' ),
                    'singular_name' => __( 'Entity', 'community-directory' ),
                    'add_new' => __( 'Add Entity', 'community-directory' ),
                    'add_new_item' => __( 'Add New Entity', 'community-directory' ),
                    'edit_item' => __( 'Edit Entity', 'community-directory' ),
                    'new_item' => __( 'New Entity', 'community-directory' ),
                    'view_item' => __( 'View Entity', 'community-directory' ),
                    'search_items' => __( 'Search Entity', 'community-directory' ),
                    'not_found' => __( 'No Entities Found', 'community-directory' ),
                    'not_found_in_trash' => __( 'No Entities Found in Trash', 'community-directory' ),
                    'menu_name' => __( 'Entities', 'community-directory' ),
                    'name_admin_bar'     => __( 'Entities', 'community-directory' ),
                ),
            'public' => true,
            'description' => __( 'Community Directory Entities', 'community-directory' ), 
            'exclude_from_search' => false,
            'show_ui' => true,
            'show_in_menu' => COMMUNITY_DIRECTORY_NAME,
            'capability_type' => array( 'entity', 'entities' ),
            'capabilities' => array(
                'edit_post'          => 'edit_entity', 
                'read_post'          => 'read_entity', 
                'delete_post'        => 'delete_entity', 
                'edit_posts'         => 'edit_entities', 
                'edit_others_posts'  => 'edit_others_entities', 
                'publish_posts'      => 'publish_entities',       
                'read_private_posts' => 'read_private_entities', 
                'create_posts'       => 'edit_entities', 
                ),
            'supports' => array(
                'title',
                'thumbnail',
                'custom_fields',
                'page-attributes'
            ),
            'rewrite' => array(
                'slug' => __( 'entity', 'community-directory' ),
                'with_front' => false,
            ),
            'taxonomies' => array('category','post_tag')
        );
         
        // Post type, $args - the Post Type string can be MAX 20 characters
        register_post_type( self::$entity_post_type, $customPostTypeArgs );
    }

    /**
     * Adds a user to the CD User table with the given location data
     * 
     * @param       $data       a_array         must contain: 'user_id', 'location_id', 'slug'
     * return                   int|WP_Error    either the returned row id or error
     */
    public static function add_entity_location_data( $data ) {
        if ( !isset( $data['user_id'] ) || !isset( $data['location_id'] ) || !isset( $data['slug'] ) ) {
            $error = new WP_Error();
            $error->add( 'ClassEntity->add_entity_location_data requires user_id, slug, and location_id' );
            return $error;
        }
        
        global $wpdb;
        return $wpdb->insert(
            COMMUNITY_DIRECTORY_DB_TABLE_USERS,
            array(
                'user_id' => $data['user_id'],
                'location_id' => $data['location_id'],
                'slug' => $data['slug'],
            ),
            array( '%d', '%d', '%s' )
        );
    }

    public static function get_entities_for_location( $user_arr, $loc_id_or_slug ) {
        global $wpdb;

        $where_var = gettype( $loc_id_or_slug ) === 'integer' ? 'id' : 'slug';

        $user_table = COMMUNITY_DIRECTORY_DB_TABLE_USERS;

        $location_name = ClassACF::$field_location_name;

        $users = $wpdb->get_results("
            SELECT cd_users.user_id, usermeta.meta_value as $location_name
            FROM $user_table AS cd_users
            JOIN $wpdb->usermeta AS usermeta
            ON cd_users.user_id = usermeta.user_id
            WHERE cd_users.$where_var = '$loc_id_or_slug' AND usermeta.meta_key = '$location_name'
        ");

        return array_merge( $user_arr, $users );
    }

}