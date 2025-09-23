<?php
/**
 * Theme setup tasks.
 *
 * @package PFD_Child_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register theme supports and editor styles.
 *
 * @return void
 */
function pfd_child_setup() {
    add_theme_support('editor-styles');
    add_editor_style([
        'style.css',
        'assets/blocks/navigation.css',
    ]);
}
add_action('after_setup_theme', 'pfd_child_setup');
