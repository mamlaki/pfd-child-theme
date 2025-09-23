<?php
/**
 * Miscellaneous head output
 *
 * @package PFD_Child_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Hide the site preview banner for logged in users
 *
 * @return void
 */
function pfd_child_hide_site_preview_warning() {
    if (!is_user_logged_in()) {
        return;
    }

    echo '<style>
          .nfd-site-preview-warning {
            display: none !important;
          }
        </style>';
}
add_action('wp_head', 'pfd_child_hide_site_preview_warning');

/**
 * Ensure favicon links are always present
 *
 * @return void
 */
function pfd_child_output_favicons() {
    echo '<link rel="icon" href="/favicon.ico" sizes="any">' . "\n";
    echo '<link rel="apple-touch-icon" href="/apple-touch-icon.png">' . "\n";
}
add_action('wp_head', 'pfd_child_output_favicons', 99);
