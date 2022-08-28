import type { Dispatch } from 'redux';

import { getImports } from '@/features/compiler/getImports';
import { initialKeyControl } from '@/features/compiler/keycontrol';
import type { compilerProps, getImportsProps } from '@/typings/compiler';

export const getProps = (dispatcher?: Dispatch, canvasId = 'output-canvas'): compilerProps => {
  const canvas = <HTMLCanvasElement>document.getElementById(canvasId);

  if (!canvas) {
    throw new Error('Canvas not found');
  }

  const gl = canvas.getContext('webgl');

  if (!gl) {
    throw new Error('WebGL not supported');
  }

  const props: getImportsProps = {
    canvas,
    gl,
    webglObjects: {
      webglBuffers: [],
      webglPrograms: [],
      webglTextures: [],
      webglUniformLoc: [],
    },
    variables: {
      memory: new WebAssembly.Memory({ initial: 1000 }),
      memorySize: 0,
      wasm: '',
      id: '',
      lang: 'ja',
      keyControl: initialKeyControl,
      compiled: false,
      interval: null,
      lazeCallNoParam: null,
    },
    arduinoObjects: {
      port: null,
      serialReader: null,
      lastCommand: {
        command: -1,
        data: -1,
      },
      receiveText: '',
      digitalInput: new Array(100).fill(0),
      analogInput: new Array(100).fill(0),
      pulseInput: new Array(100).fill(0),
    },
  };

  return {
    importObject: getImports(props, dispatcher),
    ...props,
  };
};
