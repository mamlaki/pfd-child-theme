<?php
/**
 * Custom meta registration and handling
 *
 * @package PFD_Child_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Authorization callback for tagline meta access
 *
 * @return bool
 */
function pfd_child_can_edit_tagline_meta() {
    return current_user_can('edit_posts');
}

/**
 * Register custom meta used by the Page Tagline metabox
 *
 * @return void
 */
function pfd_child_register_tagline_meta() {
    register_post_meta(
        'page',
        'pfd_tagline',
        [
            'type'              => 'string',
            'single'            => true,
            'show_in_rest'      => true,
            'sanitize_callback' => 'wp_kses_post',
            'auth_callback'     => 'pfd_child_can_edit_tagline_meta',
        ]
    );
}
add_action('init', 'pfd_child_register_tagline_meta');

/**
 * Register the Page Tagline metabox
 *
 * @return void
 */
function pfd_child_register_tagline_metabox() {
    add_meta_box(
        'pfd_tagline_mb',
        __('Page Tagline', 'pfd-child-theme'),
        'pfd_child_render_tagline_metabox',
        'page',
        'side',
        'high'
    );
}
add_action('add_meta_boxes', 'pfd_child_register_tagline_metabox');

/**
 * Render callback for the Page Tagline metabox
 *
 * @param WP_Post $post Current post instance
 *
 * @return void
 */
function pfd_child_render_tagline_metabox($post) {
    $value = get_post_meta($post->ID, 'pfd_tagline', true);

    wp_nonce_field('pfd_tagline_nonce', 'pfd_tagline_nonce');

    echo '<p><em>' . esc_html__('Short tagline that appears under the featured image.', 'pfd-child-theme') . '</em></p>';
    echo '<textarea id="pfd_tagline" name="pfd_tagline" rows="3" style="width:100%;">' . esc_textarea($value) . '</textarea>';
}

/**
 * Persist Page Tagline metabox data
 *
 * @param int $post_id The post being saved
 *
 * @return void
 */
function pfd_child_save_tagline_metabox($post_id) {
    if (!isset($_POST['pfd_tagline_nonce']) || !wp_verify_nonce($_POST['pfd_tagline_nonce'], 'pfd_tagline_nonce')) {
        return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if (!current_user_can('edit_page', $post_id)) {
        return;
    }

    $value = isset($_POST['pfd_tagline']) ? wp_kses_post($_POST['pfd_tagline']) : '';
    update_post_meta($post_id, 'pfd_tagline', $value);
}
add_action('save_post_page', 'pfd_child_save_tagline_metabox');
