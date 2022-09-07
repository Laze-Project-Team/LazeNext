import type { Laze } from '@/typings/laze';

export type LinetraceData = {
  time: number;
};

export type importLinetraceProps = {
  linetraceTime: LinetraceData;
};

const checkImportLinetraceProps = (arg: unknown): boolean => {
  const props = arg as importLinetraceProps;
  return typeof props?.linetraceTime === 'object';
};

const importLinetrace = (p: unknown): WebAssembly.Imports => {
  if (!checkImportLinetraceProps(p)) {
    throw new Error('The props in importLinetrace is not of type importLinetraceProps.');
  }

  const props = p as importLinetraceProps;

  return {
    linetrace: {
      updateLinetraceTime: (time: number) => {
        time.toPrecision(4);
        console.log(time);
        props.linetraceTime.time = time;
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
  return props;
};

export const linetraceModule: Laze.Module = {
  props: {
    linetraceTime: 0,
  },
  importFunc: importLinetrace,
  initFunc: initializeLinetraceProps,
};
