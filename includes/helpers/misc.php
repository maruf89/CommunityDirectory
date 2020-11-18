<?php

/**
 * Display a help tip for settings.
 *
 * @param  string $tip Help tip text
 * @param  bool $allow_html Allow sanitized HTML if true or escape
 *
 * @return string
 */
function community_directory_help_tip( $tip, $allow_html = false ) {
    if ( $allow_html ) {
        $tip = uwp_sanitize_tooltip( $tip );
    } else {
        $tip = esc_attr( $tip );
    }

    return '<span class="uwp-help-tip dashicons dashicons-editor-help" title="' . $tip . '"></span>';
}

/**
 * Clean variables using sanitize_text_field. Arrays are cleaned recursively.
 * Non-scalar values are ignored.
 *
 * @param string|array $var
 *
 * @return string|array
 */
function community_directory_clean( $var ) {

    if ( is_array( $var ) ) {
        return array_map( 'community_directory_clean', $var );
    } else {
        return is_scalar( $var ) ? sanitize_text_field( $var ) : $var;
    }

}