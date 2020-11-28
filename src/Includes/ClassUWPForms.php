<?php

namespace Maruf89\CommunityDirectory\Includes;

use Maruf89\CommunityDirectory\Admin\Settings\ClassUWPFormBuilder;

/**
 * The UsersWP custom field form functionality of the plugin.
 *
 * @since      0.0.1
 *
 * @package    community-directory
 * @subpackage community-directory/includes
 */
class ClassUWPForms {

    public static function builder_extra_fields_locationselect( $x, $field, $value, $form_type ) {
        $locations = community_directory_get_locations( true, false, false );
        
        $design_style = uwp_get_option("design_style","bootstrap");
        $bs_form_group = $design_style ? "form-group" : "";
        $bs_sr_only = $design_style ? "sr-only" : "";
        $bs_form_control = $design_style ? "form-control" : "";

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
                    <option value="<?= $row->display_name ?>"><?= $row->display_name ?></option>
                <?php endforeach; ?>
                <option value="<?= ClassUWPFormBuilder::$location_not_listed_name ?>">(<?= __( 'My location isn\'t listed', 'community-directory' ) ?>)</option>
            </select>
            <small class="uwp_message_note form-text text-muted"><?= __( 'Select the village, town, or city you reside in.', 'community-directory' ) ?></small>
            <?php if ($field->is_required) : ?>
                <span class="uwp_message_error invalid-feedback"><?php __($field->required_msg, 'community-directory'); ?></span>
            <?php endif; ?>
        </div>

        <div id="unlistedSelectLoc" class="hidden uwp_form_row clearfix uwp_clear">
            <div class="<?= esc_attr($bs_form_group);?>">
                <div class="location-not-listed-row custom-control custom-checkbox">
                    <input type="hidden" name="location_not_listed" id="locationNotListedBox_hidden" value="0">
                    <input type="checkbox"
                        id="locationNotListedBox"
                        name="<?= ClassUWPFormBuilder::$location_not_listed_name ?>"
                        value="0"
                        onchange="if(this.checked){jQuery('#locationNotListedBox_hidden').val('1');} else{ jQuery('#locationNotListedBox_hidden').val('0');}"
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
                    <input type="text"
                            id="newLocationInput"
                            name="<?= ClassUWPFormBuilder::$new_location_name ?>"
                            placeholder="<?= __( 'Your location', 'community-directory' ) ?>"
						    <?php if ($field->for_admin_use == 1) { echo 'readonly="readonly"'; } ?>
                            class="<?= $field->css_class; ?> <?= esc_attr($bs_form_control);?>" />
                </div>
                <small class="uwp_message_note form-text text-muted"><?= __( 'Enter the name of village, town, or city you reside in.', 'community-directory' ) ?></small>
                <?php if ($field->is_required) : ?>
                    <span class="uwp_message_error invalid-feedback"><?php __($field->required_msg, 'community-directory'); ?></span>
                <?php endif; ?>
            </div>
        </div>
        <script type="text/javascript">
            (function ($) {
                var $listedSection = $('#<?= $field->htmlvar_name;?>_row');
                var $myLoc = $('#<?= $field->htmlvar_name; ?>_select');
                var $unlistedSection = $('#unlistedSelectLoc');
                var $locNotListedCheckbox = $('#locationNotListedBox');
                var $newMyLoc = $('#newLocationInput');
                var hideListedSection = false;

                function triggerHide() {
                    $listedSection.toggleClass('hidden', hideListedSection);
                    $unlistedSection.toggleClass('hidden', !hideListedSection);
                }

                // Show option to add new location
                $myLoc.on('change', function (e) {
                    if (e.target.value === '<?= ClassUWPFormBuilder::$location_not_listed_name ?>') {
                        hideListedSection = true;
                        triggerHide();
                        $locNotListedCheckbox[0].checked = true;
                        $newMyLoc.attr('required', 'required');
                    }
                });
                
                // Hide the new location when checkbox unchecked
                $locNotListedCheckbox.on('change', function (e) {
                    hideListedSection = this.checked;
                    triggerHide()
                    $myLoc[0].value = '';
                    $newMyLoc.removeAttr('required');
                });

                $listedSection.closest('form').on('submit', function (e) {
                    // In the last second, updates the community directory select with the new location's value
                    if (hideListedSection) {
                        $myLoc.children()[0].value = $newMyLoc[0].value;
                        $myLoc[0].value = $newMyLoc[0].value;
                    }
                });
            })(jQuery);
        </script>

        <?php

        return $x = ob_get_clean();
    }
    
}