import { notification } from 'antd';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import type { MutableRefObject, VFC } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { createContext } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { VscMenu } from 'react-icons/vsc';
import { useDispatch } from 'react-redux';

import { compileErrorContext } from '@/components/functional/CompileErrorProvider';
import { useMediaQuery } from '@/components/functional/useMediaQuery';
import { CompileButton } from '@/components/model/EditorButtons/EditorButton/CompileButton';
import { ConvertButton } from '@/components/model/EditorButtons/EditorButton/ConvertButton';
import { SettingsButton } from '@/components/model/EditorButtons/EditorButton/SettingsButton';
import type { ExecuteParam } from '@/features/laze/executeLaze';
import { cx } from '@/features/utils/cx';

import { ResetButton } from './EditorButton/ResetButton';
import { SubmitButton } from './EditorButton/SubmitButton';

const QUERY_SM_DOWN = '(max-width: 800px)' as const;
const QUERY_MD_UP = '(min-width: 801px)' as const;

export const competeEditorExecuteParamContext = createContext<MutableRefObject<ExecuteParam> | null>(null);

export const CompeteButtons: VFC = () => {
  const [t] = useTranslation('editor');
  const { query } = useRouter();
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

  const dispatch = useDispatch();

  const { locale } = useRouter();

  const CompileErrorContext = useContext(compileErrorContext);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const error = (err: any) => {
    console.error(err);
    notification.open({
      message: t('errors.LaunchProgramFailed.title'),
      description: t('errors.LaunchProgramFailed.message'),
      type: 'error',
      placement: 'bottomRight',
      duration: 5,
    });
  };

  const compileError = () => {
    CompileErrorContext?.current?.();
  };

  const param = useRef<ExecuteParam>({
    interval: null,
    id: '',
    dispatcher: dispatch,
    error,
    compileError,
    getWasmApi: '',
    wasmUrl: '',
    programUrl: '',
    lang: locale ?? 'en',
    linetraceTime: { time: 0 },
    levelNow: typeof query.levelID === 'string' ? query.levelID : '',
  });

  useEffect(() => {
    if (query.levelID) {
      param.current.levelNow = typeof query.levelID === 'string' ? query.levelID : '';
    }
  }, [query.levelID]);

  return (
    <>
      <competeEditorExecuteParamContext.Provider value={param}>
        <div className="flex h-full bg-[#f3f3f3] dark:bg-background">
          {media && media === QUERY_SM_DOWN ? (
            <>
              <button className="px-2" onClick={toggleDisplay} aria-label={t('buttons.menu')}>
                <VscMenu />
              </button>

              {isOpened && <div className="fixed top-0 left-0 bottom-0 right-0 z-10" onClick={close} />}
              <div
                className={cx(
                  'fixed top-7 left-0 z-10 flex min-h-0 flex-col space-y-1 overflow-hidden bg-gray-100 px-2 shadow-md transition-all duration-300 dark:bg-[#333]',
                  isOpened ? 'h-24 py-2' : 'h-0 py-0'
                )}
              >
                <div>
                  <CompileButton />
                </div>
                <div>
                  <ResetButton />
                </div>
                <div>
                  <ConvertButton />
                </div>
              </div>
            </>
          ) : (
            <>
              <CompileButton />
              <ResetButton />
              <ConvertButton />
            </>
          )}
          <div className="ml-auto">
            <SubmitButton />
            <SettingsButton />
          </div>
        </div>
      </competeEditorExecuteParamContext.Provider>
    </>
  );
};
