import { Button, Layout, notification, Tooltip } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import type { VFC } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { AiOutlineDoubleRight } from 'react-icons/ai';
import { BsQuestion } from 'react-icons/bs';
import { MdLeaderboard } from 'react-icons/md';
import Markdown from 'react-markdown';
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
  const [isSiderbarCollapsed, setIsSiderbarCollapsed] = useState(false);

  const { locale, query } = useRouter();
  const level = (query.level ?? '') as string;
  const id = (query.id ?? '') as string;
  const name = (query.name ?? '') as string;

  const [content, setContent] = useState('');

  useEffect(() => {
    const openFetchError = (errorItem: string) => {
      notification.open({
        message: t(`fetch ${errorItem} error`),
        description: t(`fetch ${errorItem} error message`, { level, id: name }),
      });
    };
    if (query.id && query.levelID) {
      const url = `/api/compete/getexplanation?id=${query.id}&level=${query.levelID}&lang=${locale}`;
      fetch(url, {
        method: 'GET',
      })
        .then((res) => {
          if (res.ok) {
            return res.text();
          } else {
            openFetchError('explanation');
          }
        })
        .then((text) => {
          setContent(text ?? '');
        });
    }
  }, [query, content, id, level, name, locale, t]);

  return (
    <Layout className="relative flex h-full flex-1">
      <Layout.Content>
        <MonacoEditor />
      </Layout.Content>
      <div className="absolute right-0 bottom-0 z-10 flex flex-col space-y-2 pb-4 pr-4">
        <Link href={`/compete/${query.id ?? ''}`}>
          <Tooltip title={t('goToLeaderboard')}>
            <Button
              type="primary"
              shape="circle"
              icon={<MdLeaderboard className="relative top-[-2px] inline h-full w-full" />}
            />
          </Tooltip>
        </Link>
        <Tooltip title={isSiderbarCollapsed ? t('help') : t('close_help')}>
          <Button
            type="primary"
            shape="circle"
            icon={
              isSiderbarCollapsed ? (
                <BsQuestion className="relative top-[-2px] inline h-full w-full" />
              ) : (
                <AiOutlineDoubleRight className="relative top-[-2px] inline h-full w-full" />
              )
            }
            onClick={() => {
              setIsSiderbarCollapsed((isSiderbarCollapsed) => {
                return !isSiderbarCollapsed;
              });
            }}
          />
        </Tooltip>
      </div>
      <Layout.Sider width="35%" collapsed={isSiderbarCollapsed} collapsible trigger={null} collapsedWidth="0">
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
            {content ?? ''}
          </Markdown>
        </div>
      </Layout.Sider>
    </Layout>
  );
};
