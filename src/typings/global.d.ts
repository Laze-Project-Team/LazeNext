import { compilerType, compilerProps } from '@/typings/compiler';

export type lazeObject = {
  compiler: compilerType;
  props: compilerProps;
};

declare global {
  interface Window {
    laze: lazeObject;
  }
}
