<?php
    $offer_need = $args[ 'offer_need' ];
    $type = $args[ 'type' ];
?>

<li id="<?= $offer_need->get_id() ?>" class="cd-<?= $type ?>-single <?= "$type-$offer_need->ID card" ?>">
    <div class="card-body">
        <h3><?= $offer_need->post_title ?></h3>
        <p><?= $offer_need->get_acf_description() ?></p>
    </div>
    
</li>