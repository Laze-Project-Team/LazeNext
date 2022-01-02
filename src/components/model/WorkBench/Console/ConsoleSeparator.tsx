import type { VFC } from 'react';

export const ConsoleSeparator: VFC = () => {
  return (
    <>
      <div className="p-2">
        <hr className="bg-gray-300 dark:bg-gray-700" />
      </div>
    </>
  );
};
