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
            <article class="row">
                <header>
                    <h2 class="entry-title"><?php echo $post->post_title; ?></h2>
                </header>

                
                

            </article>
        </div>
    </main>

<?php get_footer(); ?>