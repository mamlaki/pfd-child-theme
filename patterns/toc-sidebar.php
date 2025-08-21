<?php
/**
 * Title: Table of Contents - Sidebar
 * Slug: pfd-child-theme/toc-sidebar
 * Categories: pfd
 * Description: Minimal sticky table of contents alongside page content with a mobile floating toggle.
 * Inserter: yes
 */
?>
<!-- wp:group {"className":"pfd-toc-pattern","layout":{"type":"constrained"},"style":{"spacing":{"blockGap":"var:preset|spacing|m"}}} -->
<div class="wp-block-group pfd-toc-pattern">
<!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":"var:preset|spacing|l"}}} -->
<div class="wp-block-columns alignwide">
  <!-- wp:column {"width":"28%"} -->
  <div class="wp-block-column" style="flex-basis:28%">
    <!-- wp:group {"className":"pfd-toc","style":{"spacing":{"padding":{"top":"var:preset|spacing|m","bottom":"var:preset|spacing|m","left":"var:preset|spacing|m","right":"var:preset|spacing|m"},"blockGap":"var:preset|spacing|s"},"border":{"radius":"8px","width":"1px"}},"backgroundColor":"neutral-background","borderColor":"neutral-border-divider","layout":{"type":"constrained"}} -->
    <div class="wp-block-group pfd-toc has-neutral-background-background-color has-border-color has-neutral-border-divider-border-color has-background" style="border-width:1px;border-radius:8px;padding-top:var(--wp--preset--spacing--m);padding-right:var(--wp--preset--spacing--m);padding-bottom:var(--wp--preset--spacing--m);padding-left:var(--wp--preset--spacing--m)">
      <!-- wp:heading {"level":5,"style":{"spacing":{"margin":{"bottom":"var:preset|spacing|xs"}}}} -->
      <h5 class="wp-block-heading" style="margin-bottom:var(--wp--preset--spacing--xs)">On this page</h5>
      <!-- /wp:heading -->

      <!-- wp:html -->
      <nav class="pfd-toc__nav" aria-label="On this page"><ul class="pfd-toc__list"></ul></nav>
      <!-- /wp:html -->
    </div>
    <!-- /wp:group -->
  </div>
  <!-- /wp:column -->

  <!-- wp:column {"width":"72%"} -->
  <div class="wp-block-column" style="flex-basis:72%">
    <!-- wp:group {"className":"pfd-toc__content","layout":{"type":"constrained"},"style":{"spacing":{"blockGap":"var:preset|spacing|m"}}} -->
    <div class="wp-block-group pfd-toc__content">
      <!-- demo content: you can replace everything in this group with your page content -->
      <!-- wp:heading {"level":2} -->
      <h2 class="wp-block-heading">Section heading</h2>
      <!-- /wp:heading -->

      <!-- wp:paragraph -->
      <p>Add your page content here. The table of contents will auto-populate from H2–H4 headings in this column.</p>
      <!-- /wp:paragraph -->

      <!-- wp:heading {"level":3} -->
      <h3 class="wp-block-heading">Subsection</h3>
      <!-- /wp:heading -->

      <!-- wp:paragraph -->
      <p>More content…</p>
      <!-- /wp:paragraph -->
    </div>
    <!-- /wp:group -->
  </div>
  <!-- /wp:column -->
</div>
<!-- /wp:columns -->

<!-- wp:buttons {"className":"pfd-toc__fab-container","layout":{"type":"flex","justifyContent":"right"}} -->
<div class="wp-block-buttons pfd-toc__fab-container">
  <!-- wp:button {"className":"pfd-toc__fab","textColor":"neutral-background","backgroundColor":"primary","style":{"border":{"radius":"999px"}},"fontSize":"caption"} -->
  <div class="wp-block-button pfd-toc__fab"><a class="wp-block-button__link has-neutral-background-color has-primary-background-color has-text-color has-background has-caption-font-size wp-element-button" href="#" aria-expanded="false" aria-haspopup="dialog">On this page</a></div>
  <!-- /wp:button -->
  </div>
<!-- /wp:buttons -->

</div>
<!-- /wp:group -->


