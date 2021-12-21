import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Docs: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace('/docs/home');
  });

  return <></>;
};

export default Docs;
