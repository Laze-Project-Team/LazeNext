import type { VFC } from 'react';
import { Item, Menu, Separator, useContextMenu } from 'react-contexify';

import type { ContextMenuItem, ContextMenuItems } from '@/typings/contextmenu';

type ContextMenuprops = {
  id: string;
  items: ContextMenuItems;
};

export const ContextMenuTemplate: VFC<ContextMenuprops> = ({ id, items }) => {
  const handleItemClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent> | React.TouchEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
    props: { index: string },
    item: ContextMenuItem
  ) => {
    event.preventDefault();
    event.stopPropagation();

    return item.callback(props.index);
  };

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { hideAll } = useContextMenu({ id });

  return (
    <>
      <Menu id={id} animation={false} theme="editor">
        {items.map((item) => {
          return item.separator ? (
            <Separator key={`${id}-${item.name}`} />
          ) : (
            <Item
              key={`${id}-${item.name}`}
              onClick={({ event, props }) => {
                hideAll();
                handleItemClick(event, props, item);
              }}
            >
              {item.name}
            </Item>
          );
        })}
      </Menu>
    </>
  );
};
