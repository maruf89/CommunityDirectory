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
            __( 'CD Locations', 'community-directory' ),
                
            // Widget description
            array( 'description' => __( 'Displays Community Directory locations on a map or as a list', 'community-directory' ), ) 
        );
    }
    
    private static array $templates = [
        'list' => 'community_directory_template_location/location-list.php',
        'map' => 'community_directory_template_location/location-map.php',
    ];
    
    // Creating widget front-end
    public function widget( $args, $instance ) {
        $type = isset( $instance[ 'type' ] ) ? $instance[ 'type' ] : 'list';
        $template_filter = static::$templates[ $type ];

        $locations = apply_filters( 'community_directory_get_locations', [], null, array( 'active_inhabitants' => '> 0' ) );
        $locations = apply_filters( 'community_directory_format_locations', $locations, 'instance' );

        $template_file = apply_filters( $template_filter, '' );
        $single_template = apply_filters( 'community_directory_template_elements/location-single.php', '' );
        load_template( $template_file, false, array(
            'locations' => $locations,
            'single_template' => $single_template
        ) );
    }
            
    private static int $idIncrement = 1;
    
    // Creating widget Backend 
    public function form( $instance ) {
        $type = isset( $instance[ 'type' ] ) ? $instance[ 'type' ] : 'list';
         
        // markup for form ?>
        <fieldset>
            <legend><?= __( 'How do you want to display the Locations?', 'community-directory' ) ?></legend>
            <div>
                <input type="radio"
                       value="list"
                       id="cdList<?= self::$idIncrement ?>"
                       name="<?= $this->get_field_name( 'type' ) ?>"
                       <?php if ( $type === 'list' ) echo 'checked' ?>
                       />
                <label for="cdList<?= self::$idIncrement++ ?>"><?= __( 'List as Blocks', 'community-directory' ) ?></label>
            </div>
            <?php if ( community_directory_settings_get( 'enable_open_street_map', false ) ): ?>
                <div>
                    <input type="radio"
                        value="map"
                        id="cdMap<?= self::$idIncrement ?>"
                        name="<?= $this->get_field_name( 'type' ) ?>"
                        <?php if ( $type === 'map' ) echo 'checked' ?>
                        />
                    <label for="cdMap<?= self::$idIncrement++ ?>"><?= __( 'On a map', 'community-directory' ) ?></label>
                </div>
            <?php endif; ?>
        </fieldset>
                 
        <?php
    }
        
    // Updating widget replacing old instances with new
    public function update( $new_instance, $old_instance ) {
        $instance = $old_instance;

        if ( isset( $new_instance[ 'type' ] ) ) {
            $instance[ 'type' ] = $new_instance[ 'type' ];
        }

        return $instance;
    }
}