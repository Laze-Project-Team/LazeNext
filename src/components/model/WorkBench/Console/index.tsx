import type { VFC } from 'react';
import { useRef } from 'react';
import { connect } from 'react-redux';

import ConsoleLogs from '@/components/model/WorkBench/Console/ConsoleLogs';
import { ConsolePanelListItem } from '@/components/model/WorkBench/Console/ConsolePanelListItem';

import { RootState } from '@/features/redux/root';

import { consoleState } from '@/features/redux/console';
import { useTranslation } from 'next-i18next';

const Console: VFC<Omit<consoleState, 'scrolled'>> = ({ console, active }) => {
  const [t] = useTranslation('editor');

  const consoleRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-full flex">
      <div className="flex-1 h-full overflow-y-scroll editor-scrollable" ref={consoleRef}>
        <ConsoleLogs consoleRef={consoleRef} />
      </div>
      <div className="w-28 ml-1 border-l-[1px] border-gray-300 dark:border-gray-700">
        {Object.keys(console).map((key) => (
          <ConsolePanelListItem
            id={key}
            label={key === 'master' ? t('Master') : console[key].label}
            active={key === active}
            isMaster={key === 'master'}
            key={key}
          />
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  console: state.console.console,
  active: state.console.active,
});

export default connect(mapStateToProps)(Console);
