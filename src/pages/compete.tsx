import { Col, Row } from 'antd';
import type { NextPage } from 'next';
import Head from 'next/head';
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
  return (
    <>
      <Head>
        <title>Compete</title>
      </Head>
      <IndexLayout>
        <H1>Compete</H1>
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
  const files = getAllCompetitions();
  const competitions = files.map((name) => {
    return getCompetitionData(name.replace(/\.json$/, ''));
  });
  return {
    props: {
      competitions,
      ...(await serverSideTranslations(context.locale, ['common', 'layout', 'compete'])),
    },
  };
};

export default CompeteHome;
