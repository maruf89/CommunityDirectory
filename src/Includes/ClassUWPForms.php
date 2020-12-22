<?php

namespace Maruf89\CommunityDirectory\Includes;

use Maruf89\CommunityDirectory\Admin\Settings\ClassUWPFormBuilder;

/**
 * The UsersWP custom field form functionality of the plugin.
 *
 * @since      2020.11
 *
 * @package    community-directory
 * @subpackage community-directory/includes
 */
class ClassUWPForms {

    public static function builder_extra_fields_locationselect( $x, $field, $value, $form_type ) {
        $locations = apply_filters( 'community_directory_get_locations', [], null, null );
        
        $design_style = uwp_get_option("design_style","bootstrap");
        $bs_form_group = $design_style ? "form-group" : "";
        $bs_sr_only = $design_style ? "sr-only" : "";
        $bs_form_control = $design_style ? "form-control" : "";

        $loc_not_listed_selected = isset( $_POST[ ClassUWPFormBuilder::$location_not_listed_name ] ) ?
            !!$_POST[ ClassUWPFormBuilder::$location_not_listed_name ] : false;

        ob_start();
        ?>

        <div id="<?= $field->htmlvar_name;?>_row"
             class="<?php if ($field->is_required) echo 'required_field';?> uwp_form_row clearfix uwp_clear <?= esc_attr($bs_form_group);?>">
            <?php

            $label = $site_title = uwp_get_form_label($field);
            if (!is_admin()) { ?>
                <label class="<?= esc_attr($bs_sr_only) ?>">
                    <?= (trim($site_title)) ? $site_title : '&nbsp;'; ?>
                    <?php if ($field->is_required) echo '<span>*</span>';?>
                </label>
            <?php } ?>

            <div id="<?= $field->htmlvar_name; ?>_parent">
                <select name="<?= ClassUWPFormBuilder::$community_directory_location_name; ?>"
                        id="<?= $field->htmlvar_name; ?>_select"
                        class="<?= $field->css_class; ?> <?= esc_attr($bs_form_control);?>"
                        placeholder="<?= uwp_get_field_placeholder($field); ?>"
                        title="<?= $label; ?>"
                    <?php if ($field->for_admin_use == 1) { echo 'readonly="readonly"'; } ?>
                    <?php if ($field->is_required == 1) { echo 'required="required"'; } ?>
                        type="<?= $field->field_type; ?>"
                        value="<?= esc_html($value); ?>">

                    <option value=""></option>
                    <?php foreach ( $locations as $row ): ?>
                        <?php
                            $selected = !$loc_not_listed_selected &&
                                $_POST[ ClassUWPFormBuilder::$community_directory_location_name ] == $row->display_name;
                        ?>
                        <option value="<?= $row->display_name ?>"
                            <?= $selected ? 'selected' : '' ?>
                            ><?= $row->display_name ?></option>
                    <?php endforeach; ?>
                    <option value="<?= ClassUWPFormBuilder::$location_not_listed_name ?>">(<?= __( 'My location isn\'t listed', 'community-directory' ) ?>)</option>
                </select>
            </div>
            <small class="uwp_message_note form-text text-muted"><?= __( 'Select the village, town, or city you reside in.', 'community-directory' ) ?></small>
            <?php if ($field->is_required) : ?>
                <span class="uwp_message_error invalid-feedback"><?php __($field->required_msg, 'community-directory'); ?></span>
            <?php endif; ?>
        </div>

        <div id="unlistedSelectLoc" class="hidden uwp_form_row clearfix uwp_clear">
            <div class="<?= esc_attr($bs_form_group);?>">
                <div class="location-not-listed-row custom-control custom-checkbox">
                    <input type="checkbox"
                           id="locationNotListedBox"
                           name="<?= ClassUWPFormBuilder::$location_not_listed_name ?>"
                           value="<?= $loc_not_listed_selected ? 1 : 0 ?>"
                           <?php if ( $loc_not_listed_selected ) echo 'checked' ?>
                           class="<?= $field->css_class; ?> custom-control-input" />
                    <label for="locationNotListedBox" class="custom-control-label"><?= __( 'My location isn\'t listed', 'community-directory' ) ?></label>
                </div>
            </div>
            <div class="<?= esc_attr($bs_form_group);?>">
                <div class="new-location-row <?php if ($field->is_required) echo 'required_field';?>">
                    <?php if (!is_admin()) : ?>
                        <label for="newLocationInput" class="<?php echo esc_attr($bs_sr_only);?>">
                            <?= __( 'Your location', 'community-directory' ) ?>
							<?php if ($field->is_required) echo '<span>*</span>';?>
                        </label>
					<?php endif; ?>
                    <div id="newLocationInputParent">
                        <input type="text"
                               id="newLocationInput"
                               name="<?= ClassUWPFormBuilder::$community_directory_location_name ?>"
                               placeholder="<?= __( 'Your location', 'community-directory' ) ?>"
                               value="<?= $loc_not_listed_selected ? $_POST[ ClassUWPFormBuilder::$community_directory_location_name ] : '' ?>"
                               <?php if ($field->for_admin_use == 1) { echo 'readonly="readonly"'; } ?>
                               <?php if ($field->is_required == 1) { echo 'required="required"'; } ?>
                               class="<?= $field->css_class; ?> <?= esc_attr($bs_form_control);?>" />
                    </div>
                </div>
                <small class="uwp_message_note form-text text-muted"><?= __( 'Enter the name of village, town, or city you reside in.', 'community-directory' ) ?></small>
                <?php if ($field->is_required) : ?>
                    <span class="uwp_message_error invalid-feedback"><?php __($field->required_msg, 'community-directory'); ?></span>
                <?php endif; ?>
            </div>
        </div>
        <script type="text/javascript" nonce="<?= wp_create_nonce() ?>">
            (function ($) {
                var $listedSection = $('#<?= $field->htmlvar_name;?>_row');
                var $myLocParent = $('#<?= $field->htmlvar_name; ?>_parent');
                var $myLoc = $('#<?= $field->htmlvar_name; ?>_select');
                var $unlistedSection = $('#unlistedSelectLoc');
                var $locNotListedCheckbox = $('#locationNotListedBox');
                var $newMyLocParent = $('#newLocationInputParent');
                var $newMyLoc = $('#newLocationInput');
                var hideListedSection = !!<?= $loc_not_listed_selected ? 1 : 0 ?>;

                $newMyLoc.detach();

                function triggerHide() {
                    if (hideListedSection) {
                        $myLoc.detach();
                        $newMyLoc.appendTo($newMyLocParent);
                    } else {
                        $newMyLoc.detach();
                        $myLoc.appendTo($myLocParent);
                    }
                    $listedSection.toggleClass('hidden', hideListedSection);
                    $unlistedSection.toggleClass('hidden', !hideListedSection);
                }

                // Show option to add new location
                $myLoc.on('change', function (e) {
                    if (e.target.value === '<?= ClassUWPFormBuilder::$location_not_listed_name ?>') {
                        hideListedSection = true;
                        triggerHide();
                        $locNotListedCheckbox[0].checked = true;
                        $locNotListedCheckbox[0].value = 1;
                    } else
                        $locNotListedCheckbox[0].value = [];
                });
                
                // Hide the new location when checkbox unchecked
                $locNotListedCheckbox.on('change', function (e) {
                    hideListedSection = this.checked;
                    triggerHide()
                    $myLoc[0].value = '';
                });

                $listedSection.closest('form').on('submit', function (e) {
                    // In the last second, updates the community directory select with the new location's value
                    if (hideListedSection) {
                        $myLoc.children()[0].value = $newMyLoc[0].value;
                        $myLoc[0].value = $newMyLoc[0].value;
                    }
                });

                if ( hideListedSection ) triggerHide();
            })(jQuery);
        </script>

        <?php

        return $x = ob_get_clean();
    }
    
}