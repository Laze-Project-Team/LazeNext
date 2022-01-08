import { Anchor, Breadcrumb } from 'antd';
import fs from 'fs';
import type { GetStaticPaths, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useRef } from 'react';
import Markdown from 'react-markdown';

import { IndexList } from '@/components/model/IndexList';
import { LazeLogo } from '@/components/ui/atoms/LazeLogo';
import { a, anchorLink, H1, H2, HR, Paragraph } from '@/components/ui/Markdown';
import type { breadcrumb, directoryObject } from '@/features/docs/getProps';
import { getDocsProps } from '@/features/docs/getProps';

type DocsProps = {
  content: string;
  breadcrumbs: breadcrumb[];
  indexList: directoryObject[];
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
        <div className="w-64 border-r-2 overflow-y-scroll">
          <Link href="/" passHref>
            <a className="flex justify-center mt-4">
              <LazeLogo size={120} option="logo_caption" />
            </a>
          </Link>
          <hr className="bg-gray-300 my-4" />
          <div className="pb-[80vh]">
            <IndexList indexList={indexList} active={`/${path.join('/')}/`} />
          </div>
        </div>
        <div ref={documentRef} className="flex-1 pl-8 pr-44 break-normal overflow-y-scroll">
          <div className="px-2 py-4">
            <Breadcrumb>
              {breadcrumbs.map((breadcrumb, i) => {
                if (breadcrumbs.length === i + 1) {
                  return <Breadcrumb.Item key={breadcrumb.href}>{breadcrumb.title}</Breadcrumb.Item>;
                }
                return (
                  <Breadcrumb.Item key={breadcrumb.href}>
                    <Link href={`/docs${breadcrumb.href}`}>{breadcrumb.title}</Link>
                  </Breadcrumb.Item>
                );
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
          <p className="font-bold text-gray-800 mt-0 mb-1">{t('contents')}</p>
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

  const { indexList, breadcrumbs } = getDocsProps(`${DOCS_DIR}/${context.locale}`, context.params.path);

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
