<?php

$locations = $args[ 'locations' ];
$single_template = $args[ 'single_template' ];

$filtered_locations = array_filter( $locations, function ( $location ) {
    return $location->has_coords();
});
?>

<div class="map widget-map" id="LocationMap">
    <?php foreach ( $locations as $location ): ?>

        <div class="marker"
           data-lat="<?= $location->coords[ 'lat' ] ?>"
           data-lon="<?= $location->coords[ 'lon' ] ?>"
        >
            <?= load_template( $single_template, false, array( 'location' => $location ) ) ?>
        </div>

    <?php endforeach; ?>
</div>