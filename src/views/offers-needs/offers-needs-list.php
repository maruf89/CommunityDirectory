<?php

$instances = $args[ 'instances' ];
$type = $args[ 'attrs' ][ 'type' ];
$single_template = $args[ 'single_template' ];

?>

<section class="cd-offers-needs">
    <ul class="cd-<?= $type ?>-list">
        <?php foreach ( $instances as $index => $instance ) {
            load_template( $single_template, false, array(
                'instance' => $instance,
                'index' => $index,
                'type' => $type,
            ) );
        } ?>
    </ul>
</section>