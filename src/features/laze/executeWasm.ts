import { initShaderProgram } from '@/features/compiler/initialize/initShaderProgram';
import { fs as fsSource } from '@/features/compiler/source/fs';
import { fs2DNoTexture as fs2DNoTextureSource } from '@/features/compiler/source/fs2DNoTexture';
import { fs2DTexture as fs2DTextureSource } from '@/features/compiler/source/fs2DTexture';
import { lightFs as lightFsSource } from '@/features/compiler/source/lightFs';
import { pointFs as pointFsSource } from '@/features/compiler/source/pointFs';
import { pointVs as pointVsSource } from '@/features/compiler/source/pointVs';
import { vs as vsSource } from '@/features/compiler/source/vs';
import { vs2DNoTexture as vs2DNoTextureSource } from '@/features/compiler/source/vs2DNoTexture';
import { vs2DTexture as vs2DTextureSource } from '@/features/compiler/source/vs2DTexture';

import { keyControlInitialize } from '../compiler/keycontrol';
import type { ExecuteParam } from './executeLaze';
import type { Libraries } from './getWasmImports';
import { getWasmImports } from './getWasmImports';

export const executeWasm = async (
  wasm: ArrayBuffer,
  dependencies: Libraries[],
  param: ExecuteParam,
  canvasId = 'output-canvas'
): Promise<null | (() => void)> => {
  try {
    const [props, importObject] = getWasmImports(dependencies, param, canvasId);
    if (props.keyControl) {
      keyControlInitialize(props.keyControl);
    }

    const executable = await WebAssembly.instantiate(wasm, importObject);

    const { instance } = executable;
    if ('webgl' in dependencies && props.gl && props.webglObjects) {
      props.webglObjects.webglPrograms.push(
        initShaderProgram(props.gl, vsSource, fsSource),
        initShaderProgram(props.gl, vsSource, lightFsSource),
        initShaderProgram(props.gl, pointVsSource, pointFsSource),
        initShaderProgram(props.gl, vs2DTextureSource, fs2DTextureSource),
        initShaderProgram(props.gl, vs2DNoTextureSource, fs2DNoTextureSource)
      );
    }

    const memorySizeFunc = instance.exports.memorySize as CallableFunction;
    const mainFunc = instance.exports.main as CallableFunction;
    const loopFunc = instance.exports.loop as CallableFunction;
    const stringLiterals = instance.exports.__stringLiterals as CallableFunction;
    const clearMemory = instance.exports.clearMemory as CallableFunction;

    if ('arduino' in dependencies && instance.exports.jsCallListenerNoParam && props.lazeCallNoParam) {
      props.lazeCallNoParam = instance.exports.jsCallListenerNoParam as CallableFunction | undefined;
    }

    clearMemory();
    stringLiterals();

    props.memorySize = memorySizeFunc();
    mainFunc();

    if (instance.exports.loop && props.gl && props.canvas) {
      const gl = props.gl;
      const canvas = props.canvas;
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
