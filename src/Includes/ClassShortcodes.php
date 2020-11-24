<?php

/**
 * The shortcode functionality of the plugin.
 *
 * @since      0.0.1
 *
 * @package    community-directory
 * @subpackage community-directory/includes
 */

namespace Maruf89\CommunityDirectory\Includes;

class ClassShortcodes {

    public static function list_locations( $atts = array() ) {
        $locations = community_directory_get_location_names( COMMUNITY_DIRECTORY_ENUM_ACTIVE );
        // set up default parameters
        extract(shortcode_atts(array(
            'li_class' => ''
        ), $atts));

        echo '<ul>';

        foreach ( $locations as $slug => $display_name ): ?>
            <li class="<?= $li_class; ?>">
                <a href="/<?= $slug ?>/"><?= $display_name; ?></a>
            </li>
        <?php endforeach;

        echo '</ul>';
    }
    
}