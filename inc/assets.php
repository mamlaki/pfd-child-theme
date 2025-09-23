<?php
/**
 * Front-end asset loading
 *
 * @package PFD_Child_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Enqueue styles and scripts for the front end
 *
 * @return void
 */
function pfd_child_enqueue_assets() {
    // Parent theme stylesheet
    wp_enqueue_style(
        'twentytwentyfive-style',
        get_template_directory_uri() . '/style.css',
        [],
        wp_get_theme('twentytwentyfive')->get('Version')
    );

    // Child theme stylesheet
    wp_enqueue_style(
        'pfd-child-style',
        get_stylesheet_uri(),
        ['wp-block-library', 'twentytwentyfive-style', 'global-styles'],
        wp_get_theme()->get('Version')
    );

    // Main script bundle
    wp_enqueue_script(
        'pfd-child',
        get_stylesheet_directory_uri() . '/assets/js/pfd.js',
        [],
        wp_get_theme()->get('Version'),
        true
    );

    // Table of contents interactions
    wp_enqueue_script(
        'pfd-toc',
        get_stylesheet_directory_uri() . '/assets/js/pfd-toc.js',
        [],
        wp_get_theme()->get('Version'),
        true
    );

    // Navigation interactions
    wp_enqueue_script(
        'pfd-nav',
        get_stylesheet_directory_uri() . '/assets/js/pfd-nav.js',
        [],
        '1.0.0',
        true
    );

    // Carousel behaviour
    wp_enqueue_script(
        'pfd-carousel',
        get_stylesheet_directory_uri() . '/assets/js/pfd-carousel.js',
        [],
        wp_get_theme()->get('Version'),
        true
    );
}
add_action('wp_enqueue_scripts', 'pfd_child_enqueue_assets', 100);
