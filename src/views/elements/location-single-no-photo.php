<?php $location = $args['location']; ?>

<a class="card" href="/<?= __( 'location', 'community-directory' ) . "/$location->slug" ?>">
    <div class="card-body text-center">
        <h4><?= $location->display_name ?></h4>
        <div class="divider">&nbsp;</div>
        <h5><?= sprintf( _n( '%d Inhabitant', '%d Inhabitants', $location->active_inhabitants, 'community-directory' ), $location->active_inhabitants ) ?></h5>
    </div>
</a>
