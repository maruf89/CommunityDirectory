<?php

/**
 * This widget lists the locations
 */

namespace Maruf89\CommunityDirectory\Admin\Widgets;

use Maruf89\CommunityDirectory\Includes\ClassLocation;

class ClassLocationsWidget extends \WP_Widget {
    // The construct part  
    function __construct() {
        parent::__construct(
            // Base ID of your widget
            'community_directory_locations_widget',
                
            // Widget name will appear in UI
            __( 'Community Directory Locations', 'community-directory' ),
                
            // Widget description
            array( 'description' => __( 'Displays locations', 'community-directory' ), ) 
        );
    }
    
    // Creating widget front-end
    public function widget( $args, $instance ) {
        $title = apply_filters( 'widget_title', $instance['title'] );

        $class_location = ClassLocation::get_instance();
        $locations = $class_location->format_to_instances( $class_location->get( true, true ) );
        $template_file = apply_filters( 'community_directory_template_location-list.php', '' );
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