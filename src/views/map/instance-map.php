<?php
$instances = $args[ 'instances' ];
$single_template = $args[ 'single_template' ];
?>

<div class="map instance-map" id="InstanceMap">
    <?php foreach ( $instances as $instance ): ?>

        <div class="marker"
           data-lat="<?= $instance->coords[ 'lat' ] ?>"
           data-lon="<?= $instance->coords[ 'lon' ] ?>"
        >
            <?= load_template( $single_template, false, array( 'instance' => $instance ) ) ?>
        </div>

    <?php endforeach; ?>
</div>