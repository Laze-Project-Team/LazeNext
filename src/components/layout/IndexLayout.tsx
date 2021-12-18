import { Layout, Menu, Typography } from 'antd';
import type { FC, ReactNode, VFC } from 'react';

import { LazeLogo } from '@/components/ui/LazeLogo';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export type IndexLayoutProps = {
  children: ReactNode;
};

const IndexHeader: VFC = () => {
  const [t] = useTranslation('layout');

  return (
    <>
      <div className="flex items-center">
        <div className="inline-flex px-4 py-4 cursor-pointer hover:bg-white/10 transition-colors duration-200">
          <Link href="/">
            <div className="inline-flex">
              <LazeLogo size={32}></LazeLogo>
              <Typography.Text className="!text-laze-primary text-2xl font-bold ml-2 select-none">Laze</Typography.Text>
            </div>
          </Link>
        </div>
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="editor">
            <Link href="/editor">{t('Editor')}</Link>
          </Menu.Item>
          <Menu.Item key="docs">
            <Link href="/docs">{t('Docs')}</Link>
          </Menu.Item>
        </Menu>
      </div>
    </>
  );
};

const IndexFooter: VFC = () => {
  return <footer></footer>;
};

const IndexLayout: FC<IndexLayoutProps> = ({ children }) => {
  return (
    <>
      <Layout className="overflow-x-hidden">
        <Layout.Header className="z-[1] w-full">
          <IndexHeader></IndexHeader>
        </Layout.Header>
        <Layout.Content className="w-[60rem] max-w-full mx-auto px-4 py-4">{children}</Layout.Content>
        <Layout.Footer>
          <IndexFooter></IndexFooter>
        </Layout.Footer>
      </Layout>
    </>
  );
};

export { IndexLayout };
