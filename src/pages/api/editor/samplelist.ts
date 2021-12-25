import fs from 'fs';
import type { NextApiHandler } from 'next';

import { SAMPLE_DIR } from '@/const/dir';
import type { langId, lazeConfig } from '@/typings/config';

export const langIds: langId[] = ['ja', 'en', 'de', 'ru', 'pt', 'nl', 'fr', 'it', 'es', 'pl', 'zh-cn'];

const isLangId = (id: string): id is langId => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return langIds.includes(id);
};

export const sampleList = async (lang: langId): Promise<Record<string, { name: string }>> => {
  const dirents = await fs.promises.readdir(SAMPLE_DIR, { withFileTypes: true });
  const files = await Promise.all(
    dirents
      .map((dirent) => {
        if (dirent.isDirectory()) {
          return fs.promises.readFile(`${SAMPLE_DIR}/${dirent.name}/laze.config.json`, {
            flag: 'r',
            encoding: 'utf-8',
          });
        }
      })
      .filter(Boolean)
  );
  const sampleList = (files.filter(Boolean) as string[])
    .map((content) => {
      return JSON.parse(content);
    })
    .map((config: lazeConfig) => {
      return {
        [config.id]: { name: config.name[lang] },
      };
    })
    .reduce((acc, cur) => {
      return { ...acc, ...cur };
    });

  return sampleList;
};

const handler: NextApiHandler = (req, res) => {
  const { lang } = req.query;

  if (typeof lang !== 'string') {
    res.status(400).send('query "lang" is not valid');
    return;
  }

  if (!isLangId(lang)) {
    res.status(400).send('Invalid language');
    return;
  }

  sampleList(lang)
    .then((files) => {
      return res.json(files);
    })
    .catch((err) => {
      res.status(500).end();
      console.error(err);
    });
};

export default handler;
