import type { VFC } from 'react';
import { VscLoading } from 'react-icons/vsc';

import { Spin } from '@/components/ui/Spin';

export const Loading: VFC = () => {
  return (
    <>
      <div className="flex h-full w-full items-center justify-center">
        <Spin className="text-6xl">
          <VscLoading />
        </Spin>
      </div>
    </>
  );
};
