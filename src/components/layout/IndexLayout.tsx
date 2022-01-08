import { Button, Drawer, Layout, Menu, Typography } from 'antd';
import Link from 'next/link';
import type { FC, ReactNode, VFC } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconContext } from 'react-icons';
import { AiOutlineMenu } from 'react-icons/ai';
import { FaDiscord, FaGithub, FaTwitter } from 'react-icons/fa';

import { useMediaQuery } from '@/components/functional/useMediaQuery';
import { LazeLogo } from '@/components/ui/atoms/LazeLogo';
import { StyledLink } from '@/components/ui/atoms/StyledLink';

export type IndexLayoutProps = {
  children: ReactNode;
};

const NavLink = ({ href, children }: { href: string; children: ReactNode }) => {
  return (
    <StyledLink
      className="px-4 text-gray-400 hover:text-gray-200 hover:bg-white/10 transition-colors duration-200"
      href={href}
    >
      {children}
    </StyledLink>
  );
};

const QUERY_SM_DOWN = '(max-width: 576px)' as const;
const QUERY_MD_UP = '(min-width: 577px)' as const;

const IndexHeader: VFC = () => {
  const [t] = useTranslation(['layout', 'common']);
  const query = useMediaQuery([QUERY_SM_DOWN, QUERY_MD_UP]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const onClick = () => {
    return setIsDrawerOpen(true);
  };
  const onClose = () => {
    return setIsDrawerOpen(false);
  };

  return (
    <>
      <div className="max-w-[58rem] mx-auto flex items-center">
        <div className="inline-flex px-4 py-4 cursor-pointer hover:bg-white/10 transition-colors duration-200">
          <Link href="/" passHref>
            <div className="inline-flex">
              <LazeLogo size={32}></LazeLogo>
              <Typography.Text className="!text-laze-primary text-2xl font-bold ml-2 select-none">Laze</Typography.Text>
            </div>
          </Link>
        </div>
        {typeof window !== 'undefined' && query === QUERY_SM_DOWN ? (
          <div className="ml-auto flex items-center">
            <Button type="text" className="!text-gray-400 hover:!text-gray-200" onClick={onClick}>
              <AiOutlineMenu size="1.4rem" />
            </Button>
            <Drawer title={t('header.drawer')} placement="right" onClose={onClose} visible={isDrawerOpen}>
              <Menu>
                <Menu.Item>
                  <Link href="/editor">{t('header.Editor')}</Link>
                </Menu.Item>
                <Menu.Item>
                  <Link href="/docs">{t('header.Docs')}</Link>
                </Menu.Item>
              </Menu>
            </Drawer>
          </div>
        ) : (
          <div className="flex">
            <NavLink href="/editor">{t('header.Editor')}</NavLink>
            <NavLink href="/docs">{t('header.Docs')}</NavLink>
          </div>
        )}
      </div>
    </>
  );
};

type ContentsListProps = {
  title: string;
  children: ReactNode;
};

const ContentsList: FC<ContentsListProps> = ({ title, children }) => {
  return (
    <div className="flex flex-col space-y-1">
      <Typography.Text strong className="!text-gray-100">
        {title}
      </Typography.Text>
      {children}
    </div>
  );
};

type FooterLinkProps = {
  href: string;
};

const FooterLink: FC<FooterLinkProps> = ({ children, href }) => {
  return (
    <>
      <Link href={href} passHref>
        <a className="text-gray-400 hover:text-gray-300">{children}</a>
      </Link>
    </>
  );
};

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
        <Layout.Header className="z-[1] w-full !px-2">
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
