import { Breadcrumb } from 'antd';
import fs from 'fs';
import type { GetStaticPaths, NextPage } from 'next';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { Components } from 'react-markdown';
import Markdown from 'react-markdown';

import { LazeLogo } from '@/components/ui/atoms/LazeLogo';

type breadcrumb = {
  id: string;
  title: string;
  href: string;
};

type DocsProps = {
  content: string;
  breadcrumbs: breadcrumb[];
};

const H2: Components['h2'] = ({ node, children }) => {
  return <h2 id={node.position?.start.line.toString()}>{children}</h2>;
};

const anchorLink: Components['h2'] = ({ node, children }) => {
  return (
    <p className="my-1">
      <a href={'#' + node.position?.start.line.toString()} className="text-gray-400 text-xs">
        {children}
      </a>
    </p>
  );
};

const Docs: NextPage<DocsProps> = ({ content, breadcrumbs }) => {
  const [t] = useTranslation('docs');

  return (
    <>
      <div className="flex">
        <div className="w-60 border-r-2">
          <Link href="/" passHref>
            <a className="flex justify-center mt-4">
              <LazeLogo size={120} option="logo_caption" />
            </a>
          </Link>
          <hr className="bg-gray-300 my-4" />
          <div></div>
        </div>
        <div>
          <Breadcrumb>
            {breadcrumbs.map((breadcrumb) => {
              return (
                <Breadcrumb.Item key={breadcrumb.id}>
                  <Link href={breadcrumb.href}>{breadcrumb.title}</Link>
                </Breadcrumb.Item>
              );
            })}
          </Breadcrumb>
        </div>
        <div className="flex-1 pl-4 pr-36 pt-4 break-normal">
          <Markdown
            components={{
              h2: H2,
            }}
          >
            {content}
          </Markdown>
        </div>
        <div className="fixed right-4 top-4 w-24">
          <p className="font-bold text-gray-800 my-0">{t('contents')}</p>
          <Markdown
            allowedElements={['h2']}
            components={{
              h2: anchorLink,
            }}
          >
            {content}
          </Markdown>
        </div>
      </div>
    </>
  );
};

const readDirectoryRecursive = (path: string, subpath = '/'): string[] => {
  const dirents = fs.readdirSync(`${path}${subpath}`, { withFileTypes: true });
  return dirents
    .map((dirent) => {
      return dirent.isDirectory()
        ? readDirectoryRecursive(path, `${subpath}${dirent.name}/`)
        : [`${subpath}${dirent.name}`];
    })
    .reduce((acc, cur) => {
      return acc.concat(cur);
    }, []);
};

const DOCS_DIR = './docs';

export const getStaticPaths: GetStaticPaths = () => {
  const paths = readDirectoryRecursive(DOCS_DIR).map((path) => {
    return {
      params: {
        path: path.split('.')[0].split('/').slice(2),
      },
      locale: path.split('.')[0].split('/')[1],
    };
  });

  return {
    paths,
    fallback: false,
  };
};

type contextType = {
  locale: string;
  params: {
    path: string[];
  };
};
export const getStaticProps = async (context: contextType) => {
  const content = fs.readFileSync(`${DOCS_DIR}/${context.locale}/${context.params.path.join('/')}.md`, {
    encoding: 'utf-8',
    flag: 'r',
  });

  const breadcrumbs: breadcrumb[] = context.params.path.map((path, i, paths) => {
    const content = fs.readFileSync(`${DOCS_DIR}/${context.locale}/${paths.slice(0, i + 1).join('/')}.md`, {
      encoding: 'utf-8',
      flag: 'r',
    });

    const id = path.split('.')[0];
    const title = content.match('# (.*)');

    return {
      id,
      title: title ? title[1] : id,
      href: `/docs/${paths.slice(0, i + 1).join('/')}`,
    };
  });

  return {
    props: {
      content,
      breadcrumbs,
      ...(await serverSideTranslations(context.locale, ['common', 'docs'])),
    },
  };
};

export default Docs;
