import { initShaderProgram } from '@/features/compiler/initialize/initShaderProgram';
import { initialKeyControl } from '@/features/compiler/keycontrol';
import { fs as fsSource } from '@/features/compiler/source/fs';
import { fs2DNoTexture as fs2DNoTextureSource } from '@/features/compiler/source/fs2DNoTexture';
import { fs2DTexture as fs2DTextureSource } from '@/features/compiler/source/fs2DTexture';
import { lightFs as lightFsSource } from '@/features/compiler/source/lightFs';
import { pointFs as pointFsSource } from '@/features/compiler/source/pointFs';
import { pointVs as pointVsSource } from '@/features/compiler/source/pointVs';
import { vs as vsSource } from '@/features/compiler/source/vs';
import { vs2DNoTexture as vs2DNoTextureSource } from '@/features/compiler/source/vs2DNoTexture';
import { vs2DTexture as vs2DTextureSource } from '@/features/compiler/source/vs2DTexture';
import type { getCompleteImportsFunction, WasmImportProps } from '@/typings/compiler';

export const executeWasm = async (
  wasm: ArrayBuffer,
  variables: WasmImportProps,
  importObjectFunc: getCompleteImportsFunction
): Promise<null | (() => void)> => {
  try {
    variables.webglObjects = {
      webglBuffers: [],
      webglPrograms: [],
      webglTextures: [],
      webglUniformLoc: [],
    };
    const executable = await WebAssembly.instantiate(wasm, importObjectFunc(variables.variables.id));
    if (variables.variables.interval) {
      clearInterval(variables.variables.interval);
    }
    const { instance } = executable;
    if (variables.gl) {
      variables.webglObjects.webglPrograms.push(
        initShaderProgram(variables.gl, vsSource, fsSource),
        initShaderProgram(variables.gl, vsSource, lightFsSource),
        initShaderProgram(variables.gl, pointVsSource, pointFsSource),
        initShaderProgram(variables.gl, vs2DTextureSource, fs2DTextureSource),
        initShaderProgram(variables.gl, vs2DNoTextureSource, fs2DNoTextureSource)
      );
    } else {
      return null;
    }

    const memorySizeFunc = instance.exports.memorySize as CallableFunction;
    const mainFunc = instance.exports.main as CallableFunction;
    const loopFunc = instance.exports.loop as CallableFunction;
    const stringLiterals = instance.exports.__stringLiterals as CallableFunction;
    const clearMemory = instance.exports.clearMemory as CallableFunction;

    if (instance.exports.jsCallListenerNoParam) {
      variables.variables.lazeCallNoParam = instance.exports.jsCallListenerNoParam as CallableFunction | null;
    }

    clearMemory();
    stringLiterals();

    variables.variables.memorySize = memorySizeFunc();
    mainFunc();

    if (instance.exports.loop && variables.gl && variables.canvas) {
      const gl = variables.gl;
      const canvas = variables.canvas;
      return () => {
        gl.viewport(0, 0, canvas.width, canvas.height);
        loopFunc();
      };
    } else {
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const wasmInitProps: WasmImportProps = {
  canvas: null,
  gl: null,
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
    lang: 'en',
    keyControl: initialKeyControl,
    lazeCallNoParam: null,
    interval: null,
    linetraceTime: null,
    programUrl: '',
    wasmUrl: '',
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
