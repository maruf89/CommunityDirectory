<?php

$offers_needs = $args[ 'offers_and_needs' ];
$type = $args[ 'attrs' ][ 'type' ];

?>

<section class="cd-offers-needs">
    <ul class="cd-<?= $type ?>-list">
        <?php foreach ( $offers_needs as $offer_need ): ?>
            <li class="cd-<?= $type ?>-single <?= "$type-$offer_need->ID card" ?>" >
                <div class="card-body">
                    <h3><?= $offer_need->post_title ?></h3>
                    <p><?= $offer_need->get_description() ?></p>
                </div>
                
            </li>
        <?php endforeach; ?>
    </ul>
</section>