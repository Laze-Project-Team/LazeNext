import type { FC } from 'react';
import { Fragment } from 'react';

import type { consoleLog, separator } from '@/features/redux/console';

import { logColors } from '../WorkBench/Console/ConsoleLog';

export type OutputProps = {
  logs: (consoleLog | separator)[];
};

export const Output: FC<OutputProps> = ({ logs }) => {
  return (
    <div className="max-h-40 overflow-y-auto border-[1px] border-t-0">
      {logs.map((log) => {
        if (log.type === 'separator') {
          return <></>;
        }
        return (
          <div className="px-4 py-[.1rem] font-editor hover:bg-gray-100" key={log.timestamp}>
            <span className="flex-1" style={{ color: logColors[log.level] }}>
              {log.content.split('\n').map((line) => {
                return (
                  <Fragment key={line}>
                    {line}
                    <br />
                  </Fragment>
                );
              })}
            </span>
          </div>
        );
      })}
    </div>
  );
};
