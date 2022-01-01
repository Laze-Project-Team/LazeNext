import type * as monaco from 'monaco-editor';

import { jaKeywordList } from '@/features/monaco/options/keywords';

const char = '[㐀-龯ぁ-んァ-ヶa-zA-Zー#＃_＿]';
const charnum = '[㐀-龯ぁ-んァ-ヶa-zA-Zー#＃_＿0-9]';

const separator = `(?:(?<!${charnum}) | (?!${charnum}))`;
const name = `${char}${charnum}*?`;

console.log(
  `${separator}
  (?:
    ${(() => {
      const func = jaKeywordList.keywords.function;
      return func
        .split('')
        .map((_, i) => {
          return `(?!${func.slice(0, i + 1)})`;
        })
        .join('');
    })()}
  )
  (?:
    (${name})
    (\\s*[:：]\\s*)
  )
  ( ${name} )
  `.replace(/\s/g, '')
);

export const tokenProvider: monaco.languages.IMonarchLanguage = {
  controls: Object.values(jaKeywordList.control),
  defaultFunction: Object.values(jaKeywordList.functions),
  keywords: Object.values(jaKeywordList.keywords),
  typeKeywords: Object.values(jaKeywordList.typeKeywords),

  tokenizer: {
    root: [
      // キーワード(識別子)
      [
        new RegExp(`${separator}${char}${charnum}`),
        { cases: { '@controls': 'control', '@keywords': 'keyword', '@default': 'identifier' } },
      ],

      // 変数宣言
      [
        new RegExp(
          `${separator}
          (?:
            ${(() => {
              const func = jaKeywordList.keywords.function;
              return func
                .split('')
                .map((_, i) => {
                  return `(?!${func.slice(0, i + 1)})`;
                })
                .join('');
            })()}
          )
          (?:
            (${name})
            (\\s*[:：]\\s*)
          )
          ( ${name} )
          `.replace(/\s/g, '')
        ),
        ['separator', 'type', 'space', 'variable'],
      ],

      // 関数宣言
      [new RegExp(`${separator}${jaKeywordList.keywords.function}\\s*[:：]\\s*${name}`), 'function.declaration'],
      // 関数呼び出し
      [new RegExp(`${separator}${name}\\s*[(（]`), 'function'],

      // whitespace
      { include: '@whitespace' },

      // numbers
      [/\d*\.\d/, 'number.float'],
      [/0[xX][0-9a-fA-F]+/, 'number.hex'],
      [/\d+/, 'number'],

      // strings
      [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-teminated string
      [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],

      // characters
      [/'([^']|\\')*'/, 'string'],
      [/'/, 'string.invalid'],
    ],

    comment: [
      [/[^/*]+/, 'comment'],
      [/\/\*/, 'comment', '@push'],
      ['\\*/', 'comment', '@pop'],
      [/[/*]/, 'comment'],
    ],

    string: [
      [/[^\\"]+/, 'string'],
      [/\\./, 'string.escape'],
      [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
    ],

    whitespace: [
      [/[ \t\r\n]+/, 'white'],
      [/\/\*/, 'comment', '@comment'],
      [/\/\/.*$/, 'comment'],
    ],
  },
};
