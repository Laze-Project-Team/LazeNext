import type { Dispatch } from 'redux';

import { consoleSlice } from '@/features/redux/console';
import type { Laze } from '@/typings/laze';

export type importEditorConsoleProps = {
  memory: WebAssembly.Memory;
  dispatcher: Dispatch | null;
  id: string;
};

const checkImportEditorConsoleProps = (arg: unknown): boolean => {
  const props = arg as importEditorConsoleProps;
  return typeof props?.memory === 'object' && typeof props?.dispatcher === 'function' && typeof props?.id === 'string';
};

const importEditorConsole = (p: unknown): WebAssembly.Imports => {
  if (!checkImportEditorConsoleProps(p)) {
    throw new Error('The props in importEditorConsole is not of type importEditorConsoleProps.');
  }

  const props = p as importEditorConsoleProps;
  const { memory, dispatcher, id } = props;

  const { addLog } = consoleSlice.actions;

  const logConsole = (content: string) => {
    if (dispatcher) {
      dispatcher(
        addLog({
          console: id,
          content,
          level: 'log',
        })
      );
    } else {
      throw new Error('No dispatcher.');
    }
  };

  return {
    console: {
      log: (arg: number) => {
        // eslint-disable-next-line no-console
        logConsole(`${arg}`);
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
        logConsole(string);
      },
      logMatrix: (offset: number) => {
        const buffer = memory.buffer.slice(offset, 128 + offset);
        const f64Array = new Float64Array(buffer);
        const f32Array = Float32Array.from(f64Array);
        // eslint-disable-next-line no-console
        logConsole(JSON.stringify(f32Array));
      },
    },
  };
};

const initializeEditorConsoleProps = (p: unknown): Laze.Props => {
  if (!checkImportEditorConsoleProps(p)) {
    throw new Error('The props in initializeStdProps does not include type importEditorConsoleProps.');
  }
  const props = p as importEditorConsoleProps;
  props.memory = new WebAssembly.Memory({ initial: 1000 });
  return props;
};

export const editorConsoleModule: Laze.Module = {
  props: {
    memory: new WebAssembly.Memory({ initial: 1000 }),
    id: '',
    dispatcher: null,
  },
  importFunc: importEditorConsole,
  initFunc: initializeEditorConsoleProps,
};
