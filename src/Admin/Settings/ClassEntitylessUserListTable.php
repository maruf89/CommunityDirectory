<?php

namespace Maruf89\CommunityDirectory\Admin\Settings;

use Maruf89\CommunityDirectory\Includes\ClassEntity;
use Maruf89\CommunityDirectory\Includes\instances\Entity;

//Our class extends the WP_List_Table class, so we need to make sure that it's there
if ( !class_exists( 'WP_MS_Users_List_Table' ) ) {
    require_once( ABSPATH . 'wp-admin/includes/class-wp-ms-users-list-table.php' );
}

class ClassEntitylessUserListTable extends \WP_MS_Users_List_Table {

    protected $post_type;
    private $page_tab;
    private $section;
    private $display_status = '';

    /**
     * Prepare the table with different parameters, pagination, columns and table elements
     */
    function prepare_items() {
        global $wpdb, $_wp_column_headers;
        $screen = get_current_screen();

            /* -- Preparing your query -- */
        $query = ClassEntity::get_entities_for_entityless_users( true );

            /* -- Ordering parameters -- */
        list( $orderby, $order ) = $this->get_sort_params();
        if( !empty( $orderby ) && !empty( $order ) )
            $query .= " ORDER BY $orderby $order";

        $this->process_bulk_action();

        $this->process_single_action();

            /* -- Pagination parameters -- */
        //Number of elements in your table?
        $totalitems = $wpdb->query( $query ); //return the total number of affected rows

        //How many to display per page?
        $perpage = 20;

        //Which page is this?
        $paged = !empty( $_GET["paged"] ) ? esc_sql( $_GET["paged"] ) : '';

        //Page Number
        if ( empty( $paged ) || !is_numeric( $paged ) || $paged <= 0 ) $paged = 1;

        //How many pages do we have in total?
        $totalpages = ceil( $totalitems / $perpage );

        //adjust the query to take pagination into account
        if ( !empty( $paged ) && !empty( $perpage ) ) {
            $offset = ( $paged - 1 ) *$perpage;
            $query .= ' LIMIT ' . (int) $offset . ',' . (int) $perpage;
        }

            /* -- Register the pagination -- */
        $this->set_pagination_args( array(
            "total_items" => $totalitems,
            "total_pages" => $totalpages,
            "per_page" => $perpage,
        ) );
        //The pagination links are automatically built according to those parameters

            /* -- Register the Columns -- */
        $columns = $this->get_columns();
        $this->_column_headers = array(
            $this->get_columns(),       // columns
            array(),           // hidden
            $this->get_sortable_columns(),  // sortable
       );
        $_wp_column_headers[$screen->id] = $columns;

        $this->items = $wpdb->get_results( $query );
        foreach ( $this->items as $key => $user ) {
            $this->items[$key] = new \WP_User( $user );
        }

    }

    protected function get_bulk_actions() {
        return array(
            'generate' => __( 'Generate Entities', 'community-directory' ),
        );
    }

    public function process_bulk_action() {
        $action      = $this->current_action();
        $allusers = isset( $_REQUEST['allusers'] ) ? wp_parse_id_list( wp_unslash( $_REQUEST['allusers'] ) ) : array();

        $count = 0;

        switch ( $action ) {
            case 'generate':
                foreach ( $allusers as $user_id ) {
                    $entity = new Entity( null, $user_id );
                    $user = get_userdata( $user_id );
                    if ( $post_id = $entity->insert_into_db( array(
                        'user_id'                   => $user->ID,
                        'first_name'                => $user->first_name,
                        'last_name'                 => $user->last_name,
                    ) ) ) $count++;
                }

                add_settings_error(
                    'bulk_action',
                    'bulk_action',
                    /* translators: %d: Number of requests. */
                    sprintf( _n( 'Activated %d entity', 'Activated %d entities', $count ), $count ),
                    'success'
                );
                break;
        }
    }

    public function process_single_action() {
        $action      = $this->current_action();
        $entity_id = isset( $_REQUEST['entity'] ) ? (int) wp_unslash( $_REQUEST['entity'] ) : null;

        if ( !$action || !$entity_id ) return;

        $entity = new Entity( $entity_id );

        switch ( $action ) {
            case 'activate':
                if ( $entity->activate_deactivate( true ) ) {
                    add_settings_error(
                        'single_action',
                        'single_action',
                        /* translators: %d: Number of requests. */
                        __( 'Activated entity', 'community-directory' ),
                        'success'
                    );
                }
                break;
            case 'deactivate':
                if ( $entity->activate_deactivate( false ) ) {
                    add_settings_error(
                        'single_action',
                        'single_action',
                        /* translators: %d: Number of requests. */
                        __( 'Deactivated Entity', 'community-directory' ),
                        'success'
                    );
                }
                break;
        }
    }

    public function column_cb( $item ) {
        return sprintf( '<input type="checkbox" name="allusers[]" value="%1$s" /><span class="spinner"></span>', esc_attr( $item->ID ) );
    }
}