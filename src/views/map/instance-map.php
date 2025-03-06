<?php
$instances = $args[ 'instances' ];
$single_template = $args[ 'single_template' ];
$single_args = $args[ 'single_template_args' ] ?? [];
$hide_popup = $single_args[ 'hide_popup' ] ?? false;
?>

<div class="map instance-map" data-single-marker="<?= $hide_popup ?>" id="InstanceMap">
    <?php foreach ( $instances as $instance ): ?>

        <div class="marker"
           data-lat="<?= $instance->coords[ 'lat' ] ?>"
           data-lon="<?= $instance->coords[ 'lon' ] ?>"
        >
            <?php
                if ( !$hide_popup )
                    load_template(
                        $single_template,
                        false,
                        array(
                            'instance' => $instance,
                            'is_map' => true
                        )
                    )
            ?>
        </div>

    <?php endforeach; ?>
</div>