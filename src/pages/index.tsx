import { Button, Typography } from 'antd';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { FC, ReactNode } from 'react';
import { AiOutlineApi, AiOutlineCloud, AiOutlineTeam } from 'react-icons/ai';
import { FaDiscord } from 'react-icons/fa';

import { IndexLayout } from '@/components/layout/IndexLayout';
import { Card, CardContainer } from '@/components/ui/atoms/Card';
import { SectionContainer, SectionTitle } from '@/components/ui/atoms/Section';
import { StyledLink } from '@/components/ui/atoms/StyledLink';

const ActionButton: FC = ({ children }) => {
  return (
    <>
      <div className="mt-auto flex justify-center pt-4">{children}</div>
    </>
  );
};

type ActionLinkProps = {
  href: string;
  onClick?: () => void;
  children: ReactNode;
};

const ActionLink: FC<ActionLinkProps> = ({ children, href, onClick }) => {
  return (
    <StyledLink
      href={href}
      className="mx-2 block w-full rounded-sm p-2 text-center font-bold !text-whitesmoke shadow-sm transition-colors hover:bg-white/5 hover:!text-[#BED7E3]"
      onClick={onClick}
    >
      {children}
    </StyledLink>
  );
};

const Home: NextPage = () => {
  const { locale } = useRouter();
  const [t] = useTranslation(['index', 'common']);
  const title = `Laze - ${t('common:motto')} | Laze`;

  return (
    <>
      <Head>
        <title>{title}</title>

        <meta content={t('description')} name="description" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={t('description')} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://laze.ddns.net/${locale ?? ''}`} />
        <meta property="og:site_name" content={title} />
        <meta property="og:locale" content={locale ?? 'en'} />
      </Head>

      <IndexLayout>
        <h1 className="hidden">{t('title')}</h1>
        <Typography.Text className="block !text-8xl font-semibold">Laze</Typography.Text>
        <Typography.Text className="mt-4 block text-xl">{t('common:motto')}</Typography.Text>
        <div className="mt-4 mb-12 flex flex-wrap items-center space-x-4">
          <Button type="primary" size="large" className="mt-4">
            <Link href="/editor">{t('Try Laze')}</Link>
          </Button>
          <StyledLink
            className="mt-4 text-lg"
            href={locale === 'en' ? 'https://forms.gle/FH4XYbnvgSMTEyX66' : 'https://forms.gle/arQwxAY8NuuT1zfi8'}
          >
            {t('requests')}
          </StyledLink>

          <Button type="primary" size="large" className="!ml-auto !mr-4 !mt-4">
            <StyledLink href="https://discord.gg/K3prMrmS7e">
              <>
                <FaDiscord className="relative -top-[2px] mr-2 inline text-xl" />
                <span>{t('discord')}</span>
              </>
            </StyledLink>
          </Button>
        </div>

        <SectionContainer className="bg-[#2b5b84]">
          <SectionTitle className="border-[#1e405e] !text-whitesmoke">{t('Laze Features')}</SectionTitle>
          <CardContainer>
            <Card
              title={t('features.1.title')}
              description={t('features.1.description')}
              textClass="!text-whitesmoke"
              icon={<AiOutlineTeam />}
            />
            <Card
              title={t('features.2.title')}
              description={t('features.2.description')}
              textClass="!text-whitesmoke"
              icon={<AiOutlineApi />}
            />
            <Card
              title={t('features.3.title')}
              description={t('features.3.description')}
              textClass="!text-whitesmoke"
              icon={<AiOutlineCloud />}
            />
          </CardContainer>
        </SectionContainer>

        <SectionContainer className="bg-whitesmoke">
          <SectionTitle className="border-primary-400">{t('Laze Production')}</SectionTitle>
          <CardContainer>
            <Card title={t('productions.1.title')} description={t('productions.1.description')} />
            <Card title={t('productions.2.title')} description={t('productions.2.description')} />
            <Card
              title={t('productions.3.title')}
              description={t('productions.3.description')}
              className="opacity-50"
            />
          </CardContainer>
        </SectionContainer>

        <SectionContainer className="bg-primary-600">
          <SectionTitle className="border-primary-800 text-whitesmoke">{t('Join Laze')}</SectionTitle>
          <CardContainer>
            <Card
              title={t('activities.1.title')}
              description={t('activities.1.description')}
              textClass="!text-whitesmoke"
            >
              <ActionButton>
                <ActionLink href="/docs">{t('activities.1.action')}</ActionLink>
              </ActionButton>
            </Card>
            <Card
              title={t('activities.2.title')}
              description={t('activities.2.description')}
              textClass="!text-whitesmoke"
            >
              <ActionButton>
                <ActionLink href="https://discord.gg/K3prMrmS7e">{t('activities.2.action')}</ActionLink>
              </ActionButton>
            </Card>
            <Card
              title={t('activities.3.title')}
              description={t('activities.3.description')}
              textClass="!text-whitesmoke"
            >
              <ActionButton>
                <ActionLink href="https://github.com/Laze-Project-Team">{t('activities.3.action')}</ActionLink>
              </ActionButton>
            </Card>
          </CardContainer>
        </SectionContainer>
      </IndexLayout>
    </>
  );
};

type contextType = {
  locale: string;
};
export const getStaticProps = async (context: contextType) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common', 'layout', 'index'])),
    },
  };
};

export default Home;
