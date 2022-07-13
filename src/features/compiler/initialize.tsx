import { notification } from 'antd';
import type { TFunction } from 'i18next';
import moment from 'moment';
import type { Dispatch } from 'redux';

import { langList } from '@/const/lang';
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
import { compileFailed, compileSuccessful, runProgram } from '@/features/gtm';
import { consoleSlice } from '@/features/redux/console';
import { getHash } from '@/features/utils/hash';
import type { compileResponse, compilerType, convertRequest, convertResponse } from '@/typings/compiler';

import { explorerSlice } from '../redux/explorer';

export const initialize = (dispatcher: Dispatch, t: TFunction): compilerType => {
  keyControlInitialize();
  const { addLog, createPanel, addSeparator, setActive } = consoleSlice.actions;
  const { saveFile } = explorerSlice.actions;

  const run: compilerType['run'] = () => {
    runProgram();

    const { canvas, gl, importObject, variables } = window.laze.props;

    if (variables.wasm === '' || variables.id === '') {
      console.error('Cannot run program. Please compile first.');

      return;
    }

    dispatcher(addSeparator(variables.id));

    return fetch(variables.wasm)
      .then((res) => {
        window.laze.props.webglObjects = {
          webglBuffers: [],
          webglPrograms: [],
          webglTextures: [],
          webglUniformLoc: [],
        };
        return res.arrayBuffer();
      })
      .then((bytes) => {
        return WebAssembly.instantiate(bytes, importObject(variables.id));
      })
      .then((results) => {
        if (variables.interval) {
          clearInterval(variables.interval);
        }
        const { instance } = results;
        window.laze.props.webglObjects.webglPrograms.push(
          initShaderProgram(gl, vsSource, fsSource),
          initShaderProgram(gl, vsSource, lightFsSource),
          initShaderProgram(gl, pointVsSource, pointFsSource),
          initShaderProgram(gl, vs2DTextureSource, fs2DTextureSource),
          initShaderProgram(gl, vs2DNoTextureSource, fs2DNoTextureSource)
        );

        const memorySizeFunc = instance.exports.memorySize as CallableFunction;
        const mainFunc = instance.exports.main as CallableFunction;
        const loopFunc = instance.exports.loop as CallableFunction;
        const stringLiterals = instance.exports.__stringLiterals as CallableFunction;
        const clearMemory = instance.exports.clearMemory as CallableFunction;

        if (instance.exports.jsCallListenerNoParam) {
          window.laze.props.variables.lazeCallNoParam = instance.exports
            .jsCallListenerNoParam as CallableFunction | null;
        }

        clearMemory();
        stringLiterals();

        window.laze.props.variables.memorySize = memorySizeFunc();
        mainFunc();

        const draw = () => {
          gl.viewport(0, 0, canvas.width, canvas.height);
          loopFunc();
        };

        if (instance.exports.loop) {
          variables.interval = setInterval(draw, 1000 / 60);
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

  const compile: compilerType['compile'] = async (code: string, label: string) => {
    window.laze.props.variables.id = '';
    window.laze.props.variables.wasm = '';

    const body = JSON.stringify({
      code,
      option: { lang: window.laze.props.variables.lang, label: label.replaceAll('$', '') },
    });

    try {
      const res = await fetch(`/api/editor/compile`, {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const resJson = (await res.json()) as compileResponse;
      const id = moment().unix().toString(36) + getHash(4);

      window.laze.props.variables.id = id;
      window.laze.props.variables.wasm = resJson.success ? resJson.wasm : '';
      window.laze.props.variables.compiled = resJson.success;

      dispatcher(createPanel({ id, label, active: true }));

      dispatcher(
        addLog({
          console: id,
          content: resJson.message,
          level: resJson.success ? 'log' : 'error',
        })
      );

      if (resJson.success) {
        compileSuccessful();
        run();
      } else {
        compileFailed();
      }
    } catch {
      notification.open({
        message: t('errors.CompileProgramFailed.title'),
        description: t('errors.CompileProgramFailed.message'),
        type: 'error',
        placement: 'bottomRight',
        duration: 5,
      });
    }
  };

  const convert: compilerType['convert'] = async (
    path: string,
    code: string,
    lang: string,
    newLang: string,
    label: string
  ) => {
    const bodyJson: convertRequest = { code, option: { label, from: lang, to: newLang } };
    const body = JSON.stringify(bodyJson);

    const res = await fetch(`/api/editor/convert`, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const resJson = (await res.json()) as convertResponse;

    if (resJson.success) {
      notification.open({
        message: t('convert.success.title'),
        description: t('convert.success.message', { from: langList[lang], to: langList[newLang] }),
        type: 'success',
        placement: 'bottomRight',
        duration: 5,
      });
      dispatcher(saveFile({ path, content: resJson.code }));
    } else {
      dispatcher(
        addLog({
          console: 'master',
          content: resJson.message,
          level: 'error',
        })
      );
      dispatcher(addSeparator('master'));
      dispatcher(setActive('master'));

      notification.open({
        message: t('convert.error.title'),
        description: t('convert.error.message', { from: langList[lang], to: langList[newLang] }),
        type: 'error',
        placement: 'bottomRight',
        duration: 5,
      });
    }

    return resJson.success;
  };

  return { compile, run, convert };
};
