<?php

$instances = $args[ 'instances' ];

$type = $args[ 'attrs' ][ 'type' ];

$show_title = isset( $args[ 'show_title' ] ) ? $args[ 'show_title' ] : false;
if ( $show_title ) {
    if ( $type === 'offer' ) $title = __( 'Latest Offers', 'community-directory' );
    else $title = __( 'Latest Needs', 'community-directory' );
}

?>

<section class="offers-needs-hashtags">
    <?php if ( $show_title ): ?>
        <h3><?= $title ?></h3>
    <?php endif; ?>
    <ul class="cd-<?= $type ?>-list list-inline">
        <?php foreach ( $instances as $num => $instance ): ?>
            <?php
                $link = $instance->get_link();
                if ( empty( $link ) ) continue;
                $even_odd = ( $num % 2 ) === 1 ? 'even' : 'odd';
            ?>
            <li class="<?= "$type-$instance->ID $even_odd list-inline-item" ?>" >
                <a href="<?= $link ?>">
                    <?= $instance->get_acf_hashtag_title() ?>
                </a>
            </li>
        <?php endforeach; ?>
    </ul>
</section>