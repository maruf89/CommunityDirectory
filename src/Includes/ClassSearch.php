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
            $meta_search = $this->_format_meta_search(
                $type_class::get_meta_search_fields(), 'search', $search, $type_class
            );

            global $wpdb;
            $results = $wpdb->get_results( $meta_search );

            if ( !count( $results ) ) return json_encode( $results );

            
        }
        
    	return json_encode( $results );
    }

    private function _format_meta_search( array $meta, string $search_type = 'search', string $search_val, $type_class ):string {
        $formatted = [ 'relation' => 'OR' ];

        $as_post = 'post';
        $as_meta = 'meta';
        $post_type = $type_class::$post_type;
        
        $or = [];
        $required = [
            "$as_post.post_type = '$post_type'",
            "$as_post.post_status = 'publish'"
        ];

        if ( isset( $meta[ $search_type ] ) )
            foreach ( $meta[ $search_type ] as $key )
                $or[] = "( $as_meta.meta_key = '$key' AND $as_meta.meta_value LIKE '%$search_val%' )";
                // $formatted[] = [
                //     'key' => $key,
                //     'value' => '%' . \preg_quote( $search_val ) . '%',
                //     'compare' => 'LIKE'
                // ];

        if ( isset( $meta[ 'required' ] ) )
            foreach ( $meta[ 'required' ] as $key => $value )
                $required[] = "$key = " . ( gettype( $value ) == 'string' ) ? "'$value'" : $value;
                // $formatted[] = [
                //     'key' => $key,
                //     'value' => $value,
                //     'compare' => '='
                // ];

        global $wpdb;

        $where_req = implode( ' AND ', $required );
        $where_or = implode( ' OR ', $or );

        $sql = "
            SELECT SQL_CALC_FOUND_ROWS $as_post.ID
            FROM $wpdb->posts AS $as_post
            INNER JOIN $wpdb->postmeta AS $as_meta
            ON ( $as_post.ID = $as_meta.post_id )
            WHERE $where_req AND $where_or
            GROUP BY $as_post.ID
        ";

        return $sql;
    }
    
    public function _search_where( $where, &$wp_query ) {
        global $wpdb;
        if ( $search_term = $wp_query->get( 'search_prod_title' ) ) {
            $where .= ' AND ' . $wpdb->posts . '.post_title LIKE \'%' . esc_sql( like_escape( $search_term ) ) . '%\'';
        }
        return $where;
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