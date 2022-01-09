export type langId = (
  | 'ja' // 日本語
  | 'en'
) & // 英語
  string;

export type lazeConfig = {
  id: string;
  name: Record<langId, string>;
  description: Record<langId, string>;
  dependencies: Record<string, string>;
};
