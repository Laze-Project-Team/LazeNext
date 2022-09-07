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
  linetraceTime?: LinetraceData | undefined;
  dispatcher?: Dispatch;
  canvasId?: string;
};

export const executeLaze = (
  wasmUrl: string,
  dependencies: Libraries[],
  param: ExecuteParam,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errorFunc: (reason: any) => void | PromiseLike<void>
): Promise<void> => {
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
    .catch(errorFunc);
};
