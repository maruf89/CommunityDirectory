<?php

$locations = $args[ 'locations' ];
$single_template = $args[ 'single_template' ];

?>

<ul class="row location-list">
    <?php foreach ( $locations as $location ): ?>
        <li class="col-xs-12 col-md-6 p-2">
            <?php
                load_template( $single_template, false, array(
                    'location' => $location,
                    'style_class' => 'card'
                    )
                );
            ?>
        </li>
    <?php endforeach; ?>
</ul>