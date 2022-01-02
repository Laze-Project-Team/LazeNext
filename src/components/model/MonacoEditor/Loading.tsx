import type { VFC } from 'react';
import { VscLoading } from 'react-icons/vsc';

import { Spin } from '@/components/ui/Spin';

export const Loading: VFC = () => {
  return (
    <>
      <div className="w-full h-full flex justify-center items-center">
        <Spin className="text-6xl">
          <VscLoading />
        </Spin>
      </div>
    </>
  );
};
