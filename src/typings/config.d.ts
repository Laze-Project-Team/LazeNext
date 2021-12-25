export type langId = (
  | 'ja' // 日本語
  | 'en' // 英語
  | 'de' // ドイツ語
  | 'ru' // ロシア語
  | 'pt' // ポルトガル語
  | 'nl' // オランダ語
  | 'fr' // フランス語
  | 'it' // イタリア語
  | 'es' // スペイン語
  | 'pl' // ポーランド語
  | 'zh-cn'
) & // 中国語
  string;

export type lazeConfig = {
  id: string;
  name: Record<langId, string>;
  description: Record<langId, string>;
  dependencies: Record<string, string>;
};
