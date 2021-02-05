<?php

use Maruf89\CommunityDirectory\Includes\ClassOffersNeeds;

function community_directory_offer_type_translated(
    string $type,
    int $count = 1,
    string $context = ''
):string {
    switch ( strtolower( $type ) ) {
        case 'offer':
            if ( $context )
                return _nx( 'Offer', 'Offers', $count, $context, 'community-directory' );    
            return _n( 'Offer', 'Offers', $count, 'community-directory' );
        case 'need':
            if ( $context )
                return _nx( 'Need', 'Needs', $count, $context, 'community-directory' );    
            return _n( 'Need', 'Needs', $count, 'community-directory' );
    }
    return '';
}

function community_directory_offer_need_link( string $link_type = 'create' ):string {
    $post_type = ClassOffersNeeds::$post_type;

    if ( $link_type === 'create' ) {
        return admin_url( "post-new.php?post_type=$post_type" );
    }
    
}