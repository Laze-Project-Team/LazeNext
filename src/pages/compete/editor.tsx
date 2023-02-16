import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { MutableRefObject, RefObject } from 'react';
import { createContext, useRef } from 'react';
import SplitPane from 'react-split-pane';

import { CompileErrorProvider } from '@/components/functional/CompileErrorProvider';
import { CompeteEditorLayout } from '@/components/layout/CompeteEditorLayout';
import { CompeteButtons } from '@/components/model/EditorButtons/compete';
import { EditorFooter } from '@/components/model/EditorFooter';
// import { Explorer } from '@/components/model/Explorer';
import { WorkBench } from '@/components/model/WorkBench';

export const splitPaneRefContext = createContext<RefObject<SplitPane> | null>(null);
export const competeProgramLangContext = createContext<MutableRefObject<string> | null>(null);

const Editor: NextPage = () => {
  const { locale } = useRouter();
  const [t] = useTranslation(['editor', 'common']);

  const title = `${t('title')} | Laze`;

  const splitPaneRef = useRef<SplitPane>(null);

  const programLangRef = useRef(locale ?? 'en');

  return (
    <>
      <competeProgramLangContext.Provider value={programLangRef}>
        <CompileErrorProvider>
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
                  <div className="flex h-full flex-1">
                    <CompeteEditorLayout />
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
        </CompileErrorProvider>
      </competeProgramLangContext.Provider>
    </>
  );
};

type contextType = {
  locale: string;
};
export const getStaticProps = async (context: contextType) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common', 'editor', 'compete'])),
    },
  };
};

export default Editor;