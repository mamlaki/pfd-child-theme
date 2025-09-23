<?php
/**
 * Block registration and styles
 *
 * @package PFD_Child_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register custom block styles and pattern categories
 *
 * @return void
 */
function pfd_child_register_block_assets() {
    wp_enqueue_block_style(
        'core/navigation',
        [
            'handle' => 'pfd-nav-style',
            'src'    => get_stylesheet_directory_uri() . '/assets/blocks/navigation.css',
            'path'   => get_stylesheet_directory() . '/assets/blocks/navigation.css',
            'ver'    => wp_get_theme()->get('Version'),
        ]
    );

    register_block_style(
        'core/navigation',
        [
            'name'         => 'pfd-nav',
            'label'        => __('PFD Nav', 'pfd-child-theme'),
            'style_handle' => 'pfd-nav-style',
        ]
    );

    register_block_pattern_category(
        'pfd',
        [
            'label' => __('PFD Patterns', 'pfd-child-theme'),
        ]
    );
}
add_action('init', 'pfd_child_register_block_assets');
