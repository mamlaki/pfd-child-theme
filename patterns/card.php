<?php
/**
 * Title: Card
 * Slug: pfd-child-theme/card-static
 * Categories: pfd
 * Inserter: yes
 * Description: General static informative card, no interactability.
 */
?>
<!-- wp:group {"className":"is-style-pfd-card secondary-card","style":{"spacing":{"padding":{"top":"var:preset|spacing|m","bottom":"var:preset|spacing|m","left":"var:preset|spacing|m","right":"var:preset|spacing|m"},"blockGap":"var:preset|spacing|m"},"border":{"width":"1px","color":"#E2E8F0","radius":"4px"},"dimensions":{"minHeight":"330px"}},"gradient":"card-mist-neutral","layout":{"type":"flex","orientation":"vertical","verticalAlignment":"center","justifyContent":"stretch","flexWrap":"nowrap"}} -->
<div class="is-style-pfd-card secondary-card wp-block-group has-border-color has-card-mist-neutral-gradient-background has-background" style="border-color:#E2E8F0;border-width:1px;border-radius:4px;min-height:330px;padding-top:var(--wp--preset--spacing--m);padding-right:var(--wp--preset--spacing--m);padding-bottom:var(--wp--preset--spacing--m);padding-left:var(--wp--preset--spacing--m)">
  <!-- wp:heading {"level":3,"fontSize":"h3"} -->
  <h3 class="wp-block-heading has-h-3-font-size">Card Title</h3>
  <!-- /wp:heading -->

  <!-- wp:paragraph {"fontSize":"body"} -->
  <p class="has-body-font-size">Brief description goes here.</p>
  <!-- /wp:paragraph -->

  <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"right"}} -->
  <div class="wp-block-buttons">
    <!-- wp:button {"className":"secondary-btn is-style-outline","fontSize":"caption"} -->
    <div class="secondary-btn is-style-outline wp-block-button"><a class="wp-block-button__link has-caption-font-size has-custom-font-size wp-element-button" href="/your-target">LEARN MORE</a></div>
    <!-- /wp:button -->
  </div>
  <!-- /wp:buttons -->
</div>
<!-- /wp:group -->