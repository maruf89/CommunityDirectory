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

    //////////////////////////////
    ////////  WordPress  /////////
    //////////////////////////////

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

    public static function get_meta_search_fields():array {
        $fields = [
            'search' => [
                ClassACF::$entity_location_name,
                ClassACF::$entity_about,
            ],
            'email' => ClassACF::$entity_email,
            'required' => []
        ];

        $fields[ 'required' ][ ClassACF::$entity_active ] = 'true';
        
        return $fields;
    }

    //////////////////////////////
    ////////     Get     /////////
    //////////////////////////////

    /**
     * Get's all entities based on passed in vars
     * 
     * @param       $results            ?array           an array which to merge with passed in results
     * @param       $post_status        ?string|array    optional array, first variable must be (=|!=), default: =
     *                                                   if null or empty string, returns non-auto draft fields
     * @param       $where_match        ?array           optional array with fields to match against
     * @param       $output             ?string          one of (sql|OBJECT|ARRAY_A|ARRAY_N)
     */
    function get(
        array $results = [],
        $post_status = null,
        array $where_match = null,
        string $output = null
    ) {
        global $wpdb;

        if ( null === $post_status || empty( $post_status ) ) $post_status = [ '!=', 'auto-draft' ];
        if ( null === $where_match ) $where_match = [];
        if ( null === $output ) $output = OBJECT;

        // Create where array with the first check
        $where = [ 'post_type = \'' . static::$post_type . '\'' ];
        
        if ( gettype( $post_status ) === 'string' )
            $post_status = [ '=', $post_status ];
        
        $where[] = sprintf( 'post_status %s \'%s\'', $post_status[ 0 ], $post_status[ 1 ] );

        if ( count( $where_match ) ) {
            foreach ( $where_match as $key => $match ) {
                switch ( $key ) {

                    // Integer values
                    case 'location_id':
                        $where[] = "post_parent = $match";
                        break;
                    case 'post_parent':
                    case 'post_author':
                    case 'ID':
                        $where[] = "$key = $match";
                        break;

                    // Date type, must include (>|<|>=) next to date value
                    case 'post_date':
                    case 'post_modified':
                        $where[] = "$key $match";
                        break;

                    // Default string values
                    case 'slug':
                        $key = 'post_name';
                    default:
                        $where[] = "$key = '$match'";
                }
            }
        }
                    
        $where_clauses = 'WHERE ' . implode( ' AND ', $where );

        $sql = "
            SELECT *
            FROM $wpdb->posts
            $where_clauses  
        ";
        
        if ( $output === 'sql' ) return $sql;

        $entities = $wpdb->get_results( $sql );
        
        return array_merge( $entities, $results );
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

    /**
     * Formats entity types based on second parameter
     * 
     * @param $results          array           the rows to format
     * @param $format           ?string         an entity field to format the key, 'instance' to return Entity instances (default: 'id')
     * @return                  array           formatted
     */
    public static function format( array $results, string $format = 'id' ) {
        if ( !count( $results ) ) return $results;
        
        if ( $format === 'instance' ) return self::format_to_instances( $results );
        if ( gettype( $format ) === 'boolean' ) return self::format_row_locations( $results );
        // Otherwise $format is a string
        return self::format_row_locations( $results, $format );
    }

    public static function format_to_instances( $rows ) {
        foreach ( (object) $rows as $key => $post ) {
            $rows[ $key ] = new Entity( $post->ID, null, \WP_Post::get_instance( $post->ID ) );
        }

        return $rows;
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