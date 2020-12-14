<?php

$entity = $args[ 'entity' ];

?>

<div class="col-xs-12 col-md-4 p-3 mb-3">
    <a href="<?= $entity->get_display_link( $entity ) ?>">
    <div class="card p-3">
        <h4 class="m-0"><?= $entity->get_acf_location_name() ?>
    </div>
    </a>
</div>