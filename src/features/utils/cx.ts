export const cx = (...classNames: (string | undefined | null | boolean)[]): string => {
  return classNames.filter(Boolean).join(' ');
};
