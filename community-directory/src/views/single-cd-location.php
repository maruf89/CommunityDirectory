<?php

use Maruf89\CommunityDirectory\Includes\ClassACF;

get_header();

global $post;

$location = $post->post_name;

$entities = apply_filters( 'community_directory_get_entities', array(), $location, 'location', 'publish' );

$url_pre = '/' . __( 'location', 'community-directory' ) . '/' . $location;

?>

    <main id="content" class="container">
        <div class="row mt-5 mb-5">
            <h1 class="text-center col-xs-12 col-md-12"><?= $post->post_title ?></h1>
            <?php foreach ( $entities as $entity ): ?>
                <div class="col-xs-12 col-md-4 p-3 mb-3">
                    <a href="<?= "$url_pre/$entity->post_name" ?>">
                    <div class="card p-3">
                        <h4 class="m-0"><?= $entity->{ClassACF::$field_location_name} ?>
                    </div>
                    </a>
                </div>
            <?php endforeach; ?>
        </div>
    </main>

<?php get_footer(); ?>