import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export const lazeDarkTheme: monaco.editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'function', foreground: 'DCDCAA' },
    { token: 'keyword', foreground: '569CD6' },
    { token: 'variable', foreground: '9CDCFE' },
    { token: 'control', foreground: 'C586C0' },
    { token: 'string.invalid', foreground: 'F44747' },
    { token: 'char', foreground: 'CE9178' },
    { token: 'char.invalid', foreground: 'F44747' },
    { token: 'default', foreground: '569CD6' },
    { token: 'class', foreground: '4EC9B0' },
  ],
  colors: {},
};

export const lazeTheme: monaco.editor.IStandaloneThemeData = {
  base: 'vs',
  inherit: true,
  rules: [
    { token: 'function', foreground: '795e26' },
    { token: 'keyword', foreground: '0000FF' },
    { token: 'variable', foreground: '001080' },
    { token: 'control', foreground: 'af00db' },
    { token: 'string.invalid', foreground: 'F44747' },
    { token: 'char', foreground: 'a31515' },
    { token: 'char.invalid', foreground: 'F44747' },
    { token: 'default', foreground: '0000FF' },
    { token: 'class', foreground: '267f99' },
  ],
  colors: {},
};
