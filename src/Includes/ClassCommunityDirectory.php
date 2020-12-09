<?php

namespace Maruf89\CommunityDirectory\Includes;

use Maruf89\CommunityDirectory\Admin\ClassAdmin;
use Maruf89\CommunityDirectory\Admin\ClassAdminMenus;
use Maruf89\CommunityDirectory\Admin\ClassAdminPostDisplay;
use Maruf89\CommunityDirectory\Admin\ClassAccount;
use Maruf89\CommunityDirectory\Admin\Settings\ClassUWPFormBuilder;

final class ClassCommunityDirectory {

    /**
     * The current version of the plugin.
     *
     * @since    2020.11
     * @access   protected
     * @var      string    $version    The current version of the plugin.
     */
    protected string $version;
    
    private static ?ClassCommunityDirectory $instance = null;

    protected ClassPublic $public;
    protected ClassAdminMenus $menus;
    protected ClassTables $tables;
    protected ClassAdmin $admin;
    protected ClassLocation $location;
    protected ClassUWPForms $uwp_forms;
    protected ClassShortcodes $shortcodes;
    protected ClassACF $acf;
    protected ClassRestEndPoints $rest_end_points;

    protected ClassUWPFormBuilder $uwp_form_builder;
    protected ClassAdminPostDisplay $admin_post_display;
    protected ClassAccount $account;


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
        $this->rest_end_points = ClassRestEndPoints::get_instance();
        
        $this->init_hooks();

        $this->menus = new ClassAdminMenus();
        $this->tables = new ClassTables();
        $this->admin = new ClassAdmin();
        $this->uwp_forms = new ClassUWPForms();
        $this->shortcodes = new ClassShortcodes();
        $this->acf = new ClassACF();

        $this->admin_uwpform_builder = new ClassUWPFormBuilder();
        $this->admin_post_display = ClassAdminPostDisplay::get_instance();
        $this->account = new ClassAccount();

        // actions and filters
        $this->load_assets_actions_and_filters( $this->public );
        $this->load_tables_actions_and_filters( $this->tables );
        $this->load_location_actions_and_filters( $this->location );
        $this->load_uwp_forms_actions_and_filters( $this->uwp_forms );
        $this->load_public_actions_and_filters( $this->public );
        $this->load_entity_actions_and_filters( $this->entity );
        $this->load_acf_actions_and_filters( $this->acf );

        // shortcodes
        $this->load_shortcodes( $this->shortcodes );

        //admin
        $this->load_account_actions_and_filters( $this->account );
        $this->load_menus_actions_and_filters( $this->menus );
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
        add_action( 'init', array( $this->location, 'register_location_post_type' ) );
        add_action( 'init', array( $this->entity, 'register_entity_post_type' ) );
        add_action( 'rest_api_init', array( $this->rest_end_points, 'on_init' ) );
	    add_action( 'community_directory_flush_rewrite_rules', array( $this, 'flush_rewrite_rules' ) );
        add_action( 'community_directory_language_file_add_string', array( $this, 'register_string' ), 10, 1 );
    }

    /**
     * Actions for assets
     *
     * @param $instance
     */
    public function load_assets_actions_and_filters($instance) {
        add_action( 'wp_enqueue_scripts', array($instance, 'enqueue_styles') );
        add_action( 'wp_enqueue_scripts', array($instance, 'enqueue_scripts') );
    }

    /**
     * Actions for database tables
     *
     * @param $instance
     */
    public function load_tables_actions_and_filters( $instance ) {
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

        // Delete location
        add_action( 'wp_ajax_location_delete', array( $instance, 'delete_location_ajax' ), 10, 0 );
        add_action( 'community_directory_delete_location', array( $instance, 'delete_location' ), 10, 1 );

        // Create location
        add_filter( 'community_directory_prepare_location_for_creation', array( $instance, 'prepare_location_for_creation' ) );
        add_action( 'community_directory_create_locations', array( $instance, 'create_locations' ), 10, 1 );

        // Update values
        add_action( 'community_directory_update_locations', array( $instance, 'update_locations' ), 10, 1 );
        add_action( 'community_directory_add_inhabitant', array( $instance, 'add_inhabitant' ), 10, 4 );
        add_action( 'community_directory_shift_inhabitants_count', array( $instance, 'shift_inhabitants_count' ), 10, 3 );
        add_filter( 'acf/update_value/key=' . ClassACF::$field_is_active_key, array( $instance, 'acf_shift_inhabitants_count' ), 10, 3 );
    }

    /**
     * Actions & Filters for rendering UsersWP forms relating to this plugin
     */
    public function load_uwp_forms_actions_and_filters( $instance ) {
        add_filter( 'uwp_form_input_html_locationselect', array( $instance, 'builder_extra_fields_locationselect' ), 10, 4 );
    }

    public function load_shortcodes( $instance ) {
        add_shortcode( 'community_directory_list_locations', array( $instance, 'list_locations' ) );
    }

    public function load_public_actions_and_filters( $instance ) {
        add_filter( 'single_template', array( $instance, 'load_custom_templates' ), 99 );
        add_filter( 'wp_get_nav_menu_items', array( $instance, 'custom_nav_menu' ), 20, 2 );
        add_action( 'pre_get_posts', array( $instance, 'pre_get_posts' ), 1 );
    }

    public function load_entity_actions_and_filters( $instance ) {
        add_filter( 'community_directory_get_entities', array( $instance, 'get_entities' ), 10, 4 );

        add_filter( 'community_directory_get_post_types', array( $instance, 'add_post_type' ), 10, 3 );
    }

    public function load_acf_actions_and_filters( $instance ) {
        add_action( 'acf/init', array( $instance, 'initiate_plugin' ) );
        add_action( 'community_directory_acf_initiate_entity', array( $instance, 'initiate_entity' ) );

        add_filter( 'community_directory_required_acf_fields', array( $instance, 'generate_required_fields' ), 10, 1 );
    }

    

    /**
     * Actions & Filters for account & registration
     */
    public function load_account_actions_and_filters( $instance ) {
        add_filter( 'uwp_validate_fields_before', array( $instance, 'validate_user_registration_before' ), 11, 3 );
        add_filter( 'uwp_before_extra_fields_save', array( $instance, 'save_data_to_user_meta' ), 11, 3 );
    }

    /**
     * Actions for admin menus
     *
     * @param $instance
     */
    public function load_menus_actions_and_filters($instance) {
        // add_action( 'load-nav-menus.php', array($instance, 'users_wp_admin_menu_metabox') );
        add_action( 'admin_bar_menu', array($instance, 'admin_bar_menu'), 51 );
    }

    public function load_uwp_form_hooks_and_filters( $instance ) {
        add_filter( 'uwp_form_fields_predefined', array( $instance, 'load_uwp_form_fields' ), 10, 2 );
    }

    public function load_admin_post_display_hooks_and_filters( $instance ) {
        $entity = ClassEntity::$post_type;
        add_filter( "manage_${entity}_posts_columns", array( $instance, 'entity_post_column_head' ), 10, 1 );
        add_action( "manage_${entity}_posts_custom_column", array( $instance, 'entity_post_table_content' ), 10, 2 );
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
}

$translations = [
    __( 'm/d/y g:i a', 'community-directory' ),
    __( 'm/d/Y g:i:s a', 'community-directory' )
];