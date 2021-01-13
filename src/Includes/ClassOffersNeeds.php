<?php
/**
 * Community Directory Entity aka User Profile related functions
 *
 * @since      2020.12
 * @author     Marius Miliunas <mvmiliunas@gmail.com>
 */

namespace Maruf89\CommunityDirectory\Includes;


use Maruf89\CommunityDirectory\Includes\Abstracts\Routable;
use Maruf89\CommunityDirectory\Includes\instances\{OfferNeed, Entity};
use Maruf89\CommunityDirectory\Includes\Interfaces\ISearchable;
use Maruf89\CommunityDirectory\Includes\Traits\{PostTypeMethods, Searchable};

class ClassOffersNeeds extends Routable implements ISearchable {

    use PostTypeMethods, Searchable;

    private static ClassOffersNeeds $instance;
    private static string $instance_class = OfferNeed::class;

    protected string $router_ns = 'offers-needs';
    
    public static string $post_type = 'cd-offers-needs';
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
        parent::__construct( $this );
    }

    /**
     * Register's the Entity post type
     */
    public static function register_post_type() {
        $post_type = self::$post_type;
        
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
                'slug' => __( 'offer-need', 'community-directory' ),
                'with_front' => false,
            ),
            'menu_position' => self::$post_type_menu_position,
            'delete_with_user' => true,
            'show_in_rest' => true,
            'taxonomies' => array( self::$taxonomy )
        );

        register_post_type( $post_type, $custom_post_type_args );
    }

    /**
     * Called via 'after_setup_theme' action
     * 
     * Gathers the categories to be added
     */
    public function register_taxonomy_terms() {
        $custom_taxonomy_args = array(
            'hierarchical' => true,
            'label' => __( 'Product & Service Types', 'community-directory' ), // display name
            'query_var' => true,
            'labels' => array(
                'name' => __( 'Product & Service Types', 'community-directory' ),
                'singular_name' => __( 'Product & Service Type', 'community-directory' ),
                'search_items' =>  __( 'Search Product & Service Types' ),
                'all_items' => __( 'All Product & Service Types', 'community-directory' ),
                'parent_item' => __( 'Parent Product & Service Type', 'community-directory' ),
                'parent_item_colon' => __( 'Parent Product & Service Type:', 'community-directory' ),
                'edit_item' => __( 'Edit Product & Service Type' , 'community-directory'), 
                'update_item' => __( 'Update Product & Service Type', 'community-directory' ),
                'add_new_item' => __( 'Add New Product & Service Type', 'community-directory' ),
                'new_item_name' => __( 'New Product & Service Type Name', 'community-directory' ),
                'menu_name' => __( 'Product & Service Types', 'community-directory' ),
            ),
            'capabilities' => array(
                'manage_terms' => 'manage_product_service_type',
                'edit_terms' => 'edit_product_service_type',
                'delete_terms' => 'delete_product_service_type',
                'assign_terms' => 'assign_product_service_type',
            ),
            'rewrite' => array(
                'slug' => __( 'product-service-type', 'community-directory' ),
                'with_front' => false  // Don't display the category base before
            )
        );

        register_taxonomy( self::$taxonomy, self::$post_type, $custom_taxonomy_args );
        
        $categories = $this->_default_categories;
        $categories = apply_filters( 'community_directory_offers_needs_default_categories', $categories );
        $this->add_term_categories( $categories );
    }

    /**
     * Filters the HTML on the edit OffersNeeds cpt to replace the category checkboxes with radio buttons
     */
    public function replace_terms_to_radio_start( string $post_type, \WP_Post $post ) {
        if ( $post_type === self::$post_type ) {
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
                $views[$mime_type] = "<a href='upload.php?post_mime_type=$mime_type'$class>" . sprintf( translate_nooped_plural( $label[2], $num_posts[$mime_type] ), $num_posts[$mime_type] ) . '</a>';
        }
        $views['detached'] = '<a href="upload.php?detached=1"' . ( $detached ? ' class="current"' : '' ) . '>' . sprintf( '%s <span class="count">(%s)</span>', __( 'Unattached', 'community-directory' ), 'detached files', $total_orphans ) . '</a>';
        return $views;
    }

    /**
     * Registers Product/Service categories in WP
     */
    public function add_term_categories( array $categories, array $parent = null ) {
        foreach ( $categories as $key => $term_or_arr ) {
            $term_type = gettype( $term_or_arr );
            if ( $term_type === 'array' ) {
                $group_parent = $this->_insert_term_category( $key, $parent );
                if ( $group_parent instanceof \WP_Error ) return;
                $this->add_term_categories( $term_or_arr, $group_parent );
            } else $this->_insert_term_category( $term_or_arr, $parent );
        }
    }

    private function _insert_term_category( string $term, array $parent = null ) {
        $translated = __( $term, 'community-directory' );
        $slug = sanitize_title_with_dashes( community_directory_function_transliterate_string( $translated ) );
        return wp_insert_term(
            mb_convert_case( $translated, MB_CASE_TITLE, 'UTF-8'),
            self::$taxonomy,
            array(
                'slug' => $slug,
                'parent' => gettype( $parent ) === 'array' ? $parent['term_id'] : 0,
            )
        );
    }

    protected array $_default_categories = [
        'food & drink' => array(
            'ingredients',
            'vegetables',
            'fruit',
            'meat',
            'mushrooms',
            'grains',
            'dairy products',
            'desert',
            'fish',
            'drinks',
            'services' => array(
                'catering',
            ),
            'other',
        ),
        'home & construction' => array(
            'furniture',
            'kitchen',
            'flowers',
            'bathroom',
            'bedroom & sleeping',
            'services' => array(
                'handyman',
                'cleaning',
                'carpentry',
                'plumbing',
                'electric work',
            ),
            'other',
        ),
        'garden, farm, forest' => array(
            'flowers',
            'seeds',
            'trees & plants',
            'animals',
            'equipment',
            'services' => array(
                'landscaping',
                'farm help',
            ),
            'other',
        ),
        'real-estate' => array(
            'apartment',
            'land',
            'rent',
            'cottage',
            'services' => array( 
                'realty',
            ),
            'other',
        ),
        'transportas' => array(
            'bikes',
            'vehicles',
            'courier',
            'carpooling',
            'services',
            'other',
        ),
        'technology' => array(
            'phones',
            'tablets',
            'computers',
            'accessories',
            'services' => array(
                'technical repair',
                'web consulting & websites',
            ),
            'other',
        ),
        'entertainment' => array(
            'books & movies',
            'hunting & fishing',
            'music',
            'games',
            'services' => array(
                'musical performance',
                'acting performance',
            ),
            'other',
        ),
        'clothing' => array(
            "men's clothing",
            "women's clothing",
            'special occasion',
            'services',
            'other',
        ),
        'children' => array(
            "children's clothing",
            'toys',
            'school supplies',
            'accessories',
            'services',
            'other',
        ),
        'personal development & health' => array(
            'coaching, therapy, psychiatry',
            'doctor',
            'beauty',
            'education' => array(
                'math',
                'science',
                'spiritual',
                'healthy eating',
            ),
            'sports & exercise',
            'other',
        ),
        'work' => array(
            'accounting',
            'legal',
            'other',
        ),
        'arts & crafts' => array(
            'services',
            'other',
        ),
        'give away' => array()
    ];

    /**
     * ISearchable Implementation
     */
    public function get_meta_search_fields():array {
        $fields = [
            'search' => [
                'post' => [
                    'post_title'
                ],
                'meta' => [
                    ClassACF::$offers_needs_hashtag_title,
                    ClassACF::$offers_needs_description,
                ]
            ],
            'required' => [
                'meta' => [],
                'post' => [
                    'post_type' => static::$post_type,
                    'post_status' => 'publish',
                ]
            ]
        ];

        $fields[ 'required' ][ 'meta' ][ ClassACF::$offers_needs_active ] = [ '=', 'true' ];
        
        return $fields;
    }

    

    /**
     * @param       $array          array       the array to fill
     * @param       $type           string      (offer|need)
     * @param       $entity_post_id int         post id of the entity that created this
     * @param       $sql_only       bool        whether to only return the sql
     */
    public function get_latest(
        array $array,
        string $type,
        int $entity_post_id = null,
        int $location_post_id = null,
        string $status = 'publish',
        bool $sql_only = false
    ):array {
        global $wpdb;
        $post_type = self::$post_type;

        if ( $type !== 'need' && $type !== 'offer' ) die( 'Invalid type passed to ClassOffersNeeds->get_latest()' );

        $where_status = '';
        if ( !empty( $status ) )
            $where_status .= "AND post_status = '$status'";

        $where_entity = '';
        if ( $entity_post_id ) {
            $where_entity = "AND post_parent regexp '^$entity_post_id'";
        }

        $where_location = '';
        if ( $location_post_id ) {
            $where_location = "AND post_parent regexp '$location_post_id$'";
        }

        $sql = "
            SELECT *
            FROM $wpdb->posts
            WHERE post_status != 'auto-draft'
            AND post_type = '$post_type' $where_entity $where_location $where_status
            AND post_excerpt = '$type'
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

// Category translations
__( 'food & drink', 'community-directory' );
    __( 'ingredients', 'community-directory' );
    __( 'vegetables', 'community-directory' );
    __( 'fruit', 'community-directory' );
    __( 'meat', 'community-directory' );
    __( 'mushrooms', 'community-directory' );
    __( 'grains', 'community-directory' );
    __( 'dairy products', 'community-directory' );
    __( 'desert', 'community-directory' );
    __( 'fish', 'community-directory' );
    __( 'drinks', 'community-directory' );
    __( 'services', 'community-directory' );
        __( 'catering', 'community-directory' );
    __( 'other', 'community-directory' );
__( 'home & construction', 'community-directory' );
    __( 'furniture', 'community-directory' );
    __( 'kitchen', 'community-directory' );
    __( 'flowers', 'community-directory' );
    __( 'bathroom', 'community-directory' );
    __( 'bedroom & sleeping', 'community-directory' );
        __( 'handyman', 'community-directory' );
        __( 'cleaning', 'community-directory' );
        __( 'carpentry', 'community-directory' );
        __( 'plumbing', 'community-directory' );
        __( 'electric work', 'community-directory' );
__( 'garden, farm, forest', 'community-directory' );
    __( 'flowers', 'community-directory' );
    __( 'seeds', 'community-directory' );
    __( 'trees & plants', 'community-directory' );
    __( 'animals', 'community-directory' );
    __( 'equipment', 'community-directory' );
        __( 'landscaping', 'community-directory' );
        __( 'farm help', 'community-directory' );
__( 'real-estate', 'community-directory' );
    __( 'apartment', 'community-directory' );
    __( 'land', 'community-directory' );
    __( 'rent', 'community-directory' );
    __( 'cottage', 'community-directory' );
        __( 'realty', 'community-directory' );
__( 'transportation', 'community-directory' );
    __( 'bikes', 'community-directory' );
    __( 'vehicles', 'community-directory' );
    __( 'courier', 'community-directory' );
    __( 'carpooling', 'community-directory' );
__( 'technology', 'community-directory' );
    __( 'phones', 'community-directory' );
    __( 'tablets', 'community-directory' );
    __( 'computers', 'community-directory' );
    __( 'accessories', 'community-directory' );
        __( 'technical repair', 'community-directory' );
        __( 'web consulting & websites', 'community-directory' );
__( 'entertainment', 'community-directory' );
    __( 'books & movies', 'community-directory' );
    __( 'hunting & fishing', 'community-directory' );
    __( 'music', 'community-directory' );
    __( 'games', 'community-directory' );
        __( 'musical performance', 'community-directory' );
        __( 'acting performance', 'community-directory' );
__( 'clothing', 'community-directory' );
    __( "men's clothing", 'community-directory' );
    __( "women's clothing", 'community-directory' );
    __( 'special occasion', 'community-directory' );
__( 'children', 'community-directory' );
    __( "children's clothing", 'community-directory' );
    __( 'toys', 'community-directory' );
    __( 'school supplies', 'community-directory' );
    __( 'accessories', 'community-directory' );
__( 'personal development & health', 'community-directory' );
    __( 'coaching, therapy, psychiatry', 'community-directory' );
    __( 'doctor', 'community-directory' );
    __( 'beauty', 'community-directory' );
    __( 'education', 'community-directory' );
        __( 'math', 'community-directory' );
        __( 'science', 'community-directory' );
        __( 'spiritual', 'community-directory' );
        __( 'healthy eating', 'community-directory' );
    __( 'sports & exercise', 'community-directory' );
__( 'work', 'community-directory' );
    __( 'accounting', 'community-directory' );
    __( 'legal', 'community-directory' );
__( 'arts & crafts', 'community-directory' );
__( 'give away', 'community-directory' );