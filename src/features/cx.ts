export const cx = (...classNames: (string | undefined | null | boolean)[]): string =>
  classNames.filter(Boolean).join(' ');
