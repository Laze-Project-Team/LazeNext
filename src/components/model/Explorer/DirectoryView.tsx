import type { VFC } from 'react';
import { useEffect, useRef, useState } from 'react';
import type { TreeEnvironmentRef, TreeItem, TreeItemIndex, TreeRef } from 'react-complex-tree';
import { ControlledTreeEnvironment, Tree } from 'react-complex-tree';
import { VscChevronDown, VscChevronRight } from 'react-icons/vsc';
import { connect, useDispatch } from 'react-redux';

import { ContextMenuTrigger } from '@/components/model/Explorer/ContextMenu/ContextMenuTrigger';
import { FileContextMenu } from '@/components/model/Explorer/ContextMenu/FileContextMenu';
import { FolderContextMenu } from '@/components/model/Explorer/ContextMenu/FolderContextMenu';
import { RootContextMenu } from '@/components/model/Explorer/ContextMenu/RootContextMenu';
import { RenameInput } from '@/components/model/Explorer/RenameInput';
import type { ExplorerState } from '@/features/redux/explorer';
import { explorerSlice } from '@/features/redux/explorer';
import type { RootState } from '@/features/redux/root';
import { cx } from '@/features/utils/cx';
import { getTreeItems } from '@/features/utils/dirents2treeitem';
import { getBase, getName } from '@/features/utils/path';

type DirectoryViewProps = {
  directory: Record<TreeItemIndex, TreeItem>;
  directoryState: ExplorerState['directory'];
};

const UnconnectedDirectoryView: VFC<DirectoryViewProps> = ({ directory, directoryState }) => {
  const [focusedItem, setFocusedItem] = useState<TreeItemIndex>();
  const [expandedItems, setExpandedItems] = useState<TreeItemIndex[]>([]);
  const [selectedItems, setSelectedItems] = useState<TreeItemIndex[]>([]);
  const [isRename, setIsRename] = useState(false);

  const environmentRef = useRef<TreeEnvironmentRef>(null);
  const treeRef = useRef<TreeRef>(null);

  const dispatcher = useDispatch();
  const { openFile, renameDirent, startRenaming, stopRenaming } = explorerSlice.actions;

  useEffect(() => {
    for (let i = 0; i < Object.keys(directoryState).length; i++) {
      const path = Object.keys(directoryState)[i];
      if (directoryState[path].isRenaming) {
        treeRef.current?.startRenamingItem(path);
        dispatcher(startRenaming({ path }));
        setFocusedItem(path);
        setIsRename(true);

        const parent = getBase(path);
        if (parent.length > 0 && !expandedItems.includes(parent)) {
          setExpandedItems([...expandedItems, parent]);
        }
      }
    }
  }, [directory, directoryState, dispatcher, expandedItems, startRenaming]);

  return (
    <>
      {typeof window !== 'undefined' && (
        <div className={cx(isRename && 'dark:bg-gray-300/[0.02]', 'h-full bg-[#f3f3f3] dark:bg-background')}>
          <RootContextMenu />
          <FileContextMenu />
          <FolderContextMenu />

          <ContextMenuTrigger id="explorer-root" path="/" className="h-full">
            <ControlledTreeEnvironment
              ref={environmentRef}
              items={directory}
              getItemTitle={(item) => {
                return item.data.name;
              }}
              viewState={{
                'directory-view': {
                  focusedItem,
                  expandedItems,
                  selectedItems,
                },
              }}
              canDragAndDrop
              canDropOnItemWithChildren
              canDropOnItemWithoutChildren
              canRename
              canReorderItems={false}
              canSearch={false}
              renderItemArrow={(item) => {
                return (
                  <div className="inline-block h-4 w-4">
                    {item.item.data.type === 'folder' &&
                      (item.context.isExpanded ? <VscChevronDown size={16} /> : <VscChevronRight size={16} />)}
                  </div>
                );
              }}
              renderRenameInput={({ inputRef, item }) => {
                return <RenameInput inputRef={inputRef} item={item} />;
              }}
              renderItem={({ item, depth, children, title, context, arrow, info }) => {
                const InteractiveComponent = context.isRenaming ? 'div' : 'button';

                return (
                  <li
                    {...context.itemContainerWithChildrenProps}
                    className={cx(
                      'rct-tree-item-li',
                      item.hasChildren && 'rct-tree-item-li-hasChildren',
                      context.isSelected && 'rct-tree-item-li-selected',
                      context.isExpanded && 'rct-tree-item-li-expanded',
                      context.isFocused && 'rct-tree-item-li-focused',
                      context.isDraggingOver && 'rct-tree-item-li-dragging-over',
                      context.isSearchMatching && 'rct-tree-item-li-search-match',
                      context.isFocused && 'z-10'
                    )}
                  >
                    <div
                      {...context.itemContainerWithoutChildrenProps}
                      style={{
                        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                        paddingLeft: `${(depth + 1) * 10}px`,
                      }}
                      className={cx(
                        'rct-tree-item-title-container',
                        item.hasChildren && 'rct-tree-item-title-container-hasChildren',
                        context.isSelected && 'rct-tree-item-title-container-selected',
                        context.isExpanded && 'rct-tree-item-title-container-expanded',
                        context.isFocused && 'rct-tree-item-title-container-focused',
                        context.isDraggingOver && 'rct-tree-item-title-container-dragging-over',
                        context.isSearchMatching && 'rct-tree-item-title-container-search-match',
                        info.isRenaming && !context.isRenaming && 'opacity-30 dark:bg-gray-300/10 dark:opacity-20',
                        'hover:bg-gray-300/10 dark:hover:bg-gray-300/5'
                      )}
                    >
                      {arrow}
                      <ContextMenuTrigger
                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                        id={`explorer-${item.data.type}`}
                        path={item.index as string}
                        className="flex-1"
                      >
                        <InteractiveComponent
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          {...(context.interactiveElementProps as unknown)}
                          className={cx(
                            'min-w-0',
                            'rct-tree-item-button',
                            item.hasChildren && 'rct-tree-item-button-hasChildren',
                            context.isSelected && 'rct-tree-item-button-selected',
                            context.isExpanded && 'rct-tree-item-button-expanded',
                            context.isFocused && 'rct-tree-item-button-focused',
                            context.isDraggingOver && 'rct-tree-item-button-dragging-over',
                            context.isSearchMatching && 'rct-tree-item-button-search-match'
                          )}
                        >
                          <div className="overflow-hidden overflow-ellipsis whitespace-nowrap">{title}</div>
                        </InteractiveComponent>
                      </ContextMenuTrigger>
                    </div>
                    {children}
                  </li>
                );
              }}
              autoFocus={false}
              onFocusItem={(item) => {
                return setFocusedItem(item.index);
              }}
              onExpandItem={(item) => {
                return setExpandedItems([...expandedItems, item.index]);
              }}
              onCollapseItem={(item) => {
                return setExpandedItems(
                  expandedItems.filter((expandedItemIndex) => {
                    return expandedItemIndex !== item.index;
                  })
                );
              }}
              onPrimaryAction={(item) => {
                return item.data.type === 'file' && dispatcher(openFile({ path: item.index as string }));
              }}
              onDrop={(items, targetItem) => {
                const targetBase = targetItem.targetType === 'item' ? targetItem.targetItem : targetItem.parentItem;

                for (let i = 0; i < items.length; i++) {
                  const payload = {
                    oldPath: items[i].index as string,
                    newPath: [targetBase, '/', getName(items[i].index as string)].join(''),
                  };

                  dispatcher(renameDirent(payload));
                }
              }}
              onRenameItem={(item, newName) => {
                const index = item.index as string;
                dispatcher(
                  renameDirent({
                    oldPath: index,
                    newPath: `${getBase(index)}/${newName}`,
                  })
                );
                setIsRename(false);
              }}
              onStartRenamingItem={(item) => {
                dispatcher(startRenaming({ path: item.index as string }));
                setFocusedItem(undefined);
                setIsRename(true);
              }}
              onAbortRenamingItem={(item) => {
                dispatcher(stopRenaming({ path: item.index as string }));
                setIsRename(false);
              }}
              onSelectItems={(items) => {
                const selectItem = items.filter((item) => {
                  return !selectedItems.includes(item) || directory[item]?.data.type === 'folder';
                });
                setSelectedItems(selectItem);
              }}
              keyboardBindings={{
                expandSiblings: [],
                moveFocusToFirstItem: [],
                moveFocusToLastItem: [],
                primaryAction: [],
                renameItem: [],
                abortRenameItem: [],
                toggleSelectItem: [],
                abortSearch: [],
                startSearch: [],
                selectAll: [],
                startProgrammaticDnd: [],
                completeProgrammaticDnd: [],
                abortProgrammaticDnd: [],
              }}
              showLiveDescription={false}
            >
              <Tree ref={treeRef} treeId="directory-view" rootItem="root" treeLabel="Directory View" />
            </ControlledTreeEnvironment>
          </ContextMenuTrigger>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    directory: getTreeItems(state.explorer.directory),
    directoryState: state.explorer.directory,
  };
};

export const DirectoryView = connect(mapStateToProps)(UnconnectedDirectoryView);
