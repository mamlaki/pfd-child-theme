<?php
/**
 * Block editor only assets
 *
 * @package PFD_Child_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Enqueue custom controls for the block editor
 *
 * @return void
 */
function pfd_child_enqueue_editor_assets() {
    $scripts = [
        '/assets/js/pfd-card-hover-control.js',
        '/assets/js/pfd-card-controls.js',
    ];

    foreach ($scripts as $relative_path) {
        $path = get_stylesheet_directory() . $relative_path;
        $uri  = get_stylesheet_directory_uri() . $relative_path;

        if (!file_exists($path)) {
            continue;
        }

        wp_enqueue_script(
            basename($relative_path, '.js'),
            $uri,
            [
                'wp-blocks',
                'wp-dom-ready',
                'wp-edit-post',
                'wp-element',
                'wp-components',
                'wp-hooks',
                'wp-i18n',
                'wp-compose',
                'wp-data',
                'wp-block-editor',
            ],
            filemtime($path),
            true
        );
    }
}
add_action('enqueue_block_editor_assets', 'pfd_child_enqueue_editor_assets');
