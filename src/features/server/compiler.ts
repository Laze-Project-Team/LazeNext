import child_process from 'child_process';
import fs from 'fs';
import { promisify } from 'util';

import { CACHE_DIR, COMMON_DIR, LANG_DIR, PARSER_DIR } from '@/const/dir';
import type { compileRequest, compilerResult } from '@/typings/compiler';

const exec = promisify(child_process.exec);

if (!process.env.COMPILER_PATH) {
  console.error('Please set value at "COMPILER_PATH"');
  process.exit(1);
}

// 定数
const execOption = { shell: '/bin/bash', windowsHide: true, timeout: 5000 };

// execされるコマンド
const commands = {
  compile: (id: string, option: compileRequest['option']) => {
    return [
      process.env.COMPILER_PATH,
      option.label,
      `-c ${CACHE_DIR}/${id}`,
      '--mode compile',
      `--parse-json ${LANG_DIR}/${option.lang}.json`,
      `--parser-opt ${PARSER_DIR}/${option.lang}.parser`,
      `--link ${COMMON_DIR}/${option.lang}/std.laze`,
    ].join(' ');
  },
  wat2wasm: (id: string, option: compileRequest['option']) => {
    return [
      'wat2wasm',
      `${CACHE_DIR}/${id}/.${option.label}.wat`,
      `-o ${CACHE_DIR}/${id}.wasm`,
      '--enable-bulk-memory',
    ].join(' ');
  },
};

export const compileCode = async (code: string, option: compileRequest['option']): Promise<compilerResult> => {
  const id = Date.now().toString(36) + Math.random().toString(36);

  if (code === '') {
    return {
      success: false,
      message: 'Please compile non-empty code',
    };
  }

  await fs.promises.mkdir(`${CACHE_DIR}/${id}`);
  await fs.promises.writeFile(`${CACHE_DIR}/${id}/${option.label}`, code, { encoding: 'utf8', flag: 'w' });
  const { stdout, stderr } = await exec(commands.compile(id, option), execOption);

  if (stderr) {
    return {
      success: false,
      message: stderr,
    };
  } else {
    await exec(commands.wat2wasm(id, option), execOption);
    return {
      success: true,
      message: stdout,
      wasm: `/api/editor/getwasm/${id}`,
    };
  }
};
