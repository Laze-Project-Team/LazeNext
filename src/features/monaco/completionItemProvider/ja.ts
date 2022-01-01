import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export const completionItemProvider: monaco.languages.CompletionItemProvider = {
  provideCompletionItems: (model) => {
    const range: monaco.IRange = {
      startColumn: 1,
      startLineNumber: 1,
      endColumn: model.getLineCount(),
      endLineNumber: model.getLineLength(model.getLineCount()),
    };

    const suggestions: monaco.languages.CompletionItem[] = [
      {
        label: '実行',
        insertText: ['関数:実行 () => () {', '\t', '}'].join('\n'),
        documentation: ['メイン実行関数', '', '無：実行() = {', '\t', '}'].join('\n'),
      },
      {
        label: 'もし',
        insertText: ['もし ( ${1:条件} ) ならば {', '\t$0', '}'].join('\n'),
        documentation: ['条件分岐処理', '', 'もし ( 条件 ) ならば {', '\t', '}'].join('\n'),
      },
      {
        label: 'からまで',
        insertText: [
          '(整数：${1:カウンタ} = 0;) から (${1:カウンタ} == ${2:回数}) まで (${1:カウンタ}++;) {',
          '\t$0',
          '}',
        ].join('\n'),
        documentation: [
          '繰り返し処理',
          '',
          '(整数：カウンタ = 0;) から (カウンタ == 回数) まで (カウンタ++;) {',
          '\t',
          '}',
        ].join('\n'),
      },
      {
        label: '回繰り返す',
        insertText: ['(${1:回数}) 回繰り返す {', '\t$0', '}'].join('\n'),
        documentation: ['(回数) 回繰り返す {', '\t$0', '}'].join('\n'),
      },
      {
        label: '関数',
        insertText: ['関数:${1:関数名} (${2:引数}) => (${3:戻り値}) {', '\t$0', '}'].join('\n'),
        documentation: ['関数の宣言', '', '関数:関数名 (引数) => (戻り値) {', '\t', '}'].join('\n'),
      },
      {
        label: 'クラス',
        insertText: [
          'クラス:${1:クラス名} {',
          '\t関数:${1:クラス名} () => () {',
          '\t\t$0',
          '\t}',
          '\t公開:',
          '\t非公開:',
          '}',
        ].join('\n'),
        documentation: [
          'クラス定義',
          '',
          'クラス:クラス名 {',
          '\t関数:クラス名 () => () {',
          '\t\t',
          '\t}',
          '\t公開:',
          '\t非公開:',
          '}',
        ].join('\n'),
      },
    ].map((item) => {
      return {
        range,
        kind: 27,
        insertTextRules: 4,
        ...item,
      };
    });
    return { suggestions };
  },
};
