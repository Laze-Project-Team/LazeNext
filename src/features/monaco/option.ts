import { EditorConstructionOptions } from 'react-monaco-editor';

const options: EditorConstructionOptions = {
  language: 'laze',
  theme: 'laze-theme',
  selectOnLineNumbers: true,
  automaticLayout: true,
  autoClosingBrackets: 'always',
  autoClosingOvertype: 'always',
  'semanticHighlighting.enabled': true,
  wordBasedSuggestions: false,
  wordSeparators: `()（）[]［］{}｛｝'’"”「」&＆|｜=＝-ー+＋*＊/%％,.:：;；`,
  fontFamily:
    "'Consolas', 'Droid Sans Mono', 'Courier New', ui-monospace, 'Droid Sans Fallback'",
};

export default options;
