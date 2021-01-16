<?php

/**
 * This widget shows a map with the locations
 */

namespace Maruf89\CommunityDirectory\Admin\Widgets;

use Maruf89\CommunityDirectory\Includes\ClassLocation;

class ClassLocationsMapWidget extends \WP_Widget {
    // The construct part  
    function __construct() {
        parent::__construct(
            // Base ID of your widget
            'community_directory_locations_map_widget',
                
            // Widget name will appear in UI
            __( 'Community Directory Locations Map', 'community-directory' ),
                
            // Widget description
            array( 'description' => __( 'Displays locations on a map', 'community-directory' ), ) 
        );
    }
    
    // Creating widget front-end
    public function widget( $args, $instance ) {
        $locations = apply_filters( 'community_directory_get_locations', [], null, array( 'active_inhabitants' => '> 0' ) );
        $locations = apply_filters( 'community_directory_format_locations', $locations, 'instance' );
        $template_file = apply_filters( 'community_directory_template_location/location-list.php', '' );
        load_template( $template_file, false, array(
            'locations' => $locations
        ) );
    }
            
    // Creating widget Backend 
    public function form( $instance ) {
        
    }
        
    // Updating widget replacing old instances with new
    public function update( $new_instance, $old_instance ) {
        return array();
    }
}