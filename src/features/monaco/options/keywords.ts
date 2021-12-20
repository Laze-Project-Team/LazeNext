export type keywordType = {
  keywords: {
    true: string;
    false: string;
    function: string;
    class: string;
    template: string;
  };
  functions: {
    loadJS: string;
    writeJS: string;
    sizeof: string;
  };
  control: {
    end: string;
    if: string;
    then: string;
    else: string;
    from: string;
    until: string;
    break: string;
    continue: string;
    repeat: string;
    loop: string;
    include: string;
    private: string;
    public: string;
  };
  typeKeywords: {
    void: string;
    boolean: string;
    int32: string;
    int64: string;
    double: string;
    char: string;
    string: string;
  };
};

const jaKeywordList: keywordType = {
  keywords: {
    true: '真',
    false: '偽',
    function: '関数',
    class: 'クラス',
    template: '型',
  },
  functions: {
    loadJS: 'js読み込み',
    writeJS: 'js書き出し',
    sizeof: 'バイト数',
  },
  control: {
    end: '終了',
    if: 'もし',
    then: 'ならば',
    else: 'でなければ',
    from: 'から',
    until: 'まで',
    break: '抜ける',
    continue: '次へ',
    repeat: '回繰り返す',
    loop: '無限ループ',
    include: '#include',
    private: '非公開',
    public: '公開',
  },
  typeKeywords: {
    void: '無',
    boolean: '真偽',
    int32: '整数32',
    int64: '整数',
    double: '実数',
    char: '文字',
    string: '文字列',
  },
};

const legend = {
  tokenTypes: [
    'comment',
    'string',
    'keyword',
    'number',
    'regexp',
    'operator',
    'namespace',
    'type',
    'struct',
    'class',
    'interface',
    'enum',
    'typeParameter',
    'function',
    'member',
    'macro',
    'variable',
    'parameter',
    'property',
    'label',
    'control',
    'scope0',
    'scope1',
    'scope2',
    'bracket',
    'char',
    'default',
  ],
  tokenModifiers: [
    'declaration',
    'documentation',
    'readonly',
    'static',
    'abstract',
    'deprecated',
    'modification',
    'async',
    'dec',
    'hex',
    'bin',
    'start',
    'end',
    'invalid',
  ],
};

export { jaKeywordList, legend };
