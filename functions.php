<?php
/**
 * PFD Child Theme bootstrap
 *
 * @package PFD_Child_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

$includes = [
    'setup.php',
    'assets.php',
    'block-styles.php',
    'meta.php',
    'editor.php',
    'head.php',
];

foreach ($includes as $file) {
    $path = __DIR__ . '/inc/' . $file;

    if (!file_exists($path)) {
        continue;
    }

    require_once $path;
}
