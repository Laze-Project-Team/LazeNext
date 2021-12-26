import type { VFC } from 'react';
import { useCallback, useEffect, useMemo } from 'react';
import { connect, useDispatch } from 'react-redux';

import { ConsoleLog } from '@/components/model/WorkBench/Console/ConsoleLog';
import { ConsoleSeparator } from '@/components/model/WorkBench/Console/ConsoleSeparator';
import type { consoleState } from '@/features/redux/console';
import { consoleSlice } from '@/features/redux/console';
import type { RootState } from '@/features/redux/root';
import { getHash } from '@/features/utils/hash';

const UnconnectedConsoleLogs: VFC<consoleState & { consoleRef: React.RefObject<HTMLDivElement> }> = ({
  console,
  active,
  scrolled,
  consoleRef,
}) => {
  const activeConsole = console[active];

  const dispacher = useDispatch();
  const { setScrolled } = consoleSlice.actions;

  const handleScroll = useCallback(() => {
    if (consoleRef.current) {
      const { scrollHeight, scrollTop, clientHeight } = consoleRef.current;
      dispacher(setScrolled(scrollHeight <= scrollTop + clientHeight + 1));
    }
  }, [consoleRef, dispacher, setScrolled]);

  useEffect(() => {
    if (consoleRef.current) {
      if (scrolled) {
        consoleRef.current.scroll({ top: consoleRef.current.scrollHeight });
      }
      consoleRef.current.addEventListener('scroll', handleScroll);
    }
  }, [consoleRef, handleScroll, scrolled, console]);

  const render = useMemo(() => {
    return (
      <>
        {activeConsole?.log.map((log) => {
          return log.type === 'separator' ? (
            <ConsoleSeparator key={`log-separator-${getHash(6)}`} />
          ) : (
            <ConsoleLog
              content={log.content}
              timestamp={log.timestamp}
              level={log.level}
              key={`log-${log.timestamp}-${getHash(6)}`}
            />
          );
        })}
      </>
    );
  }, [activeConsole]);

  return render;
};

const mapStateToProps = (state: RootState) => {
  return {
    ...state.console,
  };
};

export const ConsoleLogs = connect(mapStateToProps)(UnconnectedConsoleLogs);
