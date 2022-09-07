import { notification } from 'antd';
import type { TFunction } from 'i18next';
import moment from 'moment';
import type { Dispatch } from 'redux';

import { langList } from '@/const/lang';
import { compileFailed, compileSuccessful, runProgram } from '@/features/gtm';
import { consoleSlice } from '@/features/redux/console';
import { getHash } from '@/features/utils/hash';
import type { compileResponse, compilerType, convertRequest, convertResponse } from '@/typings/compiler';

import type { ExecuteParam } from '../laze/executeLaze';
import { executeLaze } from '../laze/executeLaze';
import { explorerSlice } from '../redux/explorer';

const getLangFile = (lang: string) => {
  if (!lang.startsWith('custom-')) return;

  const storage = localStorage.getItem('custom_lang');
  if (storage === null) return;

  const storageObj: Record<string, { name: string; content: string }> = JSON.parse(storage);

  return storageObj[lang].content;
};

export const initialize = (dispatcher: Dispatch, t: TFunction): compilerType => {
  const { addLog, createPanel, addSeparator, setActive } = consoleSlice.actions;
  const { saveFile } = explorerSlice.actions;

  const run: compilerType['run'] = (param: ExecuteParam | undefined) => {
    if (!param) {
      throw new Error('run: param is undefined.');
    }

    runProgram();

    if (param.getWasmApi === '' || param.id === '') {
      console.error('Cannot run program. Please compile first.');

      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error = (err: any) => {
      console.error(err);
      notification.open({
        message: t('errors.LaunchProgramFailed.title'),
        description: t('errors.LaunchProgramFailed.message'),
        type: 'error',
        placement: 'bottomRight',
        duration: 5,
      });
    };

    dispatcher(addSeparator(param.id));

    return executeLaze(param.getWasmApi, ['std', 'editorConsole', 'graphics', 'arduino', 'linetrace'], param, error);
  };

  const compile: compilerType['compile'] = async (
    code: string,
    label: string,
    lang: string,
    param: ExecuteParam | undefined
  ): Promise<boolean> => {
    if (!param) {
      throw new Error('compile: param is undefined.');
    }

    const langFile = getLangFile(lang);

    const body = JSON.stringify({
      code,
      option: { lang, label: label.replaceAll('$', ''), ...(langFile ? { langFile } : {}) },
    });

    if (body === undefined) {
      notification.open({
        message: t('errors.CompileProgramFailed.title'),
        description: t('errors.CompileProgramFailed.message'),
        type: 'error',
        placement: 'bottomRight',
        duration: 5,
      });
      return false;
    }

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

      param.id = id;
      param.dispatcher = dispatcher;
      param.getWasmApi = resJson.success ? resJson.wasm : '';
      // window.laze.props.variables.compiled = resJson.success;
      param.programUrl = resJson.success ? resJson.programUrl : '';
      param.wasmUrl = resJson.success ? resJson.wasmUrl : '';

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
        run(param);
      } else {
        compileFailed();
      }
      return resJson.success;
    } catch (err) {
      console.error(err);
      notification.open({
        message: t('errors.CompileProgramFailed.title'),
        description: t('errors.CompileProgramFailed.message'),
        type: 'error',
        placement: 'bottomRight',
        duration: 5,
      });
      return false;
    }
  };

  const convert: compilerType['convert'] = async (
    path: string,
    code: string,
    lang: string,
    newLang: string,
    label: string
  ) => {
    const fromLangFile = getLangFile(lang);
    const toLangFile = getLangFile(newLang);
    const bodyJson: convertRequest = {
      code,
      option: {
        label,
        from: lang,
        to: newLang,
        ...(fromLangFile ? { fromLangFile } : {}),
        ...(toLangFile ? { toLangFile } : {}),
      },
    };
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
