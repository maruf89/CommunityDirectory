<?php

$attrs = $args[ 'attrs' ];
$type = $attrs[ 'type' ];
$translated = community_directory_offer_type_translated( $type, true );

if ( $type === 'need' )
    $message = __( 'Maybe you have a need you would like to make public? Make it known.', 'community-directory' );
else
    $message = __( 'Maybe you have something to offer? Make it known.', 'community-directory' );

if ( cd_is_entity_user() ) {
    $link = community_directory_offer_need_link( 'create' );
    $link_msg = sprintf( __( 'Create one <a href="%s">here</a>.', 'community-directory' ), $link );
} else {
    $link = wp_registration_url();
    $link_msg = sprintf( __( 'Register your account <a href="%s">here</a> to get started.', 'community-directory' ), $link);
}
    

?>

<section>
    <h5><?= sprintf( __( 'No %s.', 'community-directory' ), $translated ); ?></h5>
    <p><?= $message ?></p>
    <p><?= $link_msg ?></p>

</section>