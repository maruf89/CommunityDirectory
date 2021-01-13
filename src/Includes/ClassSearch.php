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
                $type_class->get_meta_search_fields(), 'search', $search, $type_class
            );

            global $wpdb;
            $results = $wpdb->get_results( $meta_search );
            $count = count( $results );
            $id_search = [];

            if ( !$count ) return $this->_send_success( [ 'results' => $count ] );
            else if ( $count === 1 ) $id_search = [ 'ID' => $results[ 0 ]->ID ];
            else {
                $ids = [];
                foreach( $results as $res ) $ids[] = $res->ID;
                $id_search = [ 'IDs' => $ids ];
            }

            $items = $type_class->get( [], null, $id_search );

            $render = $type_class->render_search_results( $items, $search );
            return $this->_send_success( [ 'results' => $count, 'html' => $render ] );
        }
        
    	return $this->_send_success( $results );
    }

    private function _format_meta_search( array $meta, string $search_type = 'search', string $search_query, $type_class ):string {
        global $wpdb;
        $search_val = $wpdb->_real_escape( $search_query );
        
        $formatted = [ 'relation' => 'OR' ];

        $as_post = 'post';
        $as_meta = 'meta';
        $post_type = $type_class::$post_type;
        
        $or = [];
        $and = [];

        if ( isset( $meta[ $search_type ] ) )
            foreach ( $meta[ $search_type ] as $post_meta => $keys )
                foreach ( $keys as $key )
                    $or[] = $this->_add_where_match(
                        $post_meta === 'meta' ? $as_meta : $as_post,
                        $key,
                        'LIKE',
                        "%$search_val%",
                        $post_meta === 'meta'
                    );

        if ( isset( $meta[ 'required' ] ) )
            foreach ( $meta[ 'required' ] as $post_meta => $key_values )
                foreach ( $key_values as $key => $values ) {
                    $values = is_array( $values ) ? $values : [ '=', $values ];
                    $and[] = $this->_add_where_match(
                        $post_meta === 'meta' ? $as_meta : $as_post,
                        $key,
                        $values[ 0 ],
                        $values[ 1 ],
                        $post_meta === 'meta'
                    );
                }

        $where_req = implode( ' AND ', $and );
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

    /**
     * Formats a where clause depending on whether it's meta or on the type of value
     * and returns it
     * 
     * @param   $as         string          mysql table prefix
     * @param   $key        string          the key to match on
     * @param   $comparison string          the type of comparison
     * @param   $value      string|int      value
     * @param   $is_meta    bool            if checking a meta value
     * @return              string          formatted where clause
     */
    private function _add_where_match(
        string $as,
        string $key,
        string $comparison,
        $value,
        bool $is_meta
    ):string {
        // If not working with digits and not comparing, wrap in quotes for SQL
        if ( gettype( $value ) !== 'integer')
            $value = "'$value'";
        
        if ( $is_meta )
            return  "( $as.meta_key = '$key' AND $as.meta_value $comparison $value )";
        else
            return "$as.$key = $value";
    }

    private function _send_success( array $data ) {
        return json_encode( [
            'result' => 200,
            'data' => $data,
        ] );
    }

    private function _send_error( string $error, int $error_code = 400 ) {
        return json_encode( [
            'result' => $error_code,
            'message' => $error
        ] );
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