import { TreeItem, TreeItemIndex } from 'react-complex-tree';
import { directoryType, direntsType } from '@/typings/directory';
import { getDirents } from '@/features/utils/dirents2directory';

type TreeItemType = Record<TreeItemIndex, TreeItem>;

const readDirectory = (dirents: directoryType[], path = ''): TreeItemType => {
  let result: TreeItemType = {};
  for (const dirent of dirents) {
    const currentPath = `${path}/${dirent.name}`;
    result[currentPath] = {
      index: currentPath,
      children: dirent.type === 'folder' ? dirent.children.map((child) => `${currentPath}/${child.name}`) : [],
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
      children: directory.map((dirent) => `/${dirent.name}`),
      data: {},
    },
    ...readDirectory(directory),
  };

  return result;
};
