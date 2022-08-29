import { Button, Drawer, Layout, Menu, Typography } from 'antd';
import Link from 'next/link';
import type { FC, ReactNode, VFC } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconContext } from 'react-icons';
import { AiOutlineMenu } from 'react-icons/ai';
import { FaDiscord, FaGithub, FaTwitter } from 'react-icons/fa';

import { useMediaQuery } from '@/components/functional/useMediaQuery';
import { ChangeLanguage } from '@/components/model/ChangeLanguage';
import { QiitaIcon } from '@/components/ui/atoms/icons/QiitaIcon';
import { LazeLogo } from '@/components/ui/atoms/LazeLogo';
import { StyledLink } from '@/components/ui/atoms/StyledLink';

export type IndexLayoutProps = {
  children: ReactNode;
};

const NavLink = ({ href, children }: { href: string; children: ReactNode }) => {
  return (
    <StyledLink
      className="px-4 text-gray-400 transition-colors duration-200 hover:bg-white/10 hover:text-gray-200"
      href={href}
    >
      {children}
    </StyledLink>
  );
};

// const AccountLink = ({ href, children }: { href: string; children: ReactNode }) => {
//   return (
//     <Button
//       type="text"
//       className="inline-flex h-8 items-center rounded-sm !text-gray-400 hover:!bg-white/5 hover:!text-gray-200"
//     >
//       <StyledLink href={href} className="!transition-none">
//         {children}
//       </StyledLink>
//     </Button>
//   );
// };

// const AccountButton = ({ href, children, title }: { href: string; children: ReactNode; title: string }) => {
//   return (
//     <Button
//       type="text"
//       className="inline-flex h-8 w-8 items-center justify-center rounded-sm !p-1 !text-gray-400 hover:!bg-white/5 hover:!text-gray-200"
//       title={title}
//     >
//       <StyledLink href={href} className="flex justify-center !transition-none">
//         {children}
//       </StyledLink>
//     </Button>
//   );
// };

const QUERY_XS_DOWN = '(max-width: 400px)';
const QUERY_SM_DOWN = '(max-width: 568px)';
const QUERY_MD_DOWN = '(max-width: 767px)';
const QUERY_MD_UP = '(min-width: 768px)';

const IndexHeader: VFC = () => {
  const [t] = useTranslation(['layout', 'common']);
  // const { user } = useAuthContext();
  const media = useMediaQuery([QUERY_XS_DOWN, QUERY_SM_DOWN, QUERY_MD_DOWN, QUERY_MD_UP]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const onClick = () => {
    return setIsDrawerOpen(true);
  };
  const onClose = () => {
    return setIsDrawerOpen(false);
  };

  return (
    <>
      <div className="mx-auto flex max-w-[58rem] items-center">
        <div className="flex cursor-pointer px-4 py-4 transition-colors duration-200 hover:bg-white/10">
          <Link href="/" passHref>
            <div className="inline-flex">
              <LazeLogo size={32} />
              <Typography.Text className="ml-2 select-none text-2xl font-bold !text-laze-primary">Laze</Typography.Text>
            </div>
          </Link>
        </div>
        {media === QUERY_MD_UP && (
          <>
            <div className="flex flex-1">
              <NavLink href="/editor">{t('header.Editor')}</NavLink>
              <NavLink href="/docs">{t('header.Docs')}</NavLink>
            </div>
          </>
        )}
        <div className="ml-auto flex items-center">
          {/* {media && [QUERY_SM_DOWN, QUERY_XS_DOWN].includes(media) ? (
            <IconContext.Provider value={{ size: '1.2rem' }}>
              {user ? (
                <>
                  <AccountButton href="/profile" title={t('header.Profile')}>
                    <AiOutlineUser />
                  </AccountButton>
                  <AccountButton href="/logout" title={t('header.Logout')}>
                    <AiOutlineLogout />
                  </AccountButton>
                </>
              ) : (
                <>
                  <AccountButton href="/login" title={t('header.Signup')}>
                    <AiOutlineLogin />
                  </AccountButton>
                </>
              )}
            </IconContext.Provider>
          ) : (
            <>
              {user ? (
                <>
                  <AccountLink href="/profile">{t('header.Profile')}</AccountLink>
                  <AccountLink href="/logout">{t('header.Logout')}</AccountLink>
                </>
              ) : (
                <>
                  <AccountLink href="/login">{t('header.SignUp')}</AccountLink>
                </>
              )}
            </>
          )} */}
          <ChangeLanguage isText={media !== QUERY_XS_DOWN} />
          {media !== QUERY_MD_UP && (
            <>
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
            </>
          )}
        </div>
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
    <div className="mr-4 mb-4 flex flex-col space-y-1">
      <Typography.Text strong className="!text-gray-100">
        {title}
      </Typography.Text>
      {children}
    </div>
  );
};

type FooterLinkProps = {
  href: string;
  locale?: string;
};

const FooterLink: FC<FooterLinkProps> = ({ children, href, locale }) => {
  return (
    <>
      <Link href={href} locale={locale} passHref>
        <a className="text-gray-400 hover:text-gray-300">{children}</a>
      </Link>
    </>
  );
};

const IndexFooter: VFC = () => {
  const [t] = useTranslation(['layout', 'common']);

  return (
    <>
      <div className="mx-auto flex max-w-[58rem] flex-wrap space-y-4 sm:flex-nowrap sm:space-y-0">
        <div className="w-full sm:w-auto">
          <div className="flex items-center space-x-2">
            <LazeLogo size={40} option="logo_gray" className="relative top-1" />
            <Typography.Text className="text-5xl !text-whitesmoke">Laze</Typography.Text>
          </div>
          <div className="mt-2">
            <Typography.Text className="!text-whitesmoke">{t('common:motto')}</Typography.Text>
          </div>
          <div className="mt-6 flex space-x-2">
            <IconContext.Provider value={{ size: '1.5rem' }}>
              <a
                href="https://github.com/Laze-Project-Team"
                title="GitHub"
                className="text-gray-400 hover:text-gray-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub />
              </a>
              <a
                href="https://twitter.com/LazeProjectTeam"
                title="Twitter"
                className="text-gray-400 hover:text-gray-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter />
              </a>
              <a
                href="https://discord.gg/K3prMrmS7e"
                title="Discord"
                className="text-gray-400 hover:text-gray-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaDiscord />
              </a>
              <a
                href="https://qiita.com/tags/laze"
                title="Qiita"
                className="text-gray-400 hover:text-gray-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <QiitaIcon className="h-6 w-6" />
              </a>
            </IconContext.Provider>
          </div>
          <div className="mt-4">
            <Typography.Text className="!text-gray-400">{t('common:copyright')}</Typography.Text>
          </div>
        </div>
        <div className="flex flex-wrap sm:ml-auto">
          <ContentsList title={t('footer.Guides')}>
            <FooterLink href="/terms">{t('footer.guides.Terms')}</FooterLink>
            <FooterLink href="/guideline">{t('footer.guides.Guideline')}</FooterLink>
            <FooterLink href="/privacy">{t('footer.guides.Privacy')}</FooterLink>
            <FooterLink href="/license">{t('footer.guides.License')}</FooterLink>
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
      <Layout className="flex !min-h-screen flex-col overflow-x-hidden">
        <Layout.Header className="z-[1] w-full !px-2">
          <IndexHeader />
        </Layout.Header>
        <Layout.Content className="mx-auto w-[60rem] max-w-full flex-1 px-4 pt-4">{children}</Layout.Content>
        <Layout.Footer className="!bg-[#333344]">
          <IndexFooter />
        </Layout.Footer>
      </Layout>
    </>
  );
};

export { IndexFooter, IndexHeader, IndexLayout };
