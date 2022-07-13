import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export const Config: monaco.languages.LanguageConfiguration = {
  brackets: [
    ['{', '}'],
    ['｛', '｝'],
    ['[', ']'],
    ['［', '］'],
    ['(', ')'],
    ['（', '）'],
    ['「', '」'],
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '｛', close: '｝' },
    { open: '[', close: ']' },
    { open: '［', close: '］' },
    { open: '(', close: ')' },
    { open: '（', close: '）' },
    { open: '「', close: '」' },
    { open: '"', close: '"' },
    { open: '”', close: '”' },
    { open: "'", close: "'" },
    { open: '’', close: '’' },
  ],
  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '「', close: '」' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
  comments: {
    blockComment: ['/*', '*/'],
    lineComment: '//',
  },
};
