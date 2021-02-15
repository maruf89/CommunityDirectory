<?php
/**
 * Community Directory Entity aka User Profile related functions
 *
 * @since      2020.12
 * @author     Marius Miliunas <mvmiliunas@gmail.com>
 */

namespace Maruf89\CommunityDirectory\Includes;


use Maruf89\CommunityDirectory\Includes\Abstracts\Routable;
use Maruf89\CommunityDirectory\Includes\instances\{Project, Entity};
use Maruf89\CommunityDirectory\Includes\Interfaces\ISearchable;
use Maruf89\CommunityDirectory\Includes\Traits\{PostTypeMethods, Searchable, EntityChildClassMethods};

class ClassProjects extends Routable implements ISearchable {

    use PostTypeMethods, Searchable, EntityChildClassMethods;

    private static ClassProjects $instance;
    private static string $instance_class = Project::class;

    protected string $router_ns = 'projects';
    
    public static string $name = 'projects';
    public static string $post_type;
    public static int $post_type_menu_position = 29;

    public static function get_instance():ClassProjects {
        if ( !isset( self::$instance ) ) {
            self::$instance = new ClassProjects();
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
            'label' => __( 'Projects', 'community-directory' ),
            'labels' =>
                array(
                    'name' => __( 'Projects', 'community-directory' ),
                    'singular_name' => __( 'Project', 'community-directory' ),
                    'add_new' => __( 'Add Project', 'community-directory' ),
                    'add_new_item' => __( 'Add New Project', 'community-directory' ),
                    'edit_item' => __( 'Edit Project', 'community-directory' ),
                    'new_item' => __( 'New Project', 'community-directory' ),
                    'view_item' => __( 'View Project', 'community-directory' ),
                    'search_items' => __( 'Search Project', 'community-directory' ),
                    'not_found' => __( 'No Projects Found', 'community-directory' ),
                    'not_found_in_trash' => __( 'No Projects Found in Trash', 'community-directory' ),
                    'menu_name' => __( 'Projects', 'community-directory' ),
                    'name_admin_bar'     => __( 'Projects', 'community-directory' ),
                ),
            'public' => true,
            'description' => __( 'Community Directory Projects', 'community-directory' ), 
            'exclude_from_search' => false,
            'show_ui' => true,
            'show_in_menu' => true,
            'capability_type' => array( 'project', 'projects' ),
            'map_meta_cap'        => false,
            'capabilities' => array(
                'edit_post'          => 'edit_project', 
                'read_post'          => 'read_project', 
                'delete_post'        => 'delete_project', 
                'edit_posts'         => 'edit_projects', 
                'edit_others_posts'  => 'edit_others_projects', 
                'publish_posts'      => 'publish_projects',       
                'read_private_posts' => 'read_private_projects', 
                'create_posts'       => 'create_projects',
                'delete_posts'       => 'delete_projects',
                'delete_others_posts'=> 'delete_others_projects',
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

        Project::define_post_type( static::$post_type, $slug );

        register_post_type( static::$post_type, $custom_post_type_args );
    }

    /**
     * Updates the wp_query which by default loads all projects a user can see
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
     * Updates the number of Offer_Need posts a user sees
     * because default is to show all
     */
    public static function fix_post_counts($views) {
        global $current_user, $wp_query;
        unset($views['mine']);
        $types = array(
            array( 'status' =>  NULL ),
            array( 'status' => 'publish' ),
            array( 'status' => 'draft' ),
            array( 'status' => 'pending' ),
            array( 'status' => 'trash' )
        );
        foreach( $types as $type ) {
            $query = array(
                'author'      => $current_user->ID,
                'post_type'   => 'post',
                'post_status' => $type['status']
            );
            $result = new WP_Query($query);
            if( $type['status'] == NULL ):
                $class = ($wp_query->query_vars['post_status'] == NULL) ? ' class="current"' : '';
                $views['all'] = sprintf('<a href="%s" %s>%s <span class="count">(%d)</span></a>', 'all',
                    admin_url('edit.php?post_type=post'),
                    $class,
                    __( 'All', 'community-directory' ),
                    $result->found_posts
                );
            elseif( $type['status'] == 'publish' ):
                $class = ($wp_query->query_vars['post_status'] == 'publish') ? ' class="current"' : '';
                $views['publish'] = sprintf('<a href="%s" %s>%s <span class="count">(%d)</span></a>', 'publish',
                    admin_url('edit.php?post_status=publish&post_type=post'),
                    $class,
                    __( 'Published', 'community-directory' ),
                    $result->found_posts);
            elseif( $type['status'] == 'draft' ):
                $class = ($wp_query->query_vars['post_status'] == 'draft') ? ' class="current"' : '';
                $views['draft'] = sprintf('<a href="%s" %s>%s <span class="count">(%d)</span></a>', 'draft',
                    admin_url('edit.php?post_status=draft&post_type=post'),
                    $class,
                    _n( 'Draft', 'Drafts', (sizeof($result->posts)), 'community-directory' ),
                    $result->found_posts);
            elseif( $type['status'] == 'pending' ):
                $class = ($wp_query->query_vars['post_status'] == 'pending') ? ' class="current"' : '';
                $views['pending'] = sprintf('<a href="%s" %s>%s <span class="count">(%d)</span></a>', 'pending',
                    admin_url('edit.php?post_status=pending&post_type=post'),
                    $class,
                    __( 'Pending', 'community-directory' ),
                    $result->found_posts);
            elseif( $type['status'] == 'trash' ):
                $class = ($wp_query->query_vars['post_status'] == 'trash') ? ' class="current"' : '';
                $views['trash'] = sprintf('<a href="%s" %s>%s <span class="count">(%d)</span></a>', 'trash',
                    admin_url('edit.php?post_status=trash&post_type=post'),
                    $class,
                    __( 'Trash', 'community-directory' ),
                    $result->found_posts);
            endif;
        }
        return $views;
    }

    /**
     * Further fixes number of media items that appear for a given user
     */
    public static function fix_media_counts($views) {
        global $wpdb, $current_user, $post_mime_types, $avail_post_mime_types;
        $views = array();
        $count = $wpdb->get_results( "
            SELECT post_mime_type, COUNT( * ) AS num_posts 
            FROM $wpdb->posts 
            WHERE post_type = 'attachment' 
            AND post_author = $current_user->ID 
            AND post_status != 'trash' 
            GROUP BY post_mime_type
        ", ARRAY_A );
        foreach( $count as $row )
            $_num_posts[$row['post_mime_type']] = $row['num_posts'];
        $_total_posts = array_sum($_num_posts);
        $detached = isset( $_REQUEST['detached'] ) || isset( $_REQUEST['find_detached'] );
        if ( !isset( $total_orphans ) )
            $total_orphans = $wpdb->get_var("
                SELECT COUNT( * ) 
                FROM $wpdb->posts 
                WHERE post_type = 'attachment' 
                AND post_author = $current_user->ID 
                AND post_status != 'trash' 
                AND post_parent < 1
            ");
        $matches = wp_match_mime_types(array_keys($post_mime_types), array_keys($_num_posts));
        foreach ( $matches as $type => $reals )
            foreach ( $reals as $real )
                $num_posts[$type] = ( isset( $num_posts[$type] ) ) ? $num_posts[$type] + $_num_posts[$real] : $_num_posts[$real];
        $class = ( empty($_GET['post_mime_type']) && !$detached && !isset($_GET['status']) ) ? ' class="current"' : '';
        $views['all'] = "<a href='upload.php'$class>" . sprintf( '%s <span class="count">(%s)</span>', __( 'All', 'community-directory' ), __( 'uploaded files', 'community-directory' ), number_format_i18n( $_total_posts )) . '</a>';
        foreach ( $post_mime_types as $mime_type => $label ) {
            $class = '';
            if ( !wp_match_mime_types($mime_type, $avail_post_mime_types) )
                continue;
            if ( !empty($_GET['post_mime_type']) && wp_match_mime_types($mime_type, $_GET['post_mime_type']) )
                $class = ' class="current"';
            if ( !empty( $num_posts[$mime_type] ) )
                $views[$mime_type] = "<a href='upload.php?post_mime_type=$mime_type'$class>" . sprintf( translate_nooped_plural( $label[2], $num_posts[$mime_type] ), 'community-directory' ) . '</a>';
        }
        $views['detached'] = '<a href="upload.php?detached=1"' . ( $detached ? ' class="current"' : '' ) . '>' . sprintf( '%s <span class="count">(%s)</span>', __( 'Unattached', 'community-directory' ), 'detached files', $total_orphans ) . '</a>';
        return $views;
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
        $entity_loc_separator = OfferNeed::$entity_loc_separator;

        extract( $args );
        
        global $wpdb;
        $post_type = self::$post_type;

        $offer_need_type = '';
        if ( $type == 'need' || $type == 'offer' )
            $offer_need_type = "AND post_excerpt = '$type'";

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
            $offer_need_type
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