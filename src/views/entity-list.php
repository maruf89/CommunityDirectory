<?php

/**
 * Lists entities
 */

$entities = $args[ 'entities' ];

$template_file = apply_filters( 'community_directory_template_elements/entity-single.php', '' );

?>

<?php foreach ( $entities as $index => $entity ): ?>
    <?php load_template( $template_file, false, array( 'entity' => $entity, 'index' => $index ) ); ?>
<?php endforeach; ?>