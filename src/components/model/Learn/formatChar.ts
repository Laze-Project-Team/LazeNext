export const formatChar = (rawString: string): string => {
  return (
    rawString
      .replace(/[！-～]/g, (str) => {
        // Shift charcode
        // 文字コードをシフト
        return String.fromCharCode(str.charCodeAt(0) - 0xfee0);
      })
      .replace(/”/g, '"')
      .replace(/’/g, "'")
      .replace(/‘/g, '`')
      .replace(/￥/g, '\\')
      // eslint-disable-next-line no-irregular-whitespace
      .replace(/　/g, ' ')
      .replace(/〜/g, '~')
  );
};
