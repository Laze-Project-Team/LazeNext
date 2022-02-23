import fs from 'fs';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import path from 'path';
import { AiOutlineLink, AiOutlineMail } from 'react-icons/ai';

import { IndexLayout } from '@/components/layout/IndexLayout';
import { StyledLink } from '@/components/ui/atoms/StyledLink';
import { H1 } from '@/components/ui/IndexLayout';
import { DATA_DIR } from '@/const/dir';
import type { renderLicenseType } from '~/tasks/generateLicense';

type LicenseProps = {
  licenses: renderLicenseType;
};

const License: NextPage<LicenseProps> = ({ licenses }) => {
  const { locale } = useRouter();
  const [t] = useTranslation(['license', 'common']);
  const title = `${t('title')} | Laze`;

  return (
    <>
      <Head>
        <title>{title}</title>

        <meta content={t('description')} name="description" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={t('description')} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://laze.ddns.net/${locale + '/' ?? ''}license`} />
        <meta property="og:site_name" content={title} />
        <meta property="og:locale" content={locale ?? 'en'} />
      </Head>

      <IndexLayout>
        <H1>{t('title')}</H1>

        <div className="mb-16">
          {Object.keys(licenses).map((name) => {
            const license = licenses[name];

            return (
              <div key={name} className="border-b-2 px-4 py-2 first-of-type:border-t-2">
                <h2 className="m-0 text-gray-600">{`${name} (${license.licenses})`}</h2>
                {license.publisher && (
                  <p className="m-0 text-gray-500">
                    {t('publisher')}: <span className="font-semibold">{license.publisher}</span>
                  </p>
                )}
                {license.repository && (
                  <StyledLink href={license.repository} className="text-gray-400">
                    {license.repository}
                  </StyledLink>
                )}
                {(license.email || license.url) && (
                  <div className="mt-2 flex space-x-2">
                    {license.email && (
                      <StyledLink
                        href={`mailto:${license.email}`}
                        title={license.email}
                        iconDisabled
                        className="text-lg text-gray-400"
                      >
                        <AiOutlineMail />
                      </StyledLink>
                    )}
                    {license.url && (
                      <StyledLink href={license.url} title={license.url} iconDisabled className="text-lg text-gray-400">
                        <AiOutlineLink />
                      </StyledLink>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </IndexLayout>
    </>
  );
};

type contextType = {
  locale: string;
};
export const getStaticProps = async (context: contextType) => {
  const licenses = JSON.parse(
    await fs.promises.readFile(path.join(DATA_DIR, 'etc', 'license.json'), { encoding: 'utf-8' })
  );

  return {
    props: {
      licenses,
      ...(await serverSideTranslations(context.locale, ['common', 'license', 'layout'])),
    },
  };
};

export default License;
