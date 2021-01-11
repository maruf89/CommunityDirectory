<?php // Individual Offer Need result

$instance = $args[ 'instance' ];
$search = $args[ 'search' ];
$has_image = $instance->has_acf_image()

?>

<a class="search-result" href="<?= $instance::get_display_link( $instance ) ?>">
    <?php if ( $has_image ): ?>
        <figure class="thumb">
            <?= $instance->get_featured( 'thumb' ) ?>
        </figure>
    <?php endif; ?>
    <div class="copy">
        <h5 class="title"><?= $instance->post_title ?></h5>
        <div class="excerpt"><?= $instance->get_acf_description() ?></div>
    </div>
    
</a>