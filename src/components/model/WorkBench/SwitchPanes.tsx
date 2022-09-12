import { Tooltip } from 'antd';
import { useTranslation } from 'next-i18next';
import type { VFC } from 'react';
import { useCallback, useContext, useEffect } from 'react';
import { useState } from 'react';

import { compileErrorContext } from '@/components/functional/CompileErrorProvider';
import { cx } from '@/features/utils/cx';

export type SwitchPaneObject = {
  label: string;
  element: React.ReactElement;
};

type EnhancedSwitchPanesProps = {
  panes: Record<string, SwitchPaneObject>;
  initialPane: string;
};

export const SwitchPane: VFC<EnhancedSwitchPanesProps> = ({ panes, initialPane }) => {
  const [t] = useTranslation('editor');
  const [activePane, setActivePane] = useState<string>(initialPane);
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  const CompileErrorContext = useContext(compileErrorContext);

  const errorFunc = useCallback(() => {
    if (activePane !== 'output') {
      setIsErrorOpen(true);
    }
  }, [activePane]);

  useEffect(() => {
    if (CompileErrorContext !== null) {
      CompileErrorContext.current = errorFunc;
    }
  }, [CompileErrorContext, errorFunc]);

  return (
    <>
      <Tooltip visible={isErrorOpen} title={t('errors.CompileProgramFailed.title')} color="red" placement="topLeft">
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
                    setActivePane(key);
                    if (key === 'output') {
                      setIsErrorOpen(false);
                    }
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
      </Tooltip>
    </>
  );
};
