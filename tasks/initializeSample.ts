import fs from 'fs';

import { SAMPLE_DIR } from '@/const/dir';
import { langList } from '@/const/lang';
import { convertCode } from '@/features/server/converter';

const initializeSample = async (): Promise<void> => {
  const dirents = await fs.promises.readdir(SAMPLE_DIR, { withFileTypes: true });
  const samples = dirents
    .filter((dirent) => {
      return dirent.isDirectory();
    })
    .map((dirent) => {
      return dirent.name;
    });
  samples.forEach(async (sample) => {
    const content = await fs.promises.readFile(`${SAMPLE_DIR}/${sample}/main.laze`, { encoding: 'utf8' });
    Object.keys(langList).forEach(async (lang) => {
      if (lang === 'ja') {
        return;
      }

      const convertResult = await convertCode(content, { from: 'ja', to: lang, label: 'main.laze' });
      if (convertResult.success) {
        await fs.promises.mkdir(`${SAMPLE_DIR}/${sample}/${lang}`, { recursive: true });
        await fs.promises.writeFile(`${SAMPLE_DIR}/${sample}/${lang}/main.laze`, convertResult.code);
      }
    });
  });
};

initializeSample();
