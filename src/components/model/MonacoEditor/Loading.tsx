import type { VFC } from 'react';
import { Spin } from 'antd';

export const Loading: VFC = () => (
  <>
    <div className="w-full h-full flex justify-center items-center">
      <Spin size="large" />
    </div>
  </>
);
