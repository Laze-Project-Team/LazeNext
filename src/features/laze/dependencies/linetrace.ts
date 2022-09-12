import { notification } from 'antd';

import type { Laze } from '@/typings/laze';

export type LinetraceData = {
  time: number;
};

export type importLinetraceProps = {
  linetraceTime: LinetraceData;
  memory: WebAssembly.Memory;
  levelNow: string;
};

const checkImportLinetraceProps = (arg: unknown): boolean => {
  const props = arg as importLinetraceProps;
  return (
    typeof props?.linetraceTime === 'object' && typeof props.levelNow === 'string' && typeof props.memory === 'object'
  );
};

const importLinetrace = (p: unknown): WebAssembly.Imports => {
  if (!checkImportLinetraceProps(p)) {
    throw new Error('The props in importLinetrace is not of type importLinetraceProps.');
  }

  const props = p as importLinetraceProps;

  return {
    linetrace: {
      updateLinetraceTime: (time: number, offset: number, length: number) => {
        let bytes = new Uint8Array(props.memory.buffer, offset, Number(length) * 4);
        bytes = bytes.filter((element) => {
          return element !== 0;
        });
        const string = new TextDecoder('utf-8').decode(bytes);
        time.toPrecision(4);
        notification.open({
          message: `${Number(time.toFixed(2))}s`,
        });
        if (props.levelNow === '' || string === props.levelNow) {
          props.linetraceTime.time = time;
        } else {
          props.linetraceTime.time = -1;
        }
      },
    },
  };
};

const initializeLinetraceProps = (p: unknown): Laze.Props => {
  if (!checkImportLinetraceProps(p)) {
    throw new Error('The props in initializeLinetraceProps does not include importLinetraceProps.');
  }
  const props = p as importLinetraceProps;
  props.linetraceTime.time = 0;
  props.memory = new WebAssembly.Memory({ initial: 1000 });
  return props;
};

export const linetraceModule: Laze.Module = {
  props: {
    linetraceTime: 0,
    memory: new WebAssembly.Memory({ initial: 1000 }),
    levelNow: '',
  },
  importFunc: importLinetrace,
  initFunc: initializeLinetraceProps,
};
