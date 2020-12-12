<?php

$attrs = $args[ 'attrs' ];
$type = $attrs[ 'type' ];
$translated = community_directory_offer_type_translated( $type, true );

?>

<section>
    <h3>
        <?= sprintf( __( 'No %s results found.', 'community-directory' ), $translated ); ?>
    </h3>
</section>