<?php
/**
 * Community Directory Entity aka User Profile related functions
 *
 * @since      2020.11
 * @author     Marius Miliunas <mvmiliunas@gmail.com>
 */

namespace Maruf89\CommunityDirectory\Includes;

class ClassEntity {

    private static $instance;

    public static function get_instance() {
        if (self::$instance == null) {
            self::$instance = new ClassEntity();
        }
 
        return self::$instance;
    }
    
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
     * Creates a new Entity post with the user's info
     * 
     * @param       $data       a_array         must contain: 'user_id', 'location_id', 'first_name', 'last_name', 'location_post_id'
     * return                   int|WP_Error    either the returned row id or error
     */
    public static function add_entity_location_data( $data ) {
        // Turn the array variables to be locally accessible
        extract( $data );
        
        if ( !isset( $user_id ) || !isset( $location_id ) || !isset( $location_post_id ) ) {
            dump($data);
            die( 'ClassEntity->add_entity_location_data requires user_id, location_id, first_name, last_name, location_post_id' );
        }
        
        $title = community_directory_generate_display_name_from_user_name( $first_name, $last_name );
        
        $row_id = wp_insert_post(
            array(
                'post_author' => $user_id,
                'post_title' => $title,
                'post_name' => strtolower( $title ),
                'post_parent' => $location_post_id,
                'post_type' => self::$entity_post_type,
            ),
        );

        return $row_id;
    }

    public static function get_entities_for_location( $user_arr, $loc_id_or_slug ) {
        global $wpdb;

        $where_var = gettype( $loc_id_or_slug ) === 'integer' ? 'id' : 'slug';

        $user_table = COMMUNITY_DIRECTORY_DB_TABLE_USERS;

        $location_name = ClassACF::$field_location_name;

        $users = $wpdb->get_results("
            SELECT posts.ID, posts.post_title as $location_name
            FROM $wpdb->posts AS parent
            JOIN $wpdb->posts AS posts
            ON parent.ID = posts.post_parent
            WHERE parent.post_name = '$loc_id_or_slug'
        ");

        return array_merge( $user_arr, $users );
    }

}