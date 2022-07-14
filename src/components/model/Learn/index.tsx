import type { FC } from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

import { Pre } from '@/components/model/Learn/CodeBlock';
import { Footer } from '@/components/model/Learn/Footer';
import { Header } from '@/components/model/Learn/Header';
import content from '@/components/model/Learn/learn.md';
import { Info } from '@/components/model/Learn/LearnMarkdown';
import { a, Code, H1, H2, H3, H4, HR, Img, Paragraph, Table, Tbody, Td, Th, Thead, Tr } from '@/components/ui/Markdown';

export const LearnPage: FC = () => {
  return (
    <>
      <canvas id="output-canvas" className="hidden" />

      <div className="flex h-screen w-screen flex-col">
        <Header />

        <div className="flex flex-1">
          <nav className="w-60"></nav>
          <div className="h-full min-w-0 flex-1 overflow-y-auto px-4">
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
