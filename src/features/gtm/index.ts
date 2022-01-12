declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

// プログラム実行時に実行
export const runProgram = (): void => {
  window.dataLayer.push({
    event: 'run_program',
    run_program_trigger: 'run_program_button',
  });
};

// コンパイル成功時に実行
export const compileSuccessful = (): void => {
  window.dataLayer.push({
    event: 'compile_successful',
    compile_successful_trigger: 'compile_button',
  });
};

// コンパイル成功時に実行
export const compileFailed = (): void => {
  window.dataLayer.push({
    event: 'compile_failed',
    compile_failed_trigger: 'compile_button',
  });
};

// コンパイル成功時に実行
export const sampleLoad = (sample: string): void => {
  window.dataLayer.push({
    event: 'sample_load',
    loeded_sample: sample,
  });
};
