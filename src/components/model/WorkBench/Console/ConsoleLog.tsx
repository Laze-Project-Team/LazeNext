import moment from 'moment';
import type { VFC } from 'react';
import { useContext } from 'react';
import { Fragment } from 'react';

import type { consoleLog } from '@/features/redux/console';
import { colorModeContext } from '@/pages/_app';

const logColors: Record<consoleLog['level'], string> = {
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
      <p className="flex px-4 m-0 py-[0.1rem] hover:bg-black/5 dark:hover:bg-gray-100/5 text-sm">
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
          className="inline-flex items-center ml-auto select-none text-gray-800 dark:text-gray-500"
          dateTime={moment(timestamp).format()}
        >
          {moment(timestamp).format('HH:mm')}
        </time>
      </p>
    </>
  );
};
