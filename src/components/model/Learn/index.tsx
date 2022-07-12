import { useTranslation } from 'next-i18next';
import type { FC } from 'react';

import { Editor } from '@/components/model/Learn/Editor';
import { Footer } from '@/components/model/Learn/Footer';
import { Header } from '@/components/model/Learn/Header';

export const LearnPage: FC = () => {
  const [t] = useTranslation();

  return (
    <>
      <Header />

      <main className="px-4">
        <h1 className="text-4xl">{t('title')}</h1>

        <p>{t('description')}</p>

        <Editor
          initialValue={'関数: 実行 () => {\n    \n}'}
          placeholder={'関数: 実行 () => {\n    表示("ようこそ、Lazeへ！");\n}'}
          cursor={{ lineNumber: 2, column: 5 }}
        />
        <Editor placeholder="this is second placeholder" initialValue="this is initial value" />
      </main>

      <Footer />
    </>
  );
};
