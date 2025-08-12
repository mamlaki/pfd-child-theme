<?php
/**
 * PFD Child – enqueue + block style registration (Twenty Twenty-Five)
 */

add_action('after_setup_theme', function () {
  add_theme_support('editor-styles');
  add_editor_style([
    'style.css',
    'assets/blocks/navigation.css', // PFD nav style in block editor
  ]);
});

add_action('wp_enqueue_scripts', function () {
  // Parent
  wp_enqueue_style(
    'twentytwentyfive-style',
    get_template_directory_uri() . '/style.css',
    [],
    wp_get_theme('twentytwentyfive')->get('Version')
  );

  // Child styles
  wp_enqueue_style(
    'pfd-child-style',
    get_stylesheet_uri(),
    [ 'wp-block-library', 'twentytwentyfive-style', 'global-styles' ],
    wp_get_theme()->get('Version')
  );

  // JS
  wp_enqueue_script(
    'pfd-child',
    get_stylesheet_directory_uri() . '/assets/js/pfd.js',
    [],
    wp_get_theme()->get('Version'),
    true
  );

  wp_enqueue_script(
    'pfd-nav',
    get_stylesheet_directory_uri() . '/assets/js/pfd-nav.js',
    [],
    '1.0.0',
    true
  );
}, 100);

add_action('init', function () {
  // Enqueue nav block style
  wp_enqueue_block_style(
    'core/navigation',
    [
      'handle' => 'pfd-nav-style',
      'src'    => get_stylesheet_directory_uri() . '/assets/blocks/navigation.css',
      'path'   => get_stylesheet_directory() . '/assets/blocks/navigation.css',
      'ver'    => wp_get_theme()->get('Version'),
    ]
  );

  // Register nav block style "PFD Nav"
  register_block_style('core/navigation', [
    'name'         => 'pfd-nav',
    'label'        => __('PFD Nav', 'pfd-child-theme'),
    'style_handle' => 'pfd-nav-style',
  ]);

  // Hide Site Banner While Editing
  add_action('wp_head', function () {
    if (is_user_logged_in()) {
        echo '<style>
          .nfd-site-preview-warning {
            display: none !important;
          }
        </style>';
    }
});
});