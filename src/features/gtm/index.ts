import { googleTagManagerId } from '@/components/functional/GoogleTagManager';

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

const sendEvent = (event: string, data?: Record<string, unknown>) => {
  if (googleTagManagerId) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event,
      ...data,
    });
  }
};

// プログラム実行時に実行
export const runProgram = (): void => {
  sendEvent('run_program');
};

// コンパイル成功時に実行
export const compileSuccessful = (): void => {
  sendEvent('compile_successful');
};

// コンパイル失敗時に実行
export const compileFailed = (): void => {
  sendEvent('compile_failed');
};

// サンプルロード時に実行
export const sampleLoad = (loaded_sample: string): void => {
  sendEvent('sample_load', { loaded_sample });
};
