<?php

use Maruf89\CommunityDirectory\Includes\ClassACF;

get_header();

global $post;

$location_name = $post->post_name;

?>

    <main id="content" class="container">

        <div class="row">
            <div class="col-xs-12 col-sm-12 mb-5">
                <h1 class="text-center col-xs-12 col-md-12"><?= $post->post_title ?></h1>
            </div>
        </div>

        <div class="row mb-5">
            <div class="col-xs-12 col-sm-6">
                <h4 class="text-center mb-4"><?= sprintf( __( 'Offers in %s', 'community-directory' ), $post->post_title ) ?></h4>
                <?php do_shortcode( "[community_directory_list_offers_needs_hashtag_list location_id='$post->ID' type='offer' ]" ); ?>
            </div>
            <div class="col-xs-12 col-sm-6">
                <h4 class="text-center mb-4"><?= sprintf( __( 'Needs in %s', 'community-directory' ), $post->post_title ) ?></h4>
                <?php do_shortcode( "[community_directory_list_offers_needs_hashtag_list location_id='$post->ID' type='need' ]" ); ?>
            </div>
        </div>

        <div class="row mb-5">
            <h2 class="text-center col-xs-12 col-sm-12 mb-4"><?= sprintf( __( 'Entities in %s', 'community-directory' ), $post->post_title ) ?></h2>
            <?php do_shortcode( "[community_directory_list_entities location_id='$post->ID' ]" ); ?>
        </div>
    </main>

<?php get_footer(); ?>