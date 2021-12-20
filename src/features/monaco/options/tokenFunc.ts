import { legend } from './keywords';

export const getType = (type: string): number => {
  return legend.tokenTypes.indexOf(type);
};

export const getModifier = (modifiers: string | string[]): number => {
  if (typeof modifiers === 'string') {
    // eslint-disable-next-line no-param-reassign
    modifiers = [modifiers];
  }
  if (Array.isArray(modifiers)) {
    let nModifiers = 0;
    // eslint-disable-next-line no-restricted-syntax
    for (const modifier of modifiers) {
      const nModifier = legend.tokenModifiers.indexOf(modifier);
      if (nModifier > -1) {
        // eslint-disable-next-line no-bitwise
        nModifiers |= (1 << nModifier) >>> 0;
      }
    }

    return nModifiers;
  }

  return 0;
};

export const regexpToString = (regexp: RegExp): string => {
  return /\/(.*)\/[igmsuy]*/.exec(regexp.toString())?.[1] ?? '';
};

export type position = {
  row: number;
  column: number;
};

export const indexToRowColumn = (content: string, i: number): position => {
  return {
    row: content.substring(0, i).split('\n').length - 1,
    column: content.substring(0, i).split('\n').slice(-1)[0].length,
  };
};

export const rowColumnToIndex = (content: string, row: number, column: number): number => {
  return content.split('\n').slice(0, row).join('\n').length + column + 1;
};
