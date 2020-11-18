<?php

final class Community_Directory_Plugin {

    /**
     * The current version of the plugin.
     *
     * @since    1.0.0
     * @access   protected
     * @var      string    $version    The current version of the plugin.
     */
    protected $version;
    protected $i18n;
    protected $menus;
    protected $tables;
    protected $assets;

  private static $instance = null;

  public static function init() {
     if (self::$instance === null) self::$instance = new self;
     return self::$instance;
  }

    public function __construct() {
        $this->plugin_name = COMMUNITY_DIRECTORY_NAME;
        $this->version = COMMUNITY_DIRECTORY_VERSION;

        $this->load_dependencies();
        $this->init_hooks();

        $this->assets = new Community_Directory_Public();
        $this->menus = new Community_Directory_Admin_Menus();
        $this->tables = new Community_Directory_Tables();

        // actions and filters
        $this->load_tables_actions_and_filters($this->tables);

        //admin
        $this->load_menus_actions_and_filters($this->menus);

        add_action('init', array($this, 'has_required_plugins'), 10, 1);
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
        register_activation_hook( COMMUNITY_DIRECTORY_PLUGIN_FILE, array( 'Community_Directory_Activator', 'activate' ) );
        register_deactivation_hook( COMMUNITY_DIRECTORY_PLUGIN_FILE, array( 'Community_Directory_Activator', 'deactivate' ) );
        add_action( 'admin_init', array('Community_Directory_Activator', 'automatic_upgrade') );
        add_action( 'init', array($this, 'load_plugin_textdomain'));
        add_action( 'community_directory_language_file_add_string', array($this, 'register_string'), 10, 1);
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
    public function load_tables_actions_and_filters($instance) {
        add_filter( 'wpmu_drop_tables', array($instance, 'drop_tables_on_delete_blog'));
    }

    /**
     * Actions for admin menus
     *
     * @param $instance
     */
    public function load_menus_actions_and_filters($instance) {
        add_action( 'load-nav-menus.php', array($instance, 'users_wp_admin_menu_metabox') );
        add_action( 'admin_bar_menu', array($instance, 'admin_bar_menu'), 51 );
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
  
        require_once dirname(dirname( __FILE__ )) . '/admin/settings/functions.php';

        /**
         * The class responsible for activation functionality
         * of the plugin.
         */
        require_once dirname(dirname( __FILE__ )) . '/includes/class-activator.php';

        /**
         * The class responsible for defining all actions that occur in the admin area.
         */
        require_once dirname(dirname( __FILE__ )) . '/admin/class-admin.php';

        /**
         * The class responsible for defining all menus in the admin area.
         */
        require_once dirname(dirname( __FILE__ )) . '/admin/class-admin-menus.php';

        /**
         * The class responsible for defining all actions that occur in the public-facing
         * side of the site.
         */
        require_once dirname(dirname( __FILE__ )) . '/includes/class-public.php';

        /**
         * The class responsible for table functions
         */
        require_once dirname(dirname( __FILE__ )) . '/includes/class-tables.php';

        /**
         * The class responsible for admin settings functions
         */
        include_once dirname(dirname( __FILE__ )) . '/admin/settings/abstract-class-settings-page.php';

        /**
         * contents helpers files and functions.
         */
        require_once( dirname(dirname( __FILE__ )) .'/includes/helpers.php' );

        /**
         * The class responsible for defining all admin area settings.
         */
        require_once dirname(dirname( __FILE__ )) . '/admin/settings/class-admin-settings.php';

    }

    /**
     * Load the plugin text domain for translation.
     *
     * @since       1.0.0
     * @package     community-directory
     * @return      void
     */
    public function load_plugin_textdomain() {

        load_plugin_textdomain( 'community-directory', false, basename( dirname (dirname( __FILE__ ) ) ) . '/languages' );

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