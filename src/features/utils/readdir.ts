import fs from 'fs';
import path from 'path';

type direntType = {
  type: string;
  content: string;
};

export const readDirRecursively = async (dir: string, relativePath = '/'): Promise<Record<string, direntType>> => {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
  const contents = await Promise.all(
    dirents.map(async (dirent) => {
      const fullPath = path.join(dir, dirent.name);
      if (dirent.isDirectory()) {
        return {
          ...readDirRecursively(fullPath, relativePath + dirent.name + '/'),
          [relativePath + dirent.name]: { type: 'folder' },
        };
      }
      const content = await fs.promises.readFile(fullPath, 'utf8');
      return { [relativePath + dirent.name]: { type: 'file', content } };
    })
  );
  return contents.reduce((acc, curr) => {
    return { ...acc, ...curr };
  });
};
