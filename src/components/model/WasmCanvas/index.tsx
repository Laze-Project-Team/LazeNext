import { notification } from 'antd';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import type { VFC } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import type { ExecuteParam } from '@/features/laze/executeLaze';
import { executeLaze } from '@/features/laze/executeLaze';
import type { Libraries } from '@/features/laze/getWasmImports';
import { cx } from '@/features/utils/cx';
import styles from '@/styles/canvas.module.css';

export type WasmCanvasProps = {
  wasmUrl: string;
  dependencies: Libraries[];
};

export const WasmCanvas: VFC<WasmCanvasProps> = ({ wasmUrl, dependencies }) => {
  const [t] = useTranslation('editor');
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
  const dispatch = useDispatch();
  const { locale } = useRouter();
  useEffect(() => {
    const param: ExecuteParam = {
      interval: null,
      id: '',
      dispatcher: dispatch,
      error,
      getWasmApi: '',
      wasmUrl: '',
      programUrl: '',
      lang: locale ?? 'en',
      linetraceTime: { time: 0 },
      t,
    };
    executeLaze(wasmUrl, dependencies, param);
    return () => {
      if (param.interval) {
        clearInterval(param.interval);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <canvas id="output-canvas" width="1280" height="720" className={cx('h-full w-full bg-white', styles.canvas)} />
  );
};
