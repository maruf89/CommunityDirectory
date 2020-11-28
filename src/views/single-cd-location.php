<?php

use Maruf89\CommunityDirectory\Includes\ClassACF;

get_header();

global $post;

$location = $post->post_name;

$users = apply_filters( 'community_directory_get_users_for_location', array(), $location );

$url_pre = '/' . __( 'location', 'community-directory' ) . '/' . $location;

?>

    <main id="content" class="container">
        <div class="row mt-5 mb-5">
            <h1 class="text-center col-xs-12 col-md-12"><?= $post->post_title ?></h1>
            <?php foreach ( $users as $user ): ?>
                <div class="col-xs-12 col-md-4 p-3 mb-3">
                    <a href="<?= "$url_pre/$user->post_name" ?>">
                    <div class="card p-3">
                        <h4 class="m-0"><?= $user->{ClassACF::$field_location_name} ?>
                    </div>
                    </a>
                </div>
            <?php endforeach; ?>
        </div>
    </main>

<?php get_footer(); ?>