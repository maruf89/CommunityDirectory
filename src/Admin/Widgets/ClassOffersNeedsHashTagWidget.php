<?php

/**
 * This widget lists the locations
 */

namespace Maruf89\CommunityDirectory\Admin\Widgets;

use Maruf89\CommunityDirectory\Includes\ClassACF;
use Maruf89\CommunityDirectory\Includes\ClassOffersNeeds;

class ClassOffersNeedsHashTagWidget extends \WP_Widget {
    // The construct part  
    function __construct() {
        parent::__construct(
            // Base ID of your widget
            'community_directory_offers_needs_hashtag_widget',
                
            // Widget name will appear in UI
            __( 'CD Offers & Needs Hashtag', 'community-directory' ),
                
            // Widget description
            array( 'description' => __( 'Displays Community Directory offers and needs as a hashtag list', 'community-directory' ), ) 
        );
    }
    
    // Creating widget front-end
    public function widget( $args, $instance ) {
        $class_offers_needs = ClassOffersNeeds::get_instance();
        $type = isset( $instance[ 'type' ] ) ? $instance[ 'type' ] : 'need';

        $instances = apply_filters(
            'community_directory_get_latest_offers_needs',
            array(),
            $type,
        );

        $instances = ClassOffersNeeds::format_to_instances( $instances );

        $template_file = apply_filters( 'community_directory_template_offer-need/offer-need-hashtag-list.php', '' );
        load_template( $template_file, false, array(
            'instances' => $instances,
            'attrs' => array( 'type' => $type ),
            'show_title' => true,
        ) );
    }

    private static int $idIncrement = 1;
            
    // Creating widget Backend 
    public function form( $instance ) {
        $type = isset( $instance[ 'type' ] ) ? $instance[ 'type' ] : 'offer';
         
        // markup for form ?>
        <fieldset>
            <legend><?= __( 'What to show', 'community-directory' ) ?></legend>
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