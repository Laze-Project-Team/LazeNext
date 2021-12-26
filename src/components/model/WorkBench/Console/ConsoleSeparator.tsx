import type { VFC } from 'react';

export const ConsoleSeparator: VFC = () => {
  return (
    <>
      <div className="p-2">
        <div className="bg-[#777] h-[1px]" />
      </div>
    </>
  );
};
