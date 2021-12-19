export const getHash = (digit: number): string => Math.floor(Math.random() * 36 ** digit).toString(36);
