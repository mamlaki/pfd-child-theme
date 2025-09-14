<?php 
/**
 * Title: Hero - Image Background
 * Slug: pfd-child-theme/hero-cover
 * Categories: pfd, featured
 * Description: Full-bleed cover hero with heading, text, and two buttons.
 * Inserter: yes
 */
?>
<!-- wp:cover {"dimRatio":40,"overlayColor":"secondary-darkest","isUserOverlayColor":true,"minHeight":500,"minHeightUnit":"px","lock":{"move":false,"remove":false},"align":"full","className":"is-dark","style":{"spacing":{"padding":{"top":"var:preset|spacing|l","bottom":"var:preset|spacing|l"}}},"layout":{"type":"constrained"}} -->
<div class="is-dark wp-block-cover alignfull" style="padding-top:var(--wp--preset--spacing--l);padding-bottom:var(--wp--preset--spacing--l);min-height:500px">
	<span aria-hidden="true" class="wp-block-cover__background has-secondary-darkest-background-color has-background-dim-40 has-background-dim"></span>
	<div class="wp-block-cover__inner-container">

		<!-- wp:group {"align":"wide","style":{"spacing":{"blockGap":"var:preset|spacing|s"}},"layout":{"type":"constrained","contentSize":"66ch","justifyContent":"left"}} -->
		<div class="wp-block-group alignwide">

			<!-- wp:heading {"level":1,"textColor":"neutral-background","fontSize":"h1"} -->
			<h1 class="wp-block-heading has-neutral-background-color has-text-color has-h-1-font-size">Add a strong headline</h1>
			<!-- /wp:heading -->

			<!-- wp:paragraph {"style":{"spacing":{"margin":{"top":"var:preset|spacing|s","bottom":"var:preset|spacing|s"}},"typography":{"fontStyle":"normal","fontWeight":"500"}},"textColor":"neutral-background","fontSize":"h5"} -->
			<p class="has-neutral-background-color has-text-color has-h-5-font-size" style="margin-top:var(--wp--preset--spacing--s);margin-bottom:var(--wp--preset--spacing--s);font-style:normal;font-weight:500">One or two lines of supporting copy that explains the value.</p>
			<!-- /wp:paragraph -->

			<!-- wp:buttons {"style":{"spacing":{"blockGap":"var:preset|spacing|s"}}} -->
			<div class="wp-block-buttons">
				<!-- wp:button {"fontSize":"body"} -->
        <div class="wp-block-button">
					<a class="wp-block-button__link has-body-font-size has-custom-font-size wp-element-button" href="#">Primary action</a>
				</div>
				<!-- /wp:button -->

				<!-- wp:button {"className":"is-style-outline","fontSize":"body"} -->
				<div class="is-style-outline wp-block-button">
					<a class="wp-block-button__link has-body-font-size has-custom-font-size wp-element-button" href="#">Secondary</a>
				</div>
				<!-- /wp:button -->
			</div>
			<!-- /wp:buttons -->

		</div>
		<!-- /wp:group -->

	</div>
</div>
<!-- /wp:cover -->