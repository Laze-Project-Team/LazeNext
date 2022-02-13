import colors from 'colors/safe';
import fs from 'fs';
import path from 'path';

const LOCALE_DIR = path.resolve(__dirname, '../src/locales');

const LANG_LIST = ['en', 'ja'];

type ignorePattern = {
  lang: string | null;
  file: string;
  path: string;
};

const ignorePaths: ignorePattern[] = [
  {
    lang: null,
    file: 'common.json',
    path: 'copyright',
  },
  {
    lang: null,
    file: 'profile.json',
    path: 'title',
  },
];

const connectObject = <T>(acc: T, cur: T) => {
  return { ...acc, ...cur };
};

const connectArray = <T>(acc: T[], cur: T[]) => {
  return [...acc, ...cur];
};

type localeFile = {
  [key: string]: string | localeFile;
};

const getDeepKeys = (obj: localeFile, subpath = ''): string[] => {
  return Object.keys(obj)
    .map((key) => {
      const child = obj[key];
      const path = `${subpath}${key}`;
      if (typeof child !== 'string') {
        return getDeepKeys(child, `${subpath}${key}.`);
      }
      return [path];
    })
    .reduce(connectArray, []);
};

const assignDeepKeys = (obj: localeFile, path: string, value: string) => {
  if (path === '') {
    return;
  }

  const shallowPath = path.split('.')[0];
  obj[shallowPath] = obj[shallowPath] ?? {};
  const data = obj[shallowPath];
  if (typeof data === 'string' || path.indexOf('.') === -1) {
    obj[shallowPath] = value;
  } else {
    assignDeepKeys(data, path.split('.').slice(1).join('.'), value);
  }
};

const localeTest = async (isFix: boolean) => {
  const localeData = (
    await Promise.all(
      LANG_LIST.map(async (lang) => {
        const files = await fs.promises.readdir(path.join(LOCALE_DIR, lang));
        const jsonFiles = files.filter((file) => {
          return file.split('.').slice(-1)[0] === 'json';
        });

        const localeContent: Record<string, localeFile> = (
          await Promise.all(
            jsonFiles.map(async (file) => {
              const content = await fs.promises.readFile(path.join(LOCALE_DIR, lang, file), { encoding: 'utf-8' });
              const json = JSON.parse(content);
              return { [file]: json };
            })
          )
        ).reduce(connectObject, {});

        return {
          [lang]: localeContent,
        };
      })
    )
  ).reduce(connectObject, {});

  const localeKeys = Object.keys(localeData)
    .map((lang) => {
      return Object.keys(localeData[lang])
        .map((file) => {
          return {
            [file]: {
              [lang]: getDeepKeys(localeData[lang][file]),
            },
          };
        })
        .reduce(connectObject, {});
    })
    .reduce((acc, cur) => {
      const file = Object.keys(cur)
        .map((file) => {
          return {
            [file]: {
              ...acc[file],
              ...cur[file],
            },
          };
        })
        .reduce(connectObject, {});

      return {
        ...acc,
        ...file,
      };
    }, {});

  Object.keys(localeKeys).map((file) => {
    const files = localeKeys[file];

    return {
      [file]: Object.keys(localeKeys[file]).map((lang) => {
        const paths = localeKeys[file][lang];
        paths.forEach((path) => {
          Object.keys(files).forEach((lang) => {
            const langPaths = files[lang];
            if (
              ignorePaths.some((pattern) => {
                return (
                  pattern.path === path && pattern.file === file && (pattern.lang === lang || pattern.lang === null)
                );
              })
            ) {
              return;
            }
            if (typeof langPaths === 'undefined') {
              console.error(`[${lang}] ${colors.cyan(file)} is not found`);
            }
            if (!langPaths.includes(path)) {
              console.error(`[${lang}] ${colors.cyan(file)} -> ${colors.green(path)} is not found`);
              if (isFix) {
                assignDeepKeys(localeData[lang][file], path, '!!! translation value has not been set !!!');
              }
            }
          });
        });
      }),
    };
  });

  if (isFix) {
    Object.keys(localeData).forEach((lang) => {
      Object.keys(localeData[lang]).forEach((file) => {
        const data = localeData[lang][file];
        fs.promises.writeFile(path.join(LOCALE_DIR, lang, file), JSON.stringify(data, null, 2));
      });
    });
  }
};

const isFix = process.argv.slice(2).includes('--fix');

localeTest(isFix);
