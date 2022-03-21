import type { Dispatch } from 'redux';

import { getImports } from '@/features/compiler/getImports';
import { initialKeyControl } from '@/features/compiler/keycontrol';
import type { compilerProps, getImportsProps } from '@/typings/compiler';

export const getProps = (dispatcher: Dispatch, locale: string): compilerProps => {
  const canvas = <HTMLCanvasElement>document.getElementById('output-canvas');

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
      memory: new WebAssembly.Memory({ initial: 100 }),
      memorySize: 0,
      wasm: '',
      id: '',
      lang: locale,
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
    importObject: getImports(dispatcher, props),
    ...props,
  };
};
