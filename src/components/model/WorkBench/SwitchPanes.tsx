import type { VFC } from 'react';
import { useContext, useEffect, useState } from 'react';

import { cx } from '@/features/utils/cx';
import { ratioAdjustContext } from '@/pages/editor';

export type SwitchPaneObject = {
  label: string;
  element: React.ReactElement;
};

type EnhancedSwitchPanesProps = {
  panes: Record<string, SwitchPaneObject>;
  initialPane: string;
};

export const SwitchPane: VFC<EnhancedSwitchPanesProps> = ({ panes, initialPane }) => {
  const [activePane, setActivePane] = useState<string>(initialPane);
  const ratioAdjust = useContext(ratioAdjustContext);

  useEffect(() => {
    if (activePane === 'canvas') {
      ratioAdjust();
    }
  }, [activePane, ratioAdjust]);

  return (
    <>
      <div className="flex h-full flex-col">
        <div className="flex space-x-4 px-4 py-1">
          {Object.keys(panes).map((key) => {
            return (
              <button
                className={cx(
                  'mb-1 border-b-[1px] border-transparent py-1 text-xs text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-[#ccc]',
                  key === activePane && 'border-gray-800 text-gray-800 dark:border-[#ccc] dark:text-[#ccc]'
                )}
                onClick={() => {
                  return void setActivePane(key);
                }}
                key={key}
              >
                {panes[key].label}
              </button>
            );
          })}
        </div>

        <div className="flex-1">
          {Object.keys(panes).map((key) => {
            return (
              <div className={cx('h-full', key === activePane ? 'block' : 'hidden')} key={key}>
                {panes[key].element}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
