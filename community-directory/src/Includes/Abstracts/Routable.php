<?php

namespace Maruf89\CommunityDirectory\Includes\Abstracts;

use Maruf89\CommunityDirectory\Includes\Interfaces\IRoutable;

abstract class Routable implements IRoutable {
    protected string $router_ns;
    protected string $router_base;
    protected array $route_map;

    // length of the rest base
    private int $base_len;

    public function __construct( Routable $instance ) {
        add_filter( 'community_directory_register_location_end_points', array( $instance, 'register_router_end_points' ), 10, 2 );
    }

    public function register_router_end_points( array $routes, string $rest_base ):array {
        $this->set_router_base( $rest_base . $this->router_ns );

        $routes[ $this->router_ns ] = $this::get_router_end_points(
            array( $this, 'restify_callback' )
        );

        return $routes;
    }

    private function set_router_base( string $base ) {
        $this->router_base = $base;
        $this->base_len = strlen( $base );
    }

    protected function extract_location( string $route ):string {
        return substr( $route, $this->base_len + 1 );
    }

    public function restify_callback( \WP_REST_Request $request ) {
        $location = $this->extract_location( $request->get_route() );
        
        if ( isset( $this->route_map[ $location ] ) ) {
            $route = $this->route_map[ $location ];

            switch ( gettype( $route ) ) {
                case 'string':
                    // run function without args
                    if ( method_exists( $this, $route ) ) return $this->{$route}();
                    break;
                case 'array':
                    $params = $request->get_params();
                    $args = [];
                    if ( count( $params ) ) {
                        $args = $this->_sanitize_and_prepare_args( $params, $route['args'] );
                    }
                    $method = $route['callback'];
                    $bound_method = gettype( $method ) === 'array' ? $method : array( $this, $method );

                    return call_user_func_array( $bound_method, $args );
                    break;
                default:
                    return 'There was an error.';
            }
        }
    }

    private function _sanitize_and_prepare_args( array $params, array $method_args ) {
        $args = [];
        foreach ( $method_args as $name => $type ) {
            $is_optional = substr( $type, 0, 1 ) === '?';
            // if optional, get the rest of the string
            if ( $is_optional ) $type = substr( $type, 1 );
            
            if ( isset( $params[ $name ] ) ) {
                switch ( $type ) {
                    case 'bool':
                        $args[] = rest_sanitize_boolean( $params[ $name ] );
                        break;
                    case 'int':
                        $args[] = intval( $params[ $name ] );
                        break;
                    case 'string';
                    default:
                        $args[] = $params[ $name ];
                }
            } else {
                if ( $is_optional ) $args[] = null;
                else {
                    return new \WP_Error( 400, sprintf( __( 'Error: a required argument %s of type %s is missing argument', 'community-directory' ), $name, $type ) );
                }
            }
        }

        return $args;
    }
}