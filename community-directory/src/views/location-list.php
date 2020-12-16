<?php

$locations = $args['locations'];

$no_photo_template = apply_filters( 'community_directory_template_elements/location-single-no-photo.php', '' );
$photo_template = apply_filters( 'community_directory_template_elements/location-single.php', '' );
?>

<ul class="row location-list">
    <?php foreach ( $locations as $location ): ?>
        <li class="col-xs-12 col-md-6 p-2">
            <?php
                $template_file = $location->get_featured() ? $photo_template : $no_photo_template;
                load_template( $template_file, false, array( 'location' => $location ) );
            ?>
        </li>
    <?php endforeach; ?>
</ul>