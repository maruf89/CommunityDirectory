<?php
    $instance = $args[ 'instance' ];
    $type = $args[ 'type' ];
    $hide_location = $args[ 'hide_location' ] ?? false;
    $hide_product_service = $args[ 'hide_product_service' ] ?? false;
    if ( !$hide_location ) $location = $instance->get_location();

    $type_type = __( 'Offer Type', 'community-directory' );
    if ( $type === 'need' ) $type_type = __( 'Type of Need', 'community-directory' );
?>

<li id="<?= $instance->get_id() ?>" class="minified cd-on-single card">
    <div class="card-body">
        <a href="<?= $instance->get_link() ?>" title="<?= $instance->post_title ?>">
            <h3 class="title"><?= $instance->post_title ?></h3>
        </a>
        <span class="tag product-or-service"><?= $instance->get_offer_need_type() ?></span>
        <?php if ( !$hide_location ): ?>
            <a href="<?= $location->get_display_link() ?>" class="d-block location d-icon">
                <?= $location->display_name ?>
            </a>
        <?php endif; if ( !$hide_product_service ): ?>
            <?= $instance->get_product_service_link( 'd-block product-service d-icon' ) ?>
        <?php endif; ?>

        <span class="tag urgency"><?= $instance->get_urgency( true ) ?></span>
    </div>
    
</li>