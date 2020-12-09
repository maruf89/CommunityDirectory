<?php
/**
 * Community Directory Entity aka User Profile related functions
 *
 * @since      2020.11
 * @author     Marius Miliunas <mvmiliunas@gmail.com>
 */

namespace Maruf89\CommunityDirectory\Includes;

use Maruf89\CommunityDirectory\Includes\Abstracts\Routable;
use Maruf89\CommunityDirectory\Includes\instances\Entity;
use Maruf89\CommunityDirectory\Includes\instances\Location;

class ClassEntity extends Routable {

    private static ClassEntity $instance;

    protected string $router_ns = 'entity';
    
    public static string $role_entity = 'entity_subscriber';
    public static string $post_type = 'cd-entity';
    public static string $post_meta_loc_name = '_cd_location_display_name';
    public static string $post_meta_loc_id = '_cd_location_id';

    public static function get_instance():ClassEntity {
        if ( !isset( self::$instance ) ) {
            self::$instance = new ClassEntity();
        }

        // flush_rewrite_rules( true );
 
        return self::$instance;
    }

    public function __construct() {
        parent::__construct( $this );
    }

    /**
     * Register's the Entity post type
     */
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
            'show_in_menu' => true,//COMMUNITY_DIRECTORY_NAME,
            'capability_type' => array( 'entity', 'entities' ),
            'map_meta_cap'        => false,
            'capabilities' => array(
                'edit_post'          => 'edit_entity', 
                'read_post'          => 'read_entity', 
                'delete_post'        => 'delete_entity', 
                'edit_posts'         => 'edit_entities', 
                'edit_others_posts'  => 'edit_others_entities', 
                'publish_posts'      => 'publish_entities',       
                'read_private_posts' => 'read_private_entities', 
                'create_posts'       => 'create_entities',
                'delete_posts'       => 'delete_entities',
                'delete_others_posts'=> 'delete_others_entities',
            ),
            'supports' => array(
                'title',
                'thumbnail',
                'custom_fields',
                'page-attributes'
            ),
            'rewrite' => array(
                // 'slug' => "$loc_prefix/%location%",
                'slug' => __( 'entity', 'community-directory' ),
                'with_front' => false,
            ),
            'delete_with_user' => true,
            'show_in_rest' => true,
            'taxonomies' => array('category','post_tag')
        );
         
        // Post type, $args - the Post Type string can be MAX 20 characters
        register_post_type( $post_type, $customPostTypeArgs );
    }

    /**
     * Filter method to aggregate post types
     */
    public static function add_post_type( $arr ) {
        $arr[] = self::$post_type;
        return $arr;
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

    /**
     * Get's all entities matching a post_id, slug, or returning all
     * A wp filter method that can be called on it's own to get all of the entities for a given location
     * 
     * @param           $entity_arr     array       the array to populate with entities
     * @param           $where_val      int|string  the location  (optional: if empty returns all entities)
     * @param           $where_key      string      options: ('location' or any field key)
     *                                              if 'location' passed, $where_val must be either a location post id's slug or post's ID. Otherwise a post's field key
     * @param           $status         string      the post's status. If empty, returns all post status types
     * @param           $sql_only       bool        whether to return only the sql query
     * @return                          array       Entity post types
     */
    public static function get_entities(
        array $entity_arr,
        $where_val = false,
        $where_key = '',
        string $status = 'publish',
        bool $sql_only = false
    ) {
        global $wpdb;
        $location_name = ClassACF::$field_location_name;
        $post_type = self::$post_type;

        if ( $where_key === 'location' ) {
            $where_key = gettype( $where_val ) === 'integer' ? 'entity.ID' : 'location.post_name';

            $where_status = '';
            if ( !empty( $status ) )
                $where_status .= "AND entity.post_status = '$status'";

            $sql = "
                SELECT entity.ID, entity.post_name, entity.post_title as $location_name
                FROM $wpdb->posts AS location
                JOIN $wpdb->posts AS entity
                ON location.ID = entity.post_parent
                WHERE entity.post_status != 'auto-draft' AND entity.post_type = '$post_type' AND $where_key = '$where_val' $where_status
            ";
        } else {
            $where_match = '';
            if ( $where_val && !empty( $where_key ) )
                $where_match .= "AND $where_val = '$where_val'";

            $where_status = '';
            if ( !empty( $status ) )
                $where_status .= "AND post_status = '$status'";
            
            $sql = "
                SELECT *
                FROM $wpdb->posts
                WHERE post_status != 'auto-draft' AND post_type = '$post_type' $where_match $where_status
            ";
        }

        if ( $sql_only ) return $sql;
        
        $entities = $wpdb->get_results( $sql );

        return array_merge( $entity_arr, $entities );
    }

    /**
     * Activates or deactivates an entity in ACF and the post's status
     * 
     * @param           $activate       bool        Whether to activate
     * @param           $id             int         Either 'post_id' or 'user_id'
     * @param           $id_for_what    string      If searching user_id, searches on the post_author field, otherwise on the post's ID (optional default: 'post_id')
     * @param           $status_only    bool        Whether to only update the post's status, and not the ACF field
     */
    public static function activate_deactivate_entity(
        bool $activate,
        int $id,
        string $id_for_what = 'post_id',
        bool $status_only = false
    ) {
        if ( $id_for_what === 'post_id' ) $entity_post_id = $id;
        else if ( $id_for_what === 'user_id' ) {
            $entity_post_id = community_directory_get_post_var_by_field(
                'ID', 'post_author', $id, self::$post_type
            );
            if ( !$entity_post_id ) {
                debug_trace();
                dump( $id );
                die( "Error getting entity's post_id for user: $id. Status not updated." );
            }
        } else die( 'Invalid "id_for_what" passed into ClassEntity::activate_deactivate_entity().' );

        // In cases where user manually updates the field, we don't need to do it again
        if ( !$status_only ) {
            // Update the user's active field in ACF
            $acf_updates = array();
            $acf_updates[ClassACF::$field_is_active_key] = $activate ? 'true' : 'false';
            community_directory_acf_update_entity( $entity_post_id, $acf_updates );
        }

        // Update the post_status
        $status = $activate ? COMMUNITY_DIRECTORY_ENUM_ACTIVE : COMMUNITY_DIRECTORY_ENUM_PENDING;
        community_directory_update_post_status( $entity_post_id, $status );
        return true;
    }

    public static function get_entities_for_entityless_users( bool $sql_only = false ) {
        global $wpdb;
        $post_type = self::$post_type;

        $sql = "
            SELECT  users.*
            FROM    $wpdb->users users
            WHERE   NOT EXISTS
            (
                SELECT  post_author
                FROM    $wpdb->posts posts
                WHERE   post_type = '$post_type' AND users.ID = posts.post_author
            )
        ";

        return $sql_only ? $sql : $wpdb->get_results( $sql );
    }

    public static function update_entity( int $entity_id, int $location_id ) {
        $entity = new Entity( $entity_id );
        return $entity->set_location( new Location( $location_id ) );
    }



    protected array $route_map = [
        '/update-entity' => array(
            'callback' => 'update_entity',
            'args' => array(
                'entity' => 'int', // the user to edit
                'location_id' => 'int'
            )
        )
    ];

    public static function get_router_end_points( array $callback ):array {
        return array(
            '/update-entity' => array(
                'methods'   => 'POST',
                'callback'  => $callback,
                'permission_callback' => function ( $request ):bool {
                    $params = $request->get_params();
                    if ( !isset( $params['entity'] ) ) return false;
                    return current_user_can( 'edit_others_entities' ) || ClassEntity::user_can_edit_entity( $params['entity'] );
                },
            )
        );
    }

    public static function user_can_edit_entity( int $entity_id, \WP_User $user = null ):bool {
        if ( !$user ) $user = wp_get_current_user();
        
        $me = new Entity( null, $user );
        if ( !$me->is_valid() ) return false;

        return $me->post_id == $entity_id;
    }

}