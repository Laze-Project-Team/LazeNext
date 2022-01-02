import { useTranslation } from 'next-i18next';
import type { VFC } from 'react';
import { useRef } from 'react';
import { connect } from 'react-redux';

import { ConsoleLogs } from '@/components/model/WorkBench/Console/ConsoleLogs';
import { ConsolePanelListItem } from '@/components/model/WorkBench/Console/ConsolePanelListItem';
import type { consoleState } from '@/features/redux/console';
import type { RootState } from '@/features/redux/root';

const UnconnectedConsole: VFC<Omit<consoleState, 'scrolled'>> = ({ console, active }) => {
  const [t] = useTranslation('editor');

  const consoleRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-full flex">
      <div className="flex-1 h-full overflow-y-scroll editor-scrollable" ref={consoleRef}>
        <ConsoleLogs consoleRef={consoleRef} />
      </div>
      <div className="w-28 ml-1 border-l-[1px] border-gray-300 dark:border-gray-700 editor-scrollable overflow-x-hidden overflow-y-auto">
        {Object.keys(console).map((key) => {
          return (
            <ConsolePanelListItem
              id={key}
              label={key === 'master' ? t('panellist.master') : console[key].label}
              active={key === active}
              isMaster={key === 'master'}
              key={key}
            />
          );
        })}
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    console: state.console.console,
    active: state.console.active,
  };
};

export const Console = connect(mapStateToProps)(UnconnectedConsole);
