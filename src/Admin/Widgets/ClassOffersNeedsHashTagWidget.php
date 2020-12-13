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
            __( 'Community Directory Offers & Needs Hashtag Widget', 'community-directory' ),
                
            // Widget description
            array( 'description' => __( 'Displays offers and needs', 'community-directory' ), ) 
        );
    }
    
    // Creating widget front-end
    public function widget( $args, $instance ) {
        $class_offers_needs = ClassOffersNeeds::get_instance();
        $type = isset( $args[ 'type' ] ) ? $args[ 'type' ] : 'need';
        $offers_and_needs = $class_offers_needs->format_to_instances( $class_offers_needs->get_latest(
            array(), $type
        ) );

        $template_file = apply_filters( 'community_directory_template_offers_needs_hashtag_list.php', '' );
        load_template( $template_file, false, array(
            'offers_and_needs' => $offers_and_needs,
            'attrs' => array( 'type' => $type ),
        ) );
    }

    private static int $idIncrement = 1;
            
    // Creating widget Backend 
    public function form( $instance ) {
        $defaults = array(
            'type' => 'offer'
        );
        $type = $instance[ 'type' ];
         
        // markup for form ?>
        <fieldset>
            <legend><?= __( 'What to show', 'community-directory' ) ?></legend>
            <div>
                <input type="radio"
                       value="offer"
                       id="cdOffer<?= self::$idIncrement ?>"
                       name="<?= $this->get_field_id( 'type' ) ?>"
                       <?php if ( $type === 'offer' ) echo 'selected' ?>
                       />
                <label for="cdOffer<?= self::$idIncrement++ ?>"><?= __( 'Offer', 'community-directory' ) ?></label>
            </div>
            <div>
                <input type="radio"
                       value="need"
                       id="cdNeed<?= self::$idIncrement ?>"
                       name="<?= $this->get_field_id( 'type' ) ?>"
                       <?php if ( $type === 'need' ) echo 'selected' ?>
                       />
                <label for="cdNeed<?= self::$idIncrement++ ?>"><?= __( 'Need', 'community-directory' ) ?></label>
            </div>
        </fieldset>
                 
        <?php
    }
        
    // Updating widget replacing old instances with new
    public function update( $new_instance, $old_instance ) {
        $instance = $old_instance;
        $instance[ 'type' ] = $new_instance[ 'type' ];
        return $instance;
    }
}