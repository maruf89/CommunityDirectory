<?php $location = $args['location']; ?>

<a class="card cd-location photo" href="/<?= __( 'location', 'community-directory' ) . "/$location->slug" ?>">
    <div class="card-body text-center">
        <div class="img-container" style="background: url(<?= $location->get_featured() ?>) no-repeat center;">
            <img class="d-none d-sm-none" src="<?= $location->get_featured() ?>" />
        </div>
        <div class="text">
            <h4><?= $location->display_name ?></h4>
            <h5><?= sprintf( _n( '%d Inhabitant', '%d Inhabitants', $location->active_inhabitants, 'community-directory' ), $location->active_inhabitants ) ?></h5>
        </div>
    </div>
</a>