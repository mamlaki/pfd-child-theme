(function (wp) {
  const { addFilter } = wp.hooks;
  const { Fragment, createElement: el } = wp.element;
  const { createHigherOrderComponent } = wp.compose;
  const { InspectorControls } = wp.blockEditor || wp.editor;
  const { PanelBody, ColorPalette,
          __experimentalToolsPanel: ToolsPanel,
          __experimentalToolsPanelItem: ToolsPanelItem } = wp.components;
  const { select } = wp.data;

  const TARGET_BLOCK = 'core/group';
  const TARGET_CLASS = 'is-style-pfd-card';

  // Attribute
  addFilter('blocks.registerBlockType', 'pfd/hover-attr', (settings, name) => {
    if (name !== TARGET_BLOCK) return settings;
    return {
      ...settings,
      attributes: {
        ...(settings.attributes || {}),
        pfdHoverBorder: { type: 'string', default: '' },
      },
    };
  });

  // Save inline style
  addFilter('blocks.getSaveContent.extraProps', 'pfd/hover-inline-style', (props, blockType, attrs) => {
    if (blockType.name !== TARGET_BLOCK) return props;
    const cn = ((props.className || '') + ' ' + (attrs.className || '')).trim();
    if (!cn.split(/\s+/).includes(TARGET_CLASS)) return props;
    if (attrs.pfdHoverBorder) {
      props.style = Object.assign({}, props.style, { '--pfd-card-hover': attrs.pfdHoverBorder });
    }
    return props;
  });

  // Editor wrapper
  const withWrapperStyle = createHigherOrderComponent((BlockListBlock) => {
    return function (props) {
      if (props.block?.name !== TARGET_BLOCK) return el(BlockListBlock, props);
      const cn = ((props.className || '') + ' ' + (props.block.attributes.className || '')).trim();
      if (!cn.split(/\s+/).includes(TARGET_CLASS)) return el(BlockListBlock, props);

      const hover = props.block.attributes.pfdHoverBorder || null;
      const wrapperProps = Object.assign({}, props.wrapperProps, {
        style: Object.assign({}, (props.wrapperProps && props.wrapperProps.style) || {}, hover ? { '--pfd-card-hover': hover } : {})
      });

      return el(BlockListBlock, Object.assign({}, props, { wrapperProps }));
    };
  }, 'pfd/withWrapperStyle');
  addFilter('editor.BlockListBlock', 'pfd/hover-inline-editor', withWrapperStyle);

  // Inspector control
  const withHoverControl = createHigherOrderComponent((BlockEdit) => {
    return function (props) {
      if (props.name !== TARGET_BLOCK) return el(BlockEdit, props);
      const cn = (props.attributes.className || '').split(/\s+/);
      if (!cn.includes(TARGET_CLASS)) return el(BlockEdit, props);

      const themeColors = (select('core/block-editor').getSettings() || {}).colors || [];
      const clearValue = () => props.setAttributes({ pfdHoverBorder: '' });

      return el(Fragment, null,
        el(BlockEdit, props),
        el(InspectorControls, { group: 'styles' },
          el(PanelBody, { title: 'Card Hover Border', initialOpen: true },
            el(ToolsPanel, { label: 'Hover Border' },
              el(ToolsPanelItem, {
                hasValue: () => !!props.attributes.pfdHoverBorder,
                label: 'Hover border color',
                onDeselect: clearValue,
                isShownByDefault: true
              },
                el(ColorPalette, {
                  colors: themeColors,
                  value: props.attributes.pfdHoverBorder,
                  onChange: (color) => props.setAttributes({ pfdHoverBorder: color || '' }),
                  enableAlpha: true
                })
              )
            )
          )
        )
      );
    };
  }, 'pfd/withHoverControl');
  addFilter('editor.BlockEdit', 'pfd/hover-control', withHoverControl);
})(window.wp);