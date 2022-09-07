import { notification } from 'antd';
import moment from 'moment';

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

export const runLaze: compilerType['run'] = (param: ExecuteParam | undefined) => {
  const { addSeparator } = consoleSlice.actions;
  if (!param) {
    throw new Error('run: param is undefined.');
  }

  runProgram();

  if (param.getWasmApi === '' || param.id === '') {
    console.error('Cannot run program. Please compile first.');

    return;
  }

  if (param.dispatcher) {
    param.dispatcher(addSeparator(param.id));
  } else {
    throw new Error('dispatcher is not in param.');
  }

  return executeLaze(param.getWasmApi, ['std', 'editorConsole', 'graphics', 'arduino', 'linetrace'], param);
};

export const compileLaze: compilerType['compile'] = async (
  code: string,
  label: string,
  lang: string,
  param: ExecuteParam | undefined
): Promise<boolean> => {
  const { createPanel, addLog } = consoleSlice.actions;

  if (!param) {
    throw new Error('compile: param is undefined.');
  }

  const langFile = getLangFile(lang);

  const body = JSON.stringify({
    code,
    option: { lang, label: label.replaceAll('$', ''), ...(langFile ? { langFile } : {}) },
  });

  if (body === undefined) {
    param.error('');
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
    param.getWasmApi = resJson.success ? resJson.wasm : '';
    param.programUrl = resJson.success ? resJson.programUrl : '';
    param.wasmUrl = resJson.success ? resJson.wasmUrl : '';

    if (param.dispatcher) {
      param.dispatcher(createPanel({ id, label, active: true }));

      param.dispatcher(
        addLog({
          console: id,
          content: resJson.message,
          level: resJson.success ? 'log' : 'error',
        })
      );
    }

    if (resJson.success) {
      compileSuccessful();
      runLaze(param);
    } else {
      compileFailed();
    }
    return resJson.success;
  } catch (err) {
    param.error(err);
    return false;
  }
};

export const convertLaze: compilerType['convert'] = async (
  path: string,
  code: string,
  lang: string,
  newLang: string,
  label: string,
  param: ExecuteParam | undefined
) => {
  const { addLog, addSeparator, setActive } = consoleSlice.actions;
  const { saveFile } = explorerSlice.actions;

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
      message: param?.t ? param.t('convert.success.title') : 'Convert success.',
      description: param?.t
        ? param.t('convert.success.message', { from: langList[lang], to: langList[newLang] })
        : `Convert succeeded from ${langList[lang]} to ${langList[newLang]}.`,
      type: 'success',
      placement: 'bottomRight',
      duration: 5,
    });
    if (param?.dispatcher) {
      param.dispatcher(saveFile({ path, content: resJson.code }));
    }
  } else {
    if (param?.dispatcher) {
      param.dispatcher(
        addLog({
          console: 'master',
          content: resJson.message,
          level: 'error',
        })
      );
      param.dispatcher(addSeparator('master'));
      param.dispatcher(setActive('master'));
    }

    notification.open({
      message: param?.t ? param.t('convert.error.title') : 'Convert error.',
      description: param?.t
        ? param.t('convert.error.message', { from: langList[lang], to: langList[newLang] })
        : `Failed to convert from ${langList[lang]} to ${langList[newLang]}.`,
      type: 'error',
      placement: 'bottomRight',
      duration: 5,
    });
  }

  return resJson.success;
};
