<?php

namespace Maruf89\CommunityDirectory\Admin;

use Maruf89\CommunityDirectory\Includes\{ClassEntity, ClassOffersNeeds};
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

    public function reorder_metaboxes( $order ) {
        return array(
            'normal'   => join( ",", array(
                'postexcerpt',
                'formatdiv',
                'trackbacksdiv',
                'tagsdiv-post_tag',
                'categorydiv',
                'postimagediv',
                'postcustom',
                'commentstatusdiv',
                'slugdiv',
                'authordiv',
                'submitdiv',
            ) ),
            'side'     => '',
            'advanced' => '',
        );
    }

    public function force_single_col( $result, $option, $user ) {
        return '1';
    }

    public function hide_publishing_actions() {
        global $post;
        if ( $post->post_type == ClassEntity::$post_type || $post->post_type == ClassOffersNeeds::$post_type ) {
            echo '<style type="text/css">
                #misc-publishing-actions,
                #minor-publishing-actions{
                    display:none;
                }
                #publishing-action {
                    width: 100%;
                    text-align: center;
                }
                #publish {
                    width: 80%;
                }
                #delete-action {
                    display: none;
                }
                </style>';
        }
    }
    
}