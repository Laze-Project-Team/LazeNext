import type { FC } from 'react';

import type { consoleLog, separator } from '@/features/redux/console';

export type OutputProps = {
  logs: (consoleLog | separator)[];
};

export const Output: FC<OutputProps> = ({ logs }) => {
  return (
    <>
      {logs.map((log, i) => {
        if (log.type === 'separator') {
          return <hr key={i} />;
        }
        return <div key={log.timestamp}>{log.content}</div>;
      })}
    </>
  );
};
