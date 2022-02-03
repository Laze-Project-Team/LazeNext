import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { RefObject } from 'react';
import { createContext, useCallback, useEffect, useRef } from 'react';
import SplitPane from 'react-split-pane';

import { EditorButtons } from '@/components/model/EditorButtons';
import { EditorFooter } from '@/components/model/EditorFooter';
// import { Explorer } from '@/components/model/Explorer';
import { Editor as MonacoEditor } from '@/components/model/MonacoEditor';
import { WorkBench } from '@/components/model/WorkBench';

export const ratioRefContext = createContext<RefObject<HTMLDivElement> | null>(null);
export const splitPaneRefContext = createContext<RefObject<SplitPane> | null>(null);
export const ratioAdjustContext = createContext<() => void>(() => {
  return void 0;
});

const Editor: NextPage = () => {
  const { locale } = useRouter();
  const [t] = useTranslation(['editor', 'common']);

  const title = `${t('title')} | Laze`;

  const ratioRef = useRef<HTMLDivElement>(null);
  const splitPaneRef = useRef<SplitPane>(null);

  const reflectSizeToCanvas = (ref: RefObject<HTMLDivElement>) => {
    if (ref.current === null) {
      return;
    }

    const parent = ref.current.parentElement as HTMLDivElement;

    if (parent.clientWidth > (parent.clientHeight / 9) * 16) {
      ref.current.style.width = `${(parent.clientHeight / 9) * 16}px`;
    } else {
      ref.current.style.width = 'auto';
    }
  };

  const handleResize = useCallback(() => {
    reflectSizeToCanvas(ratioRef);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize, false);
    return () => {
      return window.removeEventListener('resize', handleResize, false);
    };
  }, [handleResize]);

  return (
    <>
      <ratioRefContext.Provider value={ratioRef}>
        <ratioAdjustContext.Provider value={handleResize}>
          <Head>
            <title>{title}</title>

            <meta content={t('description')} name="description" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={t('description')} />
            <meta property="og:type" content="article" />
            <meta property="og:url" content={`https://laze.ddns.net/${locale + '/' ?? ''}editor`} />
            <meta property="og:site_name" content={title} />
            <meta property="og:locale" content={locale ?? 'en'} />
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
                onChange={handleResize}
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
                    <EditorButtons />
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
        </ratioAdjustContext.Provider>
      </ratioRefContext.Provider>
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
