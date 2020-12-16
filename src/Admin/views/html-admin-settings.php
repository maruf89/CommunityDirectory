<?php
/**
 * Admin View: Settings
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

?>
<div class="wrap community-directory">
    <form method="<?php echo esc_attr( apply_filters( 'community_directory_settings_form_method_tab_' . $current_tab, 'post' ) ); ?>" id="mainform" action="" enctype="multipart/form-data">
        <nav class="nav-tab-wrapper cd-nav-tab-wrapper">
            <?php
            foreach ( $tabs as $name => $label ) {
                echo '<a href="' . admin_url( 'admin.php?page=community-directory&tab=' . $name ) . '" class="nav-tab ' . ( $current_tab == $name ? 'nav-tab-active' : '' ) . '">' . $label . '</a>';
                }
                do_action( 'community_directory_settings_tabs' );
            ?>
        </nav>
        <h1 class="screen-reader-text"><?php echo esc_html( $tabs[ $current_tab ] ); ?></h1>
        <?php
            do_action( 'community_directory_sections_' . $current_tab );

            self::show_messages();

            do_action( 'community_directory_settings_' . $current_tab );
            do_action( 'community_directory_settings_tabs_' . $current_tab );
        ?>
        <p class="submit">
            <?php if ( empty( $GLOBALS['community_directory_hide_save_button'] ) ) : ?>
                <input name="save" class="button-primary cd-save-button" type="submit" value="<?php esc_attr_e( 'Save changes', 'community-directory' ); ?>" />
            <?php endif; ?>
            <?php wp_nonce_field( 'community-directory-settings' ); ?>
        </p>
    </form>
</div>
