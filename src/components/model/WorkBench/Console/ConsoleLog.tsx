import moment from 'moment';
import type { VFC } from 'react';
import { useContext } from 'react';
import { Fragment } from 'react';

import type { consoleLog } from '@/features/redux/console';
import { colorModeContext } from '@/pages/_app';

export const logColors: Record<consoleLog['level'], string> = {
  log: '#333',
  info: '#1f74ad',
  warn: '#c18a0b',
  error: '#e74c3c',
};

const logColorsDark: Record<consoleLog['level'], string> = {
  log: '#ccc',
  info: '#3498db',
  warn: '#f1c40f',
  error: '#e74c3c',
};

export const ConsoleLog: VFC<Omit<consoleLog, 'type'>> = ({ content, timestamp, level }) => {
  const colorMode = useContext(colorModeContext);
  const colors = colorMode && colorMode[0] === 'dark' ? logColorsDark : logColors;

  return (
    <>
      <p className="m-0 flex px-4 py-[0.1rem] text-sm hover:bg-black/5 dark:hover:bg-gray-100/5">
        <span className="flex-1" style={{ color: colors[level] }}>
          {content.split('\n').map((line) => {
            return (
              <Fragment key={line}>
                {line}
                <br />
              </Fragment>
            );
          })}
        </span>
        <time
          className="ml-auto inline-flex select-none items-center text-gray-800 dark:text-gray-200"
          dateTime={moment(timestamp).format()}
        >
          {moment(timestamp).format('HH:mm')}
        </time>
      </p>
    </>
  );
};
