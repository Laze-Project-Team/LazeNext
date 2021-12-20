import type { directoryType, direntsType } from '@/typings/directory';

const sortByName = (a: directoryType, b: directoryType): number => {
  if (a.type === b.type) {
    return a.name.localeCompare(b.name);
  }

  return a.type === 'folder' ? -1 : 1;
};

const recursiveSort = (sortDirents: directoryType[]) => {
  for (let i = 0; i < sortDirents.length; i++) {
    const dirent = sortDirents[i];
    if (dirent.type === 'folder') {
      recursiveSort(dirent.children);
    }
  }
  sortDirents.sort(sortByName);
};

export const getDirents = (srcDirents: direntsType): directoryType[] => {
  const result: directoryType[] = [];
  for (let i = 0; i < Object.keys(srcDirents).length; i++) {
    const key = Object.keys(srcDirents)[i];
    let draftDirectory = result;
    for (let i = 0; key.split('/').slice(1, -1).length > i; i++) {
      const dir = key.split('/').slice(1, -1)[i];
      if (
        draftDirectory.filter((dirent) => {
          return dirent.name === dir;
        }).length === 0
      ) {
        draftDirectory.push({
          name: dir,
          type: 'folder',
          children: [],
        });
      }
      draftDirectory = draftDirectory.filter((dirent) => {
        return dirent.name === dir;
      })[0].children;
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
