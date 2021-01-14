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
            case 'location':
                $type_class = ClassLocation::get_instance();
                break;
            case 'entity':
                $type_class = ClassEntity::get_instance();
                break;
            case 'offer_need':
                $type_class = ClassOffersNeeds::get_instance();
                break;
        }

        if ( $type_class ) {
            $search_sql = $this->_format_search_sql(
                $type_class->get_search_fields(), 'search', $search
            );

            if ( $search_sql instanceof \WP_Error )
                return $this->_send_error( $search_sql );

            global $wpdb;
            $results = $wpdb->get_results( $search_sql );
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

    private function _format_search_sql(
        array $search_fields,
        string $search_by_key = 'search',
        string $search_query
    ) {
        global $wpdb;
        $search_val = $wpdb->_real_escape( $search_query );
        
        $formatted = [ 'relation' => 'OR' ];

        $as = [
            'posts' => 'post',
            'postmeta' => 'meta',
            'users' => 'user',
        ];
        
        $or = [];
        $and = [];

        if ( isset( $search_fields[ $search_by_key ] ) )
            foreach ( $search_fields[ $search_by_key ] as $table => $keys )
                foreach ( $keys as $key )
                    $or[] = $this->_add_where_match(
                        $as[ $table ],
                        $key,
                        'LIKE',
                        "%$search_val%"
                    );
        else
            return ClassErrorHandler::handle_exception( new \WP_Error( 400, "Invalid search_by_key: $search_by_key" ) );

        if ( isset( $search_fields[ 'required' ] ) )
            foreach ( $search_fields[ 'required' ] as $table => $key_values )
                foreach ( $key_values as $key => $values ) {
                    $values = is_array( $values ) ? $values : [ '=', $values ];
                    $and[] = $this->_add_where_match(
                        $as[ $table ],
                        $key,
                        $values[ 0 ],
                        $values[ 1 ]
                    );
                }

        $from_join_on = implode(
            ' ',
            $this->_add_from_join_on( $search_fields, $search_by_key, $as, 'posts' )
        );
                
        $where_req = implode( ' AND ', $and );
        $where_or = implode( ' OR ', $or );

        $sql = "
            SELECT SQL_CALC_FOUND_ROWS " . $as[ 'posts' ] . ".ID
            $from_join_on
            WHERE $where_req AND $where_or
            GROUP BY " . $as[ 'posts' ] . ".ID
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
     * @return              string          formatted where clause
     */
    private function _add_where_match(
        string $as,
        string $key,
        string $comparison,
        $value
    ):string {
        // If not working with digits and not comparing, wrap in quotes for SQL
        if ( gettype( $value ) !== 'integer')
            $value = "'$value'";
        
        if ( $as === 'meta' )
            return  "( $as.meta_key = '$key' AND $as.meta_value $comparison $value )";
        else
            return "$as.$key $comparison $value";
    }

    private function _add_from_join_on(
        array $search_fields,
        string $search_by_key,
        array $as_arr,
        string $primary_table
    ) {
        global $wpdb;
        $primary_as = $as_arr[ $primary_table ];
        $from_join_on = [];

        $join_map = [
            'posts_postmeta' => [ 'ID', 'post_id' ],
            'posts_users' => [ 'post_author', 'ID' ]
        ];

        foreach ( $as_arr as $table => $as ) {
            if ( $as === $primary_as ) {
                $_table = $wpdb->$table;
                array_unshift( $from_join_on, "FROM $_table AS $as" );
            }
                
            else {
                $join_field_key = "${primary_table}_${table}";
                if ( !isset( $join_map[ $join_field_key ] ) )
                    return ClassErrorHandler::handle_exception(
                        new \WP_Error( 500, "Illegal _add_from_join_on: $join_field_key" )
                    );

                $_table = $wpdb->$table;
                list( $primary_field, $secondary_field ) = $join_map[ $join_field_key ];
                $from_join_on[] = "
                    INNER JOIN $_table AS $as
                    ON ( $primary_as.$primary_field = $as.$secondary_field )
                ";
            }
                
        }
        
        return $from_join_on;
    }

    private function _send_success( array $data ) {
        return json_encode( [
            'result' => 200,
            'data' => $data,
        ] );
    }

    private function _send_error( \WP_Error $error ) {
        return json_encode( [
            'result' => $error->get_error_code(),
            'message' => $error->get_error_message()
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