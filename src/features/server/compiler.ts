import child_process from 'child_process';
import fs from 'fs';
import { promisify } from 'util';

import { CACHE_DIR, COMMON_DIR } from '@/const/dir';
import type { compileRequest, compilerResult } from '@/typings/compiler';

const exec = promisify(child_process.exec);

if (!process.env.COMPILER_PATH) {
  console.error('Please set value at "COMPILER_PATH"');
  process.exit(1);
}

// 定数
const execOption = { shell: '/bin/bash', windowsHide: true };

// execされるコマンド
const commands = {
  compile: (id: string) => {
    return [process.env.COMPILER_PATH, id, `-c ${CACHE_DIR}`, `-link ${COMMON_DIR}/std.laze`].join(' ');
  },
  wat2wasm: (id: string) => {
    return ['wat2wasm', `${CACHE_DIR}/.${id}.wat`, `-o ${CACHE_DIR}/${id}.wasm`, '--enable-bulk-memory'].join(' ');
  },
};

export const compileCode = async (code: string, _: compileRequest['option']): Promise<compilerResult> => {
  const id = Date.now().toString(36) + Math.random().toString(36);

  if (code === '') {
    return {
      success: false,
      message: 'Please compile non-empty code',
    };
  }

  await fs.promises.writeFile(`${CACHE_DIR}/${id}`, code, { encoding: 'utf8', flag: 'w' });
  const { stdout, stderr } = await exec(commands.compile(id), execOption);

  if (stderr) {
    return {
      success: false,
      message: stderr,
    };
  } else {
    await exec(commands.wat2wasm(id), execOption);
    return {
      success: true,
      message: stdout,
      wasm: `/api/editor/getwasm/${id}`,
    };
  }
};
