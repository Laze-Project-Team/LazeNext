export const filterNull = <T>(arg: T[]): Exclude<T, null | undefined>[] => {
  return arg.filter((val) => {
    return val !== null && val !== undefined;
  }) as Exclude<T, null | undefined>[];
};
