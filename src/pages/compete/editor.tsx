import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { RefObject } from 'react';
import { useEffect } from 'react';
import { createContext, useRef } from 'react';
import { useDispatch } from 'react-redux';
import SplitPane from 'react-split-pane';

import { CompeteButtons } from '@/components/model/EditorButtons/compete';
import { EditorFooter } from '@/components/model/EditorFooter';
// import { Explorer } from '@/components/model/Explorer';
import { Editor as MonacoEditor } from '@/components/model/MonacoEditor';
import { WorkBench } from '@/components/model/WorkBench';
import { linetraceTemplate } from '@/const/linetraceSample';
import { explorerSlice } from '@/features/redux/explorer';

export const splitPaneRefContext = createContext<RefObject<SplitPane> | null>(null);

const Editor: NextPage = () => {
  const { locale } = useRouter();
  const [t] = useTranslation(['editor', 'common']);

  const title = `${t('title')} | Laze`;

  const splitPaneRef = useRef<SplitPane>(null);

  const dispatch = useDispatch();
  const { setDirectory } = explorerSlice.actions;

  useEffect(() => {
    dispatch(
      setDirectory({
        projectName: '',
        directory: {
          '/main.laze': {
            type: 'file',
            content: linetraceTemplate,
            isRenaming: false,
          },
        },
      })
    );
  }, [dispatch, setDirectory]);

  return (
    <>
      <Head>
        <title>{title}</title>

        <meta content={t('description')} name="description" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={t('description')} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://laze.ddns.net/${locale + '/' ?? ''}editor`} />
        <meta property="og:site_name" content={title} />
        <meta property="og:locale" content={locale ?? 'en'} />

        <meta name="robots" content="noindex" />
      </Head>

      <div className="flex h-screen w-screen flex-col overflow-hidden text-[0.9rem] dark:bg-background dark:text-[#ccc]">
        <div className="min-h-0 flex-1">
          <SplitPane
            split="horizontal"
            primary="second"
            defaultSize="max(12rem, 20%)"
            paneStyle={{ minHeight: '0' }}
            pane2Style={{ maxHeight: 'calc(100% - 11.75rem)' }}
            className="!static"
            ref={splitPaneRef}
          >
            {/* <SplitPane
                  split="vertical"
                  primary="first"
                  defaultSize="12rem"
                  pane1Style={{ minWidth: '6rem', maxWidth: '50%' }}
                >
                  <div className="h-full">
                    <Explorer />
                  </div> */}
            <div className="flex h-full flex-1 flex-col">
              <div className="h-7">
                <CompeteButtons />
              </div>
              <div className="flex-1">
                <MonacoEditor />
              </div>
            </div>
            {/* </SplitPane> */}

            <div className="h-full w-full">
              <WorkBench />
            </div>
          </SplitPane>
        </div>
        <EditorFooter />
      </div>
    </>
  );
};

type contextType = {
  locale: string;
};
export const getStaticProps = async (context: contextType) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common', 'editor'])),
    },
  };
};

export default Editor;