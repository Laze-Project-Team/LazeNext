import { useTranslation } from 'next-i18next';
import type { FC } from 'react';

import { Editor } from '@/components/model/Learn/Editor';
import { Footer } from '@/components/model/Learn/Footer';
import { Header } from '@/components/model/Learn/Header';

export const LearnPage: FC = () => {
  const [t] = useTranslation('learn');

  return (
    <>
      <canvas id="output-canvas" className="hidden" />

      <Header />

      <div className="flex">
        <nav className="w-60"></nav>
        <div className="min-w-0 flex-1 px-4">
          <main>
            <h1 className="my-4 text-4xl text-gray-800">{t('title')}</h1>

            <p>{t('description')}</p>

            <Editor
              initialValue={'関数:実行 () => (){\n    //この下の行に書いてみよう\n    \n}'}
              placeholder={'関数:実行 () => (){\n    //この下の行に書いてみよう\n    表示("ようこそ、Lazeへ！");\n}'}
              cursor={{ lineNumber: 2, column: 5 }}
            />
            <Editor placeholder="this is second placeholder" initialValue="this is initial value" />
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
};
