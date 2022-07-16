import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

// eslint-disable-next-line no-irregular-whitespace
export const separator = `()（）[]［］{}｛｝'’"”「」&＆|｜=＝-ー+＋*＊/%％,.:：;； 　`;

const convertTable: [string, string][] = [
  ['(', '（'],
  [')', '）'],
  ['[', '［'],
  [']', '］'],
  ['{', '｛'],
  ['}', '｝'],
  ["'", '’'],
  ['"', '”'],
  ['&', '＆'],
  ['|', '｜'],
  ['=', '＝'],
  ['+', '＋'],
  ['*', '＊'],
  ['/', '／'],
  ['%', '％'],
  [':', '：'],
  [';', '；'],
  [' ', '　'],
];

const getJapaneseCompatibleCompletions = (
  suggestText: string
): monaco.languages.InlineCompletions<monaco.languages.InlineCompletion> => {
  return {
    items: convertTable
      .reduce(
        (acc: string[], [zenkaku, hankaku]) => {
          if (suggestText.includes(zenkaku)) {
            return acc.flatMap((completion: string) => {
              return [completion, completion.replaceAll(zenkaku, hankaku)];
            });
          }
          return acc;
        },
        [suggestText]
      )
      .map((completion: string) => {
        return {
          text: completion,
        };
      }),
  };
};

export const InlineCompletionsProvider: monaco.languages.InlineCompletionsProvider<monaco.languages.InlineCompletions> =
  {
    provideInlineCompletions: (model, position) => {
      const placeholder = window.editorPlaceholders[model.id];

      const suggestText = (() => {
        const line = placeholder.split('\n')[position.lineNumber - 1];

        let currentWord = '';
        if (position.column > 1) {
          for (let j = position.column - 2; j >= 0; j--) {
            const char = line[j];
            if (char === undefined || separator.includes(char)) {
              break;
            }
            currentWord = char + currentWord;
          }
        }
        return currentWord + line.substring(position.column - 1);
      })();

      return getJapaneseCompatibleCompletions(suggestText);
    },
    freeInlineCompletions: () => {
      return void 0;
    },
  };
