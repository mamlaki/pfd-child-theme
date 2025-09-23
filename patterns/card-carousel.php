<?php
/**
 * Title: Card - Carousel
 * Slug: pfd-child-theme/card-carousel
 * Categories: pfd
 * Inserter: yes
 * Description: A responsive horizontal carousel for three PFD cards, with swipe and dots.
 */
?>
<!-- wp:group {"className":"pfd-carousel","layout":{"type":"constrained"}} -->
<div class="pfd-carousel wp-block-group">
  <!-- wp:group {"metadata":{"name":"Card Wrapper"},"className":"pfd-carousel__track","layout":{"type":"default"}} -->
  <div class="pfd-carousel__track wp-block-group">
   <!-- wp:group {"metadata":{"name":"Card"},"className":"pfd-carousel__slide is-style-pfd-card secondary-card","style":{"spacing":{"padding":{"top":"var:preset|spacing|m","bottom":"var:preset|spacing|m","left":"var:preset|spacing|m","right":"var:preset|spacing|m"},"blockGap":"var:preset|spacing|m"},"border":{"width":"1px","color":"#E2E8F0","radius":"8px"},"dimensions":{"minHeight":"330px"}},"gradient":"card-mist-neutral","layout":{"type":"flex","orientation":"vertical","verticalAlignment":"center","justifyContent":"stretch","flexWrap":"nowrap"}} -->
    <div class="pfd-carousel__slide is-style-pfd-card secondary-card wp-block-group has-border-color has-card-mist-neutral-gradient-background has-background" style="border-color:#E2E8F0;border-width:1px;border-radius:8px;min-height:330px;padding-top:var(--wp--preset--spacing--m);padding-right:var(--wp--preset--spacing--m);padding-bottom:var(--wp--preset--spacing--m);padding-left:var(--wp--preset--spacing--m)">
      <!-- wp:heading {"level":3,"fontSize":"h3"} -->
      <h3 class="wp-block-heading has-h-3-font-size">Card One</h3>
      <!-- /wp:heading -->

      <!-- wp:paragraph {"fontSize":"body"} -->
      <p class="has-body-font-size">Brief description goes here for card one.</p>
      <!-- /wp:paragraph -->

      <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"right"}} -->
      <div class="wp-block-buttons">
        <!-- wp:button {"className":"secondary-btn is-style-outline","fontSize":"caption","icon":"arrow-right"} -->
        <div class="secondary-btn is-style-outline wp-block-button"><a class="wp-block-button__link has-caption-font-size has-custom-font-size wp-element-button" href="#">GO</a></div>
        <!-- /wp:button -->
      </div>
      <!-- /wp:buttons -->
    </div>
    <!-- /wp:group -->

   <!-- wp:group {"metadata":{"name":"Card"},"className":"pfd-carousel__slide is-style-pfd-card secondary-card","style":{"spacing":{"padding":{"top":"var:preset|spacing|m","bottom":"var:preset|spacing|m","left":"var:preset|spacing|m","right":"var:preset|spacing|m"},"blockGap":"var:preset|spacing|m"},"border":{"width":"1px","color":"#E2E8F0","radius":"8px"},"dimensions":{"minHeight":"330px"}},"gradient":"card-mist-neutral","layout":{"type":"flex","orientation":"vertical","verticalAlignment":"center","justifyContent":"stretch","flexWrap":"nowrap"}} -->
    <div class="pfd-carousel__slide is-style-pfd-card secondary-card wp-block-group has-border-color has-card-mist-neutral-gradient-background has-background" style="border-color:#E2E8F0;border-width:1px;border-radius:8px;min-height:330px;padding-top:var(--wp--preset--spacing--m);padding-right:var(--wp--preset--spacing--m);padding-bottom:var(--wp--preset--spacing--m);padding-left:var(--wp--preset--spacing--m)">
      <!-- wp:heading {"level":3,"fontSize":"h3"} -->
      <h3 class="wp-block-heading has-h-3-font-size">Card Two</h3>
      <!-- /wp:heading -->

      <!-- wp:paragraph {"fontSize":"body"} -->
      <p class="has-body-font-size">Brief description goes here for card two.</p>
      <!-- /wp:paragraph -->

      <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"right"}} -->
      <div class="wp-block-buttons">
        <!-- wp:button {"className":"secondary-btn is-style-outline","fontSize":"caption","icon":"arrow-right"} -->
        <div class="secondary-btn is-style-outline wp-block-button"><a class="wp-block-button__link has-caption-font-size has-custom-font-size wp-element-button" href="#">GO</a></div>
        <!-- /wp:button -->
      </div>
      <!-- /wp:buttons -->
    </div>
    <!-- /wp:group -->

   <!-- wp:group {"metadata":{"name":"Card"},"className":"pfd-carousel__slide is-style-pfd-card secondary-card","style":{"spacing":{"padding":{"top":"var:preset|spacing|m","bottom":"var:preset|spacing|m","left":"var:preset|spacing|m","right":"var:preset|spacing|m"},"blockGap":"var:preset|spacing|m"},"border":{"width":"1px","color":"#E2E8F0","radius":"8px"},"dimensions":{"minHeight":"330px"}},"gradient":"card-mist-neutral","layout":{"type":"flex","orientation":"vertical","verticalAlignment":"center","justifyContent":"stretch","flexWrap":"nowrap"}} -->
    <div class="pfd-carousel__slide is-style-pfd-card secondary-card wp-block-group has-border-color has-card-mist-neutral-gradient-background has-background" style="border-color:#E2E8F0;border-width:1px;border-radius:8px;min-height:330px;padding-top:var(--wp--preset--spacing--m);padding-right:var(--wp--preset--spacing--m);padding-bottom:var(--wp--preset--spacing--m);padding-left:var(--wp--preset--spacing--m)">
      <!-- wp:heading {"level":3,"fontSize":"h3"} -->
      <h3 class="wp-block-heading has-h-3-font-size">Card Three</h3>
      <!-- /wp:heading -->

      <!-- wp:paragraph {"fontSize":"body"} -->
      <p class="has-body-font-size">Brief description goes here for card three.</p>
      <!-- /wp:paragraph -->

      <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"right"}} -->
      <div class="wp-block-buttons">
        <!-- wp:button {"className":"secondary-btn is-style-outline","fontSize":"caption","icon":"arrow-right"} -->
        <div class="secondary-btn is-style-outline wp-block-button"><a class="wp-block-button__link has-caption-font-size has-custom-font-size wp-element-button" href="#">GO</a></div>
        <!-- /wp:button -->
      </div>
      <!-- /wp:buttons -->
    </div>
    <!-- /wp:group -->

  </div>
  <!-- /wp:group -->

  <!-- wp:group {"metadata":{"name":"Dots Wrapper (Do Not Edit)"},"className":"pfd-carousel__dots","layout":{"type":"flex","justifyContent":"center"}} -->
  <div class="pfd-carousel__dots wp-block-group"></div>
  <!-- /wp:group -->
</div>
<!-- /wp:group -->


