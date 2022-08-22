import child_process from 'child_process';
import fs from 'fs';
import { promisify } from 'util';

import { CACHE_DIR, COMMON_DIR, LANG_DIR, PARSER_DIR } from '@/const/dir';
import type { convertRequest, convertResponse } from '@/typings/compiler';

const exec = promisify(child_process.exec);

if (!process.env.COMPILER_PATH) {
  console.error('Please set value at "COMPILER_PATH"');
  process.exit(1);
}

// 定数
const execOption = { shell: '/bin/bash', windowsHide: true };

// execされるコマンド
const commands = {
  convert: (id: string, option: convertRequest['option']) => {
    return [
      process.env.COMPILER_PATH,
      option.label,
      `-c ${CACHE_DIR}/${id}`,
      '--mode convert',
      option.fromLangFile === undefined
        ? `--parse-json ${LANG_DIR}/${option.from}.json`
        : `--parse-json ${CACHE_DIR}/${id}/fromLang.json`,
      option.fromLangFile === undefined
        ? `--convert-json ${LANG_DIR}/${option.to}.json`
        : `--convert-json ${CACHE_DIR}/${id}/toLang.json`,
      `--convert-output ${option.label}-dist`,
      `--parser-opt ${PARSER_DIR}/${option.from}.parser`,
      `--convert-link std.laze`,
      `--convert-dir ${COMMON_DIR}/${option.from}/`,
    ].join(' ');
  },
};

export const convertCode = async (code: string, option: convertRequest['option']): Promise<convertResponse> => {
  const id = Date.now().toString(36) + Math.random().toString(36);

  await fs.promises.mkdir(`${CACHE_DIR}/${id}`, { recursive: true });
  await fs.promises.writeFile(`${CACHE_DIR}/${id}/${option.label}`, code, { encoding: 'utf8', flag: 'w' });
  if (option.fromLangFile !== undefined) {
    await fs.promises.writeFile(`${CACHE_DIR}/${id}/fromLang.json`, option.fromLangFile, {
      encoding: 'utf8',
      flag: 'w',
    });
  }
  if (option.toLangFile !== undefined) {
    await fs.promises.writeFile(`${CACHE_DIR}/${id}/toLang.json`, option.toLangFile, { encoding: 'utf8', flag: 'w' });
  }
  const { stderr } = await exec(commands.convert(id, option), execOption);

  if (stderr) {
    return {
      success: false,
      message: stderr,
    };
  } else {
    const code = await fs.promises.readFile(`${CACHE_DIR}/${id}/${option.label}-dist`, { encoding: 'utf8' });
    fs.promises.rm(`${CACHE_DIR}/${id}/${option.label}-dist`);
    return {
      success: true,
      code,
    };
  }
};
