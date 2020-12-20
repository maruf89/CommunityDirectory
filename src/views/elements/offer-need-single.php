<?php
    $offer_need = $args[ 'offer_need' ];
    $type = $args[ 'type' ];

    $type_type = __( 'Offer Type', 'community-directory' );
    if ( $type === 'need' ) $type_type = __( 'Type of Need', 'community-directory' );
?>

<li id="<?= $offer_need->get_id() ?>" class="cd-<?= $type ?>-single cd-on-single <?= "$type-$offer_need->ID card" ?>">
    <div class="card-body">
        <h3 class="title"><?= $offer_need->post_title ?></h3>
        <?php if ( $offer_need->has_acf_image() ): ?>
            <figure class="on-img-head">
                <?= $offer_need->get_featured() ?>
            </figure>
        <?php endif; ?>
        <span class="tag product-or-service">
            <strong><?= $type_type ?>:</strong> <?= $offer_need->get_offer_need_type() ?>
        </span>
        <span class="tag product-or-service">
            <strong><?= __( 'Category', 'community-directory' ) ?>:</strong> <?= $offer_need->get_category( false ) ?>
        </span>
        <span class="tag urgency">
            <strong><?= __( 'Urgency', 'community-directory' ) ?>:</strong> <?= $offer_need->get_urgency( true ) ?>
        </span>
        <p><?= $offer_need->get_acf_description() ?></p>
        <?php if ( $offer_need->has_acf_attachment() ): ?>
            <div class="acf-file-uploader on-attachment" data-library="uploadedTo" data-mime_types="pdf,jpeg,jpg,gif,png" data-uploader="wp">
                <h4><?= __( 'Additional Attachment', 'community-directory' ) ?></h4>
                <a href="<?= $offer_need->get_acf_attachment()[ 'url' ] ?>" target="_blank">
                    <div class="file-icon">
                        <img data-name="icon" src="/wp/wp-includes/images/media/document.png" alt="">
                    </div>
                </a>
            </div>
        <?php endif; ?>
    </div>
    
</li>