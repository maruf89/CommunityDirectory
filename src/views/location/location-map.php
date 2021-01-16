<?php

$locations = $args['locations'];

$filtered = array_filter( $locations, function ( $location ) {
    return $location->has_coords();
});
?>

<div class="map widget-map" id="LocationMap">
    <?php foreach ( $locations as $location ): ?>

        <a class="marker"
           data-lat="<?= $location->coords[ 'lat' ] ?>"
           data-lon="<?= $location->coords[ 'lon' ] ?>"
        ></a>

    <?php endforeach; ?>
</div>