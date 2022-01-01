/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

import { jaKeywordList, legend } from '@/features/monaco/options/keywords';
import { getModifier, getType, indexToRowColumn, regexpToString } from '@/features/monaco/options/tokenFunc';
import { tokenPatternDefine, tokenPatterns, tokens } from '@/features/monaco/options/tokens';

const TokenProvider = (content: string) => {
  const contentDatas: { index: number; length: number; type: string; modifier: string }[] = [];

  const classes = [];

  //#region コメント

  // ラインコメント //
  for (let match = null; (match = tokenPatterns.comment.line.exec(content)); ) {
    content =
      content.substring(0, match.index) + ' '.repeat(match[0].length) + content.substr(match.index + match[0].length);
    contentDatas.push({
      index: match.index,
      length: match[0].length,
      type: 'comment',
      modifier: '',
    });
  }
  // ブロックコメント /* */
  let blockStack: number | null = null;
  for (let match = null; (match = tokenPatterns.comment.block.exec(content)); ) {
    if (match[0] === '/*') {
      // start
      if (blockStack === null) {
        blockStack = match.index;
      }
    } else {
      // end
      if (blockStack !== null) {
        const inComment = content.substring(blockStack, match.index + 2).replace(/[^\n]/g, ' ');
        content = content.substring(0, blockStack) + inComment + content.substr(match.index + 2);
        let indexOffset = blockStack;
        const lines = inComment.split('\n');
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          contentDatas.push({
            index: indexOffset,
            length: line.length,
            type: 'comment',
            modifier: '',
          });
          indexOffset += line.length + 1;
        }
        blockStack = null;
      }
    }
  }

  //#endregion

  //#region 文字列

  // 文字 ''
  for (let match = null; (match = tokenPatterns.string.char.exec(content)); ) {
    const inComment = content.substring(match.index, match.index + match[0].length).replace(/[^\n]/g, ' ');
    content = content.substring(0, match.index) + inComment + content.substr(match.index + match[0].length);
    contentDatas.push({
      index: match.index,
      length: match[0].length,
      type: 'char',
      modifier: '',
    });
  }
  // 文字片方 ''
  for (let match = null; (match = tokenPatterns.string.charInvalid.exec(content)); ) {
    const inComment = content.substring(match.index, match.index + match[0].length).replace(/[^\n]/g, ' ');
    content = content.substring(0, match.index) + inComment + content.substr(match.index + match[0].length);
    contentDatas.push({
      index: match.index,
      length: match[0].length,
      type: 'char',
      modifier: 'invalid',
    });
  }
  // 文字列 ""
  let stringStack: number | null = null;
  for (let match = null; (match = tokenPatterns.string.string.exec(content)); ) {
    if (stringStack !== null) {
      const inString = content.substring(stringStack, match.index + 1).replace(/[^\n]/g, ' ');
      content = content.substring(0, stringStack) + inString + content.substr(match.index + 1);
      let indexOffset = stringStack;
      const lines = inString.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        contentDatas.push({
          index: indexOffset,
          length: line.length,
          type: 'string',
          modifier: '',
        });
        indexOffset += line.length + 1;
      }
      stringStack = null;
    } else {
      stringStack = match.index;
    }
  }
  // 文字列片方
  if (stringStack !== null) {
    const lineEnd = content.substr(stringStack).indexOf('\n');
    const inString = content.substring(stringStack, stringStack + lineEnd).replace(/[^\n]/g, ' ');
    content = content.substring(0, stringStack) + inString + content.substr(stringStack + lineEnd);
    contentDatas.push({
      index: stringStack,
      length: lineEnd,
      type: 'string',
      modifier: 'invalid',
    });
  }
  // 文字列「」
  let japaneseStack: number | null = null;
  for (let match = null; (match = tokenPatterns.string.japanese.exec(content)); ) {
    if (match[0] === '「') {
      if (japaneseStack === null) {
        japaneseStack = match.index;
      }
    } else {
      if (japaneseStack !== null) {
        const inString = content.substring(japaneseStack, match.index + 1).replace(/[^\n]/g, ' ');
        content = content.substring(0, japaneseStack) + inString + content.substr(match.index + 1);
        let indexOffset = japaneseStack;
        const lines = inString.split('\n');
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          contentDatas.push({
            index: indexOffset,
            length: line.length,
            type: 'string',
            modifier: '',
          });
          indexOffset += line.length + 1;
        }
        japaneseStack = null;
      }
    }
  }
  // 文字列片方 「」
  if (japaneseStack !== null) {
    const lineEnd = content.substr(japaneseStack).indexOf('\n');
    const inString = content.substring(japaneseStack, japaneseStack + lineEnd).replace(/[^\n]/g, ' ');
    content = content.substring(0, japaneseStack) + inString + content.substr(japaneseStack + lineEnd);
    contentDatas.push({
      index: japaneseStack,
      length: lineEnd,
      type: 'string',
      modifier: 'invalid',
    });
  }

  //#endregion

  //#region 括弧

  // Bracket Colorize
  let stackNest = 0;
  for (let match = null; (match = tokenPatterns.bracketsAll.exec(content)); ) {
    if (!'{｛(（[［'.includes(match[0])) stackNest--;
    contentDatas.push({
      index: match.index,
      length: match[0].length,
      type: `scope${stackNest % 3}`,
      modifier: '{｛'.includes(match[0]) ? 'start' : 'end',
    });
    if ('{｛(（[［'.includes(match[0])) stackNest++;
  }

  //#endregion

  // テンプレート（宣言）
  for (let match = null; (match = tokenPatterns.template.exec(content)); ) {
    contentDatas.push({
      index: match.index + match[0].indexOf(match[1]) + match[1].indexOf(match[2]),
      length: match[2].length,
      type: 'class',
      modifier: '',
    });

    classes.push(match[2]);
  }

  // クラス（宣言）
  for (let match = null; (match = tokenPatterns.class.exec(content)); ) {
    contentDatas.push({
      index: match.index + match[0].length - match[1].length,
      length: match[1].length,
      type: 'class',
      modifier: '',
    });

    classes.push(match[1]);
  }

  // typeKeywordsにclassを追加
  const tokenPatternDefineEdit = tokenPatternDefine;
  tokenPatternDefineEdit.typesWithClass = tokenPatternDefine.types.replace(
    tokens.typeKeywords!.join('|') + ')',
    tokens.typeKeywords!.concat(classes).join('|') + ')'
  );
  const tokenPatternsEdit = tokenPatterns;
  tokenPatternsEdit.typesWithClass = new RegExp(
    regexpToString(tokenPatterns.types).replace(
      tokens.typeKeywords!.join('|') + ')',
      tokens.typeKeywords!.concat(classes).join('|') + ')'
    ),
    'g'
  );
  tokenPatternsEdit.functionWithClass = new RegExp(
    regexpToString(tokenPatterns.function).replace(
      tokens.typeKeywords!.join('|') + ')',
      tokens.typeKeywords!.concat(classes).join('|') + ')'
    ),
    'g'
  );

  // テンプレート（呼び出し）
  const templateCall = new RegExp(
    `(${classes.join('|')})\\s*([<＜]\\s*(${tokens.typeKeywords!.concat(classes).join('|')})\\s*[>＞])\\s*${
      tokens.colon
    }\\s*(${tokenPatternDefine.name})`,
    'g'
  );
  for (let match = null; (match = templateCall.exec(content)); ) {
    contentDatas.push({
      index: match.index,
      length: match[1].length,
      type: 'class',
      modifier: '',
    });
    contentDatas.push({
      index: match.index + match[0].indexOf(match[2]) + match[2].indexOf(match[3]),
      length: match[3].length,
      type: 'type',
      modifier: '',
    });
    contentDatas.push({
      index: match.index + match[0].length - match[4].length,
      length: match[4].length,
      type: 'variable',
      modifier: '',
    });
  }

  // キーワード
  for (let match = null; (match = tokenPatterns.keyword.exec(content)); ) {
    if (tokens.control!.includes(match[0])) {
      contentDatas.push({
        index: match.index,
        length: match[0].length,
        type: 'control',
        modifier: '',
      });
    } else if (tokens.keywords!.includes(match[0]))
      contentDatas.push({
        index: match.index,
        length: match[0].length,
        type: 'keyword',
        modifier: '',
      });
  }
  // 関数（宣言・呼び出し）
  const functions: string[] = [];
  for (let match = null; (match = tokenPatterns.functionWithClass.exec(content)); ) {
    if (match[1]) continue;
    if (!tokens.control!.includes(match[3])) {
      if (tokens.functions!.includes(match[3]))
        contentDatas.push({
          index: match.index + (match[2]?.length || 0),
          length: match[3].length,
          type: 'default',
          modifier: '',
        });
      else {
        contentDatas.push({
          index: match.index + (match[2]?.length || 0),
          length: match[3].length,
          type: 'function',
          modifier: match[2] ? 'declaration' : '',
        });
      }
    }
    if (match[2]) {
      functions.push(match[3]);
    }
  }

  // 変数
  for (let match = null; (match = tokenPatterns.variable.exec(content)); ) {
    const name = match[4] || match[3];
    if (!tokens.control!.concat(tokens.keywords!, tokens.typeKeywords!, classes).includes(name)) {
      // 呼び出し
      if (match[4]) {
        contentDatas.push({
          index: match.index + match[0].length - name.length,
          length: name.length,
          type: functions.includes(name) ? 'function' : 'variable',
          modifier: '',
        });
      }
      // 宣言
      else {
        const type = match[1].match(/([^\s<>]+)(?:<[^\s<>]>)?\s*[:：]\s*/)![1];
        if (type !== jaKeywordList.keywords.function) {
          contentDatas.push({
            index: match.index + match[0].length - name.length,
            length: name.length,
            type: 'variable',
            modifier: 'declaration',
          });
        }
      }
    }
  }
  // 型
  for (let match = null; (match = tokenPatterns.typesWithClass.exec(content)); ) {
    contentDatas.push({
      index: match.index,
      length: match[1].length,
      type: 'type',
      modifier: '',
    });
  }
  // 数（BIN・DEC・HEX）
  for (let match = null; (match = tokenPatterns.number.exec(content)); ) {
    contentDatas.push({
      index: match.index + 1,
      length: match[1].length,
      type: 'number',
      modifier: match[1].startsWith('0b') ? 'bin' : match[1].startsWith('0x') ? 'hex' : 'dec',
    });
  }
  // オペレーター
  for (let match = null; (match = tokenPatterns.operator.exec(content)); ) {
    contentDatas.push({
      index: match.index,
      length: match[0].length,
      type: 'operator',
      modifier: '',
    });
  }

  return {
    contentDatas,
    classes,
  };
};

export const semanticTokenProvider: monaco.languages.DocumentSemanticTokensProvider = {
  getLegend: () => {
    return legend;
  },
  provideDocumentSemanticTokens: (model: monaco.editor.IModel) => {
    const content = model.getValue();

    const data: number[] = [];

    let prevLine = 0;
    let prevChar = 0;

    const { contentDatas } = TokenProvider(content);

    // トークン
    contentDatas.sort((a, b) => {
      return a.index - b.index;
    });
    contentDatas.forEach((contentData) => {
      const { row, column } = indexToRowColumn(content, contentData.index);
      data.push(
        row - prevLine,
        prevLine === row ? column - prevChar : column,
        contentData.length,
        getType(contentData.type),
        contentData.modifier ? getModifier(contentData.modifier) : 0
      );
      prevLine = row;
      prevChar = column;
    });

    return {
      data: new Uint32Array(data),
      resultId: undefined,
    };
  },
  releaseDocumentSemanticTokens: () => {
    return undefined;
  },
};
