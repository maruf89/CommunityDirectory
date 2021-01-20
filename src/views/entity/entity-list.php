<?php

/**
 * Lists entities
 */

$instances = $args[ 'instances' ];
$single_template = $args[ 'single_template' ];

?>

<?php foreach ( $instances as $index => $instance ): ?>
    <?php load_template( $single_template, false, array( 'instance' => $instance, 'index' => $index ) ); ?>
<?php endforeach; ?>