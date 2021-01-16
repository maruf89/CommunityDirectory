<?php

namespace Maruf89\CommunityDirectory\Includes;

use Maruf89\CommunityDirectory\Admin\{ClassAdmin, ClassAdminPostDisplay, ClassAccount};
use Maruf89\CommunityDirectory\Admin\Menus\{ClassAdminMenus, ClassMenuItems};
use Maruf89\CommunityDirectory\Admin\Settings\ClassUWPFormBuilder;
use Maruf89\CommunityDirectory\Admin\Widgets\{ClassLocationsWidget, ClassOffersNeedsHashTagWidget};
use Maruf89\CommunityDirectory\Email\ClassTransactionalMailer;


final class ClassCommunityDirectory {

    /**
     * The current version of the plugin.
     *
     * @since    2020.11
     * @access   protected
     * @var      string    $version    The current version of the plugin.
     */
    protected string $version;
    public static string $inactive_post_status = 'inactive';
    
    private static ?ClassCommunityDirectory $instance = null;

    protected ClassPublic $public;
    protected ClassAdminMenus $admin_menus;
    protected ClassMenuItems $menu_items;
    protected ClassTables $tables;
    protected ClassAdmin $admin;
    protected ClassLocation $location;
    protected ClassOffersNeeds $offers_needs;
    protected ClassUWPForms $uwp_forms;
    protected ClassShortcodes $shortcodes;
    protected ClassACF $acf;
    protected ClassRestEndPoints $rest_end_points;
    protected ClassSearch $search;

    protected ClassUWPFormBuilder $uwp_form_builder;
    protected ClassAdminPostDisplay $admin_post_display;
    protected ClassAccount $account;

    protected ClassLocationsWidget $locations_widget;

    public static function init() {
        if (self::$instance === null) self::$instance = new self;
        return self::$instance;
    }

    public function __construct() {
        $this->plugin_name = COMMUNITY_DIRECTORY_NAME;
        $this->version = COMMUNITY_DIRECTORY_VERSION;

        $this->load_dependencies();

        $this->public = new ClassPublic();
        $this->entity = ClassEntity::get_instance();
        $this->location = ClassLocation::get_instance();
        $this->offers_needs = ClassOffersNeeds::get_instance();
        $this->rest_end_points = ClassRestEndPoints::get_instance();
        
        $this->init_hooks();

        $this->admin_menus = new ClassAdminMenus();
        $this->menu_items = new ClassMenuItems();
        $this->tables = new ClassTables();
        $this->admin = new ClassAdmin();
        $this->uwp_forms = new ClassUWPForms();
        $this->shortcodes = new ClassShortcodes();
        $this->acf = new ClassACF();

        $this->admin_uwpform_builder = new ClassUWPFormBuilder();
        $this->admin_post_display = ClassAdminPostDisplay::get_instance();
        $this->account = new ClassAccount();
        $this->search = new ClassSearch();

        // actions and filters
        $this->load_assets_actions_and_filters( $this->public );
        $this->load_tables_actions_and_filters( $this->tables );
        $this->load_location_actions_and_filters( $this->location );
        $this->load_uwp_forms_actions_and_filters( $this->uwp_forms );
        $this->load_public_actions_and_filters( $this->public );
        $this->load_template_actions_and_filters( $this->public );
        $this->load_entity_actions_and_filters( $this->entity );
        $this->load_acf_actions_and_filters( $this->acf );
        $this->load_offers_needs_actions_and_filters( $this->offers_needs );

        $this->load_instance_offers_needs_actions_and_filters( __NAMESPACE__ . '\\instances\\OfferNeed' );
        $this->load_instance_entity_actions_and_filters( __NAMESPACE__ . '\\instances\\Entity' );
        $this->load_instance_location_actions_and_filters( __NAMESPACE__ . '\\instances\\Location' );

        if ( ClassTransactionalMailer::enabled() )
            $this->load_mail_actions_and_filters( ClassTransactionalMailer::get_instance() );

        // shortcodes
        $this->load_shortcodes( $this->shortcodes );

        // admin
        $this->load_account_actions_and_filters( $this->account );
        $this->load_menus_actions_and_filters( $this->admin_menus );
        $this->load_uwp_form_hooks_and_filters( $this->admin_uwpform_builder );
        $this->load_admin_post_display_hooks_and_filters( $this->admin_post_display );
    }

    public function has_required_plugins() {
        if ( is_admin() && current_user_can( 'activate_plugins' ) &&
            (!is_plugin_active( 'userswp/userswp.php' ) ||
            !is_plugin_active( 'advanced-custom-fields/acf.php') )
        ) {
            add_action( 'admin_notices', array( $this, 'child_plugin_notice' ) );

            deactivate_plugins( plugin_basename( __FILE__ ) ); 

            if ( isset( $_GET['activate'] ) ) {
                unset( $_GET['activate'] );
            }
        }
    }

    public function child_plugin_notice() {
        ?>
            <div class="error">
                <p>Sorry, but Community Directory Plugin requires the 
                    <a href="https://wordpress.org/plugins/userswp" target="_blank">UsersWP</a> and 
                    <a href="https://wordpress.org/plugins/advanced-custom-fields" target="_blank">Advanced Custom Fields</a> 
                    to be installed and active.
                </p>
            </div>
        <?php
    }

    /**
     * Hook into actions and filters.
     */
    private function init_hooks() {
        register_activation_hook( COMMUNITY_DIRECTORY_PLUGIN_FILE, array( __NAMESPACE__ . '\\ClassActivator', 'activate' ) );
        register_deactivation_hook( COMMUNITY_DIRECTORY_PLUGIN_FILE, array( __NAMESPACE__ . '\\ClassActivator', 'deactivate' ) );
        add_action( 'admin_init', array( __NAMESPACE__ . '\\ClassActivator', 'automatic_upgrade') );
        add_action( 'init', array( $this, 'load_plugin_textdomain' ) );
        add_action( 'init', array( $this, 'has_required_plugins' ), 10, 1 );
        add_action( 'init', array( $this, 'register_error_handler' ), 10, 1 );
        add_action( 'init', array( $this->location, 'register_post_type' ) );
        add_action( 'init', array( $this->entity, 'register_post_type' ) );
        add_action( 'init', array( $this->offers_needs, 'register_post_type' ) );
        add_action( 'init', array( $this, 'register_post_status' ) );
        add_action( 'after_setup_theme', array( $this->offers_needs, 'register_taxonomy_terms' ) );
        add_action( 'rest_api_init', array( $this->rest_end_points, 'on_init' ) );
	    add_action( 'community_directory_flush_rewrite_rules', array( $this, 'flush_rewrite_rules' ) );
        add_action( 'community_directory_language_file_add_string', array( $this, 'register_string' ), 10, 1 );
        add_action( 'widgets_init', array( $this, 'load_widgets' ) );
    }

    /**
     * Actions for assets
     *
     * @param $instance
     */
    public function load_assets_actions_and_filters( ClassPublic $instance) {
        add_action( 'wp_enqueue_scripts', array( $instance, 'enqueue_styles' ) );
        add_action( 'wp_enqueue_scripts', array( $instance, 'enqueue_scripts' ) );
        add_action ( 'wp_head', [ $instance, 'global_js_variables'] );
    }

    /**
     * Actions for database tables
     *
     * @param $instance
     */
    public function load_tables_actions_and_filters( ClassTables $instance ) {
        add_action( 'community_directory_create_tables', array( $instance, 'create_tables' ), 10, 0 );
        add_filter( 'wpmu_drop_tables', array( $instance, 'drop_tables_on_delete_blog' ) );
    }

    /**
     * Actions for location
     *
     * @param $instance
     */
    public function load_location_actions_and_filters( ClassLocation $instance ) {
        add_filter( 'community_directory_get_post_types', array( $instance, 'add_post_type' ), 10, 1 );

        add_filter( 'community_directory_get_locations', array( $instance, 'get' ), 10, 4 );
        add_filter( 'community_directory_format_locations', array( $instance, 'format' ), 10, 2 );

        // Delete location
        add_action( 'wp_ajax_location_delete', array( $instance, 'delete_location_ajax' ), 10, 0 );
        add_action( 'community_directory_delete_location', array( $instance, 'delete_location' ), 10, 1 );

        // Create location
        add_action( 'community_directory_create_locations', array( $instance, 'create_locations' ), 10, 1 );
        add_filter( 'community_directory_create_location_if_doesnt_exist', array( $instance, 'create_if_doesnt_exist' ), 10, 1 );

        // Update values
        add_action( 'community_directory_update_locations', array( $instance, 'update_locations' ), 10, 1 );
    }

    /**
     * Actions & Filters for rendering UsersWP forms relating to this plugin
     */
    public function load_uwp_forms_actions_and_filters( ClassUWPForms $instance ) {
        add_filter( 'uwp_form_input_html_locationselect', array( $instance, 'builder_extra_fields_locationselect' ), 10, 4 );
    }

    public function load_shortcodes( ClassShortcodes $instance ) {
        add_shortcode( 'community_directory_list_offers_needs', array( $instance, 'list_offers_needs' ) );
        add_shortcode( 'community_directory_list_offers_needs_hashtag_list', array( $instance, 'list_offers_needs_hashtag' ) );
        add_shortcode( 'community_directory_list_entities', array( $instance, 'list_entities' ) );
    }

    public function load_public_actions_and_filters( ClassPublic $instance ) {
        add_filter( 'single_template', array( $instance, 'load_custom_templates' ), 99 );
        add_filter( 'wp_get_nav_menu_items', array( $instance, 'custom_nav_menu' ), 20, 2 );
        add_action( 'pre_get_posts', array( $instance, 'pre_get_posts' ), 1 );
    }

    public function load_template_actions_and_filters( ClassPublic $instance ) {
        list( $prefix, $len ) = ClassPublic::get_template_hook_prefix();
        add_filter( "${prefix}location/location-list.php", array( $instance, 'load_template' ), 10, 1 );
        add_filter( "${prefix}location/location-map.php", array( $instance, 'load_template' ), 10, 1 );
        add_filter( "${prefix}elements/location-single.php", array( $instance, 'load_template' ), 10, 1 );
        add_filter( "${prefix}offers-and-needs-no-results.php", array( $instance, 'load_template' ), 10, 1 );
        add_filter( "${prefix}offers-and-needs-list.php", array( $instance, 'load_template' ), 10, 1 );
        add_filter( "${prefix}offers_needs_hashtag_list.php", array( $instance, 'load_template' ), 10, 1 );
        add_filter( "${prefix}elements/offer-need-single.php", array( $instance, 'load_template' ), 10, 1 );
        add_filter( "${prefix}elements/entity-single.php", array( $instance, 'load_template' ), 10, 1 );
        add_filter( "${prefix}entity-list.php", array( $instance, 'load_template' ), 10, 1 );
        add_filter( "${prefix}entity-list.php", array( $instance, 'load_template' ), 10, 1 );
        add_filter( "${prefix}search/cd-offers-needs.php", array( $instance, 'load_template' ), 10, 1 );
        add_filter( "${prefix}search/cd-entity.php", array( $instance, 'load_template' ), 10, 1 );

        list( $admin_prefix, $len ) = ClassPublic::get_template_hook_prefix( 'admin' );
        add_filter( "${admin_prefix}modals/location-select.php", array( $instance, 'load_admin_template' ), 10, 1 );
        add_filter( "${admin_prefix}modals/openstreetmap.php", array( $instance, 'load_admin_template' ), 10, 1 );
    }

    public function load_entity_actions_and_filters( ClassEntity $instance ) {
        add_filter( 'community_directory_get_entities', array( $instance, 'get' ), 10, 4 );

        add_filter( 'community_directory_get_post_types', array( $instance, 'add_post_type' ), 10, 3 );
    }

    public function load_acf_actions_and_filters( ClassACF $instance ) {
        add_action( 'acf/init', array( $instance, 'initiate_plugin' ) );
        add_action( 'community_directory_acf_initiate_entity', array( $instance, 'initiate_entity' ) );
        add_action( 'community_directory_acf_update', array( $instance, 'update' ), 10, 2 );

        add_filter( 'community_directory_required_acf_entity_fields', array( $instance, 'generate_required_entity_fields' ), 10, 1 );
        add_filter( 'community_directory_required_acf_offers_needs_fields', array( $instance, 'generate_required_offers_needs_fields' ), 10, 1 );
    }

    public function load_offers_needs_actions_and_filters( ClassOffersNeeds $instance ) {
        add_action( 'add_meta_boxes', array( $instance, 'replace_terms_to_radio_start' ), 10, 2);
        add_action( 'dbx_post_sidebar', array( $instance, 'replace_terms_to_radio_end' ) );
        add_action( 'pre_get_posts', array( $instance, 'pre_get_posts' ), 1 );
        add_action( 'community_directory_entity_changed_activation', [ $instance, 'entity_changed_activation' ], 10, 3 );
        add_filter( 'community_directory_get_offers_needs', array( $instance, 'get' ), 10, 4 );
        add_filter(
            'community_directory_get_latest_offers_needs',
            array( $instance, 'get_latest' ), 10, 5 );
        add_filter( 'community_directory_format_offers_needs_to_instances', array( $instance, 'format_to_instances' ), 10, 1 );
    }

    // OfferNeed
    public function load_instance_offers_needs_actions_and_filters( string $class_name ) {
        // On saving the type, sets the excerpt field to (offer|need)
        add_filter(
            'acf/update_value/key=' . ClassACF::$offers_needs_type_key,
            array( $class_name, 'update_post_excerpt_with_type' ), 10, 3 );
        add_filter(
            'acf/update_value/key=' . ClassACF::$offers_needs_active_key,
            array( $class_name, 'acf_activation_changed' ), 10, 3 );

        add_action( 'wp_insert_post_data', array( $class_name, 'set_post_props_on_save' ), 10, 3 );
    }

    // Entity
    public function load_instance_entity_actions_and_filters( string $class_name ) {
        add_filter(
            'acf/update_value/key=' . ClassACF::$entity_active_key,
            array( $class_name, 'acf_shift_inhabitants_count' ), 10, 3 );
        add_filter(
            'acf/update_value/key=' . ClassACF::$entity_location_name_key,
            array( $class_name, 'acf_update_title_with_loc_name' ), 10, 3 );

        add_filter( 'community_directory_get_entity', array( $class_name, 'get_instance' ), 10, 3 );

        add_action(
            'community_directory_activate_deactivate_entity',
            array( $class_name, 'activate_deactivate_entity' ), 10, 3 );
    }

    // Location
    public function load_instance_location_actions_and_filters( string $class_name ) {
        add_filter( 'community_directory_get_location', array( $class_name, 'get_instance' ), 10, 3 );
        add_filter( 'community_directory_prepare_location_for_creation', array( $class_name, 'prepare_for_creation' ), 10, 2 );

        add_action( 'community_directory_add_inhabitant', array( $class_name, 'add_inhabitant' ), 10, 4 );

        
        add_action( 'community_directory_shift_inhabitants_count', array( $class_name, 'shift_inhabitants_count' ), 10, 3 );
    }

    public function load_mail_actions_and_filters( ClassTransactionalMailer $instance ) {
        add_action( 'uwp_activation_key', array( $instance, 'send_welcome_email' ), 10, 2 );
        add_action( 'retrieve_password_key', array( $instance, 'send_forgotten_password_email' ), 10, 2 );
    }
    
    /**
     * Actions & Filters for account & registration
     */
    public function load_account_actions_and_filters( $instance ) {
        add_filter( 'uwp_validate_fields_before', array( $instance, 'validate_user_registration_before' ), 11, 3 );
        add_filter( 'uwp_before_extra_fields_save', array( $instance, 'save_data_to_user_meta' ), 11, 3 );
        add_filter( 'community_directory_first_entity_login_link', array( $instance, 'get_first_entity_login_link' ), 10, 3 );
        add_action('wp_login', array( $instance, 'check_first_login' ), 10, 2);
    }

    /**
     * Actions for admin menus
     *
     * @param $instance
     */
    public function load_menus_actions_and_filters() {
        // add_action( 'load-nav-menus.php', array($instance, 'users_wp_admin_menu_metabox') );
        add_action( 'admin_bar_menu', array( $this->admin_menus, 'admin_bar_menu'), 51 );
        add_action( 'admin_menu', array( $this->admin_menus, 'admin_menu' ), 9 );

        add_action( 'admin_bar_menu', array( $this->admin_menus, 'modify_toolbar' ), 75);
        add_action( 'admin_menu', array( $this->admin_menus, 'modify_entity_subscriber_menu' ), 75);


        add_action( 'load-nav-menus.php', array( $this->menu_items, 'customize_menu_metaboxes') );
    }

    public function load_uwp_form_hooks_and_filters( $instance ) {
        add_filter( 'uwp_form_fields_predefined', array( $instance, 'load_uwp_form_fields' ), 10, 2 );
    }

    public function load_admin_post_display_hooks_and_filters( $instance ) {
        $entity = ClassEntity::$post_type;
        $offer_need = ClassOffersNeeds::$post_type;
        add_filter( "manage_${entity}_posts_columns", array( $instance, 'entity_post_column_head' ), 10, 1 );
        add_action( "manage_${entity}_posts_custom_column", array( $instance, 'entity_post_table_content' ), 10, 2 );
        add_filter( "get_user_option_meta-box-order_${entity}", array( $instance, 'reorder_metaboxes') );
        add_filter( "get_user_option_meta-box-order_${offer_need}", array( $instance, 'reorder_metaboxes') );
        add_filter( "get_user_option_screen_layout_${entity}", array( $instance, 'force_single_col'), 10, 3 );
        add_action('admin_head-post.php', array( $instance, 'hide_publishing_actions' ) );
        add_action('admin_head-post-new.php', array( $instance, 'hide_publishing_actions' ) );
    }

    /**
     * Load the required dependencies for this plugin.
     *
     * @since    1.0.0
     * @access   private
     */
    private function load_dependencies() {
        // global $uwp_options;

        if ( ! function_exists( 'is_plugin_active' ) ) {
            /**
             * Load all plugin functions from WordPress.
             */
            require_once( ABSPATH . '/wp-admin/includes/plugin.php' );
        }

    }

	/**
	 * Flush rewrite rules.
	 *
	 * @return      void
	 */
	public function flush_rewrite_rules(){
		flush_rewrite_rules();
	}

    /**
     * Load the plugin text domain for translation.
     *
     * @since       2020.11
     * @package     community-directory
     * @return      void
     */
    public function load_plugin_textdomain() {

        $domain = COMMUNITY_DIRECTORY_NAME;
        $locale = apply_filters( 'plugin_locale', get_locale(), $domain );

        if ( $loaded = load_textdomain( $domain, trailingslashit( WP_LANG_DIR ) . 'plugins' . '/' . $domain . '-' . $locale . '.mo' ) ) {

        } else {
            // die(basename( dirname(dirname(dirname( __FILE__ ) ))) . '/languages/');
            load_plugin_textdomain( $domain, FALSE, basename( dirname(dirname(dirname( __FILE__ ) ))) . '/languages/' );
        }

        do_action('community_directory_loaded');

    }

    /**
     * Registers an individual text string for WPML translation.
     *
     * @since 0.0.1
     *
     * @param string $string The string that needs to be translated.
     * @param string $domain The plugin domain. Default community-directory.
     * @param string $name The name of the string which helps to know what's being translated.
     */
    public static function register_string( $string, $domain = 'community-directory', $name = '' ) {
        do_action( 'wpml_register_single_string', $domain, $name, $string );
    }

    public static function register_post_status() {
        register_post_status(
            self::$inactive_post_status,
            array(
                'label' => __( 'Inactive', 'community-directory' ),
                'internal'                  => false,
                'public'                    => false,
                'exclude_from_search'       => true,
                'show_in_admin_all_list'    => true,
                'show_in_admin_status_list' => true,
                'label_count'               => _n_noop( 'Inactive <span class="count">(%s)</span>', 'Inactive <span class="count">(%s)</span>', 'community-directory' ),
            )
        );
    }

    public function load_widgets() {
        register_widget( $this->locations_widget = new ClassLocationsWidget() );
        register_widget( $this->offers_needs_hashtag_widget = new ClassOffersNeedsHashTagWidget() );
    }

    public function register_error_handler() {
        // Triggers the error handler registration init in the constructor
        ClassErrorHandler::get_instance();
    }

    public function custom_nonce_value () {
        $created_nonce = wp_create_nonce();
        define( 'NONCE_RANDVALUE', $created_nonce ); 
    }
}

$translations = [
    __( 'm/d/y g:i a', 'community-directory' ),
    __( 'm/d/Y g:i:s a', 'community-directory' ),
    ngettext( 'Activated %d location', 'Activated %d locations', 2 ),
    ngettext( '%d Inhabitant', '%d Inhabitants', 2 ),
    ngettext( 'Activated %d entity', 'Activated %d entities', 2 ),
    ngettext( 'Deactivated %d entity', 'Deactivated %d entities', 2 ),
    ngettext( 'Activated %d location', 'Activated %d locations', 2 ),
    ngettext( 'Deactivated %d location', 'Deactivated %d locations', 2 ),
    ngettext( 'Deleted %d location', 'Deleted %d locations', 2 ),
    ngettext( 'Draft', 'Drafts', 2 )
];