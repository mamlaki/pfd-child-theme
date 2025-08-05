<?php
add_action( 'wp_enqueue_scripts', function() {
    wp_enqueue_style(
        'twentytwentyfive-style',
        get_template_directory_uri() . '/style.css',
        [],
        wp_get_theme('twentytwentyfive')->get('Version')
    );
    wp_enqueue_style(
        'pfd-child-style',
        get_stylesheet_uri(),
        ['twentytwentyfive-style'],
        wp_get_theme()->get('Version')
    );
});