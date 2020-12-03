<?php
/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    community-directory
 * @subpackage community-directory/admin/settings
 * @author     Marius Miliunas
 */

namespace Maruf89\CommunityDirectory\Admin\Settings;

class ClassAdminSettings {

    /**
     * Setting pages.
     *
     * @var array
     */
    private static $settings = array();

    /**
     * Error messages.
     *
     * @var array
     */
    private static $errors   = array();

    /**
     * Update messages.
     *
     * @var array
     */
    private static $messages = array();
    
    public function __construct() {

    }

    /**
     * Include the settings page classes.
     */
    public static function get_settings_pages() {
        if ( empty( self::$settings ) ) {
            $settings = array();

            $settings[] = new ClassSettingsGeneral();
            $settings[] = new ClassSettingsLocation();
            $settings[] = new ClassSettingsUninstall();
            if ( wp_get_environment_type() !== 'production' ) $settings[] = new ClassSettingsTest();

            self::$settings = apply_filters( 'community_directory_get_settings_pages', $settings );
        }

        return self::$settings;
    }

    /**
     * Save the settings.
     */
    public static function save() {
        global $current_tab;

        if ( empty( $_REQUEST['_wpnonce'] ) || ! wp_verify_nonce( $_REQUEST['_wpnonce'], 'community-directory-settings' ) ) {
            die( __( 'Action failed. Please refresh the page and retry.', 'community-directory' ) );
        }

        // Trigger actions
        do_action( 'community_directory_settings_save_' . $current_tab );
        do_action( 'community_directory_update_options_' . $current_tab );
        do_action( 'community_directory_update_options' );

        self::add_message( __( 'Your settings have been saved.', 'community-directory' ) );

        // Clear flush rules
        wp_schedule_single_event( time(), 'community_directory_flush_rewrite_rules' );

        do_action( 'community_directory_settings_saved' );
    }

    /**
     * Add a message.
     * @param string $text
     */
    public static function add_message( $text ) {
        self::$messages[] = $text;
    }

    /**
     * Add an error.
     * @param string $text
     */
    public static function add_error( $text ) {
        self::$errors[] = $text;
    }

    /**
     * Output messages + errors.
     */
    public static function show_messages() {
        if ( sizeof( self::$errors ) > 0 ) {
            foreach ( self::$errors as $error ) {
                echo '<div id="message" class="error inline"><p><strong>' . esc_html( $error ) . '</strong></p></div>';
            }
        } elseif ( sizeof( self::$messages ) > 0 ) {
            foreach ( self::$messages as $message ) {
                echo '<div id="message" class="updated inline"><p><strong>' . esc_html( $message ) . '</strong></p></div>';
            }
        }
    }


    /**
     * Settings page.
     *
     * Handles the display of the main settings page in admin.
     */
    public static function output($tab = '') {
        global $current_section, $current_tab;

        do_action( 'community_directory_settings_start' );

        // Include settings pages
        self::get_settings_pages();

        // Get current tab/section
        if ( $tab ) {
            $current_tab = sanitize_title( $tab);

        } else {
            $current_tab = empty( $_GET['tab'] ) ? 'location' : sanitize_title( $_GET['tab'] );

        }
        
        $current_section = empty( $_REQUEST['section'] ) ? '' : sanitize_title( $_REQUEST['section'] );

        // Save settings if data has been posted
        if ( ! empty( $_POST ) ) {
            self::save();
        }

        // Add any posted messages
        if ( ! empty( $_GET['community_directory_error'] ) ) {
            self::add_error( stripslashes( $_GET['community_directory_error'] ) );
        }

        if ( ! empty( $_GET['community_directory_message'] ) ) {
            self::add_message( stripslashes( $_GET['community_directory_message'] ) );
        }

        // Get tabs for the settings page
        $tabs = apply_filters( 'community_directory_settings_tabs_array', array() );

        include( COMMUNITY_DIRECTORY_ADMIN_PATH . 'views/html-admin-settings.php' );
    }

    /**
     * Output admin fields.
     *
     * Loops though the community-directory options array and outputs each field.
     *
     * @param array $options Opens array to output
     */
    public static function output_fields( $options ) {
        foreach ( $options as $value ) {
            if ( ! isset( $value['type'] ) ) {
                continue;
            }
            if ( ! isset( $value['id'] ) ) {
                $value['id'] = '';
            }
            if ( ! isset( $value['title'] ) ) {
                $value['title'] = isset( $value['name'] ) ? $value['name'] : '';
            }
            if ( ! isset( $value['class'] ) ) {
                $value['class'] = '';
            }
            if ( ! isset( $value['css'] ) ) {
                $value['css'] = '';
            }
            if ( ! isset( $value['default'] ) ) {
                $value['default'] = '';
            }
            if ( ! isset( $value['desc'] ) ) {
                $value['desc'] = '';
            }
            if ( ! isset( $value['desc_tip'] ) ) {
                $value['desc_tip'] = false;
            }
            if ( ! isset( $value['placeholder'] ) ) {
                $value['placeholder'] = '';
            }
            if ( ! isset( $value['status'] ) ) $value['status'] = '';

            // Custom attribute handling
            $custom_attributes = array();

            if ( ! empty( $value['custom_attributes'] ) && is_array( $value['custom_attributes'] ) ) {
                foreach ( $value['custom_attributes'] as $attribute => $attribute_value ) {
                    $custom_attributes[] = esc_attr( $attribute ) . '="' . esc_attr( $attribute_value ) . '"';
                }
            }

            $wrap_class = $value['id'].'-wrap';

            // Description handling
            $field_description = self::get_field_description( $value );
            $tooltip_html = $field_description['tooltip_html'] ? $field_description['tooltip_html'] : '';
            $description = $field_description['description'] ? $field_description['description'] : '';

            // Switch based on type
            switch ( $value['type'] ) {

                // Section Titles
                case 'title':
                    if ( ! empty( $value['title'] ) ) {
                        echo '<h2 class="community-directory-settings-title">';
                        echo esc_html( $value['title'] );
                        if(!empty($value['title_html'])){echo $value['title_html'];}
                        if(isset($value['desc_tip']) && $value['desc_tip']){
                            echo $tooltip_html;
                        }
                        echo '</h2>';
                    }

                    if ( ! empty( $value['desc'] ) && (!isset($value['desc_tip']) || !$value['desc_tip']) ) {
                        echo wpautop( wptexturize( wp_kses_post( $value['desc'] ) ) );
                    }

                    $attr = '';
                    if ( isset( $value['attr'] ) && count( $value['attr'] ) > 0 ) $attr = implode( ' ', $value['attr'] );

                    echo "<table $attr class='form-table'>" . "\n\n";
                    if ( ! empty( $value['id'] ) ) {
                        do_action( 'community_directory_settings_' . sanitize_title( $value['id'] ) );
                    }
                    break;

                // Section Ends
                case 'sectionend':
                    if ( ! empty( $value['id'] ) ) {
                        do_action( 'community_directory_settings_' . sanitize_title( $value['id'] ) . '_end' );
                    }
                    echo '</table>';
                    if ( ! empty( $value['id'] ) ) {
                        do_action( 'community_directory_settings_' . sanitize_title( $value['id'] ) . '_after' );
                    }
                    break;

                // Standard text inputs and subtypes like 'number'
                case 'text':
                case 'email':
                case 'number':
                case 'password' :

                    if ( isset( $value['value'] ) ) {
                        $option_value = $value['value'];
                    } else {
                        $option_value = self::get_option( $value['id'], $value['default'] );
                    }
                    ?><tr valign="top" class="<?php if(isset($value['advanced']) && $value['advanced']){echo "community-directory-advanced-setting";}?>">
                    <th scope="row" class="titledesc">
                        <label for="<?php echo esc_attr( $value['id'] ); ?>"><?php echo esc_html( $value['title'] ); ?></label>
                        <?php echo $tooltip_html; ?>
                    </th>
                    <td class="forminp forminp-<?php echo sanitize_title( $value['type'] ) ?>">
                        <input
                                name="<?php echo esc_attr( $value['id'] ); ?>"
                                id="<?php echo esc_attr( $value['id'] ); ?>"
                                type="<?php echo esc_attr( $value['type'] ); ?>"
                                style="<?php echo esc_attr( $value['css'] ); ?>"
                                value="<?php echo esc_attr( $option_value ); ?>"
                                class="regular-text <?php echo esc_attr( $value['class'] ); ?>"
                                placeholder="<?php echo esc_attr( $value['placeholder'] ); ?>"
                            <?php echo implode( ' ', $custom_attributes ); ?>
                            <?php if( !empty( $value['disabled'] ) && true == $value['disabled']){ echo 'disabled="disabled"'; } ?>
                            <?php if( !empty( $value['readonly'] ) && true == $value['readonly']){ echo 'readonly="readonly"'; } ?>
                            <?php if($value['type']=='number'){echo "lang='EN'";} // HTML5 number input can change number format depending on browser language, we don't want that ?>
                        /> <?php echo $description; ?>
                    </td>
                    </tr><?php
                    break;

                // Color picker.
                case 'color' :
                    if ( isset( $value['value'] ) ) {
                        $option_value = $value['value'];
                    } else {
                        $option_value = self::get_option( $value['id'], $value['default'] );
                    }

                    ?><tr valign="top" class="community-directory-row-color-picker <?php if(isset($value['advanced']) && $value['advanced']){echo "community-directory-advanced-setting";}?>">
                    <th scope="row" class="titledesc">
                        <label for="<?php echo esc_attr( $value['id'] ); ?>"><?php echo esc_html( $value['title'] ); ?></label>
                        <?php echo $tooltip_html; ?>
                    </th>
                    <td class="forminp forminp-<?php echo sanitize_title( $value['type'] ) ?>">
                        <input
                                name="<?php echo esc_attr( $value['id'] ); ?>"
                                id="<?php echo sanitize_key( $value['id'] ); ?>"
                                type="text"
                                dir="ltr"
                                value="<?php echo esc_attr( $option_value ); ?>"
                                class="community-directory-color-picker"
                                placeholder="<?php echo esc_attr( $value['placeholder'] ); ?>"
                                data-default-color="<?php echo esc_attr( $value['default'] ); ?>
                                    <?php echo esc_attr( implode( ' ', $custom_attributes ) ); ?> "/>&lrm; <?php echo $description; ?>
                    </td>
                    </tr><?php
                    break;

                // Color picker.
                case 'image' :
                    // add required scripts
                    add_thickbox();
                    wp_enqueue_script('media-upload');
                    wp_enqueue_media();


                    if ( isset( $value['value'] ) ) {
                        $option_value = $value['value'];
                    } else {
                        $option_value = self::get_option( $value['id'], $value['default'] );
                    }
                    $image_size = ! empty( $value['image_size'] ) ? $value['image_size'] : 'thumbnail';

                    if($option_value){
                        $remove_class = '';
                        if ( strpos( $option_value, 'dashicons-' ) === 0 ) {
                            $show_img = '<div class="dashicons-before ' . esc_attr( $option_value ) . '"></div>';
                        } else {
                            $show_img = wp_get_attachment_image($option_value, $image_size);
                        }
                    }else{
                        $remove_class = 'hidden';
                        $show_img = '<img src="'.admin_url( 'images/media-button-image.gif' ).'" />';
                    }

                    ?><tr valign="top" class="<?php if(isset($value['advanced']) && $value['advanced']){echo "community-directory-advanced-setting";}?>">
                    <th scope="row" class="titledesc">
                        <label for="<?php echo esc_attr( $value['id'] ); ?>"><?php echo esc_html( $value['title'] ); ?></label>
                        <?php echo $tooltip_html; ?>
                    </th>
                    <td class="forminp forminp-<?php echo sanitize_title( $value['type'] ) ?>">

                        <div class="community-directory-upload-img" data-field="<?php echo esc_attr( $value['id'] ); ?>">
                            <div class="community-directory-upload-display community-directory-img-size-<?php echo $image_size; ?> thumbnail"><div class="centered"><?php echo $show_img; ?></div></div>
                            <div class="community-directory-upload-fields">
                                <input type="hidden" id="<?php echo esc_attr( $value['id'] ); ?>" name="<?php echo esc_attr( $value['id'] ); ?>" value="<?php echo esc_attr( $option_value ); ?>" />
                                <button type="button" class="community_directory_upload_image_button button"><?php _e( 'Upload Image', 'community-directory' ); ?></button>
                                <button type="button" class="community_directory_remove_image_button button <?php echo $remove_class;?>"><?php _e( 'Remove Image', 'community-directory' ); ?></button>
                            </div>
                        </div>
                    </td>
                    </tr><?php
                    break;

                // Textarea
                case 'textarea':

                    if ( isset( $value['value'] ) ) {
                        $option_value = $value['value'];
                    } else {
                        $option_value = self::get_option( $value['id'], $value['default'] );
                    }

                    $rows = !empty( $value['size'] ) ? absint($value['size']) : 5;

                    ?><tr valign="top" class="<?php if(isset($value['advanced']) && $value['advanced']){echo "community-directory-advanced-setting";}?>">
                    <th scope="row" class="titledesc">
                        <label for="<?php echo esc_attr( $value['id'] ); ?>"><?php echo esc_html( $value['title'] ); ?></label>
                        <?php echo $tooltip_html; ?>
                    </th>
                    <td class="forminp forminp-<?php echo sanitize_title( $value['type'] ) ?>">
                        <?php echo $description; ?>

                        <textarea
                                name="<?php echo esc_attr( $value['id'] ); ?>"
                                id="<?php echo esc_attr( $value['id'] ); ?>"
                                style="<?php echo esc_attr( $value['css'] ); ?>"
                                class="large-text <?php echo esc_attr( $value['class'] ); ?>"
                                placeholder="<?php echo esc_attr( $value['placeholder'] ); ?>"
                                rows="<?php echo $rows; ?>"
                            <?php echo implode( ' ', $custom_attributes ); ?>
                        ><?php echo esc_textarea( stripslashes($option_value) );  ?></textarea>
                        <?php if ( ! empty( $value['custom_desc'] ) ) { ?>
                            <span class="community-directory-custom-desc"><?php echo $value['custom_desc']; ?></span>
                        <?php } ?>
                    </td>
                    </tr><?php
                    break;
                // Editor
                case 'editor':
                    global $wp_version;
                    if ( isset( $value['value'] ) ) {
                        $option_value = $value['value'];
                    } else {
                        $option_value = self::get_option( $value['id'] );
                    }
                    if ( empty( $option_value ) && empty( $value['allow_blank'] ) ) {
                        $option_value = isset( $value['default'] ) ? $value['default'] : '';
                    }

                    $rows = !empty( $value['size'] ) ? absint($value['size']) : 20;
                    ?><tr valign="top" class="<?php echo (!empty($value['advanced']) ? 'community-directory-advanced-setting' : ''); ?>">
                    <th scope="row" class="titledesc">
                        <label for="<?php echo esc_attr( $value['id'] ); ?>"><?php echo esc_html( $value['title'] ); ?></label>
                        <?php echo $tooltip_html; ?>
                    </th>
                    <td class="forminp forminp-<?php echo sanitize_title( $value['type'] ) ?>">
                        <?php echo $description; ?>
                        <?php
                        if ( $wp_version >= 3.3 && function_exists( 'wp_editor' ) ) {
                            wp_editor( stripslashes( $option_value ), $value['id'], array( 'textarea_name' => esc_attr( $value['id'] ), 'textarea_rows' => $rows, 'media_buttons' => false, 'editor_class' => 'community-directory-wp-editor', 'editor_height' => 16 * $rows ) );
                        } else { ?>
                            <textarea
                                    name="<?php echo esc_attr( $value['id'] ); ?>"
                                    id="<?php echo esc_attr( $value['id'] ); ?>"
                                    style="<?php echo esc_attr( $value['css'] ); ?>"
                                    class="large-text <?php echo esc_attr( $value['class'] ); ?>"
                                    placeholder="<?php echo esc_attr( $value['placeholder'] ); ?>"
                                    rows="<?php echo $rows; ?>"
                                <?php echo implode( ' ', $custom_attributes ); ?>
                            ><?php echo esc_textarea( stripslashes( $option_value ) );  ?></textarea>
                        <?php } ?>
                        <?php if ( ! empty( $value['custom_desc'] ) ) { ?>
                            <span class="community-directory-custom-desc"><?php echo $value['custom_desc']; ?></span>
                        <?php } ?>
                    </td>
                    </tr><?php
                    break;

                // Select boxes
                case 'select' :
                case 'multiselect' :

                    if ( isset( $value['value'] ) ) {
                        $option_value = $value['value'];
                    } else {
                        $option_value = self::get_option( $value['id'], $value['default'] );
                    }

                    if( !empty($value['type']) && 'multiselect' == $value['type'] && !is_array($option_value)) {
                        $option_value = str_replace(' ', '', $option_value);
                        $option_value = explode(',', $option_value);
                    }

                    ?><tr valign="top" class="<?php if(isset($value['advanced']) && $value['advanced']){echo "community-directory-advanced-setting";}?>">
                    <th scope="row" class="titledesc">
                        <label for="<?php echo esc_attr( $value['id'] ); ?>"><?php echo esc_html( $value['title'] ); ?></label>
                        <?php echo $tooltip_html; ?>
                    </th>
                    <td class="forminp forminp-<?php echo sanitize_title( $value['type'] ) ?>">
                        <select
                                name="<?php echo esc_attr( $value['id'] ); ?><?php echo ( 'multiselect' === $value['type'] ) ? '[]' : ''; ?>"
                                id="<?php echo esc_attr( $value['id'] ); ?>"
                                style="<?php echo esc_attr( $value['css'] ); ?>"
                                class="regular-text aui-select2 <?php echo esc_attr( $value['class'] ); ?>"
                            <?php echo implode( ' ', $custom_attributes ); ?>
                            <?php echo ( 'multiselect' == $value['type'] ) ? 'multiple="multiple"' : ''; ?>
                            <?php echo ! empty( $value['sortable'] ) ? ' data-sortable="true"' : ''; ?>
                            <?php echo ! empty( $value['placeholder'] ) ? ' data-placeholder="' . esc_attr( $value['placeholder'] ) . '"' : ''; ?>
                        >
                            <?php
                            foreach ( $value['options'] as $key => $val ) {
                                if(stripos(strrev($key), strrev('optgroup-open')) === 0){
                                    echo '<optgroup label="'.esc_attr( $val ).'">';
                                }elseif(stripos(strrev($key), strrev('optgroup-close')) === 0){
                                    echo '</optgroup>';
                                }else{
                                    ?>
                                    <option value="<?php echo esc_attr( $key ); ?>" <?php

                                    if ( is_array( $option_value ) ) {
                                        selected( in_array( $key, $option_value ), true );
                                    } else {
                                        selected( $option_value, $key );
                                    }

                                    ?>><?php echo $val ?></option>
                                    <?php
                                }
                            }
                            ?>
                        </select> <?php echo $description; ?>
                    </td>
                    </tr><?php
                    break;

                // Radio inputs
                case 'radio' :

                    if ( isset( $value['value'] ) ) {
                        $option_value = $value['value'];
                    } else {
                        $option_value = self::get_option( $value['id'], $value['default'] );
                    }

                    ?><tr valign="top" class="<?php echo $wrap_class; ?><?php if(isset($value['advanced']) && $value['advanced']){echo " community-directory-advanced-setting";}?>">
                    <th scope="row" class="titledesc">
                        <label for="<?php echo esc_attr( $value['id'] ); ?>"><?php echo esc_html( $value['title'] ); ?></label>
                        <?php echo $tooltip_html; ?>
                    </th>
                    <td class="forminp forminp-<?php echo sanitize_title( $value['type'] ) ?>">
                        <fieldset>
                            <?php echo $description; ?>
                            <ul>
                                <?php
                                foreach ( $value['options'] as $key => $val ) {
                                    ?>
                                    <li>
                                        <label><input
                                                    name="<?php echo esc_attr( $value['id'] ); ?>"
                                                    value="<?php echo $key; ?>"
                                                    type="radio"
                                                    style="<?php echo esc_attr( $value['css'] ); ?>"
                                                    class="<?php echo esc_attr( $value['class'] ); ?>"
                                                <?php echo implode( ' ', $custom_attributes ); ?>
                                                <?php checked( $key, $option_value ); ?>
                                            /> <?php echo $val ?></label>
                                    </li>
                                    <?php
                                }
                                ?>
                            </ul>
                        </fieldset>
                    </td>
                    </tr><?php
                    break;

                // Checkbox input
                case 'checkbox' :

                    if ( isset( $value['value'] ) ) {
                        $option_value = $value['value'];
                    } else {
                        $option_value = self::get_option( $value['id'], $value['default'] );
                    }

                    $visibility_class = array();

                    if ( ! isset( $value['hide_if_checked'] ) ) {
                        $value['hide_if_checked'] = false;
                    }
                    if ( ! isset( $value['show_if_checked'] ) ) {
                        $value['show_if_checked'] = false;
                    }
                    if ( 'yes' == $value['hide_if_checked'] || 'yes' == $value['show_if_checked'] ) {
                        $visibility_class[] = 'hidden_option';
                    }
                    if ( 'option' == $value['hide_if_checked'] ) {
                        $visibility_class[] = 'hide_options_if_checked';
                    }
                    if ( 'option' == $value['show_if_checked'] ) {
                        $visibility_class[] = 'show_options_if_checked';
                    }

                    if ( ! isset( $value['checkboxgroup'] ) || 'start' == $value['checkboxgroup'] ) {
                        ?>
                            <tr valign="top" class="<?php echo esc_attr( implode( ' ', $visibility_class ) ); ?> <?php if(isset($value['advanced']) && $value['advanced']){echo "community-directory-advanced-setting";}?>" >
                                <th scope="row" class="titledesc"><?php echo esc_html( $value['title'] ) ?></th>
                                <td class="forminp forminp-checkbox">
                                    <fieldset>
                        <?php
                    } else {
                        ?>
                            <fieldset class="<?php echo esc_attr( implode( ' ', $visibility_class ) ); ?>">
                        <?php
                    }

                    if ( ! empty( $value['title'] ) ) {
                        ?>
                            <legend class="screen-reader-text"><span><?php echo esc_html( $value['title'] ) ?></span></legend>

                        <?php
                    }

                    ?>
                        <label for="<?php echo $value['id'] ?>">
                            <input
                                name="<?php echo esc_attr( $value['id'] ); ?>"
                                id="<?php echo esc_attr( $value['id'] ); ?>"
                                type="checkbox"
                                class="<?php echo esc_attr( isset( $value['class'] ) ? $value['class'] : '' ); ?>"
                                value="1"
                                <?php checked( $option_value, '1' ); ?>
                                <?php checked( $option_value, 'yes' ); ?>
                                <?php echo implode( ' ', $custom_attributes ); ?>
                            /> <?php echo $description ?>
                        </label> <?php echo $tooltip_html; ?>
                    <?php

                    if ( ! isset( $value['checkboxgroup'] ) || 'end' == $value['checkboxgroup'] ) {
                                    ?>
                                    </fieldset>
                                </td>
                            </tr>
                        <?php
                    } else {
                        ?>
                            </fieldset>
                        <?php
                    }
                    break;

                // Checkbox input
                case 'multicheckbox' :

                    if ( isset( $value['value'] ) ) {
                        $option_value = $value['value'];
                    } else {
                        $option_value = self::get_option( $value['id'], $value['default'] );
                    }

                    ?>
                    <tr valign="top" class="<?php if(isset($value['advanced']) && $value['advanced']){echo "community-directory-advanced-setting";}?>" >
                        <th scope="row" class="titledesc">
                            <label><?php echo esc_html( $value['title'] ); ?></label>
                            <?php echo $tooltip_html; ?>
                        </th>
                        <td class="forminp forminp-checkbox">
                            <div class="community-directory-mcheck-rows community-directory-mcheck-<?php echo sanitize_key( $value['id'] ); ?>">
                                <?php foreach( $value['options'] as $key => $title ) {
                                    if ( ! empty( $option_value ) && is_array( $option_value ) && in_array( $key, $option_value ) ) {
                                        $checked = true;
                                    } else {
                                        $checked = false;
                                    }
                                    ?>
                                    <div class="community-directory-mcheck-row">
                                        <input
                                                name="<?php echo esc_attr( $value['id'] ); ?>[<?php echo $key; ?>]"
                                                id="<?php echo esc_attr( $value['id'] . '-' . sanitize_key( $key ) ); ?>"
                                                type="checkbox"
                                                class="<?php echo esc_attr( isset( $value['class'] ) ? $value['class'] : '' ); ?>"
                                                value="<?php echo $key; ?>"
                                            <?php checked( $checked, true ); ?>
                                            <?php echo implode( ' ', $custom_attributes ); ?>
                                        /> <label for="<?php echo $value['id'] . '-' . sanitize_key( $key ) ?>"><?php echo $title ?></label></div>
                                <?php } ?>
                                <?php echo $description; ?>
                            </div>
                        </td>
                    </tr>
                    <?php
                    break;

                // Single page selects
                case 'single_select_page' :
                    if ( isset( $value['value'] ) ) {
                        $option_value = $value['value'];
                    } else {
                        $option_value = self::get_option( $value['id'] );
                    }

                    $args = array(
                        'name'             => $value['id'],
                        'id'               => $value['id'],
                        'sort_column'      => 'menu_order',
                        'sort_order'       => 'ASC',
                        'show_option_none' => ' ',
                        'class'            => ' regular-text aui-select2 '.$value['class'],
                        'echo'             => false,
                        'selected'         => (int)$option_value > 0 ? (int)$option_value : -1,
                    );

                    if ( isset( $value['args'] ) ) {
                        $args = wp_parse_args( $value['args'], $args );
                    }

                    ?><tr valign="top" class="single_select_page <?php if(isset($value['advanced']) && $value['advanced']){echo "community-directory-advanced-setting";}?>">
                    <th scope="row" class="titledesc"><?php echo esc_html( $value['title'] ) ?> <?php echo $tooltip_html; ?></th>
                    <td class="forminp">
                        <?php echo str_replace( ' id=', " data-placeholder='" . esc_attr__( 'Select a page&hellip;', 'community-directory' ) . "' style='" . $value['css'] . "' class='" . $value['class'] . "' id=", wp_dropdown_pages( $args ) ); ?> <?php echo $description; ?>

                        <?php if($args['selected'] > 0){ ?>
                            <a href="<?php echo get_edit_post_link( $args['selected'] ); ?>" class="button community-directory-page-setting-edit"><?php _e('Edit Page','community-directory');?></a>

                            <?php if(empty($value['is_template_page'])){ ?>
                                <a href="<?php echo get_permalink($args['selected']);?>" class="button community-directory-page-setting-view"><?php _e('View Page','community-directory');?></a>
                            <?php }
                        }

                        ?>

                    </td>
                    </tr><?php
                    break;

                // Default: run an action
                default:
                    do_action( 'community_directory_admin_field_' . $value['type'], $value );
                    break;
            }
        }
    }

    /**
     * Helper function to get the formatted description and tip HTML for a
     * given form field. Plugins can call this when implementing their own custom
     * settings types.
     *
     * @param  array $value The form field value array
     * @return array The description and tip as a 2 element array
     */
    public static function get_field_description( $value ) {
        $description  = '';
        $tooltip_html = '';

        if ( true === $value['desc_tip'] ) {
            $tooltip_html = $value['desc'];
        } elseif ( ! empty( $value['desc_tip'] ) ) {
            $description  = $value['desc'];
            $tooltip_html = $value['desc_tip'];
        } elseif ( ! empty( $value['desc'] ) ) {
            $description  = $value['desc'];
        }

        if(!empty($value['docs'])){

            $docs_link = "<a class='community-directory-docs-link' href='".esc_url($value['docs'])."' target='_blank'>".__('Documentation','community-directory')." <i class=\"fas fa-external-link-alt\" aria-hidden=\"true\" aria-hidden=\"true\"></i></a>";

            if(in_array( $value['type'], array( 'checkbox' ) )){
                $description .= $docs_link;
            }else{
                $tooltip_html .= $docs_link;
            }
        }

        if ( $description && in_array( $value['type'], array( 'textarea', 'radio' ) ) ) {
            $description = '<p style="margin-top:0">' . wp_kses_post( $description ) . '</p>';
        } elseif ( $description && in_array( $value['type'], array( 'checkbox' ) ) ) {
            $description = wp_kses_post( $description );
        } elseif ( $description ) {
            $description = '<span class="description community-directory-custom-desc">' . wp_kses_post( $description ) . '</span>';
        }



        if ( $tooltip_html && in_array( $value['type'], array( 'checkbox' ) ) ) {
            $tooltip_html = '<p class="description">' . $tooltip_html . '</p>';
        } elseif ( $tooltip_html ) {
            $tooltip_html = community_directory_help_tip( $tooltip_html );
        }

        return array(
            'description'  => $description,
            'tooltip_html' => $tooltip_html,
        );
    }

    /**
     * Save admin fields.
     *
     * Loops though the community-directory options array and outputs each field.
     *
     * @param array $options Options array to output
     * @param array $data Optional. Data to use for saving. Defaults to $_POST.
     * @return bool
     */
    public static function save_fields( $options, $data = null ) {
        if ( is_null( $data ) ) {
            $data = $_POST;
        }
        if ( empty( $data ) ) {
            return false;
        }

        // Options to update will be stored here and saved later.
        $update_options = array();

        // Loop options and get values to save.
        foreach ( $options as $option ) {
            if ( ! isset( $option['id'] ) || ! isset( $option['type'] ) ) {
                continue;
            }

            // Get posted value.
            if ( strstr( $option['id'], '[' ) ) {
                parse_str( $option['id'], $option_name_array );
                $option_name  = current( array_keys( $option_name_array ) );
                $setting_name = key( $option_name_array[ $option_name ] );
                $raw_value    = isset( $data[ $option_name ][ $setting_name ] ) ? wp_unslash( $data[ $option_name ][ $setting_name ] ) : null;
            } else {
                $option_name  = $option['id'];
                $setting_name = '';
                $raw_value    = isset( $data[ $option['id'] ] ) ? wp_unslash( $data[ $option['id'] ] ) : null;
            }

            // Format the value based on option type.
            switch ( $option['type'] ) {
                case 'checkbox' :
                    $value = '1' === $raw_value ? 1 : 0;
                    break;
                case 'textarea' :
                case 'editor' :
                    $value = wp_kses_post( trim( $raw_value ) );
                    break;
                case 'multiselect' :
                case 'multi_select_countries' :
                    $value = array_filter( array_map( 'community_directory_clean', (array) $raw_value ) );
                    break;
                case 'multicheckbox' :
                    $value = array_map( 'community_directory_clean', (array) $raw_value );
                    break;
                case 'image_width' :
                    $value = array();
                    if ( isset( $raw_value['width'] ) ) {
                        $value['width']  = community_directory_clean( $raw_value['width'] );
                        $value['height'] = community_directory_clean( $raw_value['height'] );
                        $value['crop']   = isset( $raw_value['crop'] ) ? 1 : 0;
                    } else {
                        $value['width']  = $option['default']['width'];
                        $value['height'] = $option['default']['height'];
                        $value['crop']   = $option['default']['crop'];
                    }
                    break;
                case 'select':
                    $allowed_values = empty( $option['options'] ) ? array() : array_keys( $option['options'] );
                    if ( empty( $option['default'] ) && empty( $allowed_values ) ) {
                        $value = null;
                        break;
                    }
                    $default = ( empty( $option['default'] ) ? $allowed_values[0] : $option['default'] );
                    $value   = in_array( $raw_value, $allowed_values ) ? $raw_value : $default;
                    break;
                default :
                    $value = community_directory_clean( $raw_value );
                    break;
            }

            /**
             * Sanitize the value of an option.
             */
            $value = apply_filters( 'community_directory_admin_settings_sanitize_option', $value, $option, $raw_value );

            /**
             * Sanitize the value of an option by option name.
             */
            $value = apply_filters( "community_directory_admin_settings_sanitize_option_$option_name", $value, $option, $raw_value );

            if ( is_null( $value ) ) {
                continue;
            }

            // Check if option is an array and handle that differently to single values.
            if ( $option_name && $setting_name ) {
                if ( ! isset( $update_options[ $option_name ] ) ) {
                    $update_options[ $option_name ] = self::get_option( $option_name, array() );
                }
                if ( ! is_array( $update_options[ $option_name ] ) ) {
                    $update_options[ $option_name ] = array();
                }
                $update_options[ $option_name ][ $setting_name ] = $value;
            } else {
                $update_options[ $option_name ] = $value;
            }

        }

        // Save all options in our array.
        foreach ( $update_options as $name => $value ) {
            community_directory_update_option($name, $value);
        }

        return true;
    }

    /**
     * Get a setting from the settings API.
     *
     * @param mixed $option_name
     * @param mixed $default
     * @return string
     */
    public static function get_option( $option_name, $default = '' ) {
        return community_directory_get_option( $option_name, $default );
    }
}