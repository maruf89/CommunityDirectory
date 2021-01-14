<?php

namespace Maruf89\CommunityDirectory\Includes\Traits;

trait Searchable {    
    public function render_search_results( array $items, string $search ):string {
        ob_start();

        $post_type = static::$post_type;

        $template_file = apply_filters( "community_directory_template_search/$post_type.php", '' );

        foreach ( $items as $item ) {
            $instance = static::$instance_class::get_instance( null, null, $item );

            // If it doesn't have a valid link, skip it
            if ( !$instance::get_display_link( $instance ) ) continue;
            
            load_template( $template_file, false, array(
                'instance'  => $instance,
                'search'    => $search,
            ) );
        }

        return ob_get_clean();
    }
}