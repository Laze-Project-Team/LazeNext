import fs from 'fs';

export type breadcrumb = {
  id: string;
  title: string;
  href: string;
};

export type directoryObject = {
  name: string;
  path: string;
  children: directoryObject[];
};

export type TreeType = {
  id: string;
  name: string;
  children?: TreeType[];
};

const getNameFromPath = (tree: TreeType, path: string[]): string | null => {
  if (path.length === 0) {
    return tree.name;
  }

  const child = tree.children?.find((child) => {
    return child.id === path[0];
  });

  if (!child) {
    return null;
  }

  return getNameFromPath(child, path.slice(1));
};

const getBreadcrumbs = (tree: TreeType, path: string[]): breadcrumb[] => {
  const breadcrumbs: breadcrumb[] = path
    .map((id, i) => {
      if (i + 1 === path.length && id === 'index') {
        return false;
      }
      const title = getNameFromPath(tree, path.slice(0, i + 1));
      const href = '/' + path.slice(0, i + 1).join('/') + '/index';

      if (!title) {
        throw new Error(`Could not find title for path ${href}`);
      }

      return {
        id,
        title,
        href,
      };
    })
    .filter(Boolean) as breadcrumb[];

  return breadcrumbs;
};

const getIndexList = (tree: TreeType, subpath = '/'): directoryObject[] => {
  if (tree.children) {
    return tree.children.map((child: TreeType) => {
      const name = child.name;
      const path = `${subpath}${child.id}/`;
      return {
        name,
        path,
        children: child.children ? getIndexList(child, path) : [],
      };
    });
  }
  return [];
};

type docsProps = {
  breadcrumbs: breadcrumb[];
  indexList: directoryObject[];
};

export const getDocsProps = (dir: string, path: string[]): docsProps => {
  const tree = JSON.parse(fs.readFileSync(`${dir}/tree.json`, { encoding: 'utf-8', flag: 'r' })) as TreeType;
  if (!tree.children) {
    throw new Error('tree.json is not valid');
  }

  const props: docsProps = {
    breadcrumbs: getBreadcrumbs(tree, path),
    indexList: getIndexList(tree),
  };

  return props;
};
