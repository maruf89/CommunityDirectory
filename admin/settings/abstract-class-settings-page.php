<?php
/**
 * UsersWP Settings Page/Tab
 *
 * @author      AyeCode
 * @category    Admin
 * @package     community-directory/admin
 * @version     1.0.24
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

if ( ! class_exists( 'Community_Directory_Settings_Page', false ) ) :

/**
 * Community_Directory_Settings_Page.
 */
abstract class Community_Directory_Settings_Page {

    /**
     * Setting page id.
     *
     * @var string
     */
    protected $id = '';

    /**
     * Setting page label.
     *
     * @var string
     */
    protected $label = '';

    /**
     * Constructor.
     */
    public function __construct() {
        add_filter( 'community_directory_settings_tabs_array', array( $this, 'add_settings_page' ), 20 );
        add_action( 'community_directory_sections_' . $this->id, array( $this, 'output_toggle_advanced' ) );
        add_action( 'community_directory_sections_' . $this->id, array( $this, 'output_sections' ) );
        add_action( 'community_directory_settings_' . $this->id, array( $this, 'output' ) );
        add_action( 'community_directory_settings_save_' . $this->id, array( $this, 'save' ) );

    }

    /**
     * Get settings page ID.
     * @return string
     */
    public function get_id() {
        return $this->id;
    }

    /**
     * Get settings page label.
     * @return string
     */
    public function get_label() {
        return $this->label;
    }

    /**
     * Add this page to settings.
     */
    public function add_settings_page( $pages ) {
        $pages[ $this->id ] = $this->label;

        return $pages;
    }

    /**
     * Get settings array.
     *
     * @return array
     */
    public function get_settings() {
        return apply_filters( 'community_directory_get_settings_' . $this->id, array() );
    }

    /**
     * Get sections.
     *
     * @return array
     */
    public function get_sections() {
        return apply_filters( 'community_directory_get_sections_' . $this->id, array() );
    }

    /**
     * Detect if the advanced settings button should be shown or not.
     *
     * @return bool
     */
    public function show_advanced(){
        global $current_section;
        $show = false;
        $settings = $this->get_settings($current_section);

        if(!empty($settings)){
            foreach($settings as $setting){
                if(isset($setting['advanced']) && $setting['advanced']){
                    $show = true;
                    break;
                }
            }
        }

        return $show;
    }

    /**
     * Output sections.
     */
    public function output_sections() {
        global $current_section;

        $sections = $this->get_sections();

        if ( empty( $sections ) || 1 === sizeof( $sections ) ) {
            return;
        }

        echo '<ul class="subsubsub">';

        $array_keys = array_keys( $sections );

        foreach ( $sections as $id => $label ) {
            echo '<li><a href="' . admin_url( 'admin.php?page=community-directory&tab=' . $this->id . '&section=' . sanitize_title( $id ) ) . '" class="' . ( $current_section == $id ? 'current' : '' ) . '">' . $label . '</a> ' . ( end( $array_keys ) == $id ? '' : '|' ) . ' </li>';
        }

        echo '</ul><br class="clear" />';
    }

    /**
     * Output the settings.
     */
    public function output() {
        $settings = $this->get_settings();

        Community_Directory_Admin_Settings::output_fields( $settings );
    }

    /**
     * Save settings.
     */
    public function save() {
        global $current_section;

        $settings = $this->get_settings();
        Community_Directory_Admin_Settings::save_fields( $settings );

        if ( $current_section ) {
            do_action( 'community_directory_update_options_' . $this->id . '_' . $current_section );
        }
    }
}

endif;
