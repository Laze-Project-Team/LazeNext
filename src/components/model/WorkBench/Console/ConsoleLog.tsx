import { VFC } from 'react';
import { Fragment, useEffect } from 'react';
import moment from 'moment';
import { consoleLog } from '@/features/redux/console';

const logColors: Record<consoleLog['level'], string> = {
  log: '#ccc',
  info: '#3498db',
  warn: '#f1c40f',
  error: '#e74c3c',
};

export const ConsoleLog: VFC<Omit<consoleLog, 'type'>> = ({ content, timestamp, level }) => {
  return (
    <>
      <p className="flex px-4 py-[0.1rem] hover:bg-t hover:bg-gray-100/5 text-sm">
        <span className="flex-1" style={{ color: logColors[level] }}>
          {content.split('\n').map((line) => (
            <Fragment key={line}>
              {line}
              <br />
            </Fragment>
          ))}
        </span>
        <time
          className="inline-flex items-center ml-auto select-none text-gray-500"
          dateTime={moment(timestamp).format()}
        >
          {moment(timestamp).format('HH:mm')}
        </time>
      </p>
    </>
  );
};