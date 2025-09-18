(function (wp) {
  const { addFilter } = wp.hooks;
  const { Fragment, createElement: el } = wp.element;
  const { createHigherOrderComponent } = wp.compose;
  const { InspectorControls } = wp.blockEditor || wp.editor;
  const {
    PanelBody, __experimentalToolsPanel: ToolsPanel,
    __experimentalToolsPanelItem: ToolsPanelItem,
    __experimentalUnitControl: UnitControl, Button, ButtonGroup
  } = wp.components;

  const TARGET = 'core/group';
  const CARD_CLASS = 'is-style-pfd-card';

  // Add attributes
  addFilter('blocks.registerBlockType', 'pfd/card-attrs', (settings, name) => {
    if (name !== TARGET) return settings;
    settings.attributes = Object.assign({}, settings.attributes, {
      pfdCardWidth: { type: 'string', default: '' } // e.g. "36ch", "420px", "50%"
    });
    return settings;
  });

  // Sidebar UI
  const withCardControls = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
      if (props.name !== TARGET) return el(BlockEdit, props);

      const className = (props.attributes.className || '');
      if (!className.split(/\s+/).includes(CARD_CLASS)) {
        return el(BlockEdit, props);
      }

      const value = props.attributes.pfdCardWidth || '';

      const setVal = (v) => props.setAttributes({ pfdCardWidth: v || '' });
      const reset = () => setVal('');

      const Preset = ({ label, val }) =>
        el(Button, {
          variant: value === val ? 'primary' : 'secondary',
          onClick: () => setVal(val)
        }, label);

      return el(Fragment, {},
        el(BlockEdit, props),
        el(InspectorControls, {},
          el(PanelBody, { title: 'Card', initialOpen: true },
            el(ToolsPanel, {
              label: 'Card controls',
              resetAll: reset
            },
              el(ToolsPanelItem, {
                label: 'Width',
                hasValue: () => !!value,
                onDeselect: reset
              },
                el(UnitControl, {
                  label: 'Max width',
                  value,
                  onChange: setVal,
                  units: [
                    { value: 'ch', label: 'ch', default: true },
                    { value: 'px', label: 'px' },
                    { value: 'rem', label: 'rem' },
                    { value: '%', label: '%' }
                  ],
                  help: 'Sets max-width via CSS var. Clear to use theme flow.'
                }),
                el('div', { style: { marginTop: 8 } },
                  el(ButtonGroup, {},
                    el(Preset, { label: 'Narrow', val: '36ch' }),
                    el(Preset, { label: 'Default', val: '' }),
                    el(Preset, { label: 'Wide',   val: '68ch' }),
                    el(Preset, { label: 'Full',   val: '100%' })
                  )
                )
              )
            )
          )
        )
      );
    };
  }, 'withCardControls');
  wp.hooks.addFilter('editor.BlockEdit', 'pfd/card-controls', withCardControls);

  // Inline style on save
  addFilter('blocks.getSaveContent.extraProps', 'pfd/card-style-prop', (extraProps, blockType, attributes) => {
    if (blockType.name !== TARGET) return extraProps;

    const classes = (attributes.className || '').split(/\s+/);
    if (!classes.includes(CARD_CLASS)) return extraProps;

    const w = attributes.pfdCardWidth;
    if (!w) return extraProps;

    extraProps.style = Object.assign({}, extraProps.style, { ['--pfd-card-max']: w });
    return extraProps;
  });  

  const withCardWidthOnEdit = createHigherOrderComponent((BlockListBlock) => {
    return (props) => {
      if (props.name !== TARGET) return wp.element.createElement(BlockListBlock, props);
  
      const classes = (props.attributes.className || '').split(/\s+/);
      if (!classes.includes(CARD_CLASS)) return wp.element.createElement(BlockListBlock, props);
  
      const w = props.attributes.pfdCardWidth;
      const wrapperProps = Object.assign({}, props.wrapperProps, {
        style: Object.assign({}, props.wrapperProps?.style, w ? { ['--pfd-card-max']: w } : {})
      });
  
      return wp.element.createElement(BlockListBlock, Object.assign({}, props, { wrapperProps }));
    };
  }, 'withCardWidthOnEdit');
  
  wp.hooks.addFilter('editor.BlockListBlock', 'pfd/card-width-on-edit', withCardWidthOnEdit);


})(window.wp);