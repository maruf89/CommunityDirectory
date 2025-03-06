<?php

get_header();

?>

    <main id="content" class="container">
        <h2>Create a template</h2>
        <p>
            Create a file in your theme's folder named <code>single-cd-location.php</code> to render an location.<br /> <br />
            To get started with the essential location fields, include this in the head of your file:
        </p>
        <code>
            use Maruf89\CommunityDirectory\Includes\ClassACF;<br />
            <br />
            get_header();<br />
            <br />
            global $post;<br />
            <br />
            $location = apply_filters( 'community_directory_get_location', $post->ID, $post->post_author, $post );<br />
            <br />
            // Next you can get fields like the profile photo via<br />
            $photo = $location->get_featured();
        </code>
    </main>

<?php get_footer(); ?>