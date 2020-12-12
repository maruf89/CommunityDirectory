<?php

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