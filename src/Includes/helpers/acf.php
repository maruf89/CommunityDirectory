<?php

use Maruf89\CommunityDirectory\Includes\ClassACF;

function community_directory_get_acf_fields( $form_name = '' ) {
    if ( empty( $form_name ) ) $form_name = ClassACF::$form_group_key;

    global $wpdb;

    $field_names = array();
    $res = $wpdb->get_results("
        SELECT p2.post_name, p2.post_excerpt
        FROM $wpdb->posts AS p1
        RIGHT JOIN $wpdb->posts AS p2
        ON p1.ID = p2.post_parent
        WHERE p1.post_name = '$form_name'
    ");

    foreach ( $res as $key => $field ) {
        $field_names[$field->post_excerpt] = $field->post_name;
    }
    
    return $field_names;
}

function community_directory_acf_update_entity( $entity_post_id, $entity_data ) {
    $ACF = ClassACF::get_instance();
    return $ACF->update_entity( $entity_post_id, $entity_data );
}