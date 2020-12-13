<?php

use Maruf89\CommunityDirectory\Includes\ClassOffersNeeds;

function community_directory_offer_type_translated( string $type, bool $plural = false ):string {
    switch ( $type ) {
        case 'offer':
            if ( $plural ) return __( 'Offers', 'community-directory' );
            return __( 'Offer', 'community-directory' );
        case 'need':
            if ( $plural ) return __( 'Needs', 'community-directory' );
            return __( 'Need', 'community-directory' );
    }
    return '';
}

function community_directory_offer_need_link( string $link_type = 'create' ):string {
    $post_type = ClassOffersNeeds::$post_type;

    if ( $link_type === 'create' ) {
        return admin_url( "post-new.php?post_type=$post_type" );
    }
    
}