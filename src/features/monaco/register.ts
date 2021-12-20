import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

const Language: monaco.languages.ILanguageExtensionPoint = {
  id: 'laze',
  aliases: ['Laze', 'laze'],
  extensions: ['.laze'],
};

// eslint-disable-next-line import/prefer-default-export
export { Language };
