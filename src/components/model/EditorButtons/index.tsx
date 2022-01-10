import type { VFC } from 'react';
import { useState } from 'react';
import { VscMenu } from 'react-icons/vsc';

import { useMediaQuery } from '@/components/functional/useMediaQuery';
import { CompileButton } from '@/components/model/EditorButtons/EditorButton/CompileButton';
import { ConvertButton } from '@/components/model/EditorButtons/EditorButton/ConvertButton';
import { SamplesButton } from '@/components/model/EditorButtons/EditorButton/SamplesButton';
import { SettingsButton } from '@/components/model/EditorButtons/EditorButton/SettingsButton';
import { cx } from '@/features/utils/cx';

const QUERY_SM_DOWN = '(max-width: 800px)' as const;
const QUERY_MD_UP = '(min-width: 801px)' as const;

export const EditorButtons: VFC = () => {
  const media = useMediaQuery([QUERY_MD_UP, QUERY_SM_DOWN]);

  const [isOpened, setIsOpened] = useState(false);

  const toggleDisplay = () => {
    setIsOpened((previous) => {
      return !previous;
    });
  };

  const close = () => {
    setIsOpened(false);
  };

  return (
    <>
      <div className="flex h-full bg-[#f3f3f3] dark:bg-background">
        {media && media === QUERY_SM_DOWN ? (
          <>
            <button className="px-2" onClick={toggleDisplay}>
              <VscMenu />
            </button>

            {isOpened && <div className="fixed top-0 left-0 bottom-0 right-0 z-10" onClick={close}></div>}
            <div
              className={cx(
                'fixed space-y-1 top-7 left-0 px-2 bg-gray-100 dark:bg-[#333] shadow-md flex flex-col z-10 min-h-0 overflow-hidden transition-all duration-300',
                isOpened ? 'h-24 py-2' : 'h-0 py-0'
              )}
            >
              <div>
                <CompileButton />
              </div>
              <div>
                <SamplesButton />
              </div>
              <div>
                <ConvertButton />
              </div>
            </div>
          </>
        ) : (
          <>
            <CompileButton />
            <SamplesButton />
            <ConvertButton />
          </>
        )}
        <div className="ml-auto">
          <SettingsButton />
        </div>
      </div>
    </>
  );
};
