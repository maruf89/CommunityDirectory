<?php
/**
 * The Nav menu specific functionality of the plugin.
 *
 * @package    community-directory
 * @subpackage community-directory/menus
 */

namespace Maruf89\CommunityDirectory\Admin;

class ClassAdminMenus {
    /**
     * Hook in tabs.
     */
    public function __construct() {
        add_action( 'admin_menu', array( $this, 'admin_menu' ), 9 );
    }

    public function admin_init() {
        // Add the roles you'd like to administer the custom post types
		$all_roles = array( 'entity_subscriber', 'editor', 'administrator' );
		$editor_roles = array( 'editor', 'administrator' );
		
		// Loop through each role and assign capabilities
		foreach( $all_roles as $the_role ) {
            $role = get_role( $the_role );
            if ( $role == null ) continue;
            $role->add_cap( 'read_entity');
            $role->add_cap( 'edit_entity' );
            $role->add_cap( 'read_private_entities' );
            $role->add_cap( 'edit_entities' );
            $role->add_cap( 'edit_published_entities' );
        }
        unset( $the_role );
		
		// Loop through each role and assign capabilities
		foreach( $editor_roles as $the_role ) {
		    $role = get_role( $the_role );
            $role->add_cap( 'publish_entities' );
            $role->add_cap( 'edit_others_entities' );
            $role->add_cap( 'delete_others_entities' );
            $role->add_cap( 'delete_private_entities' );
            $role->add_cap( 'delete_published_entities' );
		}
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
            array( __NAMESPACE__ . '\\Settings\\ClassAdminSettings', 'output' ),
            'dashicons-groups',
            70
        );

    }

    /**
     * Add Community_Directory setting page link to the WP admin bar.
     *
     * @since 2020.11
     * @return void
     */
    public function admin_bar_menu($wp_admin_bar){
        if ( !is_admin() && current_user_can( 'manage_options' ) ) {
            $wp_admin_bar->add_node( array(
                'parent' => 'appearance',
                'id'     => 'community-directory',
                'title'  => __( 'Community Directory', 'community-directory' ),
                'href'   => admin_url( 'admin.php?page=community-directory' )
            ) );
        }
    }
}