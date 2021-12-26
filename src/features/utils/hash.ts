export const getHash = (digit: number): string => {
  return Math.floor(Math.random() * 36 ** digit).toString(36);
};
