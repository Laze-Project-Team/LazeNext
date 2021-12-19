import type { FC, ReactNode } from 'react';
import { forwardRef } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Button, Typography } from 'antd';
import { AiOutlineApi, AiOutlineTeam, AiOutlineCloud } from 'react-icons/ai';

import { IndexLayout } from '@/components/layout/IndexLayout';
import { SectionContainer, SectionTitle } from '@/components/ui/atoms/Section';
import { Card, CardContainer } from '@/components/ui/atoms/Card';

const ActionButton: FC = ({ children }) => (
  <>
    <div className="flex justify-center mt-auto pt-4">{children}</div>
  </>
);

const actionLinkStyle =
  'block w-full text-center mx-2 !text-whitesmoke hover:!text-[#BED7E3] font-bold hover:bg-white/5 transition-colors rounded-sm shadow-sm p-2';

type ActionLinkProps = {
  href: string;
  onClick?: () => void;
  children: ReactNode;
};

const ActionLink = forwardRef<HTMLAnchorElement, ActionLinkProps>(({ children, onClick, href }, ref) => (
  <a href={href} className={actionLinkStyle} onClick={onClick} ref={ref}>
    {children}
  </a>
));

type LinkProps = {
  href: string;
};

const ExternalActionLink: FC<LinkProps> = ({ children, href }) => (
  <>
    <a href={href} className={actionLinkStyle} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  </>
);

const Home: NextPage = () => {
  const [t] = useTranslation(['index', 'common']);

  return (
    <>
      <Head>
        <title>Laze - {t('common:motto')} | Laze</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <IndexLayout>
        <h1 className="hidden">{t('title')}</h1>
        <Typography.Text className="block !text-8xl font-semibold">Laze</Typography.Text>
        <Typography.Text className="block text-xl mt-4">{t('common:motto')}</Typography.Text>
        <Button type="primary" size="large" className="mt-8 ml-4 mb-8">
          <Link href="/editor">{t('Try Laze')}</Link>
        </Button>

        <SectionContainer className="bg-[#2b5b84]">
          <SectionTitle className="!text-whitesmoke border-[#1e405e]">{t('Laze Features')}</SectionTitle>
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
                <Link href="/docs" passHref>
                  <ActionLink href="/docs">{t('activities.1.action')}</ActionLink>
                </Link>
              </ActionButton>
            </Card>
            <Card
              title={t('activities.2.title')}
              description={t('activities.2.description')}
              textClass="!text-whitesmoke"
            >
              <ActionButton>
                <ExternalActionLink href="https://discord.gg/K3prMrmS7e">{t('activities.2.action')}</ExternalActionLink>
              </ActionButton>
            </Card>
            <Card
              title={t('activities.3.title')}
              description={t('activities.3.description')}
              textClass="!text-whitesmoke"
            >
              <ActionButton>
                <ExternalActionLink href="https://github.com/Laze-Project-Team">
                  {t('activities.3.action')}
                </ExternalActionLink>
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
