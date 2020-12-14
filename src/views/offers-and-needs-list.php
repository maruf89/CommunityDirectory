<?php

$offers_needs = $args[ 'offers_and_needs' ];
$type = $args[ 'attrs' ][ 'type' ];

$template_file = apply_filters( 'community_directory_template_elements/offer-need-single.php', '' );


?>

<section class="cd-offers-needs">
    <ul class="cd-<?= $type ?>-list">
        <?php foreach ( $offers_needs as $index => $offer_need ) {
            load_template( $template_file, false, array(
                'offer_need' => $offer_need,
                'index' => $index,
                'type' => $type,
            ) );
        } ?>
    </ul>
</section>