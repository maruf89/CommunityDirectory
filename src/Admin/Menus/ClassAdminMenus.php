<?php
/**
 * The Nav menu specific functionality of the plugin.
 *
 * @package    community-directory
 * @subpackage community-directory/menus
 */

namespace Maruf89\CommunityDirectory\Admin\Menus;

use Maruf89\CommunityDirectory\Includes\ClassEntity;
use Maruf89\CommunityDirectory\Includes\instances\Entity;

class ClassAdminMenus {

    /**
     * Adds Community Directory to the admin menu
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
            array( 'Maruf89\\CommunityDirectory\\Admin\\Settings\\ClassAdminSettings', 'output' ),
            'dashicons-groups',
            70
        );
    }

    /**
     * Hides, renames, and edits certain menu items for entity subscriber role types
     */
    public function modify_entity_subscriber_menu() {
        global $menu; // Global to get menu array
        global $submenu;

        // Modify menu items for entity_subscribers
        $user = wp_get_current_user();
        $active_entity = Entity::get_active_entity();
        if ( in_array( ClassEntity::$role_entity, (array) $user->roles ) ) {
            

            // Rename dashboard 
            $menu[2][0] = __( 'Around Me', 'community-directory' );

            $entity_item =& $menu[ ClassEntity::$post_type_menu_position ];
            $entity_item[0] = __( 'Edit My Entity', 'community-directory' );
            $entity_item[2] = Entity::build_entity_link( null, true );

            $profile_item =& $menu[70];
            $profile_item[0] = __( 'Profile Settings', 'community-directory' );

            // Remove upload media
            unset( $menu[ 10 ] );

            // Remove dashboard submenu items
            $submenu['index.php'] = array();
        } else if ( $active_entity ) {
            // Insert an edit entity link for everyone else
            $entity_post_type = ClassEntity::$post_type;
            $submenu[ "edit.php?post_type=$entity_post_type"][9] = array(
                __( 'Edit My Entity', 'community-directory' ),
                'edit_entities',
                Entity::build_entity_link( null, true )
            );
        }
    }

    /**
     * Hides most of the clutter from the toolbar
     */
    public function modify_toolbar( $wp_adminbar ) {
        $to_remove = array(
            'wp-logo',
            'edit-profile',
            'my-sites',
            'blog-1',
            'new-content',
            'wp-logo-external',
            'dashboard',
            'search'
        );

        foreach ( $to_remove as $what ) $wp_adminbar->remove_node( $what );
    }

    /**
     * Add Community_Directory setting page link to the WP admin bar.
     *
     * @since 2020.11
     * @return void
     */
    public function admin_bar_menu( $wp_admin_bar ){
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