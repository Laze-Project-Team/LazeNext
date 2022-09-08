import { Button, Layout, notification, Tooltip } from 'antd';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import type { VFC } from 'react';
import Markdown from 'react-markdown';
import { useQuery } from 'react-query';
import remarkGfm from 'remark-gfm';

import { Editor as MonacoEditor } from '@/components/model/MonacoEditor';

import {
  a,
  Code,
  H1,
  H2,
  H3,
  H4,
  H5,
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
} from '../ui/EditorMarkdown';

export const CompeteEditorLayout: VFC = () => {
  const [t] = useTranslation('compete');

  const { locale, query } = useRouter();
  const level = (query.level ?? '') as string;
  const id = (query.id ?? '') as string;

  const openFetchError = (errorItem: string) => {
    notification.open({
      message: t(`fetch ${errorItem} error`),
      description: t(`fetch ${errorItem} error message`, { level, id }),
    });
  };

  const fetchExplanation = async () => {
    if (query.level && query.id) {
      const url = `/api/compete/getexplanation?id=${id}&level=${level}&lang=${locale}`;
      const res = await fetch(url, {
        method: 'GET',
      });
      if (res.ok) {
        const text = res.text();

        return text;
      } else {
        openFetchError('explanation');
      }
    }
  };

  const content = useQuery('explanation', fetchExplanation, {
    retry: 2,
  });

  return (
    <Layout className="relative flex h-full flex-1">
      <Layout.Content>
        <MonacoEditor />
      </Layout.Content>
      <div className="absolute right-0 bottom-0 flex flex-col pb-4 pr-4">
        <Tooltip title={t('')}>
          <Button shape="circle" icon={<></>}></Button>
        </Tooltip>
      </div>
      <Layout.Sider width="35%">
        <div className="editor-scrollable scrollable-normal h-full overflow-y-scroll border-l-[1px] border-b-[1px] !border-[#cccccc] bg-white p-4 pt-0 dark:!border-[#3e3e3e] dark:!bg-[#1e1e1e]">
          <Markdown
            components={{
              h1: H1,
              h2: H2,
              h3: H3,
              h4: H4,
              h5: H5,
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
            {content.isFetched ? content.data ?? '' : ''}
          </Markdown>
        </div>
      </Layout.Sider>
    </Layout>
  );
};
