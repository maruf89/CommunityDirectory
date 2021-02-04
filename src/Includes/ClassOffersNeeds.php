<?php
/**
 * Community Directory Entity aka User Profile related functions
 *
 * @since      2020.12
 * @author     Marius Miliunas <mvmiliunas@gmail.com>
 */

namespace Maruf89\CommunityDirectory\Includes;


use Maruf89\CommunityDirectory\Includes\Abstracts\Routable;
use Maruf89\CommunityDirectory\Includes\instances\{OfferNeed, Entity, ProductServiceTerm};
use Maruf89\CommunityDirectory\Includes\Interfaces\ISearchable;
use Maruf89\CommunityDirectory\Includes\Traits\{PostTypeMethods, Searchable};

class ClassOffersNeeds extends Routable implements ISearchable {

    use PostTypeMethods, Searchable;

    private static ClassOffersNeeds $instance;
    private static string $instance_class = OfferNeed::class;

    protected string $router_ns = 'offers-needs';
    
    public static string $name = 'offers-needs';
    public static string $post_type;
    public static string $taxonomy = 'cd-product-service-type';
    public static int $post_type_menu_position = 28;

    private bool $_replacing_checkboxes = false;

    public static function get_instance():ClassOffersNeeds {
        if ( !isset( self::$instance ) ) {
            self::$instance = new ClassOffersNeeds();
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
        $slug = __( 'offer-need', 'community-directory' );
        $custom_post_type_args = array(
            'label' => __( 'Offers & Needs', 'community-directory' ),
            'labels' =>
                array(
                    'name' => __( 'Offers & Needs', 'community-directory' ),
                    'singular_name' => __( 'Offer or Need', 'community-directory' ),
                    'add_new' => __( 'Add Offer or Need', 'community-directory' ),
                    'add_new_item' => __( 'Add New Offer or Need', 'community-directory' ),
                    'edit_item' => __( 'Edit Offer or Need', 'community-directory' ),
                    'new_item' => __( 'New Offer or Need', 'community-directory' ),
                    'view_item' => __( 'View Offer or Need', 'community-directory' ),
                    'search_items' => __( 'Search Offer or Need', 'community-directory' ),
                    'not_found' => __( 'No Offers & Needs Found', 'community-directory' ),
                    'not_found_in_trash' => __( 'No Offers & Needs Found in Trash', 'community-directory' ),
                    'menu_name' => __( 'Offers & Needs', 'community-directory' ),
                    'name_admin_bar'     => __( 'Offers & Needs', 'community-directory' ),
                ),
            'public' => true,
            'description' => __( 'Community Directory Offers & Needs', 'community-directory' ), 
            'exclude_from_search' => false,
            'show_ui' => true,
            'show_in_menu' => true,
            'capability_type' => array( 'offer_need', 'offers_needs' ),
            'map_meta_cap'        => false,
            'capabilities' => array(
                'edit_post'          => 'edit_offer_need', 
                'read_post'          => 'read_offer_need', 
                'delete_post'        => 'delete_offer_need', 
                'edit_posts'         => 'edit_offers_needs', 
                'edit_others_posts'  => 'edit_others_offers_needs', 
                'publish_posts'      => 'publish_offers_needs',       
                'read_private_posts' => 'read_private_offers_needs', 
                'create_posts'       => 'create_offers_needs',
                'delete_posts'       => 'delete_offers_needs',
                'delete_others_posts'=> 'delete_others_offers_needs',
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
            'taxonomies' => array( self::$taxonomy )
        );

        OfferNeed::define_post_type( static::$post_type, $slug );

        register_post_type( static::$post_type, $custom_post_type_args );
    }

    /**
     * Filters the HTML on the edit OffersNeeds cpt to replace the category checkboxes with radio buttons
     */
    public function replace_terms_to_radio_start( string $post_type, \WP_Post $post ) {
        if ( $post_type === static::$post_type ) {
            $this->_replacing_checkboxes = true;
            ob_start();
        }
    }

    public function replace_terms_to_radio_end() {
        if ( $this->_replacing_checkboxes ) {
            $this->_replacing_checkboxes = false;
            echo str_replace( '"checkbox"', '"radio"', ob_get_clean() );
        }
    }

    /**
     * Updates the wp_query which by default loads all offers_needs a user can see
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
                    ClassACF::$offers_needs_description,
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

    public static function format_to_instances( $rows ) {
        foreach ( (object) $rows as $key => $post )
            $rows[ $key ] = new OfferNeed( $post->ID, null, \WP_Post::get_instance( $post->ID ) );

        return $rows;
    }

    /**
     * Updates the offers/needs cpt post_status to reflect whether
     * the parent entity is active or not
     */
    public function entity_changed_activation( Entity $entity, bool $activated, bool $status_only ) {
        global $wpdb;
        $post_type = static::$post_type;
        $offers_needs_sql = $wpdb->prepare("
            SELECT post.ID
            FROM $wpdb->posts as post
            LEFT JOIN $wpdb->postmeta as meta
            ON post.ID = meta.post_ID
            WHERE post.post_author = %d
            AND post.post_type = '%s'
            AND meta.meta_key = '%s'
            AND meta.meta_value = 'true'
        ",
        $entity->author_id, $post_type,
        ClassACF::$offers_needs_active);

        $offers_needs = $wpdb->get_results( $offers_needs_sql );

        if ( !count( $offers_needs ) ) return;

        // If entity isn't active, offers_needs will get altered statuses
        $post_status_addition = $activated ? 0 : 2;
        $offers_needs = static::format_to_instances( $offers_needs );

        foreach ( $offers_needs as $on ) {
            $on_active = $on->get_status();
            $post_status_count = $post_status_addition + ( $on_active ? 1 : 0 );
            $post_status = community_directory_bool_to_status( $post_status_count, 'offer_need', 'post' );
            $on->update_post( array( 'post_status' => $post_status ) );
        }
    }

    protected array $route_map = [
        '/get'      => array(
            'callback'  => 'get',
            'args'      => array(
                'status_active'     => '?bool',
                'with_inhabitants'  => '?bool',
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