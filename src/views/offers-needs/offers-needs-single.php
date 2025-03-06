<?php
    $instance = $args[ 'instance' ];
    $type = $args[ 'type' ];

    $type_type = __( 'Offer Type', 'community-directory' );
    if ( $type === 'need' ) $type_type = __( 'Type of Need', 'community-directory' );

    $category = $instance->get_product_service_type();
?>

<li id="p-<?= $instance->get_id() ?>" class="cd-<?= $type ?>-single cd-on-single <?= "$type-$instance->ID card" ?>">
    <div class="card-body">
        <h3 class="title"><?= $instance->post_title ?></h3>
        <?php if ( $instance->has_acf_image() ): ?>
            <figure class="on-img-head">
                <?= $instance->get_featured() ?>
            </figure>
        <?php endif; ?>
        <span class="tag product-or-service">
            <strong><?= $type_type ?>:</strong> <?= $instance->get_offer_need_type() ?>
        </span>
        <?php if ( $category ): ?>
            <span class="tag product-or-service">
                <strong><?= __( 'Category', 'community-directory' ) ?>:</strong> <?= $category->get_link( 'category' ) ?>
            </span>
        <?php endif; ?>
        <span class="tag urgency">
            <strong><?= __( 'Urgency', 'community-directory' ) ?>:</strong> <?= $instance->get_urgency( true ) ?>
        </span>
        <p><?= $instance->get_acf_description() ?></p>
        <?php if ( $instance->has_acf_attachment() ): ?>
            <div class="acf-file-uploader on-attachment" data-library="uploadedTo" data-mime_types="pdf,jpeg,jpg,gif,png" data-uploader="wp">
                <h4><?= __( 'Additional Attachment', 'community-directory' ) ?></h4>
                <a href="<?= $instance->get_acf_attachment()[ 'url' ] ?>" target="_blank">
                    <div class="file-icon">
                        <img data-name="icon" src="/wp/wp-includes/images/media/document.png" alt="">
                    </div>
                </a>
            </div>
        <?php endif; ?>
    </div>
    
</li>