<?php

add_thickbox();
$modal_id = isset( $args[ 'modal_id' ] ) ? $args[ 'modal_id' ] : 'modalLocationSelect';

?>

<div id="<?= $modal_id ?>" style="display:none;">
    <div id="modalLocationList" class="wp-core-ui">
        <h3><?= __( 'Select a location', 'community-directory' ) ?></h3>
        <select name="location_select" id="modalLocationSelectField" style="width:100%">
            <option value=''></option>
        </select>
        <br />
        <a class="button-primary disabled submit display-block"><?= __( 'Save', 'community-directory' ) ?></a>
    </div>
</div>