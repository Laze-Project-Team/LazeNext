import type { Dispatch } from 'redux';

import { getImports } from '@/features/compiler/getImports';
import { initialKeyControl } from '@/features/compiler/keycontrol';
import type { compilerProps, getImportsProps } from '@/typings/compiler';

export const getProps = (dispatcher: Dispatch): compilerProps => {
  const canvas = <HTMLCanvasElement>document.getElementById('output-canvas');

  if (!canvas) {
    throw new Error('Canvas not found');
  }

  const gl = canvas.getContext('webgl2');

  if (!gl) {
    throw new Error('WebGL2 not supported');
  }

  const props: getImportsProps = {
    canvas,
    gl,
    webglObjects: {
      webglBuffers: [],
      webglPrograms: [],
      webglTextures: [],
      webglUniformLoc: [],
      webglShaders: [],
    },
    variables: {
      memory: new WebAssembly.Memory({ initial: 100 }),
      memorySize: 0,
      wasm: '',
      id: '',
      keyControl: initialKeyControl,
      compiled: false,
    },
  };

  return {
    importObject: getImports(dispatcher, props),
    ...props,
  };
};
