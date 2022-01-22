import fs from 'fs';
import path from 'path';

import type { TreeType } from '@/features/docs/getProps';

const DOCS_DIR = path.resolve(__dirname, '../docs');

const readDirectoryRecursive = async (path: string, subpath = '/'): Promise<string[]> => {
  const dirents = await fs.promises.readdir(`${path}${subpath}`, { withFileTypes: true });
  return (
    await Promise.all(
      dirents.map((dirent) => {
        return dirent.isDirectory()
          ? readDirectoryRecursive(path, `${subpath}${dirent.name}/`)
          : [`${subpath}${dirent.name}`];
      })
    )
  ).reduce((acc, cur) => {
    return acc.concat(cur);
  }, []);
};

type unknownTreeType = { id: unknown; name: unknown; children: unknown };

const connectBoolean = (a: boolean, b: boolean) => {
  return a && b;
};

const validateTreeProps = (tree: object): tree is unknownTreeType => {
  return Object.prototype.hasOwnProperty.call(tree, 'id') && Object.prototype.hasOwnProperty.call(tree, 'name');
};

const validateTree = (tree: unknown): tree is TreeType => {
  if (typeof tree !== 'object') {
    return false;
  }

  if (tree === null) {
    return false;
  }

  if (
    validateTreeProps(tree) &&
    typeof tree.id === 'string' &&
    typeof tree.name === 'string' &&
    (tree.children === undefined || Array.isArray(tree.children))
  ) {
    if (tree.children === undefined) {
      return true;
    }

    return tree.children
      .map((child) => {
        return validateTree(child);
      })
      .reduce(connectBoolean);
  } else {
    return false;
  }
};

const validateTreeChild = async (child: TreeType, locale: string, subpath = ''): Promise<boolean> => {
  if (child.children) {
    return (
      await Promise.all(
        child.children.map((child) => {
          return validateTreeChild(child, locale, `${subpath}/${child.id}`);
        })
      )
    ).reduce(connectBoolean);
  } else {
    const filepath = `${DOCS_DIR}/${locale}${subpath}.md`;
    if (!fs.existsSync(filepath)) {
      console.error(`${filepath} not found`);
      return false;
    }
    return true;
  }
};

const docsTest = async () => {
  return (
    await Promise.all(
      (
        await fs.promises.readdir(DOCS_DIR)
      ).map(async (locale) => {
        if (!fs.existsSync(`${DOCS_DIR}/${locale}/tree.json`)) {
          throw new Error(`${locale}/tree.json not found`);
        }
        try {
          const tree = JSON.parse(await fs.promises.readFile(`${DOCS_DIR}/${locale}/tree.json`, { encoding: 'utf-8' }));
          if (!validateTree(tree) || tree.children === undefined) {
            throw new Error('tree.json is not valid format');
          }
        } catch (err) {
          console.error(err);
          return false;
        }

        const isTreeValid = await validateTreeChild(tree, locale);

        const isDirectoryValid = (await readDirectoryRecursive(`${DOCS_DIR}/${locale}`))
          .map((path) => {
            if (path === '/tree.json') {
              return true;
            }

            let treeObj = tree;
            let flag = true;
            const paths = path.split('/').slice(1);
            for (let i = 0; i < paths.length; i++) {
              const name = paths[i];
              if (treeObj.children) {
                const child = treeObj.children.find((child) => {
                  return child.id === name.split('.')[0];
                });
                if (child) {
                  treeObj = child;
                } else {
                  console.error(`${paths.slice(0, i + 1).join('/')} is not valid`);
                  flag = false;
                  break;
                }
              } else {
                console.error(`${paths.slice(0, i + 1).join('/')} is not valid`);
                flag = false;
                break;
              }
            }

            return flag;
          })
          .reduce(connectBoolean);

        return isTreeValid && isDirectoryValid;
      })
    )
  ).reduce(connectBoolean);
};

docsTest().then((success) => {
  if (success) {
    console.log('docs test success');
  } else {
    console.error('docs test failed');
    process.exit(1);
  }
});
