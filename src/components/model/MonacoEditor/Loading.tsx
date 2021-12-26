import { Spin } from 'antd';
import type { VFC } from 'react';

export const Loading: VFC = () => {
  return (
    <>
      <div className="w-full h-full flex justify-center items-center">
        <Spin size="large" />
      </div>
    </>
  );
};
