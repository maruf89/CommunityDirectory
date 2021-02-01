<?php

/**
 * This widget lists the locations
 */

namespace Maruf89\CommunityDirectory\Admin\Widgets;

use Maruf89\CommunityDirectory\Includes\ClassACF;
use Maruf89\CommunityDirectory\Includes\ClassOffersNeeds;

class ClassOffersNeedsWidget extends \WP_Widget {
    // The construct part  
    function __construct() {
        parent::__construct(
            // Base ID of your widget
            'community_directory_offers_needs_widget',
                
            // Widget name will appear in UI
            __( 'CD Offers & Needs', 'community-directory' ),
                
            // Widget description
            array( 'description' => __( 'Displays Community Directory offers and needs as a list', 'community-directory' ), ) 
        );
    }
    
    // Creating widget front-end
    public function widget( $args, $instance ) {
        $show_title = (bool) ( $instance[ 'show_title' ] ?? false );
        $type = $instance[ 'type' ] ?? 'need';
        $minified = (bool) ( $instance[ 'minified' ] ?? false );

        if ( $show_title ) {
            if ( $type === 'offer' ) $title = __( 'Latest Offers', 'community-directory' );
            else $title = __( 'Latest Needs', 'community-directory' );
            echo "<h3>$title</h3>";
        }
        do_shortcode( "[community_directory_list_offers_needs minified='$minified' type='$type' ]" );
    }

    private static int $idIncrement = 1;
            
    // Creating widget Backend 
    public function form( $instance ) {
        $type = $instance[ 'type' ] ?? 'offer';
        $minified = !!( $instance[ 'minified' ] ?? true );
        $show_title = !!( $instance[ 'show_title' ] ?? true );
         
        // markup for form ?>
        <br />
        <fieldset>
            <div>
                <input type="checkbox"
                       value="true"
                       id="cdTitle<?= self::$idIncrement ?>"
                       name="<?= $this->get_field_name( 'show_title' ) ?>"
                       <?php if ( $show_title ) echo 'checked' ?>
                       />
                <label for="cdTitle<?= self::$idIncrement++ ?>"><?= __( 'Display Section Title', 'community-directory' ) ?></label>
            </div>
        </fieldset>
        <fieldset>
            <div>
                <input type="checkbox"
                       value="true"
                       id="cdMinified<?= self::$idIncrement ?>"
                       name="<?= $this->get_field_name( 'minified' ) ?>"
                       <?php if ( $minified ) echo 'checked' ?>
                       />
                <label for="cdMinified<?= self::$idIncrement++ ?>"><?= __( 'Show condensed fields', 'community-directory' ) ?></label>
            </div>
        </fieldset>
        <br />
        <fieldset>
            <legend><strong><?= __( 'What to show', 'community-directory' ) ?></strong></legend>
            <div>
                <input type="radio"
                       value="offer"
                       id="cdOffer<?= self::$idIncrement ?>"
                       name="<?= $this->get_field_name( 'type' ) ?>"
                       <?php if ( $type === 'offer' ) echo 'checked' ?>
                       />
                <label for="cdOffer<?= self::$idIncrement++ ?>"><?= __( 'Offer', 'community-directory' ) ?></label>
            </div>
            <div>
                <input type="radio"
                       value="need"
                       id="cdNeed<?= self::$idIncrement ?>"
                       name="<?= $this->get_field_name( 'type' ) ?>"
                       <?php if ( $type === 'need' ) echo 'checked' ?>
                       />
                <label for="cdNeed<?= self::$idIncrement++ ?>"><?= __( 'Need', 'community-directory' ) ?></label>
            </div>
        </fieldset>
        <br />
                 
        <?php
    }
        
    // Updating widget replacing old instances with new
    public function update( $new_instance, $old_instance ) {
        $instance = $old_instance;

        if ( isset( $new_instance[ 'type' ] ) ) {
            $instance[ 'type' ] = $new_instance[ 'type' ];
            $instance[ 'minified' ] = $new_instance[ 'minified' ] ?? true;
            $instance[ 'show_title' ] = $new_instance[ 'show_title' ] ?? true;
        }

        return $instance;
    }
}