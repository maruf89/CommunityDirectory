<?php
/**
 * Community Directory Event related functions
 *
 * @since      0.6.5
 * @author     Marius Miliunas <mvmiliunas@gmail.com>
 */

namespace Maruf89\CommunityDirectory\Includes;


use Maruf89\CommunityDirectory\Includes\Abstracts\Routable;
use Maruf89\CommunityDirectory\Includes\instances\{Event, Entity};
use Maruf89\CommunityDirectory\Includes\Interfaces\ISearchable;
use Maruf89\CommunityDirectory\Includes\Traits\{PostTypeMethods, Searchable, EntityChildClassMethods};

class ClassEvents extends Routable implements ISearchable {

    use PostTypeMethods, Searchable, EntityChildClassMethods;

    private static ClassEvents $instance;
    private static string $instance_class = Event::class;

    protected string $router_ns = 'events';
    
    public static string $name = 'events';
    public static string $post_type;
    public static int $post_type_menu_position = 27;

    public static function get_instance():ClassEvents {
        if ( !isset( self::$instance ) ) {
            self::$instance = new ClassEvents();
        }
 
        return self::$instance;
    }

    public function __construct() {
        static::$post_type = ClassPublic::get_post_type_prefix() . static::$name;
        parent::__construct( $this );
    }

    /**
     * Register's the Entity post type
     */
    public static function register_post_type() {
        $slug = __( static::$name, 'community-directory' );
        $custom_post_type_args = array(
            'label' => __( 'Events', 'community-directory' ),
            'labels' =>
                array(
                    'name' => __( 'Events', 'community-directory' ),
                    'singular_name' => __( 'Event', 'community-directory' ),
                    'add_new' => __( 'Add Event', 'community-directory' ),
                    'add_new_item' => __( 'Add New Event', 'community-directory' ),
                    'edit_item' => __( 'Edit Event', 'community-directory' ),
                    'new_item' => __( 'New Event', 'community-directory' ),
                    'view_item' => __( 'View Event', 'community-directory' ),
                    'search_items' => __( 'Search Event', 'community-directory' ),
                    'not_found' => __( 'No Events Found', 'community-directory' ),
                    'not_found_in_trash' => __( 'No Events Found in Trash', 'community-directory' ),
                    'menu_name' => __( 'Events', 'community-directory' ),
                    'name_admin_bar'     => __( 'Events', 'community-directory' ),
                ),
            'public' => true,
            'description' => __( 'Community Directory Events', 'community-directory' ), 
            'exclude_from_search' => false,
            'show_ui' => true,
            'show_in_menu' => true,
            'capability_type' => array( 'event', 'events' ),
            'map_meta_cap'        => false,
            'capabilities' => array(
                'edit_post'          => 'edit_event', 
                'read_post'          => 'read_event', 
                'delete_post'        => 'delete_event', 
                'edit_posts'         => 'edit_events', 
                'edit_others_posts'  => 'edit_others_events', 
                'publish_posts'      => 'publish_events',       
                'read_private_posts' => 'read_private_events', 
                'create_posts'       => 'create_events',
                'delete_posts'       => 'delete_events',
                'delete_others_posts'=> 'delete_others_events',
            ),
            'supports' => array(
                'title',
                'custom_fields',
            ),
            'rewrite' => array(
                'slug' => $slug,
                'with_front' => false,
            ),
            'menu_position' => self::$post_type_menu_position,
            'delete_with_user' => true,
            'show_in_rest' => true,
        );

        Event::define_post_type( static::$post_type, $slug );

        register_post_type( static::$post_type, $custom_post_type_args );
    }

    /**
     * Updates the wp_query which by default loads all events a user can see
     * This restricts it to only their own
     */
    public static function pre_get_posts( $query ) {
        global $current_user, $wp_query;
        if( is_admin() && !current_user_can( 'edit_others_posts' ) ) {
            $wp_query->set( 'author', $current_user->ID );
            add_filter( 'views_edit-post', array( self::get_instance(), 'fix_post_counts' ) );
            add_filter( 'views_upload', array( self::get_instance(), 'fix_media_counts' ) );
        }
    }

    /**
     * ISearchable Implementation
     */
    public function get_search_fields( string $type, array $taxonomy = null ):array {
        $fields = [
            'search' => [
                'posts' => [
                    'post_title'
                ],
                'postmeta' => [
                    ClassACF::$projects_description,
                ],
            ],
            
            'taxonomy' => [
                TaxonomyProductService::$taxonomy,
                TaxonomyLocation::$taxonomy,
            ],
            
            'required' => [
                'postmeta' => [],
                'posts' => [
                    'post_type' => static::$post_type,
                    'post_status' => 'publish',
                    'post_excerpt' => $type,
                ]
            ]
        ];
        
        return $fields;
    }

    

    /**
     * @param       $array          array       the array to fill
     * @param       $type           string      (offer|need)
     * @param       $args           array       additional arguments
     * @return                      array       wp post object data
     * 
     * Additional arguments:
     *  entity_id           int             If passed, gets all offers/needs pertaining to an entity
     *  location_id         int             If passed, gets everything for a location
     *  product_service_id  int             If passed, gets all of a cd-product-service-type taxonomy
     *  status              string          Get of a post_status type (default: 'publish')
     *  sql_only            bool            Whether to return the sql query (default: false)
     */
    public function get_latest(
        array $array,
        string $type = '',
        array $args = []
    ):array {
        $default_args = array(
            'entity_post_id' => 0,
            'location_post_id' => 0,
            'product_service_id' => 0,
            'status' => 'publish',
            'sql_only' => false,
            'ignore_status' => false,
        );

        $args = wp_parse_args( $args, $default_args );

        extract( $args );
        
        global $wpdb;
        $post_type = self::$post_type;

        $where_status = '';
        if ( !empty( $status ) )
            $where_status .= "AND post_status = '$status'";

        $where_entity = '';
        if ( $entity_post_id ) {
            $where_entity = "AND post_parent regexp '^${entity_post_id}${entity_loc_separator}'";
        }

        $where_location = '';
        if ( $location_post_id ) {
            $where_location = "AND post_parent regexp '${entity_loc_separator}${location_post_id}$'";
        }

        $ignore_auto_draft = $ignore_status ? '' : "AND post_status != 'auto-draft'";

        $sql = "
            SELECT *
            FROM $wpdb->posts
            WHERE 1 = 1
            $ignore_auto_draft
            AND post_type = '$post_type' $where_entity $where_location $where_status
            ORDER BY post_modified DESC
        ";

        if ( $sql_only ) return $sql;
        
        $latest = $wpdb->get_results( $sql );

        return array_merge( $array, $latest );
    }

    

    protected array $route_map = [
        '/get'      => array(
            'callback'  => 'get',
            'args'      => array(
                'status_active'     => '?bool',
                'formatted'         => '?bool',
            )
        )
    ];

    public static function get_router_end_points( array $callback ):array {
        return array(
            '/get' => array(
                'methods'   => \WP_REST_Server::READABLE,
                'callback'  => $callback,
                'permission_callback' => function ( $request ) { return true; },
            )
        );
    }
}