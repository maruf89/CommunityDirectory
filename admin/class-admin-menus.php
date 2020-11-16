<?php
/**
 * The Nav menu specific functionality of the plugin.
 *
 * @package    community-directory
 * @subpackage community-directory/menus
 */
class Community_Directory_Admin_Menus {
    /**
     * Hook in tabs.
     */
    public function __construct() {
        // Add menus
        add_action( 'admin_menu', array( $this, 'admin_menu' ), 9 );
    }

    /**
     * Add menu items.
     */
    public function admin_menu() {

        $install_type = community_directory_get_installation_type();

        // Proceed if main site or pages on all sites or specific blog id
        $proceed = false;
        switch ( $install_type ) {
            case "single":
            case "multi_na_all":
            case "multi_not_na":
                $proceed = true;
                break;
            case "multi_na_site_id":
                $blog_id = null;
                if (defined( 'COMMUNITY_DIRECTORY_ROOT_PAGES' )) {
                    $blog_id = COMMUNITY_DIRECTORY_ROOT_PAGES;
                }

                $current_blog_id = get_current_blog_id();
                if ( !empty($blog_id) && is_int( (int)$blog_id ) && $blog_id == $current_blog_id  ) {
                    $proceed = true;
                }
                break;
            case "multi_na_default":
                $is_main_site = is_main_site();
                if ( $is_main_site ) {
                    $proceed = true;
                }
                break;
            default:
                $proceed = false;

        }

        if ( ! $proceed ) {
            return;
        }


        add_menu_page(
            __( 'Community Directory Settings', 'community-directory' ),
            __( 'Community Directory', 'community-directory' ),
            'manage_options',
            'community-directory',
            array( 'Community_Directory_Admin_Settings', 'output' ),
            'dashicons-groups',
            70
        );

    }

    /**
     * Add Community_Directory setting page link to the WP admin bar.
     *
     * @since 1.1.2
     * @return void
     */
    public function admin_bar_menu($wp_admin_bar){
        if ( !is_admin() && current_user_can( 'manage_options' ) ) {
            $wp_admin_bar->add_node( array(
                'parent' => 'appearance',
                'id'     => 'community-directory',
                'title'  => __( 'Community_Directory', 'community-directory' ),
                'href'   => admin_url( 'admin.php?page=community-directory' )
            ) );
        }
    }
}