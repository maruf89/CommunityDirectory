<?php

/**
 * The search functionality of the plugin.
 *
 * @since      2020.11
 *
 * @package    community-directory
 * @subpackage community-directory/includes
 */

namespace Maruf89\CommunityDirectory\Includes;

use Maruf89\CommunityDirectory\Includes\{ClassEntity, ClassOffersNeeds};
use Maruf89\CommunityDirectory\Includes\Abstracts\Routable;

class ClassSearch extends Routable {

    private static ClassSearch $instance;
    protected string $router_ns = 'search';

    public static function get_instance() {
        if ( !isset( self::$instance ) ) {
            self::$instance = new ClassSearch();
        }
 
        return self::$instance;
    }

    public function __construct() {
        parent::__construct( $this );
    }

    public function search( string $search, string $type = '' ) {
        switch ( $type ) {
            case '':
                $type_class = null;
                break;
            case 'entity':
                $type_class = ClassEntity::get_instance();
                break;
            case 'offer_need':
                $type_class = ClassOffersNeeds::get_instance();
                break;
        }

        if ( $type_class ) {
            $query = new \WP_Query( [
                'post_type' => $type_class::$post_type,
                'number_posts' => -1,
                'meta_query' => [
                    'relation' => 'OR',
                    [
                        'key' 
                    ]
                ]
            ] );
        }
        
    	return "$search from server";
    }

    protected array $route_map = [
        '/all'      => array(
            'callback'  => 'search',
            'args'      => array(
                'search'           	=> 'string',
                'type'       		=> '?string',
            )
        )
    ];

    public static function get_router_end_points( array $callback ):array {
        return array(
            '/all' => array(
                'methods'   => 'POST',
                'callback'  => $callback,
                'permission_callback' => function ( $request ) { return true; },
            ),
        );
    }
}