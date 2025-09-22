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

  // Main JS
  wp_enqueue_script(
    'pfd-child',
    get_stylesheet_directory_uri() . '/assets/js/pfd.js',
    [],
    wp_get_theme()->get('Version'),
    true
  );

  // Table of Contents JS
  wp_enqueue_script(
    'pfd-toc',
    get_stylesheet_directory_uri() . '/assets/js/pfd-toc.js',
    [],
    wp_get_theme()->get('Version'),
    true
  );

  // Nav JS
  wp_enqueue_script(
    'pfd-nav',
    get_stylesheet_directory_uri() . '/assets/js/pfd-nav.js',
    [],
    '1.0.0',
    true
  );

  // Carousel JS
  wp_enqueue_script(
    'pfd-carousel',
    get_stylesheet_directory_uri() . '/assets/js/pfd-carousel.js',
    [],
    wp_get_theme()->get('Version'),
    true
  );
}, 100);

add_action('init', function () {
  // Register pfd tagline metabox
  register_post_meta('page', 'pfd_tagline', [
    'type'                => 'string',
    'single'              => true,
    'show_in_rest'        => true,
    'sanitize_callback'   => 'wp_kses_post',
    'auth_callback'       => function() {
      return current_user_can('edit_posts');
    },
  ]);

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

  // Register block patterns
  register_block_pattern_category('pfd', ['label' => __('PFD Patterns', 'pfd-child-theme')]);

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

  // ----- Metabox Page Tagline -----
  add_action('add_meta_boxes', function () {
    add_meta_box(
      'pfd_tagline_mb',
      __('Page Tagline', 'pfd-child-theme'),
      function ($post) {
        $value = get_post_meta($post->ID, 'pfd_tagline', true);
        wp_nonce_field('pfd_tagline_nonce', 'pfd_tagline_nonce');
        echo '<p><em>Short tagline that appears under the featured image.</em></p>';
        echo '<textarea id="pfd_tagline" name="pfd_tagline" rows="3" style="width:100%;">' . esc_textarea($value) . '</textarea>';
      },
      'page',
      'side',
      'high'
    );
  });

  add_action('save_post_page', function($post_id) {
    if (!isset($_POST['pfd_tagline_nonce']) || !wp_verify_nonce($_POST['pfd_tagline_nonce'], 'pfd_tagline_nonce')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_page', $post_id)) return;
    $val = isset($_POST['pfd_tagline']) ? wp_kses_post($_POST['pfd_tagline']) : '';
    update_post_meta($post_id, 'pfd_tagline', $val);
  });
});

add_action('enqueue_block_editor_assets', function () {
  foreach (['/assets/js/pfd-card-hover-control.js', '/assets/js/pfd-card-controls.js'] as $rel) {
    $path = get_stylesheet_directory() . $rel;
    $uri  = get_stylesheet_directory_uri() . $rel;
    if (file_exists($path)) {
      wp_enqueue_script(
        basename($rel, '.js'),
        $uri,
        ['wp-blocks','wp-dom-ready','wp-edit-post','wp-element','wp-components','wp-hooks','wp-i18n','wp-compose','wp-data','wp-block-editor'],
        filemtime($path),
        true
      );
    }
  }
});

// Guarantee favicon tags
add_action('wp_head', function () {
  echo '<link rel="icon" href="/favicon.ico" sizes="any">'."\n";
  echo '<link rel="apple-touch-icon" href="/apple-touch-icon.png">'."\n";
}, 99);
