import type { VFC } from 'react';
import { useContext, useEffect, useState } from 'react';

import { ratioAdjustContext } from '@/pages/editor';
import { cx } from '@/features/utils/cx';

export type SwitchPaneObject = {
  label: string;
  element: React.ReactElement;
};

type EnhancedSwitchPanesProps = {
  panes: Record<string, SwitchPaneObject>;
  initialPane: string;
};

const EnhancedSwitchPane: VFC<EnhancedSwitchPanesProps> = ({ panes, initialPane }) => {
  const [activePane, setActivePane] = useState<string>(initialPane);
  const ratioAdjust = useContext(ratioAdjustContext);

  useEffect(() => {
    if (activePane === 'canvas') {
      ratioAdjust();
    }
  }, [activePane, ratioAdjust]);

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex space-x-4 px-4 py-1">
          {Object.keys(panes).map((key) => (
            <button
              className={cx(
                'text-xs py-1 mb-1 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-[#ccc] border-b-[1px] border-transparent',
                key === activePane && 'text-gray-800 border-gray-800 dark:text-[#ccc] dark:border-[#ccc]'
              )}
              onClick={() => void setActivePane(key)}
              key={key}
            >
              {panes[key].label}
            </button>
          ))}
        </div>

        <div className="flex-1">
          {Object.keys(panes).map((key) => (
            <div className={cx('h-full', key === activePane ? 'block' : 'hidden')} key={key}>
              {panes[key].element}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default EnhancedSwitchPane;
