import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export const options: monaco.editor.IEditorConstructionOptions = {
  selectOnLineNumbers: true,
  automaticLayout: true,
  autoClosingBrackets: 'always',
  autoClosingOvertype: 'always',
  // 'semanticHighlighting.enabled': true,
  // wordBasedSuggestions: false,
  wordSeparators: `()（）[]［］{}｛｝'’"”「」&＆|｜=＝-ー+＋*＊/%％,.:：;；`,
  fontFamily: "'Consolas', 'Droid Sans Mono', 'Courier New', ui-monospace, 'Droid Sans Fallback'",
};
