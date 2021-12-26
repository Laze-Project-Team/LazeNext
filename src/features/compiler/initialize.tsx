import { notification } from 'antd';
import type { TFunction } from 'i18next';
import moment from 'moment';
import type { Dispatch } from 'redux';

import { initShaderProgram } from '@/features/compiler/initialize/initShaderProgram';
import { keyControlInitialize } from '@/features/compiler/keycontrol';
import { fs as fsSource } from '@/features/compiler/source/fs';
import { fs2DNoTexture as fs2DNoTextureSource } from '@/features/compiler/source/fs2DNoTexture';
import { fs2DTexture as fs2DTextureSource } from '@/features/compiler/source/fs2DTexture';
import { lightFs as lightFsSource } from '@/features/compiler/source/lightFs';
import { pointFs as pointFsSource } from '@/features/compiler/source/pointFs';
import { pointVs as pointVsSource } from '@/features/compiler/source/pointVs';
import { vs as vsSource } from '@/features/compiler/source/vs';
import { vs2DNoTexture as vs2DNoTextureSource } from '@/features/compiler/source/vs2DNoTexture';
import { vs2DTexture as vs2DTextureSource } from '@/features/compiler/source/vs2DTexture';
import { consoleSlice } from '@/features/redux/console';
import { getHash } from '@/features/utils/hash';
import type { compileResponse, compilerType } from '@/typings/compiler';

export const initialize = (dispatcher: Dispatch, t: TFunction): compilerType => {
  keyControlInitialize();
  const { addLog, createPanel, addSeparator } = consoleSlice.actions;

  const run: compilerType['run'] = () => {
    const { canvas, gl, importObject, variables } = window.laze.props;

    if (variables.wasm === '' || variables.id === '') {
      console.error('Cannot run program. Please compile first.');

      return;
    }

    dispatcher(addSeparator(variables.id));

    let interval: NodeJS.Timeout | null = null;

    fetch(variables.wasm)
      .then((res) => {
        window.laze.props.webglObjects = {
          webglBuffers: [],
          webglPrograms: [],
          webglShaders: [],
          webglTextures: [],
          webglUniformLoc: [],
        };

        return res.arrayBuffer();
      })
      .then((bytes) => {
        return WebAssembly.instantiate(bytes, importObject(variables.id));
      })
      .then((results) => {
        if (interval) {
          clearInterval(interval);
        }
        const { instance } = results;
        window.laze.props.webglObjects.webglShaders.push(
          initShaderProgram(gl, vsSource, fsSource),
          initShaderProgram(gl, vsSource, lightFsSource),
          initShaderProgram(gl, pointVsSource, pointFsSource),
          initShaderProgram(gl, vs2DTextureSource, fs2DTextureSource),
          initShaderProgram(gl, vs2DNoTextureSource, fs2DNoTextureSource)
        );

        const memorySizeFunc = instance.exports.memorySize as CallableFunction;
        const mainFunc = instance.exports.main as CallableFunction;
        const loopFunc = instance.exports.loop as CallableFunction;

        window.laze.props.variables.memorySize = memorySizeFunc();
        mainFunc();

        const draw = () => {
          gl.viewport(0, 0, canvas.width, canvas.height);
          loopFunc();
        };

        if (instance.exports.loop) {
          interval = setInterval(draw, 1000 / 60);
        }
      })
      .catch((err) => {
        console.error(err);
        notification.open({
          message: t('errors.LaunchProgramFailed.title'),
          description: t('errors.LaunchProgramFailed.message'),
          type: 'error',
          placement: 'bottomRight',
          duration: 5,
        });
      });
  };

  const lang = 'ja';
  const compile: compilerType['compile'] = (code: string, label: string) => {
    window.laze.props.variables.id = '';
    window.laze.props.variables.wasm = '';

    const body = JSON.stringify({ code, option: { lang } });

    fetch(`/api/editor/compile`, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((res: compileResponse) => {
        const id = moment().unix().toString(36) + getHash(4);

        window.laze.props.variables.id = id;
        window.laze.props.variables.wasm = res.success ? res.wasm : '';
        window.laze.props.variables.compiled = res.success;

        dispatcher(createPanel({ id, label, active: true }));

        dispatcher(
          addLog({
            console: id,
            content: res.message,
            level: res.success ? 'log' : 'error',
          })
        );

        if (res.success) {
          run();
        }
      })
      .catch(() => {
        notification.open({
          message: t('errors.CompileProgramFailed.title'),
          description: t('errors.CompileProgramFailed.message'),
          type: 'error',
          placement: 'bottomRight',
          duration: 5,
        });
      });
  };

  return { compile, run };
};
