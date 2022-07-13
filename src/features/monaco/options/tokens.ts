import { jaKeywordList } from './keywords';

const tokens = (() => {
  const result: {
    [key: string]: string | string[] | undefined;
    colon: string;
    number: string;
    char: string;
    charnum: string;
    separators: string;
    operator: string;
    typeKeywords?: string[];
    keywords?: string[];
    functions?: string[];
    control?: string[];
  } = {
    colon: '[:：]',
    binnumber: '[0-1]',
    hexnumber: '[0-9a-fA-F]',
    number: '[0-9]',
    char: '㐀-龯ぁ-んァ-ヶa-zA-Zー#＃_＿',
    charnum: '㐀-龯ぁ-んァ-ヶa-zA-Z0-9ー#＃_＿',
    separators:
      '~!@\\$%\\^&\\*\\(\\)\\-\\=\\+\\[\\{\\]\\}\\|;\\:\'\\",\\.\\<\\>/\\?＆＊（）＝＋［｛］｝：’”、。＞\\s\\t',
    operator:
      '＝|=|＋＝|＋=|\\+＝|\\+=|-＝|-=|＊＝|＊=|\\*＝|\\*=|/＝|/=|＞\\＞|\\>|＞＝|＞=|\\<＝|\\<=|＞＝|＞=|>＝|>=|＝＝|＝=|=＝|==|＆＆|＆&|&＆|&&|\\|\\||＋＋|＋\\+|\\+＋|\\+\\+|--',
  };
  Object.keys(jaKeywordList).forEach((key) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    result[key] = Object.values(jaKeywordList[key]);
  });

  return result;
})();

if (!tokens.typeKeywords) {
  throw new Error('typeKeywords is not defined');
}

const tokenPatternDefine = {
  types: `((?:${tokens.typeKeywords.join('|')})\\s*${tokens.colon}\\s*)`,
  typesWithClass: '',
  name: `[${tokens.char}][${tokens.charnum}]*`,
  separator: `(?:[${tokens.separators}]|^)`,
};
const tokenPatterns = {
  function: new RegExp(
    `${tokenPatternDefine.types}?(${jaKeywordList.keywords.function}\\s*${tokens.colon}\\s*)?(${tokenPatternDefine.name})(?=\\s*[\\(（])`,
    'g'
  ),
  functionWithClass: new RegExp(''),
  template: new RegExp(
    `${jaKeywordList.keywords.template}\\s*([<＜]\\s*(${tokenPatternDefine.name})\\s*[>＞])\\s*${tokens.colon}`,
    'g'
  ),
  class: new RegExp(`${jaKeywordList.keywords.class}\\s*${tokens.colon}\\s*(${tokenPatternDefine.name})`, 'g'),
  keyword: new RegExp(`[${tokens.char}][${tokens.charnum}]*`, 'g'),
  types: new RegExp(`(${tokens.typeKeywords.join('|')})\\s*(?=${tokens.colon})`, 'g'),
  typesWithClass: new RegExp(''),
  variable: new RegExp(
    `(${tokenPatternDefine.separator}
			(
				${tokenPatternDefine.name}\\s*${tokens.colon}\\s*
			)
			(
				${tokenPatternDefine.name}) | (?:[${tokens.separators.replace('\\:', '')}] | ^
			)
			(
				${tokenPatternDefine.name}
			)
			(?=
				\\s+[^\\(\\{（｛\\s\\:：\\.] | [^${tokens.charnum}\\(\\{（｛\\s\\:]|\\s*$
			)
		)`.replace(/\s/g, ''),
    'g'
  ),
  variableWithClass: new RegExp(''),
  number: new RegExp(
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    `${tokenPatternDefine.separator}(0b${tokens.binnumber}+|0x${tokens.hexnumber}+|${tokens.number}(?:${tokens.number}|\\.${tokens.number})*)`,
    'g'
  ),
  operator: new RegExp(`(${tokens.operator})`, 'g'),
  scope: new RegExp('[\\{\\}｛｝]', 'g'),
  bracketsAll: new RegExp('[\\{\\}｛｝\\(\\)（）\\[\\]［］]', 'g'),
  brackets: new RegExp('[\\(\\)（）]', 'g'),
  syntax: {
    function: new RegExp('[\\(（](.*)[\\)）](\\s*\\=\\>\\s*)[\\(（](.*?)[\\)）](\\s*[\\=＝].*?(?:;|$))?'),
    for: new RegExp(
      `[\\(（](.*)[）\\)](\\s*${jaKeywordList.control.from}\\s*)[\\(（](.*)[）\\)](\\s*${jaKeywordList.control.until}\\s*)[\\(（](.*)[）\\)](?:\\s*[{｛}])`,
      'g'
    ),
    repeat: new RegExp(`${jaKeywordList.control.repeat}`, 'g'),
    include: new RegExp(`(${jaKeywordList.control.include})\\s+(?:"([^"]*)"|「([^」]*)」)`, 'g'),
  },
  comment: {
    line: new RegExp('\\/\\/.*', 'g'),
    block: new RegExp('/\\*|\\*/', 'g'),
  },
  string: {
    char: new RegExp("[\\'’].*[\\'’]", 'g'),
    charInvalid: new RegExp("[\\'’][^\\'’]*?\\n", 'g'),
    string: new RegExp('[\\"”]', 'g'),
    japanese: new RegExp('[「」]', 'g'),
  },
};

export { tokenPatternDefine, tokenPatterns, tokens };
