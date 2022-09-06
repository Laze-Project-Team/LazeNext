import type { Laze } from '@/typings/laze';

export type importConsoleProps = {
  memory: WebAssembly.Memory;
};

const checkImportConsoleProps = (arg: unknown): boolean => {
  const props = arg as importConsoleProps;

  return typeof props?.memory === 'object';
};

const importConsole = (p: unknown): WebAssembly.Imports => {
  if (!checkImportConsoleProps(p)) {
    throw new Error('The props in importConsole is not of type importConsoleProps.');
  }

  const props = p as importConsoleProps;
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

export const consoleModule: Laze.Module = {
  props: {
    memory: new WebAssembly.Memory({ initial: 1000 }),
  },
  importFunc: importConsole,
};
