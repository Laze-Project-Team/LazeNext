export type completionType = {
  type: string;
  name: string;
  row: number;
  column: number;
  varType?: string;
};

export type completionDataType = {
  index: number;
  type: string;
  name: string;
  varType?: string;
};

export type includeDataType = {
  completionDatas: completionDataType[];
  classes: string[];
};

export type includeType = Record<string, includeDataType>;

export type completions = {
  completions: completionType[];
  includes: includeType;
};

export type contentDataType = {
  index: number;
  length: number;
  type: string;
  modifier: string;
};

export type tokenProviderResult = {
  contentDatas: contentDataType[];
  completionDatas: completionDataType[];
  classes: string[];
};

export type classMemberType = {
  type: string;
  name: string;
  accessType: string;
};
