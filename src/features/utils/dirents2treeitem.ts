import type { TreeItem, TreeItemIndex } from 'react-complex-tree';

import { getDirents } from '@/features/utils/dirents2directory';
import type { directoryType, direntsType } from '@/typings/directory';

type TreeItemType = Record<TreeItemIndex, TreeItem>;

const readDirectory = (dirents: directoryType[], path = ''): TreeItemType => {
  let result: TreeItemType = {};
  for (let i = 0; i < dirents.length; i++) {
    const dirent = dirents[i];
    const currentPath = `${path}/${dirent.name}`;
    result[currentPath] = {
      index: currentPath,
      children:
        dirent.type === 'folder'
          ? dirent.children.map((child) => {
              return `${currentPath}/${child.name}`;
            })
          : [],
      hasChildren: dirent.type === 'folder',
      canMove: true,
      canRename: true,
      data: {
        name: dirent.name,
        type: dirent.type,
      },
    };

    if (dirent.type === 'folder') {
      result = {
        ...result,
        ...readDirectory(dirent.children, currentPath),
      };
    }
  }

  return result;
};

export const getTreeItems = (dirents: direntsType): TreeItemType => {
  const directory = getDirents(dirents);

  const result: TreeItemType = {
    root: {
      index: 'root',
      children: directory.map((dirent) => {
        return `/${dirent.name}`;
      }),
      data: {},
    },
    ...readDirectory(directory),
  };

  return result;
};
