<?php

/**
 * Lists entities
 */

$instances = $args[ 'instances' ];
$single_template = $args[ 'single_template' ];
$single_template_args = $args[ 'single_template_args' ] ?? [];

?>

<?php foreach ( $instances as $index => $instance ): ?>
    <?php load_template( $single_template, false, array( 'instance' => $instance, 'index' => $index, ...$single_template_args ) ); ?>
<?php endforeach; ?>