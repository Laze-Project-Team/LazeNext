import type { Laze } from '@/typings/laze';

export type importConsoleProps = {
  memory: WebAssembly.Memory;
};

const checkImportConsoleProps = (arg: unknown): arg is importConsoleProps => {
  const props = arg as importConsoleProps;

  return typeof props?.memory === 'object';
};

const importConsole = (props: unknown): WebAssembly.Imports => {
  if (!checkImportConsoleProps(props)) {
    throw new Error('The props in importConsole is not of type importConsoleProps.');
  }

  const { memory } = props;

  return {
    console: {
      log: (arg: number) => {
        // eslint-disable-next-line no-console
        console.log(`${arg}`);
      },
      debug: (arg: number) => {
        // eslint-disable-next-line no-console
        console.log(`${arg}`);
      },
      logstring: (offset: number, length: number) => {
        let bytes = new Uint8Array(memory.buffer, offset, Number(length) * 4);
        bytes = bytes.filter((element) => {
          return element !== 0;
        });
        const string = new TextDecoder('utf-8').decode(bytes);
        // eslint-disable-next-line no-console
        console.log(string);
      },
      logMatrix: (offset: number) => {
        const buffer = memory.buffer.slice(offset, 128 + offset);
        const f64Array = new Float64Array(buffer);
        const f32Array = Float32Array.from(f64Array);
        // eslint-disable-next-line no-console
        console.log(JSON.stringify(f32Array));
      },
    },
  };
};

const initializeConsoleProps = (props: unknown): Laze.Props => {
  if (!checkImportConsoleProps(props)) {
    throw new Error('The props in initializeStdProps does not include type importConsoleProps.');
  }
  props.memory = new WebAssembly.Memory({ initial: 1000 });
  return props;
};

export const consoleModule: Laze.Module = {
  props: {
    memory: new WebAssembly.Memory({ initial: 1000 }),
  },
  importFunc: importConsole,
  initFunc: initializeConsoleProps,
};
