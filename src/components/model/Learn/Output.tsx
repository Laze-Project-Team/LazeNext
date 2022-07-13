import type { FC } from 'react';

import type { consoleLog, separator } from '@/features/redux/console';

export type OutputProps = {
  logs: (consoleLog | separator)[];
};

export const Output: FC<OutputProps> = ({ logs }) => {
  return (
    <div className="border-[1px] border-t-0">
      {logs.map((log) => {
        if (log.type === 'separator') {
          return <></>;
        }
        return (
          <div className="px-4 py-[.1rem] font-editor" key={log.timestamp}>
            {log.content}
          </div>
        );
      })}
    </div>
  );
};
