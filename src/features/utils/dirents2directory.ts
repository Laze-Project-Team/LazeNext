import { directoryType, direntsType } from '@/typings/directory';

const sortByName = (a: directoryType, b: directoryType): number => {
  if (a.type === b.type) {
    return a.name.localeCompare(b.name);
  }

  return a.type === 'folder' ? -1 : 1;
};

const recursiveSort = (sortDirents: directoryType[]) => {
  for (const dirent of sortDirents) {
    if (dirent.type === 'folder') {
      recursiveSort(dirent.children);
    }
  }
  sortDirents.sort(sortByName);
};

export const getDirents = (srcDirents: direntsType): directoryType[] => {
  const result: directoryType[] = [];
  for (const key of Object.keys(srcDirents)) {
    let draftDirectory = result;
    for (const dir of key.split('/').slice(1, -1)) {
      if (draftDirectory.filter((dirent) => dirent.name === dir).length === 0) {
        draftDirectory.push({
          name: dir,
          type: 'folder',
          children: [],
        });
      }
      draftDirectory = draftDirectory.filter((dirent) => dirent.name === dir)[0].children;
    }
    draftDirectory.push({
      name: key.split('/').slice(-1)[0],
      type: srcDirents[key].type,
      children: [],
    });
  }

  recursiveSort(result);

  return result;
};
