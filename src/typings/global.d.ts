import type { compilerProps, compilerType } from '@/typings/compiler';

export type lazeObject = {
  compiler: compilerType;
  props: compilerProps;
};

declare global {
  interface Window {
    laze: lazeObject;
  }
  declare module '*.md' {
    const content: string;
    export = content;
  }
}
