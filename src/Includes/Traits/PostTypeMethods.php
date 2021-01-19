<?php

namespace Maruf89\CommunityDirectory\Includes\Traits;

trait PostTypeMethods {


    /**
     * Filter method to aggregate post types
     */
    static function add_post_type( array $arr ):array {
        $arr[] = self::$post_type;
        return $arr;
    }
    
    /**
     * Get's all WP posts based on passed in vars
     * 
     * @param       $results            ?array           an array which to merge with passed in results
     * @param       $post_status        ?string|array    optional array, first variable must be (=|!=), default: =
     *                                                   if null or empty string, returns non-auto draft fields
     * @param       $where_match        ?array           optional array with fields to match against
     * @param       $output             ?string          one of (sql|OBJECT|ARRAY_A|ARRAY_N)
     */
    function get(
        array $results = null,
        $post_status = null,
        array $where_match = null,
        string $output = null
    ) {
        global $wpdb;

        if ( null === $results ) $results = [];
        if ( null === $post_status || empty( $post_status ) ) $post_status = [ '!=', 'auto-draft' ];
        if ( null === $where_match ) $where_match = [];
        if ( null === $output ) $output = OBJECT;

        // Create where array with the first check
        $where = [ 'post_type = \'' . static::$post_type . '\'' ];
        
        if ( gettype( $post_status ) === 'string' )
            $post_status = [ '=', $post_status ];
        
        $where[] = sprintf( 'post_status %s \'%s\'', $post_status[ 0 ], $post_status[ 1 ] );

        if ( count( $where_match ) ) {
            foreach ( $where_match as $key => $match ) {

                switch ( $key ) {
                    // Integer values
                    case 'location_id':
                    case 'owner':
                        $where[] = "post_parent = $match";
                        break;
                    case 'post_parent':
                    case 'post_author':
                    case 'ID':
                        $where[] = "$key = $match";
                        break;

                    case 'post_parents':
                    case 'post_authors':
                    case 'IDs':
                        // Get key minus the plural modifier
                        $key = substr( $key, 0, strlen( $key ) - 1 );

                        // Convert to comma separated string
                        if ( is_array( $match ) ) $match = implode( ',', $match );
                        
                        $where[] = "$key in ( $match )";
                        break;

                    // Date type, must include (>|<|>=) next to date value
                    case 'post_date':
                    case 'post_modified':
                        $where[] = "$key $match";
                        break;

                    // Default string values
                    case 'slug':
                        $key = 'post_name';
                    default:
                        $where[] = "$key = '$match'";
                }
            }
        }
                    
        $where_clauses = 'WHERE ' . implode( ' AND ', $where );

        $sql = "
            SELECT *
            FROM $wpdb->posts
            $where_clauses  
        ";
        
        if ( $output === 'sql' ) return $sql;

        $entities = $wpdb->get_results( $sql );
        
        return array_merge( $entities, $results );
    }

    /**
     * Formats entity types based on second parameter
     * 
     * @param $results          array           the rows to format
     * @param $format           ?string         an entity field to format the key, 'instance' to return Entity instances (default: 'id')
     * @return                  array           formatted
     */
    public static function format( array $results, string $format = 'id' ) {
        if ( !count( $results ) ) return $results;
        
        if ( $format === 'instance' ) return self::format_to_instances( $results );
        if ( gettype( $format ) === 'boolean' ) return self::format_row_locations( $results );
        // Otherwise $format is a string
        return self::format_row_locations( $results, $format );
    }
}