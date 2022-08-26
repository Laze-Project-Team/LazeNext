import type { NextPage } from 'next';
import Head from 'next/head';

import { H1 } from '@/components/ui/IndexLayout';

const TestPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>test</title>
      </Head>
      <H1>Hello</H1>
    </>
  );
};

export default TestPage;
