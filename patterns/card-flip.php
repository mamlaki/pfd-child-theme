<?php
/**
 * Title: Card - Flippable
 * Slug: pfd-child-theme/card-flip
 * Categories: pfd
 * Inserter: yes
 * Description: Flippable card.
 */
?>
<!-- wp:group {"className":"pfd-flip is-style-pfd-card","style":{"spacing":{"padding":{"top":"var:preset|spacing|m","bottom":"var:preset|spacing|m","left":"var:preset|spacing|m","right":"var:preset|spacing|m"},"blockGap":"var:preset|spacing|m"},"border":{"width":"1px","color":"#E2E8F0","radius":"4px"},"dimensions":{"minHeight":"330px"}},"gradient":"card-mist-neutral","layout":{"type":"default"}} -->
<div class="wp-block-group pfd-flip is-style-pfd-card has-border-color has-card-mist-neutral-gradient-background has-background" style="border-color:#E2E8F0;border-width:1px;border-radius:4px;min-height:330px;padding-top:var(--wp--preset--spacing--m);padding-right:var(--wp--preset--spacing--m);padding-bottom:var(--wp--preset--spacing--m);padding-left:var(--wp--preset--spacing--m)">

  <!-- wp:group {"metadata":{"name":"Card Wrapper"},"className":"pfd-flip__inner"} -->
  <div class="wp-block-group pfd-flip__inner">

    <!-- wp:group {"metadata":{"name":"Card - FRONT"}, "className":"pfd-flip__face pfd-flip__front"} -->
    <div class="wp-block-group pfd-flip__face pfd-flip__front">
      
      <!-- wp:group {"className":"pfd-flip__content","style":{"spacing":{"blockGap":"var:preset|spacing|m"}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"stretch","flexWrap":"nowrap"}} -->
      <div class="wp-block-group pfd-flip__content">
        <!-- wp:heading {"level":3,"fontSize":"h3"} -->
        <h3 class="wp-block-heading has-h-3-font-size">Card Title</h3>
        <!-- /wp:heading -->

        <!-- wp:paragraph {"fontSize":"body"} -->
        <p class="has-body-font-size">Brief description goes here.</p>
        <!-- /wp:paragraph -->

        <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"right"}} -->
        <div class="wp-block-buttons">
          <!-- wp:button {"className":"secondary-btn is-style-outline js-flip","fontSize":"caption","icon":"help"} -->
          <div class="secondary-btn is-style-outline wp-block-button js-flip">
            <a class="wp-block-button__link has-caption-font-size has-custom-font-size wp-element-button" href="#">FLIP</a>
          </div>
          <!-- /wp:button -->
        </div>
        <!-- /wp:buttons -->
      </div>
      <!-- /wp:group -->
    </div>
    <!-- /wp:group -->

    <!-- wp:group {"metadata":{"name":"Card - BACK"},"className":"pfd-flip__face pfd-flip__back"} -->
    <div class="wp-block-group pfd-flip__face pfd-flip__back">
      <!-- wp:group {"className":"pfd-flip__content","style":{"spacing":{"blockGap":"var:preset|spacing|m"}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"stretch","flexWrap":"nowrap"}} -->
      <div class="wp-block-group pfd-flip__content">
        <!-- wp:heading {"level":4,"fontSize":"h4"} -->
        <h4 class="wp-block-heading has-h-4-font-size">More details</h4>
        <!-- /wp:heading -->

        <!-- wp:paragraph {"fontSize":"body"} -->
        <p class="has-body-font-size">Add supporting content or highlights related to the front of the card.</p>
        <!-- /wp:paragraph -->

        <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"space-between"}} -->
        <div class="wp-block-buttons">
          <!-- wp:button {"className":"is-style-outline js-unflip secondary-btn","fontSize":"caption","icon":"chevron-left","iconPositionLeft":true} -->
          <div class="is-style-outline js-unflip secondary-btn wp-block-button">
            <a class="wp-block-button__link has-caption-font-size has-custom-font-size wp-element-button" href="#">BACK</a>
          </div>
          <!-- /wp:button -->

          <!-- wp:button {"className":"secondary-btn is-style-outline","fontSize":"caption","icon":"chevron-right"} -->
          <div class="secondary-btn is-style-outline wp-block-button">
            <a class="wp-block-button__link has-caption-font-size has-custom-font-size wp-element-button" href="/your-target">GO</a>
          </div>
          <!-- /wp:button -->
        </div>
        <!-- /wp:buttons -->
      </div>
      <!-- /wp:group -->
    </div>
    <!-- /wp:group -->

  </div>
  <!-- /wp:group -->

</div>
<!-- /wp:group -->