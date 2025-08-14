<?php 
/**
 * Title: Hero - Image Background
 * Slug: pfd-child-theme/hero-cover
 * Categories: pfd, featured
 * Description: Full-bleed cover hero with heading, text, and two buttons.
 * Inserter: yes
 */
?>
<!-- wp:cover {"dimRatio":40,"overlayColor":"secondary-darkest","minHeight":60,"minHeightUnit":"vh","align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|l","bottom":"var:preset|spacing|l"}}},"lock":{"move":false,"remove":false}} -->
<div class="wp-block-cover alignfull" style="min-height:60vh;padding-top:var(--wp--preset--spacing--l);padding-bottom:var(--wp--preset--spacing--l)">
  <span aria-hidden="true" class="wp-block-cover__background has-secondary-darkest-background-color has-background-dim-40 has-background-dim"></span>
  <div class="wp-block-cover__inner-container">
    <!-- wp:group {"layout":{"type":"constrained","contentSize":"<?php echo esc_attr( wp_get_global_settings( array( 'layout', 'contentSize' ) ) ?: '800px' ); ?>"},"style":{"spacing":{"blockGap":"var:preset|spacing|s"}}} -->
    <div class="wp-block-group">
      <!-- wp:heading {"level":1,"textColor":"neutral-background"} -->
      <h1 class="has-neutral-background-color has-text-color">Add a strong headline</h1>
      <!-- /wp:heading -->

      <!-- wp:paragraph {"textColor":"neutral-background"} -->
      <p class="has-neutral-background-color has-text-color">One or two lines of supporting copy that explains the value.</p>
      <!-- /wp:paragraph -->

      <!-- wp:buttons -->
      <div class="wp-block-buttons">
        <!-- wp:button {"backgroundColor":"primary","textColor":"neutral-background"} -->
        <div class="wp-block-button"><a class="wp-block-button__link has-neutral-background-color has-primary-background-color has-text-color has-background wp-element-button">Primary action</a></div>
        <!-- /wp:button -->

        <!-- wp:button {"className":"is-style-outline","textColor":"neutral-background"} -->
        <div class="wp-block-button is-style-outline"><a class="wp-block-button__link has-neutral-background-color has-text-color">Secondary</a></div>
        <!-- /wp:button -->
      </div>
      <!-- /wp:buttons -->
    </div>
    <!-- /wp:group -->
  </div>
</div>
<!-- /wp:cover -->