<?php

/**
 * The public-facing functionality of the plugin.
 * Handles URL rewrites and loading templates
 *
 * @since      2020.11
 *
 * @package    community-directory
 * @subpackage community-directory/includes
 */

namespace Maruf89\CommunityDirectory\Includes;

use Maruf89\CommunityDirectory\Includes\ClassEntity;
use Maruf89\CommunityDirectory\Includes\ClassLocation;

class ClassRestEndPoints {

    private static $instance;

    public string $rest_base;

    public static function get_instance() {
        if (self::$instance == null) {
            self::$instance = new ClassRestEndPoints();
        }
 
        return self::$instance;
    }

    public function __construct() {
        $this->rest_base = COMMUNITY_DIRECTORY_NAME . '/v' . COMMUNITY_DIRECTORY_VERSION_SINGLE_NUM . '/';
    }

    public static function on_init() {
        $instance = self::get_instance();
        $instance->_register_location_end_points();
    }

    private function _register_location_end_points() {
        $routes = apply_filters( 'community_directory_register_location_end_points', [], $this->rest_base);
        
        foreach ( $routes as $ns => $route ) {
            foreach ( $route as $location => $end_point ) {
                $base = "$this->rest_base${ns}";
                register_rest_route(
                    $base,
                    $location,
                    $end_point
                );
            }
        }

    }
    
}