import { Anchor, Breadcrumb, Collapse } from 'antd';
import fs from 'fs';
import type { GetStaticPaths, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { ReactNode, VFC } from 'react';
import { useEffect, useRef } from 'react';
import Markdown from 'react-markdown';

import { LazeLogo } from '@/components/ui/atoms/LazeLogo';
import { a, anchorLink, H1, H2, HR, Paragraph } from '@/components/ui/Markdown';
import { cx } from '@/features/utils/cx';

type breadcrumb = {
  id: string;
  title: string;
  href: string;
};

type directoryObject = {
  name: string;
  path: string;
  children: directoryObject[];
};

type DocsProps = {
  content: string;
  breadcrumbs: breadcrumb[];
  indexList: directoryObject[];
};

type IndexListProps = {
  indexList: directoryObject[];
  active: string;
  nest?: number;
};

const IndexList: VFC<IndexListProps> = ({ indexList, active, nest }) => {
  const readIndexList = (dir: directoryObject): ReactNode => {
    const activeClass = cx(
      active
        .split('/')
        .slice(0, (nest ?? 0) + 2)
        .join('/') === dir.path && 'indexlist-active'
    );
    return (
      <>
        {dir.children.length === 0 ? (
          <div key={dir.path} className={cx('indexlist-item', activeClass)}>
            <Link href={`/docs${dir.path}`} passHref>
              <a href={`/docs${dir.path}`} className="inline-block w-full h-full text-gray-700 hover:text-gray-700">
                {dir.name}
              </a>
            </Link>
          </div>
        ) : (
          <Collapse bordered={false} ghost expandIconPosition="right" key={dir.path} className={activeClass}>
            <Collapse.Panel header={dir.name} key={dir.path} showArrow={true}>
              <IndexList indexList={dir.children} active={active} nest={(nest ?? 0) + 1} />
            </Collapse.Panel>
          </Collapse>
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col select-none indexlist">
      {indexList.map((dir) => {
        return readIndexList(dir);
      })}
    </div>
  );
};

IndexList.defaultProps = {
  nest: 0,
};

const Docs: NextPage<DocsProps> = ({ content, breadcrumbs, indexList }) => {
  const router = useRouter();
  const { path } = router.query as { path: string[] };
  const [t] = useTranslation(['docs', 'common']);

  const title = `${t('title')} | Laze`;

  const documentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (documentRef.current) {
      documentRef.current.scrollTo(0, 0);
    }
  }, [path]);

  return (
    <>
      <Head>
        <title>{title}</title>

        <meta content={t('description')} name="description" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={t('description')} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://laze.ddns.net/${router.locale + '/' ?? ''}docs/${path.join('/')}`} />
        <meta property="og:image" content="https://laze.ddns.net/img/logo.png" />
        <meta property="og:site_name" content={title} />
        <meta property="og:locale" content={router.locale ?? 'en'} />
      </Head>

      <div className="w-screen h-screen flex overflow-hidden">
        <div className="w-60 border-r-2 overflow-y-scroll">
          <Link href="/" passHref>
            <a className="flex justify-center mt-4">
              <LazeLogo size={120} option="logo_caption" />
            </a>
          </Link>
          <hr className="bg-gray-300 my-4" />
          <div>
            <IndexList indexList={indexList} active={'/' + path.join('/')} />
          </div>
        </div>
        <div ref={documentRef} className="flex-1 pl-8 pr-44 break-normal overflow-y-scroll">
          <div className="px-2 py-4">
            <Breadcrumb>
              {breadcrumbs.map((breadcrumb) => {
                return <Breadcrumb.Item key={breadcrumb.id}>{breadcrumb.title}</Breadcrumb.Item>;
              })}
            </Breadcrumb>
          </div>
          <Markdown
            components={{
              h1: H1,
              h2: H2,
              hr: HR,
              p: Paragraph,
              a: a,
            }}
          >
            {content}
          </Markdown>
          <div className="border-t-2 mt-8">
            <p className="m-0 text-center py-4 text-sm text-gray-500">{t('common:copyright')}</p>
          </div>
        </div>
        <div className="fixed right-8 top-4 w-32">
          <p className="font-bold text-gray-800 my-0">{t('contents')}</p>
          <Anchor>
            <Markdown
              allowedElements={['h2']}
              components={{
                h2: anchorLink,
              }}
            >
              {content}
            </Markdown>
          </Anchor>
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

const getFileName = (path: string): string => {
  const title = fs.readFileSync(path, { encoding: 'utf-8', flag: 'r' }).match('# (.*)');
  return title ? title[1] : '';
};

const getIndexList = (path: string, subpath = '/'): directoryObject[] => {
  const result: directoryObject[] = [];
  fs.readdirSync(`${path}${subpath}`, { withFileTypes: true }).forEach((file) => {
    const filePath = `${subpath}${file.name.split('.')[0]}`;
    if (file.isDirectory()) {
      const fileName = getFileName(`${path}${subpath}${file.name}.md`);
      result.push({
        name: fileName,
        path: filePath,
        children: getIndexList(path, `${subpath}${file.name}/`),
      });
    } else {
      if (
        !result.find((item) => {
          return item.path === filePath;
        })
      ) {
        const fileName = getFileName(`${path}${subpath}${file.name}`);
        result.push({
          name: fileName,
          path: filePath,
          children: [],
        });
      }
    }
  });

  return result;
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

  const indexList = getIndexList(`${DOCS_DIR}/${context.locale}`);

  return {
    props: {
      content,
      breadcrumbs,
      indexList,
      ...(await serverSideTranslations(context.locale, ['common', 'docs'])),
    },
  };
};

export default Docs;
