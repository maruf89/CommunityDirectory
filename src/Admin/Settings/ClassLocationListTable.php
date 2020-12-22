<?php

namespace Maruf89\CommunityDirectory\Admin\Settings;

use Maruf89\CommunityDirectory\Includes\ClassLocation;
use Maruf89\CommunityDirectory\Includes\instances\Location;

//Our class extends the WP_List_Table class, so we need to make sure that it's there
if ( !class_exists( 'WP_List_Table' ) ) {
    require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

class ClassLocationListTable extends \WP_List_Table {

    protected $post_type;

    private $page_tab;
    private $section;
    private $display_status = '';

    private $coord_modal_loaded = false;

    /**
     * Constructor, we override the parent to pass our own arguments
     * We usually focus on three parameters: singular and plural labels, as well as whether the class supports AJAX.
     */
    public function __construct( string $page_tab = '', $section = '' ) {
        $this->post_type = ClassLocation::$post_type;
        $this->page_tab = $page_tab;

        $this->section = $section;
        if ( !empty( $section ) && ( $section === 'active' || $section === 'pending' ) )
            $this->display_status = $section === 'active' ? 'publish' : 'pending';

        parent::__construct( array(
            'singular'=> 'wp_list_location', //Singular label
            'plural' => 'wp_list_locations', //plural label, also this well be one of the table css class
            'ajax'   => false //We won't support Ajax for this table
        ) );
    }

    /**
     * Prepare the table with different parameters, pagination, columns and table elements
     */
    function prepare_items() {
        global $wpdb, $_wp_column_headers;
        $screen = get_current_screen();

        $where_status = $this->section ? community_directory_status_to_enum( $this->section ) : '';
        
            /* -- Preparing your query -- */
        $query = apply_filters( 'community_directory_get_locations', array(), $where_status, null, 'sql' );

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
        $paged = !empty( $_GET[ 'paged' ] ) ? esc_sql( $_GET[ 'paged' ] ) : '';

        //Page Number
        if ( empty( $paged ) || !is_numeric( $paged ) || $paged <= 0 ) $paged = 1;

        //How many pages do we have in total?
        $totalpages = ceil( $totalitems / $perpage );

        //adjust the query to take pagination into account
        if ( !empty( $paged ) && !empty( $perpage ) ) {
            $offset = ( $paged - 1 ) * $perpage;
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
        $items = $wpdb->get_results( $query );
        $this->items = apply_filters( 'community_directory_format_locations', $items, 'instance' );
    }

    /**
     * Define the columns that are going to be used in the table
     * @return array $columns, the array of columns to use with the table
     */
    public function get_columns() {
        $columns = array(
            'cb'=> '<input type="checkbox" />',
            'title' => __( 'Title', 'community-directory' ),
            'slug' => __( 'Slug', 'community-directory' ),
            'status' => __( 'Status', 'community-directory' ),
            'active_inhabitants' => __( 'Inhabitants', 'community-directory' ),
            'inactive_inhabitants' => __( 'Inactive Inhabitants', 'community-directory' ),
        );

        if ( community_directory_settings_get( 'enable_open_street_map', false ) ) {
            $columns[ 'coords' ] = __( 'Location', 'community-directory' );
        }
        
        return $columns;
    }

    /**
     * Decide which columns to activate the sorting functionality on
     * @return array $sortable, the array of columns that can be sorted by the user
     */
    public function get_sortable_columns() {
        $sortable = array(
            'title'     => array( 'post_title', 'asc' ),
            'status' => array( 'post_status', 'desc' ),
        );

        // If we've locked into a status, disable sortable on that col
        if ( !empty( $this->display_status ) ) unset( $sortable[ 'status' ] );
        
        return $sortable;
    }

    protected function get_default_primary_column_name() {
        return 'title';
    }

    protected function get_bulk_actions() {
        $actions = array(
            'activate' => __( 'Activate Locations', 'community-directory' ),
            'deactivate' => __( 'Deactivate Locations', 'community-directory' ),
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
        $all_locations = isset( $_REQUEST['all_locations'] ) ? wp_parse_id_list( wp_unslash( $_REQUEST['all_locations'] ) ) : array();

        if ( !count( $all_locations ) ) return;
        
        $locations = [];
        foreach ( $all_locations as $location_id ) $locations[] = new Location( $location_id );

        $count = 0;

        switch ( $action ) {
            case 'activate':
                foreach ( $locations as $location )
                    if ( $location->is_valid() && $location->activate_deactivate( true ) ) $count++;

                add_settings_error(
                    'bulk_action',
                    'bulk_action',
                    /* translators: %d: Number of requests. */
                    sprintf( _n( 'Activated %d location', 'Activated %d locations', $count, 'community-directory' ), $count ),
                    'success'
                );
                break;
            case 'deactivate':
                foreach ( $locations as $location )
                    if ( $location->activate_deactivate( false ) ) $count++;

                add_settings_error(
                    'bulk_action',
                    'bulk_action',
                    /* translators: %d: Number of requests. */
                    sprintf( _n( 'Deactivated %d location', 'Deactivated %d locations', $count, 'community-directory' ), $count ),
                    'success'
                );
                break;
            case 'delete':
                foreach ( $locations as $location )
                    if ( $location->delete_self() ) $count++;

                add_settings_error(
                    'bulk_action',
                    'bulk_action',
                    /* translators: %d: Number of requests. */
                    sprintf( _n( 'Deleted %d location', 'Deleted %d locations', $count, 'community-directory' ), $count ),
                    'success'
                );
                break;
        }
    }

    public function process_single_action() {
        $action      = $this->current_action();
        $location_id = isset( $_REQUEST['location'] ) ? (int) wp_unslash( $_REQUEST['location'] ) : null;

        if ( !$action || !$location_id ) return;

        $location = new Location( $location_id );

        switch ( $action ) {
            case 'activate':
                if ( $location->activate_deactivate( true ) ) {
                    add_settings_error(
                        'single_action',
                        'single_action',
                        /* translators: %d: Number of requests. */
                        __( 'Activated location', 'community-directory' ),
                        'success'
                    );
                }
                break;
            case 'deactivate':
                if ( $location->activate_deactivate( false ) ) {
                    add_settings_error(
                        'single_action',
                        'single_action',
                        /* translators: %d: Number of requests. */
                        __( 'Deactivated Location', 'community-directory' ),
                        'success'
                    );
                }
                break;
            case 'delete':
                if ( $location->delete_self() )
                    add_settings_error(
                        'bulk_action',
                        'bulk_action',
                        /* translators: %d: Number of requests. */
                        __( 'Deleted location', 'community-directory' ),
                        'success'
                    );
        }
    }

    public function column_id( $location ) {
        return $location->ID;
    }

    public function no_items() {
        return __( 'No locations found.', 'community-directory' );
    }

    public function column_cb( $location ) {
        return sprintf( '<input type="checkbox" name="all_locations[]" value="%1$s" /><span class="spinner"></span>', esc_attr( $location->location_id ) );
    }

    public function column_title( Location $location ) {
        $cd = COMMUNITY_DIRECTORY_NAME;
        $tab = empty( $this->page_tab ) ? '' : "&tab=$this->page_tab";
        $section = empty( $this->section ) ? '' : "&section=$this->section";
        $sort = $this->get_sort_params( true );
        $url = "<a href='?page=$cd&action=%s&location=%s${tab}${section}${sort}'>%s</a>";
        
        $edit_url = Location::get_edit_link( $location->post_id );
        $edit_link = "<a href='$edit_url' %s>%s</a>";
        
        $actions = array(
            'rename'      => sprintf( $url, 'rename', $location->location_id, __( 'Rename (todo)', 'community-directory' ) ),
            'edit'          => sprintf( $edit_link, '', __( 'Edit', 'community-directory' ) ),
            'delete'          => sprintf( $url, 'delete', $location->location_id, __( 'Delete', 'community-directory' ) ),
        );

        return sprintf( '%1$s <span style="color:silver ; display : none;">(id:%2$s)</span>%3$s',
            /*$1%s*/ sprintf( $edit_link, 'style="font-weight:bold"', $location->display_name ),
            /*$2%s*/ $location->ID,
            /*$3%s*/ $this->row_actions( $actions )
        );
    }

    public function column_slug( Location $location ) {
        return $location->slug;
    }

    public function column_status( Location $location ) {
        $active = $location->get_status( 'bool' );
        $color = $active ? 'green' : 'grey';
        $display_status = $location->get_status( 'display' );

        $cd = COMMUNITY_DIRECTORY_NAME;
        $tab = empty( $this->page_tab ) ? '' : "&tab=$this->page_tab";
        $section = empty( $this->section ) ? '' : "&section=$this->section";
        $sort = $this->get_sort_params( true );
        $url = "<a href='?page=$cd&action=%s&location=%s${tab}${section}${sort}'>%s</a>";
    
        
        $actions = array(
            'activate'      => sprintf( $url, 'activate', $location->location_id, __( 'Activate', 'community-directory' ) ),
            'deactivate'    => sprintf( $url, 'deactivate', $location->location_id, __( 'Deactivate', 'community-directory' )),
        );

        $remove_key = $location->status === COMMUNITY_DIRECTORY_ENUM_ACTIVE ? 'activate' : 'deactivate';
        unset( $actions[$remove_key] );

        // don't allow activating invalid locations
        if ( !$location->is_valid() && $remove_key !== 'activate' ) unset( $actions['activate'] );

        // don't allow activating invalid locations
        if ( !$location->is_valid() && $remove_key !== 'activate' ) unset( $actions['activate'] );

        return sprintf( '%1$s<br /><span style="color:silver; display : none;">(id:%2$s)</span>%3$s',
            /*$1%s*/ "<span style='color:$color'>$display_status</span>",
            /*$2%s*/ $location->ID,
            /*$3%s*/ $this->row_actions( $actions )
        );
    }

    public function column_active_inhabitants( Location $location ) {
        return $location->active_inhabitants;
    }

    public function column_inactive_inhabitants( Location $location ) {
        return $location->inactive_inhabitants;
    }

    public function column_coords( Location $location ) {
        $coords = $location->coords;
        $has_coords = $coords[ 'lat' ] && $coords[ 'lon' ];

        $modal_id = 'mapCoordsModal';
        $text = $has_coords ? __( 'Show in Map', 'community-directory' ) : __( 'Set Center', 'community-directory' );

        $this->require_coords_select( $modal_id );
        $columnId = 'columnLocation-' . $location->location_id;

        ob_start();
        
        if ( $has_coords ):?>

            <div id="<?= $columnId ?>">
                <a class="button-primary thickbox select-coords-modal enable-on-load disabled"
                data-location-id="<?= $location->location_id ?>"
                data-column-id="<?= $columnId ?>"
                data-column-edit="false"
                data-coords="<?= $coords[ 'lat' ] . ',' . $coords[ 'lon' ] ?>"
                href="#TB_inline?&width=400&height=425&inlineId=<?=$modal_id?>"
                >
                        <?= __( 'View on Map', 'community-directory' ) ?>
                </a>
            </div>

        <?php else: ?>

            <div id="<?= $columnId ?>">
                <a class="button-primary thickbox select-coords-modal enable-on-load disabled"
                data-location-id="<?= $location->location_id ?>"
                data-column-id="<?= $columnId ?>"
                data-column-edit="true"
                href="#TB_inline?&width=400&height=425&inlineId=<?=$modal_id?>"
                >
                        <?= __( 'Set Center', 'community-directory' ) ?>
                </a>
            </div>
        
        <?php endif;
        return ob_get_clean();
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
            foreach ( $this->items as $location ):
                ?>
                    <tr>
                        <?php $this->single_row_columns( $location ); ?>
                    </tr>
                <?php
            endforeach;
        } else {
            echo $this->no_items();
        }
    }

    private function require_coords_select( string $modal_id = '', array $coords = null, bool $edit = false ) {
        if ( $this->coord_modal_loaded ) return;

        $template_file = apply_filters( 'community_directory_template_modal-openstreetmap.php', '' );
        load_template( $template_file, false, array(
            'modal_id'  => $modal_id,
        ) );
        $this->coord_modal_loaded = true;
    }
}