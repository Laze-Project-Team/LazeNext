import type { TFunction } from 'next-i18next';
import type { Dispatch } from 'redux';

import type { LinetraceData } from './dependencies/linetrace';
import { executeWasm } from './executeWasm';
import type { Libraries } from './getWasmImports';

export type ExecuteParam = {
  interval: NodeJS.Timer | null;
  id: string;
  getWasmApi: string;
  wasmUrl: string;
  programUrl: string;
  lang: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: (err: any) => void | PromiseLike<void>;
  compileError: () => void | PromiseLike<void>;
  linetraceTime?: LinetraceData | undefined;
  levelNow?: string;
  dispatcher?: Dispatch;
  t?: TFunction;
  canvasId?: string;
};

export const executeLaze = (wasmUrl: string, dependencies: Libraries[], param: ExecuteParam): Promise<void> => {
  return fetch(wasmUrl)
    .then((res) => {
      return res.arrayBuffer();
    })
    .then((wasm) => {
      if (wasm) {
        return executeWasm(wasm, dependencies ?? [], param);
      } else {
        return null;
      }
    })
    .then((draw) => {
      if (draw) {
        param.interval = setInterval(draw, 1000 / 60);
      }
    })
    .catch(param.error);
};
