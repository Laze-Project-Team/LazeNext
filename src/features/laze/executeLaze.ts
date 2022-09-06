import { executeWasm } from './executeWasm';
import type { Libraries } from './getWasmImports';

export type ExecuteParam = {
  interval: NodeJS.Timer | null;
  id: string;
};

export const executeLaze = (
  wasmUrl: string,
  dependencies: Libraries[],
  param: ExecuteParam,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errorFunc: (reason: any) => void | PromiseLike<void>,
  canvasId = 'output-canvas'
): Promise<void> => {
  return fetch(wasmUrl)
    .then((res) => {
      return res.arrayBuffer();
    })
    .then((wasm) => {
      if (wasm) {
        return executeWasm(wasm, dependencies ?? [], param, canvasId);
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
