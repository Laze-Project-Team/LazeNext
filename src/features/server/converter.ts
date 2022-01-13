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
      id,
      `-c ${CACHE_DIR}`,
      '--mode convert',
      `--parse-json ${LANG_DIR}/${option.from}.json`,
      `--convert-json ${LANG_DIR}/${option.to}.json`,
      `--convert-output ${id}-dist`,
      `--parser-opt ${PARSER_DIR}/${option.from}.parser`,
      `--convert-link ${COMMON_DIR}/${option.from}/std.laze`,
    ].join(' ');
  },
};

export const convertCode = async (code: string, option: convertRequest['option']): Promise<convertResponse> => {
  const id = Date.now().toString(36) + Math.random().toString(36);

  await fs.promises.writeFile(`${CACHE_DIR}/${id}`, code, { encoding: 'utf8', flag: 'w' });
  const { stderr } = await exec(commands.convert(id, option), execOption);

  if (stderr) {
    return {
      success: false,
    };
  } else {
    const code = await fs.promises.readFile(`${CACHE_DIR}/${id}-dist`, { encoding: 'utf8' });
    return {
      success: true,
      code,
    };
  }
};
