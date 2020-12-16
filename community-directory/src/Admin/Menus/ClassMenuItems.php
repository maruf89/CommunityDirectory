<?php
/**
 * The Nav menu specific functionality of the plugin.
 *
 * @package    community-directory
 * @subpackage community-directory/menus
 */

namespace Maruf89\CommunityDirectory\Admin\Menus;

class ClassMenuItems {

    public function customize_menu_metaboxes(  ) {
        return; // todo once I have pages to show in nav menu
        add_meta_box(
            'add-community-directory-nav-menu',
            esc_html__( 'Community Directory Locations', 'community-directory' ),
            array( $this, 'do_wp_nav_menu_metabox'),
            'nav-menus',
            'side',
            'default'
        );
    }

    /**
     * TODO once I have pages to show in menu
     */
    public function do_wp_nav_menu_metabox() {
        global $nav_menu_selected_id;

        $walker = new UsersWP_Walker_Nav_Menu_Checklist( false );
        $args   = array( 'walker' => $walker );

        $post_type_name = 'users_wp';

        $tabs = array();

        $tabs['common']['label']  = __( 'Common', 'userswp' );
        $tabs['common']['pages']  = $this->users_wp_nav_menu_get_common_pages();

        $tabs['loggedin']['label']  = __( 'Logged-In', 'userswp' );
        $tabs['loggedin']['pages']  = $this->users_wp_nav_menu_get_loggedin_pages();

        $tabs['loggedout']['label']  = __( 'Logged-Out', 'userswp' );
        $tabs['loggedout']['pages']  = $this->users_wp_nav_menu_get_loggedout_pages();

        ?>

        <div id="users-wp-menu" class="posttypediv">
            <h4><?php esc_html_e( 'Common', 'userswp' ) ?></h4>
            <p><?php esc_html_e( 'Common links are visible to everyone.', 'userswp' ) ?></p>

            <div id="tabs-panel-posttype-<?php echo $post_type_name; ?>-common" class="tabs-panel tabs-panel-active">
                <ul id="users_wp-menu-checklist-common" class="categorychecklist form-no-clear">
                    <?php
                    if ($tabs['common']['pages']) {
                        echo walk_nav_menu_tree( array_map( 'wp_setup_nav_menu_item', $tabs['common']['pages'] ), 0, (object) $args );
                    }
                    ?>
                </ul>
            </div>

            <p class="button-controls">
			    <span class="list-controls">
					<a href="<?php echo admin_url( 'nav-menus.php?page-tab=all&selectall=1#users-wp-menu' ); ?>" class="select-all"><?php _e( 'Select all', 'userswp' ); ?></a>
				</span>
                <span class="add-to-menu">
                    <input type="submit"<?php if ( function_exists( 'wp_nav_menu_disabled_check' ) ) : wp_nav_menu_disabled_check( $nav_menu_selected_id ); endif; ?> class="button-secondary submit-add-to-menu right" value="<?php esc_attr_e( 'Add to Menu', 'userswp' ); ?>" name="add-custom-menu-item" id="submit-users-wp-menu" />
                    <span class="spinner"></span>
                </span>
            </p>
        </div><!-- /#users_wp-menu -->

        <?php
    }



    /**
     * Prepare items for nav menu page arguments
     *
     * @since 1.0.0
     * @return mixed
     */
    public function users_wp_admin_wp_nav_menu_page_args($users_wp_menu_items) {
        // If there's nothing to show, we're done
        if ( count( $users_wp_menu_items ) < 1 ) {
            return false;
        }

        //	    print_r($users_wp_menu_items);

        $page_args = array();

        foreach ( $users_wp_menu_items as $type => $users_wp_item ) {
            $page_args[ $users_wp_item['slug'] ] = (object) array(
                'ID'             => -1,
                'post_title'     => $users_wp_item['name'],
                'post_author'    => 0,
                'post_date'      => 0,
                'post_excerpt'   => $users_wp_item['slug'],
                'post_type'      => 'page',
                'post_status'    => 'publish',
                'comment_status' => 'closed',
                'guid'           => $users_wp_item['link'],
                'lightbox_class' => "users-wp-$type-nav",
            );

        }

        return $page_args;
    }
}