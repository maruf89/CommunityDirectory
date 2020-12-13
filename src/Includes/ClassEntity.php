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
    public static int $post_type_menu_position = 28;
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
    public static function register_post_type() {
        $loc_prefix = __( 'location', 'community-directory' );
        $post_type = self::$post_type;

        
        $custom_post_type_args = array(
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
            'menu_position' => self::$post_type_menu_position,
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
                'custom_fields',
            ),
            'rewrite' => array(
                'slug' => __( 'entity', 'community-directory' ),
                'with_front' => false,
            ),
            'delete_with_user' => true,
            'show_in_rest' => true,
        );
         
        // Post type, $args - the Post Type string can be MAX 20 characters
        register_post_type( $post_type, $custom_post_type_args );
    }

    /**
     * Filter method to aggregate post types
     */
    public static function add_post_type( $arr ) {
        $arr[] = self::$post_type;
        return $arr;
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
        $location_name = ClassACF::$entity_location_name;
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
     * Returns all of the users without entities
     * 
     * @param       $sql_only   bool            Whether to only return the sql
     * @return                  object|string   
     */
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

    //////////////////////////////
    //////// Rest Methods/////////
    //////////////////////////////

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