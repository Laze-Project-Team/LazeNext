import { Layout, Menu, Typography } from 'antd';
import type { FC, ReactNode, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { IconContext } from 'react-icons';
import { FaGithub, FaTwitter, FaDiscord } from 'react-icons/fa';

import { LazeLogo } from '@/components/ui/atoms/LazeLogo';

export type IndexLayoutProps = {
  children: ReactNode;
};

const IndexHeader: VFC = () => {
  const [t] = useTranslation(['layout', 'common']);

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
            <Link href="/editor">{t('header.Editor')}</Link>
          </Menu.Item>
          <Menu.Item key="docs">
            <Link href="/docs">{t('header.Docs')}</Link>
          </Menu.Item>
        </Menu>
      </div>
    </>
  );
};

type ContentsListProps = {
  title: string;
  children: ReactNode;
};

const ContentsList: FC<ContentsListProps> = ({ title, children }) => (
  <div className="flex flex-col space-y-1">
    <Typography.Text strong className="!text-gray-100">
      {title}
    </Typography.Text>
    {children}
  </div>
);

type FooterLinkProps = {
  href: string;
  className?: string;
};

const FooterLink: FC<FooterLinkProps> = ({ children, href }) => (
  <>
    <Link href={href} passHref>
      <a className="text-gray-400 hover:text-gray-300">{children}</a>
    </Link>
  </>
);

const IndexFooter: VFC = () => {
  const [t] = useTranslation(['layout', 'common']);

  return (
    <>
      <div className="flex sm:flex-nowrap flex-wrap space-y-4 sm:space-y-0 max-w-[58rem] mx-auto">
        <div className="w-full sm:w-auto">
          <div className="flex items-center space-x-2">
            <LazeLogo size={40} option="logo_gray" className="relative top-1" />
            <Typography.Text className="text-5xl !text-whitesmoke">Laze</Typography.Text>
          </div>
          <div className="mt-2">
            <Typography.Text className="!text-whitesmoke">{t('common:motto')}</Typography.Text>
          </div>
          <div className="flex space-x-2 mt-6">
            <IconContext.Provider value={{ size: '1.5rem' }}>
              <a
                href="https://github.com/Laze-Project-Team"
                title="GitHub"
                className="text-gray-400 hover:text-gray-300"
              >
                <FaGithub />
              </a>
              <a
                href="https://twitter.com/LazeProjectTeam"
                title="Twitter"
                className="text-gray-400 hover:text-gray-300"
              >
                <FaTwitter />
              </a>
              <a href="https://discord.gg/K3prMrmS7e" title="Discord" className="text-gray-400 hover:text-gray-300">
                <FaDiscord />
              </a>
            </IconContext.Provider>
          </div>
          <div className="mt-4">
            <Typography.Text className="!text-gray-400">{t('common:copyright')}</Typography.Text>
          </div>
        </div>
        <div className="flex space-x-4 sm:ml-auto">
          <ContentsList title={t('footer.Guides')}>
            <FooterLink href="/terms">{t('footer.guides.Terms')}</FooterLink>
            <FooterLink href="/guideline">{t('footer.guides.Guideline')}</FooterLink>
            <FooterLink href="/privacy">{t('footer.guides.Privacy')}</FooterLink>
          </ContentsList>
          <ContentsList title={t('footer.Sitemap')}>
            <FooterLink href="/">{t('footer.sitemap.Home')}</FooterLink>
            <FooterLink href="/editor">{t('footer.sitemap.Editor')}</FooterLink>
            <FooterLink href="/docs">{t('footer.sitemap.Docs')}</FooterLink>
          </ContentsList>
        </div>
      </div>
    </>
  );
};

const IndexLayout: FC<IndexLayoutProps> = ({ children }) => {
  return (
    <>
      <Layout className="overflow-x-hidden">
        <Layout.Header className="z-[1] w-full">
          <IndexHeader></IndexHeader>
        </Layout.Header>
        <Layout.Content className="w-[60rem] max-w-full mx-auto px-4 pt-4">{children}</Layout.Content>
        <Layout.Footer className="!bg-[#333344]">
          <IndexFooter></IndexFooter>
        </Layout.Footer>
      </Layout>
    </>
  );
};

export { IndexLayout };
