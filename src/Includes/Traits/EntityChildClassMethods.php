<?php
/**
 * Methods that pertain to shared logic across post types that fall under a entity ownership
 */
namespace Maruf89\CommunityDirectory\Includes\Traits;

use Maruf89\CommunityDirectory\Includes\{ClassACF, ClassErrorHandler};
use Maruf89\CommunityDirectory\Includes\instances\{Entity};

trait EntityChildClassMethods {
    /**
     * Updates the offers/needs cpt post_status to reflect whether
     * the parent entity is active or not
     */
    public function entity_changed_activation( Entity $entity, bool $activated, bool $status_only ) {
        global $wpdb;
        $post_type = static::$post_type;
        // $search_post_status = $activated ? 'future' : 'publish';
        $instances_sql = $wpdb->prepare("
            SELECT post.ID
            FROM $wpdb->posts as post
            WHERE post.post_status != 'auto-draft'
            AND post.post_author = %d
            AND post.post_type = '%s'
        ",
        $entity->author_id,
        $post_type
    );

        $instances = $wpdb->get_results( $instances_sql );

        if ( !count( $instances ) ) return;

        // If entity isn't active, instances will get altered statuses
        $post_status_addition = $activated ? 0 : 2;
        $instances = static::format_to_instances( $instances );

        foreach ( $instances as $instance ) {
            $instance_active = $instance->get_status();
            $post_status_count = $post_status_addition + ( $instance_active ? 1 : 0 );
            $post_status = community_directory_bool_to_status( $post_status_count, 'entity_child', 'post' );
            $instance->update_post( array( 'post_status' => $post_status ) );
        }
    }
}