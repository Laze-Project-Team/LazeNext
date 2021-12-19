export type ContextMenuItem = {
  name: string;
  callback: (path: string) => void;
  separator?: false;
};

export type ContextMenuSeparator = {
  name: string;
  separator: true;
};

export type ContextMenuItems = (ContextMenuItem | ContextMenuSeparator)[];
