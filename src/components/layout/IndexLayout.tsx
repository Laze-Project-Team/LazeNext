import { Layout, Menu } from 'antd';
import type { FC, ReactNode, VFC } from 'react';

import { LazeLogo } from '@/components/ui/LazeLogo';
import { useTranslation } from 'react-i18next';

export type IndexLayoutProps = {
  children: ReactNode;
};

const IndexHeader: VFC = () => {
  const [t] = useTranslation();

  return (
    <>
      <Menu theme="dark" mode="horizontal">
        <LazeLogo size={10} />
        <Menu.Item key="editor">{t('Editor')}</Menu.Item>
        <Menu.Item key="docs">{t('Docs')}</Menu.Item>
      </Menu>
    </>
  );
};

const IndexFooter: VFC = () => {
  return <footer></footer>;
};

const IndexLayout: FC<IndexLayoutProps> = ({ children }) => {
  return (
    <>
      <Layout>
        <Layout.Header className="z-[1] w-full">
          <IndexHeader></IndexHeader>
        </Layout.Header>
        <Layout.Content className="">{children}</Layout.Content>
        <Layout.Footer>
          <IndexFooter></IndexFooter>
        </Layout.Footer>
      </Layout>
    </>
  );
};

export { IndexLayout };
