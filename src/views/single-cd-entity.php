<?php

use Maruf89\CommunityDirectory\Includes\ClassACF;

get_header();

global $post;

$location = $post->post_name;

// dump($post);

?>

    <main id="content" class="container">
        <div class="row">
            <div class="col-xs-12 col-md-6">
                <div class="card p-3">
                    <h1><?= $post->post_title ?></h1>
                    <div class="divider"></div>
                    <p>
                        <?= get_post_meta( $post->ID, 'user_about', true ) ?>
                    </p>
                </div>
                
            </div>
            <div class="col-xs-12 col-md-6">
                <div class="card p-3">
                    <?php the_post_thumbnail( 'medium' ); ?>
                </div>
            </div>
            <div class="col-xs-12 col-md-6">
                <div class="card p-3">
                    sth.
                </div>
            </div>

                
                

        </div>
    </main>

<?php get_footer(); ?>