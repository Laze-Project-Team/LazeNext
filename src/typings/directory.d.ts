export type direntFileType = 'file' | 'folder';

export type directoryType = {
  type: direntFileType;
  name: string;
  children: directoryType[];
};

export type direntType = {
  type: direntFileType;
  content?: string;
};

export type direntsType = {
  [key: string]: direntType;
};
