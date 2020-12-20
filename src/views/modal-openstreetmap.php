<?php

add_thickbox();
$modal_id = isset( $args[ 'modal_id' ] ) ? $args[ 'modal_id' ] : 'modalOpenStreetMap';

?>

<div id="<?= $modal_id ?>" style="display:none;">
    <div id="modalMap" class="wp-core-ui">
        <div class="map" id="modalLocationMap" style="height:340px"></div>
    </div>
</div>