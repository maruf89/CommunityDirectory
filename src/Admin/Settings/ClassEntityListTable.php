<?php

namespace Maruf89\CommunityDirectory\Admin\Settings;

use Maruf89\CommunityDirectory\Includes\ClassEntity;
use Maruf89\CommunityDirectory\Includes\instances\Entity;

//Our class extends the WP_List_Table class, so we need to make sure that it's there
if ( !class_exists( 'WP_List_Table' ) ) {
    require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

class ClassEntityListTable extends \WP_List_Table {

    protected $post_type;

    private $page_tab;
    private $section;
    private $display_status = '';

    private $loc_modal_loaded = false;

    /**
     * Constructor, we override the parent to pass our own arguments
     * We usually focus on three parameters: singular and plural labels, as well as whether the class supports AJAX.
     */
    public function __construct( string $page_tab = '', $section = '' ) {
        $this->post_type = ClassEntity::$post_type;
        $this->page_tab = $page_tab;

        $this->section = $section;
        if ( !empty( $section ) && ( $section === 'active' || $section === 'inactive' ) )
            $this->display_status = $section === 'active' ? 'publish' : 'pending';

        parent::__construct( array(
            'singular'=> 'wp_list_entity', //Singular label
            'plural' => 'wp_list_entities', //plural label, also this well be one of the table css class
            'ajax'   => false //We won't support Ajax for this table
        ) );
    }

    /**
     * Prepare the table with different parameters, pagination, columns and table elements
     */
    function prepare_items() {
        global $wpdb, $_wp_column_headers;
        $screen = get_current_screen();

            /* -- Preparing your query -- */
        $query = ClassEntity::get_entities( array(), false, false, $this->display_status, true );

            /* -- Ordering parameters -- */
        list( $orderby, $order ) = $this->get_sort_params();
        if( !empty( $orderby ) && !empty( $order ) )
            $query .= " ORDER BY $orderby $order";

        $this->process_bulk_action();

        $this->process_single_action();

            /* -- Pagination parameters -- */
        //Number of elements in your table?
        $totalitems = $wpdb->query($query); //return the total number of affected rows

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

            /* -- Fetch the items -- */
        $this->items = $wpdb->get_results( $query );
    }

    /**
     * Define the columns that are going to be used in the table
     * @return array $columns, the array of columns to use with the table
     */
    public function get_columns() {
        $columns = array(
            'cb'=> '<input type="checkbox" />',
            'title' => __( 'Entity', 'community-directory' ),
            'location' => __( 'Location', 'community-directory' ),
            'status' => __( 'Status', 'community-directory' ),
            'author' => __( 'Author', 'community-directory' ),
            'last_edit' => __( 'Last Edit', 'community-directory' ),
            'join_date' => __( 'Join Date', 'community-directory' ),
        );
        return $columns;
    }

    /**
     * Decide which columns to activate the sorting functionality on
     * @return array $sortable, the array of columns that can be sorted by the user
     */
    public function get_sortable_columns() {
        $sortable = array(
            'title'     => array( 'post_title', 'asc' ),
            'location' => array( 'post_parent', 'asc' ),
            'status' => array( 'post_status', 'desc' ),
            'last_edit' => array( 'post_modified', 'desc' ),
            'join_date' => array( 'id', 'desc' ),
        );

        // If we've locked into a status, disable sortable on that col
        if ( !empty( $this->display_status ) ) unset( $sortable['status'] );
        
        return $sortable;
    }

    protected function get_default_primary_column_name() {
        return 'title';
    }

    protected function get_bulk_actions() {
        $actions = array(
            'activate' => __( 'Activate Entities', 'community-directory' ),
            'deactivate' => __( 'Deactivate Entities', 'community-directory' ),
        );

        // If we've locked into a status, disable sortable on that col
        if ( !empty( $this->display_status ) ) {
            $key = $this->section === 'active' ? 'activate' : 'deactivate';
            unset( $actions[$key] );
        }

        return $actions;
    }

    public function process_bulk_action() {
        $action      = $this->current_action();
        $all_entities = isset( $_REQUEST['all_entities'] ) ? wp_parse_id_list( wp_unslash( $_REQUEST['all_entities'] ) ) : array();

        $count = 0;

        switch ( $action ) {
            case 'activate':
                foreach ( $all_entities as $entity_post_id ) {
                    $entity = new Entity( $entity_post_id );
                    if ( $entity->is_valid() && $entity->activate_deactivate( true, false, true ) ) $count++;
                }

                add_settings_error(
                    'bulk_action',
                    'bulk_action',
                    /* translators: %d: Number of requests. */
                    sprintf( _n( 'Activated %d entity', 'Activated %d entities', $count ), $count ),
                    'success'
                );
                break;
            case 'deactivate':
                foreach ( $all_entities as $entity_post_id ) {
                    $entity = new Entity( $entity_post_id );
                    if ( $entity->activate_deactivate( false, false, true ) ) $count++;
                }

                add_settings_error(
                    'bulk_action',
                    'bulk_action',
                    /* translators: %d: Number of requests. */
                    sprintf( _n( 'Deactivated %d entity', 'Deactivated %d entities', $count ), $count ),
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
                if ( $entity->activate_deactivate( true, false, true ) ) {
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
                if ( $entity->activate_deactivate( false, false, true ) ) {
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

    public function column_id( $entity ) {
        return $entity->ID;
    }

    public function no_items() {
        return __( 'No entities found.', 'community-directory' );
    }

    public function column_cb( $item ) {
        return sprintf( '<input type="checkbox" name="all_entities[]" value="%1$s" /><span class="spinner"></span>', esc_attr( $item->ID ) );
    }

    public function column_title( Entity $entity ) {
        $cd = COMMUNITY_DIRECTORY_NAME;
        $tab = empty( $this->page_tab ) ? '' : "&tab=$this->page_tab";
        $section = empty( $this->section ) ? '' : "&section=$this->section";
        $sort = $this->get_sort_params( true );
        $url = "<a href='?page=$cd&action=%s&entity=%s${tab}${section}${sort}'>%s</a>";
        
        $edit_url = Entity::get_edit_link( $entity->ID );
        $edit_link = "<a href='$edit_url' %s>%s</a>";
        
        $actions = array(
            'activate'      => sprintf( $url, 'activate', $entity->ID, __( 'Activate', 'community-directory' ) ),
            'deactivate'    => sprintf( $url, 'deactivate', $entity->ID, __( 'Deactivate', 'community-directory' )),
            'edit'          => sprintf( $edit_link, 'style="color:red"', __( 'Edit', 'community-directory' ) ),
        );

        $remove_key = $entity->is_status( COMMUNITY_DIRECTORY_ENUM_ACTIVE ) ? 'activate' : 'deactivate';
        unset( $actions[$remove_key] );

        // don't allow activating invalid entities
        if ( !$entity->is_valid() && $remove_key !== 'activate' ) unset( $actions['activate'] );

        return sprintf( '%1$s <span style="color:silver ; display : none;">(id:%2$s)</span>%3$s',
            /*$1%s*/ sprintf( $edit_link, 'style="font-weight:bold"', $entity->post_title ),
            /*$2%s*/ $entity->ID,
            /*$3%s*/ $this->row_actions( $actions )
        );
    }

    public function column_location( Entity $entity ) {
        if ( $entity->location_name )
            return $entity->location_name;

        // Load thickbox and modal
        $id = 'modalLocationSelect';
        $this->require_location_select( $id );
        $columnId = 'columnLocation-' . $entity->post_id;
        
        // If no location exists for user;
        ob_start();
        ?>
            <div id="<?= $columnId ?>">
                <a class="button-primary thickbox select-location-modal enable-on-load disabled"
                data-entity-id="<?= $entity->ID ?>"
                data-column-id="<?= $columnId ?>"
                href="#TB_inline?&width=200&height=350&inlineId=<?=$id?>"
                >
                        <?= __( 'Select Location', 'community-directory' ) ?>
                </a>
            </div>
        <?php
        return ob_get_clean();
    }

    public function column_status( Entity $entity ) {
        return $entity->get_status( 'display' );
    }

    public function column_author( Entity $entity ) {
        $author = $entity->get_author();
        $edit_user_link = get_edit_user_link( $author->ID );
        $return = $author->display_name;

        // If current user can edit other users, wrap in link
        if ( !empty( $edit_user_link ) ) $return = "<a href='$edit_user_link'>$return</a>";

        return $return;
    }

    public function column_last_edit( Entity $entity ) {
        echo date_i18n( __( 'm/d/y g:i a', 'community-directory' ), $entity->post_modified );
    }

    public function column_join_date( Entity $entity ) {
        echo date_i18n( __( 'm/d/y g:i:s a', 'community-directory' ), $entity->post_date );
    }

    protected function get_sort_params( $as_url = false ) {
        //Parameters that are going to be used to order the result
        $orderby = !empty( $_GET['orderby'] ) ? esc_sql( $_GET['orderby'] ) : '';
        $order = !empty( $_GET['order'] ) ? esc_sql( $_GET['order'] ) : '';
        $paged = !empty( $_GET['paged'] ) ? esc_sql( $_GET['paged'] ) : '';

        if ( $as_url ) {
            $url = '';
            if ( !empty( $orderby ) && !empty( $order ) ) $url .= "&order=$order&orderby=$orderby";
            if ( !empty( $paged ) ) $url .= "&paged=$paged";
            return $url;
        }

        return array( $orderby, $order, $paged );
    }

    /**
     * Display the rows of records in the table
     *
     * @return string, echo the markup of the rows
     */
    public function display_rows() {
        if ( !empty( $this->items ) ) {
            foreach ( $this->items as $record ) {
                $class = '';// "class='$column_name column-$column_name'";

                $entity = new Entity( null, null, $record );

                ?>
                    <tr class="<?= trim( $class ) ?>">
                        <?php $this->single_row_columns( $entity ); ?>
                    </tr>
                <?php
            }
        } else {
            echo $this->no_items();
        }
    }

    private function require_location_select( $modal_id = '' ) {
        if ( $this->loc_modal_loaded ) return;

        $template_file = apply_filters( 'community_directory_template_modal-location-select.php', '' );
        load_template( $template_file, false, array( 'modal_id' => $modal_id ) );
        
        $this->loc_modal_loaded = true;
    }
}