<?php

namespace Maruf89\CommunityDirectory\Admin;

use Maruf89\CommunityDirectory\Includes\ClassEntity;
use Maruf89\CommunityDirectory\Includes\instances\Entity;

/**
 * Deals with Admin Display
 *
 * @package    community-directory
 * @subpackage community-directory/admin
 * @author     Marius Miliunas <mvmiliunas@gmail.com>
 */
class ClassAdminPostDisplay {

    private static $instance;

    private $entity_loc_col_name = 'location_name';

    public static function get_instance() {
        if (self::$instance == null) {
            self::$instance = new ClassAdminPostDisplay();
        }
 
        return self::$instance;
    }

    public function entity_post_column_head( $defaults ) {
        $defaults[$this->entity_loc_col_name] = __( 'Location', 'community-directory' );

        return $defaults;
    }

    public function entity_post_table_content( $column_name, $post_id ) {
        $Entity = new Entity( $post_id );
        echo $Entity->location_name;
    }
    
}