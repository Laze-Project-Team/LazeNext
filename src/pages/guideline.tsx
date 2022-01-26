import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { FC } from 'react';

import { IndexLayout } from '@/components/layout/IndexLayout';
import { LazeLogo } from '@/components/ui/atoms/LazeLogo';
import { H1, H2, H3, H4, LI, P, UL } from '@/components/ui/IndexLayout';
import { WithLink } from '@/components/ui/WithLink';

const GuideLine: NextPage = () => {
  const { locale } = useRouter();
  const [t] = useTranslation('guideline');
  const title = `${t('title')} | Laze`;

  return (
    <>
      <Head>
        <title>{title}</title>

        <meta content={t('description')} name="description" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={t('description')} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://laze.ddns.net/${locale + '/' ?? ''}guideline`} />
        <meta property="og:site_name" content={title} />
        <meta property="og:locale" content={locale ?? 'en'} />
      </Head>

      <IndexLayout>
        <H1>{t('title')}</H1>

        <H2>{t('LogoGuideline.title')}</H2>
        <P>{t('LogoGuideline.description')}</P>

        <H3>{t('LogoGuideline.requirement.title')}</H3>
        <P>{t('LogoGuideline.requirement.1')}</P>
        <P>{t('LogoGuideline.requirement.2.title')}</P>
        <UL>
          <LI>{t('LogoGuideline.requirement.2.1')}</LI>
          <LI>{t('LogoGuideline.requirement.2.2')}</LI>
        </UL>
        <P>
          <WithLink title={t('LogoGuideline.requirement.3')} />
        </P>

        <H3>{t('LogoGuideline.LogoKinds.title')}</H3>
        <P>{t('LogoGuideline.LogoKinds.description')}</P>
        <div className="flex flex-wrap mb-8">
          <LazeLogo size={160} option="logo" />
          <LazeLogo size={160} option="logo_caption" />
        </div>

        <H3>{t('LogoGuideline.BrandColor.title')}</H3>
        <P>{t('LogoGuideline.BrandColor.description')}</P>
        <div className="flex flex-wrap space-x-8 mb-8">
          <BrandColor
            title={t('LogoGuideline.BrandColor.main')}
            hex="#EBA059"
            rgb="R235 G160 B89"
            cmyk="C0% M32% Y62% K8%"
          />
          <BrandColor
            title={t('LogoGuideline.BrandColor.spare')}
            hex="#F2BD8B"
            rgb="R242 G189 B139"
            cmyk="C0% M22% Y43% K5%"
          />
        </div>

        <H3>{t('LogoGuideline.ProhibitedMatters.title')}</H3>
        <P>{t('LogoGuideline.ProhibitedMatters.description')}</P>
        <UL>
          <LI>{t('LogoGuideline.ProhibitedMatters.1')}</LI>
          <LI>{t('LogoGuideline.ProhibitedMatters.2')}</LI>
          <LI>{t('LogoGuideline.ProhibitedMatters.3')}</LI>
          <LI>{t('LogoGuideline.ProhibitedMatters.4')}</LI>
        </UL>

        <P className="mt-8 mb-16">{locale !== 'ja' && <WithLink title={t('common:deepL')} />}</P>
      </IndexLayout>
    </>
  );
};

type BrandColorProps = {
  title: string;
  hex: string;
  rgb: string;
  cmyk: string;
};

const BrandColor: FC<BrandColorProps> = ({ title, hex, rgb, cmyk }) => {
  return (
    <>
      <div className="flex items-center space-x-8">
        <div className="w-40 h-20" style={{ backgroundColor: hex }}></div>
        <div>
          <H4 className="pb-1 mb-4 border-b-[1px] border-gray-400 px-2">{title}</H4>
          <P>
            <strong>HEX</strong> ― {hex}
          </P>
          <P>
            <strong>RGB</strong> ― {rgb}
          </P>
          <P>
            <strong>CMYK</strong> ― {cmyk}
          </P>
        </div>
      </div>
    </>
  );
};

type contextType = {
  locale: string;
};
export const getStaticProps = async (context: contextType) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common', 'guideline', 'layout'])),
    },
  };
};

export default GuideLine;
