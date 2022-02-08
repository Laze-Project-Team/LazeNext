import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { auth } from '@/features/firebase';

const Logout: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    auth.signOut();
    router.back();
  }, [router]);

  return <></>;
};

export default Logout;
