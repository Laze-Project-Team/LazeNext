import { Col, Row } from 'antd';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { IndexLayout } from '@/components/layout/IndexLayout';
import { CompetitionCard } from '@/components/ui/atoms/CompetitionCard';
import { H1 } from '@/components/ui/IndexLayout';
import { getAllCompetitions, getCompetitionData } from '@/features/compete/compete';
import type { Competition } from '@/typings/compete';

type CompeteHomeProps = {
  competitions: Competition[];
  locale: string;
};

const CompeteHome: NextPage<CompeteHomeProps> = ({ competitions }) => {
  const [t] = useTranslation('compete');

  return (
    <>
      <Head>
        <title>{t('compete')}</title>

        <meta name="robots" content="noindex" />
      </Head>
      <IndexLayout>
        <H1>{t('compete')}</H1>
        <Row gutter={[24, 24]}>
          {competitions.map((competition) => {
            return (
              <Col span={8} key={competition.id}>
                <CompetitionCard competition={competition} />
              </Col>
            );
          })}
        </Row>
      </IndexLayout>
    </>
  );
};

type contextType = {
  locale: string;
};

export const getStaticProps = async (context: contextType) => {
  const files = await getAllCompetitions();

  const competitions: (Competition | null)[] = await Promise.all(
    files.map(async (name) => {
      return await getCompetitionData(name.replace(/\.json$/, ''));
    })
  );

  return {
    props: {
      competitions: competitions.filter((value) => {
        return value != null;
      }),
      ...(await serverSideTranslations(context.locale, ['common', 'layout', 'compete'])),
    },
  };
};

export default CompeteHome;
