<?php

$offers_needs = $args[ 'offers_and_needs' ];

$type = $args[ 'attrs' ][ 'type' ];

?>

<section class="offers-needs-hashtags">
    <h3>Latest Needs</h3>
    <ul class="cd-<?= $type ?>-list list-inline">
        <?php foreach ( $offers_needs as $num => $offer_need ): ?>
            <?php
                $link = $offer_need->get_link();
                if ( empty( $link ) ) continue;
                $even_odd = ( $num % 2 ) === 1 ? 'even' : 'odd';
            ?>
            <li class="<?= "$type-$offer_need->ID $even_odd list-inline-item" ?>" >
                <a href="<?= $link ?>">
                    <?= $offer_need->get_hashtag_title() ?>
                </a>
            </li>
        <?php endforeach; ?>
    </ul>
</section>