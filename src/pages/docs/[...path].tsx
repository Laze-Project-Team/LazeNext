import { Anchor, Breadcrumb, Button, Drawer } from 'antd';
import fs from 'fs';
import type { GetStaticPaths, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useRef, useState } from 'react';
import { AiFillInfoCircle, AiOutlineMenu } from 'react-icons/ai';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { useMediaQuery } from '@/components/functional/useMediaQuery';
import { IndexList } from '@/components/model/IndexList';
import { LazeLogo } from '@/components/ui/atoms/LazeLogo';
import { StyledLink } from '@/components/ui/atoms/StyledLink';
import {
  a,
  anchorLink,
  Code,
  H1,
  H2,
  H3,
  H4,
  HR,
  Img,
  Paragraph,
  Pre,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@/components/ui/Markdown';
import { DOCS_DIR } from '@/const/dir';
import type { docsProps } from '@/features/docs/getProps';
import { getDocsProps } from '@/features/docs/getProps';
import { cx } from '@/features/utils/cx';

const QUERY_SM_DOWN = '(max-width: 600px)' as const;
const QUERY_MD_UP = '(min-width: 601px) and (max-width: 960px)' as const;
const QUERY_LG_UP = '(min-width: 961px)' as const;

type DocsProps = docsProps & {
  content: string;
};

const Docs: NextPage<DocsProps> = ({ content, breadcrumbs, indexList, acknowledgement }) => {
  const router = useRouter();
  const media = useMediaQuery([QUERY_SM_DOWN, QUERY_MD_UP, QUERY_LG_UP]);
  const { path } = router.query as { path: string[] };
  const [t] = useTranslation(['docs', 'common']);

  const title = `${t('title')} | Laze`;

  const documentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (documentRef.current) {
      documentRef.current.scrollTo(0, 0);
    }
  }, [path]);

  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  useEffect(() => {
    setIsDrawerVisible(false);
    if (path.join('/') === 'first') {
      const element = document.querySelector('#document h2:nth-of-type(3)');
      if (element) {
        element.scrollIntoView();
      }
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
        <meta property="og:site_name" content={title} />
        <meta property="og:locale" content={router.locale ?? 'en'} />
      </Head>

      <div className="h-screen scroll-p-0">
        <div className="fixed z-10 flex h-16 w-screen bg-white shadow-sm shadow-gray-200">
          <div className="flex items-center">
            {media && media === QUERY_SM_DOWN && (
              <>
                <Button
                  type="text"
                  className="!text-gray-400 hover:!text-gray-200"
                  onClick={() => {
                    return setIsDrawerVisible(true);
                  }}
                >
                  <AiOutlineMenu size="1.4rem" />
                </Button>
                <Drawer
                  placement="left"
                  visible={isDrawerVisible}
                  onClose={() => {
                    return setIsDrawerVisible(false);
                  }}
                >
                  <IndexList indexList={indexList} active={`/${path.join('/')}/`} />
                </Drawer>
              </>
            )}
            <Link href="/" passHref>
              <a className="mx-4 flex items-center rounded-sm px-2 py-1 transition-colors duration-200 hover:bg-laze-primary/10">
                <LazeLogo size={32} option="logo" />
                <span className="ml-1 text-2xl font-semibold text-laze-primary">Laze</span>
              </a>
            </Link>
          </div>
        </div>
        <div>
          {media && media !== QUERY_SM_DOWN && (
            <div className="fixed top-16 z-10 h-[calc(100vh-4rem)] w-64 overflow-y-scroll border-r-2 pt-4">
              <div className="pb-[80vh]">
                <IndexList indexList={indexList} active={`/${path.join('/')}/`} />
              </div>
            </div>
          )}
          <div
            ref={documentRef}
            id="document"
            className={cx(
              'absolute top-16 w-[calc(100vw-18px)] break-normal',
              media && media === QUERY_LG_UP ? 'pr-44' : 'pr-8',
              media && media !== QUERY_SM_DOWN ? 'pl-72' : 'pl-8'
            )}
          >
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

            {acknowledgement && (
              <div className="my-4 flex space-x-4 rounded-md border-l-4 border-blue-600 bg-blue-100 p-4">
                <AiFillInfoCircle className="flex-shrink-0 text-xl text-blue-600" />
                <StyledLink
                  href="/docs/first#contribute"
                  className="!text-gray-900 transition-opacity hover:opacity-70"
                >
                  {t('acknowledgement')}
                </StyledLink>
              </div>
            )}

            <Markdown
              components={{
                h1: H1,
                h2: H2,
                h3: H3,
                h4: H4,
                hr: HR,
                p: Paragraph,
                a: a,
                pre: Pre,
                code: Code,
                table: Table,
                thead: Thead,
                tbody: Tbody,
                tr: Tr,
                th: Th,
                td: Td,
                img: Img,
              }}
              remarkPlugins={[remarkGfm]}
            >
              {content}
            </Markdown>
            <div className="mt-8 border-t-2">
              <p className="m-0 py-4 text-center text-sm text-gray-500">{t('common:copyright')}</p>
            </div>
          </div>
          {media && media === QUERY_LG_UP && (
            <div className="fixed right-8 top-20 z-10 w-32">
              <p className="mt-0 mb-1 font-bold text-gray-800">{t('contents')}</p>
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
          )}
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

export const getStaticPaths: GetStaticPaths = () => {
  const paths = readDirectoryRecursive(DOCS_DIR)
    .map((path) => {
      if (path.split('.')[1] === 'md') {
        return {
          params: {
            path: path.split('.')[0].split('/').slice(2),
          },
          locale: path.split('.')[0].split('/')[1],
        };
      } else {
        return false;
      }
    })
    .filter(Boolean) as unknown as string[];

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

  const props = getDocsProps(`${DOCS_DIR}/${context.locale}`, context.params.path);

  return {
    props: {
      content,
      ...props,
      ...(await serverSideTranslations(context.locale, ['common', 'docs'])),
    },
  };
};

export default Docs;
