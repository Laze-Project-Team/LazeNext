import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import type { FC } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

import { Pre } from '@/components/model/Learn/CodeBlock';
import { Footer } from '@/components/model/Learn/Footer';
import { Header } from '@/components/model/Learn/Header';
import content from '@/components/model/Learn/learn.md';
import { Info, NavH2, NavH3 } from '@/components/model/Learn/LearnMarkdown';
import { a, Code, H1, H2, H3, H4, HR, Img, Paragraph, Table, Tbody, Td, Th, Thead, Tr } from '@/components/ui/Markdown';

export const LearnPage: FC = () => {
  const [t] = useTranslation('learn');
  const { query } = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mainRef.current && location.hash) {
      const targetElement = document.getElementById(decodeURI(location.hash).slice(1));
      if (targetElement) {
        mainRef.current.scrollTo({
          behavior: 'smooth',
          top: targetElement.offsetTop - 100,
        });
      }
    }
  }, [query]);

  return (
    <>
      <canvas id="output-canvas" className="hidden" />

      <div className="flex h-screen w-screen flex-col">
        <Header />

        <div className="flex flex-1">
          <nav className="w-60 space-y-1 overflow-y-auto p-2">
            <p className="px-2 text-lg font-bold text-gray-700">{t('table_of_contents')}</p>
            <Markdown
              components={{
                h2: NavH2,
                h3: NavH3,
              }}
              allowedElements={['h2', 'h3']}
            >
              {content}
            </Markdown>
          </nav>
          <div className="h-full min-w-0 flex-1 overflow-y-auto px-4" ref={mainRef}>
            <main className="pt-8">
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
                  b: Info,
                }}
                skipHtml={false}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {content}
              </Markdown>
            </main>

            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};
