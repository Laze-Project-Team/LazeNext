export const getName = (path: string): string => path.split('/').pop() || '';

export const getBase = (path: string): string =>
  path.split('/').slice(0, -1).join('/') || '';
