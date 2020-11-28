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
    public static $post_type = 'cd-entity';
    public static $post_meta_loc_name = '_cd_location_display_name';
    public static $post_meta_loc_id = '_cd_location_id';

    public static function get_instance() {
        if (self::$instance == null) {
            self::$instance = new ClassEntity();
        }

        // flush_rewrite_rules( true );
 
        return self::$instance;
    }

    public static function register_entity_post_type() {
        $loc_prefix = __( 'location', 'community-directory' );
        $post_type = self::$post_type;

        
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
                // 'slug' => "$loc_prefix/%location%",
                'slug' => "enteaty",
                'with_front' => false,
            ),
            'delete_with_user' => true,
            'show_in_rest' => true,
            'taxonomies' => array('category','post_tag')
        );
         
        // Post type, $args - the Post Type string can be MAX 20 characters
        register_post_type( $post_type, $customPostTypeArgs );
    }

    public static function add_post_type( $arr ) {
        $arr[] = self::$post_type;
        return $arr;
    }

    public static function entity_post_type_link( $permalink, $post, $leavename ) {
        if ( stripos( $permalink, '%location%' ) == false )
            return $permalink;

        // if ( is_object( $post ) && self::$post_type == $post->post_type ) {
        //     dump('permalink');
        //     die($permalink);
        //     $loc_post_id = $post->post_parent;
        //     $loc_slug = community_directory_get_row_var( $loc_post_id, 'slug', 'post_id' );
        //     $permalink = str_replace( '%location%', $loc_slug, $permalink );
        // }

        return $permalink;
    }

    /**
     * Creates a new Entity post with the user's info
     * 
     * @param       $data       ARRAY_A         required fields
     *                              array(
     *                                  'user_id' => ...,
     *                                  'first_name' => ...,
     *                                  'last_name' => ...,
     *                                  'location_id' => $location['id'],
     *                                  'location_display_name' => $location['display_name'],
     *                                  'location_post_id' => $location['post_id'],
     *                              )
     * return                   int|WP_Error    either the returned row id or error
     */
    public static function add_entity_location_data( $data ) {
        if ( !isset( $data['user_id'] ) ||
             !isset( $data['first_name'] ) ||
             !isset( $data['last_name'] ) ||
             !isset( $data['location_id'] ) ||
             !isset( $data['location_display_name'] ) ||
             !isset( $data['location_post_id'] )
        ) {
            dump($data);
            die( 'ClassEntity->add_entity_location_data requires user_id, first_name, last_name, location_id, location_display_name location_post_id' );
        }
        
        $title = community_directory_generate_display_name_from_user_name( $data['first_name'], $data['last_name'] );
        
        $meta = array();
        $meta[self::$post_meta_loc_id] = $data['location_id'];
        $meta[self::$post_meta_loc_name] = $data['location_display_name'];
        
        $row_id = wp_insert_post(
            array(
                'post_author'   => $data['user_id'],
                'post_title'    => $title,
                'post_name'     => strtolower( $title ),
                'post_parent'   => $data['location_post_id'],
                'post_type'     => self::$post_type,
                'meta_input'    => $meta,
            ),
        );

        return $row_id;
    }

    public static function get_entities_for_location( $user_arr, $loc_id_or_slug ) {
        global $wpdb;

        $where_var = gettype( $loc_id_or_slug ) === 'integer' ? 'id' : 'slug';

        $location_name = ClassACF::$field_location_name;

        $users = $wpdb->get_results("
            SELECT posts.ID, posts.post_name, posts.post_title as $location_name
            FROM $wpdb->posts AS parent
            JOIN $wpdb->posts AS posts
            ON parent.ID = posts.post_parent
            WHERE parent.post_name = '$loc_id_or_slug'
        ");

        return array_merge( $user_arr, $users );
    }

    public static function activate_deactivate_entity( $activate, $id, $id_for_what = 'post_id', $status_only = false ) {
        if ( $id_for_what === 'post_id' ) $entity_post_id = $id;
        else if ( $id_for_what === 'user_id' ) {
            $entity_post_id = community_directory_get_post_var_by_field(
                'ID', 'post_author', $id, self::$post_type
            );
            if ( !$entity_post_id ) {
                die( "Error getting entity's post_id for user: $id. Status not updated." );
            }
        } else die( 'Invalid "id_for_what" passed into ClassEntity::activate_deactivate_entity().' );

        // In cases where user manually updates the field, we don't need to do it again
        if ( !$status_only ) {
            // Update the user's active field in ACF
            $acf_updates = array();
            $acf_updates[ClassACF::$field_is_active_key] = 'true';
            community_directory_acf_update_entity( $entity_post_id, $acf_updates );
        }

        // Update the post_status
        $status = $activate ? COMMUNITY_DIRECTORY_ENUM_ACTIVE : COMMUNITY_DIRECTORY_ENUM_PENDING;
        community_directory_update_post_status( $entity_post_id, $status );
        return true;
    }

}