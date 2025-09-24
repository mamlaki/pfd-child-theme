(function (wp) {
  if (!wp || !wp.hooks) {
    return;
  }

  const { addFilter } = wp.hooks;
  const {
    createElement: el,
    Fragment,
    useMemo,
  } = wp.element;
  const { createHigherOrderComponent } = wp.compose;
  const { InspectorControls } = wp.blockEditor || wp.editor;
  const {
    PanelBody,
    SelectControl,
    __experimentalToolsPanel: ToolsPanel,
    __experimentalToolsPanelItem: ToolsPanelItem,
  } = wp.components;
  const { useSelect } = wp.data;

  const TARGET = 'core/column';
  const ORDER_CLASS = 'has-mobile-order';

  // Add attribute that stores the desired stack position on smaller breakpoints
  addFilter(
    'blocks.registerBlockType',
    'pfd/mobile-order/attributes',
    (settings, name) => {
      if (name !== TARGET) {
        return settings;
      }

      settings.attributes = Object.assign({}, settings.attributes, {
        pfdMobileOrder: {
          type: 'string',
          default: '',
        },
      });

      return settings;
    }
  );

  const withMobileOrderControls = createHigherOrderComponent(
    (BlockEdit) => {
      return (props) => {
        if (props.name !== TARGET) {
          return el(BlockEdit, props);
        }

        const { attributes, setAttributes, clientId } = props;
        const value = attributes.pfdMobileOrder || '';

        const { columnCount, fallbackOrder } = useSelect(
          (select) => {
            const blockEditor = select('core/block-editor');
            const parentId = blockEditor.getBlockRootClientId(clientId);

            if (!parentId) {
              return {
                columnCount: 0,
                fallbackOrder: 1,
              };
            }

            const childClientIds = blockEditor.getBlockOrder(parentId) || [];

            return {
              columnCount: childClientIds.length,
              fallbackOrder: childClientIds.indexOf(clientId) + 1 || 1,
            };
          },
          [clientId]
        );

        const options = useMemo(() => {
          const opts = [
            { label: 'Theme default', value: '' },
          ];

          for (let i = 1; i <= columnCount; i += 1) {
            opts.push({
              label: `Show as #${i} when stacked`,
              value: String(i),
            });
          }

          return opts;
        }, [columnCount]);

        const reset = () => setAttributes({ pfdMobileOrder: '' });
        const hasCustomValue = !!value;

        const controls = el(
          ToolsPanelItem,
          {
            label: 'Stack position',
            hasValue: () => hasCustomValue,
            onDeselect: reset,
            isShownByDefault: true,
          },
          columnCount > 1
            ? el(SelectControl, {
                label: 'When these columns stack, show this column as…',
                value,
                options,
                onChange: (next) => setAttributes({ pfdMobileOrder: next }),
                help: `Default stack position: #${fallbackOrder}`,
              })
            : el(
                'p',
                { className: 'components-base-control__help' },
                'Add another column to control its stacked position.'
              )
        );

        return el(
          Fragment,
          {},
          el(BlockEdit, props),
          el(
            InspectorControls,
            {},
            el(
              PanelBody,
              { title: 'Responsive order', initialOpen: false },
              el(
                ToolsPanel,
                {
                  label: 'Responsive order',
                  resetAll: reset,
                },
                controls
              )
            )
          )
        );
      };
    },
    'withMobileOrderControls'
  );

  addFilter(
    'editor.BlockEdit',
    'pfd/mobile-order/block-edit',
    withMobileOrderControls
  );

  // Add classes + custom property to saved content for the front end
  addFilter(
    'blocks.getSaveContent.extraProps',
    'pfd/mobile-order/save-props',
    (extraProps, blockType, attributes) => {
      if (blockType.name !== TARGET) {
        return extraProps;
      }

      const value = attributes.pfdMobileOrder;

      if (!value) {
        return extraProps;
      }

      const mergedClassName = [
        extraProps.className,
        ORDER_CLASS,
        `${ORDER_CLASS}-${value}`,
      ]
        .filter(Boolean)
        .join(' ');

      const mergedStyle = Object.assign({}, extraProps.style, {
        '--pfd-mobile-order': value,
      });

      return Object.assign({}, extraProps, {
        className: mergedClassName,
        style: mergedStyle,
      });
    }
  );

  // Mirror the same classes/styles inside the editor canvas for live preview
  const withMobileOrderWrapperProps = createHigherOrderComponent(
    (BlockListBlock) => {
      return (props) => {
        if (props.name !== TARGET) {
          return el(BlockListBlock, props);
        }

        const value = props.attributes.pfdMobileOrder;

        if (!value) {
          return el(BlockListBlock, props);
        }

        const extraClass = [ORDER_CLASS, `${ORDER_CLASS}-${value}`].join(' ');
        const wrapperProps = Object.assign({}, props.wrapperProps, {
          className: [props.wrapperProps?.className, extraClass]
            .filter(Boolean)
            .join(' '),
          style: Object.assign({}, props.wrapperProps?.style, {
            '--pfd-mobile-order': value,
          }),
        });

        return el(
          BlockListBlock,
          Object.assign({}, props, { wrapperProps })
        );
      };
    },
    'withMobileOrderWrapperProps'
  );

  addFilter(
    'editor.BlockListBlock',
    'pfd/mobile-order/block-list-block',
    withMobileOrderWrapperProps
  );
})(window.wp);
