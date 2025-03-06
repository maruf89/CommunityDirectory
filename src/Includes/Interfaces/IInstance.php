<?php

namespace Maruf89\CommunityDirectory\Includes\Interfaces;

Interface IInstance {

    /**
     * To be called upon post type registration long before any instance is required
     */
    public static function define_post_type(
        string $post_type,
        string $post_slug,
        string $link_identifier = 'post_name'
    );
    
}