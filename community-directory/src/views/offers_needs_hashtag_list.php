<?php

$offers_needs = $args[ 'offers_and_needs' ];

$type = $args[ 'attrs' ][ 'type' ];

?>

<section class="cd-offers-needs">
    <h3>Latest Needs</h3>
    <ul class="cd-<?= $type ?>-list">
        <?php foreach ( $offers_needs as $num => $offer_need ): ?>
            <?php $even_odd = ( $num % 1 ) ? 'even' : 'odd'; ?>
            <li class="<?= "$type-$offer_need->ID $even_odd" ?>" >
                <?= $offer_need->get_hashtag_title() ?>
            </li>
        <?php endforeach; ?>
    </ul>
</section>