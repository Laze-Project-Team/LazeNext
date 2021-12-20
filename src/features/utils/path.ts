export const getName = (path: string): string => {return path.split('/').pop() || ''};

export const getBase = (path: string): string =>
  {return path.split('/').slice(0, -1).join('/') || ''};
