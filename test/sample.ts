/* eslint-disable no-console */
import colors from 'colors';
import fs from 'fs';

import { SAMPLE_DIR } from '@/const/dir';
import { langList } from '@/const/lang';
import { compileCode } from '@/features/server/compiler';

const langs = Object.keys(langList) as (keyof typeof langList)[];

const sampleTest = async () => {
  if (!fs.existsSync(SAMPLE_DIR)) {
    console.error(`${colors.red('[failed]')} sample directory (${SAMPLE_DIR}) is not found`);
    return;
  }

  try {
    const samples = await fs.promises.readdir(SAMPLE_DIR, { withFileTypes: true });

    for (let i = 0; i < samples.length; i++) {
      const sample = samples[i];

      if (!sample.isDirectory()) return;

      for (let j = 0; j < langs.length; j++) {
        const lang = langs[j];

        const sampleFilePath = `${SAMPLE_DIR}/${sample.name}/${lang}/main.laze`;
        if (!fs.existsSync(sampleFilePath)) {
          console.error(`${colors.red('[failed]')} ${sample.name} in ${lang} - file is not found`);
          return;
        }

        const sampleFileContent = await fs.promises.readFile(sampleFilePath, { encoding: 'utf-8' });

        try {
          const compileResult = await compileCode(sampleFileContent, { label: sample.name, lang });
          if (compileResult.success) {
            console.log(`${colors.green('[passed]')} ${sample.name} in ${lang}`);
          } else {
            console.log(`${colors.red('[failed]')} ${sample.name} in ${lang}`);
            console.log(compileResult.message);
          }
        } catch (err) {
          console.log(`${colors.red('[failed]')} ${sample.name} in ${lang} - Command Failed`);
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
};

sampleTest();
