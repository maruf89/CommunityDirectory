<?php

namespace Maruf89\CommunityDirectory\Includes\Interfaces;

Interface IRoutable {

    /**
     * array( '/location/(?P<id>\d+)' => array(
     *      'methods' => 'GET',
     *      'callback' => 'my_awesome_func',
     *    )
     * )
     */
    public static function get_router_end_points( array $callback ):array;
}