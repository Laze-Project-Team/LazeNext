import type { Laze } from '@/typings/laze';

type keyControlType = {
  relativeMouseX: number;
  relativeMouseY: number;
  absoluteMouseX: number;
  absoluteMouseY: number;
  mousePressed: boolean;
  pressedKeys: boolean[];
  scrollY: number;
};

export type importStdProps = {
  memory: WebAssembly.Memory;
  keyControl: keyControlType;
  memorySize: number;
};

const checkImportStdProps = (arg: unknown): boolean => {
  const props = arg as importStdProps;

  return (
    typeof props?.keyControl === 'object' && typeof props?.memory === 'object' && typeof props?.memorySize === 'number'
  );
};

const initialKeyControl: keyControlType = {
  relativeMouseX: 0.0,
  relativeMouseY: 0.0,
  absoluteMouseX: 0.0,
  absoluteMouseY: 0.0,
  mousePressed: false,
  pressedKeys: new Array(256).fill(false),
  scrollY: 0,
};

const importStd = (p: unknown): WebAssembly.Imports => {
  if (!checkImportStdProps(p)) {
    throw new Error('The props in importStd is not of type importStdProps.');
  }

  const props = p as importStdProps;

  return {
    std: {
      mem: props.memory,
      asin: Math.asin,
      acos: Math.acos,
      atan: Math.atan,
      log: Math.log,
      exp: Math.pow,
      ePow: Math.exp,
      performanceNow: (): number => {
        return performance.now();
      },
      checkKeyPress: (keyCode: number) => {
        return BigInt(props.keyControl.pressedKeys[keyCode]);
      },
      checkMousePress: () => {
        return BigInt(props.keyControl.mousePressed);
      },
      checkRelativeMouseX: () => {
        return props.keyControl.relativeMouseX;
      },
      checkRelativeMouseY: () => {
        return props.keyControl.relativeMouseY;
      },
      checkAbsoluteMouseX: () => {
        return props.keyControl.absoluteMouseX;
      },
      checkAbsoluteMouseY: () => {
        return props.keyControl.absoluteMouseY;
      },
      checkScrollY: () => {
        const temp = props.keyControl.scrollY;
        props.keyControl.scrollY = 0;
        return temp;
      },
      rand: () => {
        return Math.random();
      },
      alloc: (size: number) => {
        const oldMemorySize = props.memorySize;
        if (props.memorySize + size >= props.memory.buffer.byteLength) {
          props.memory.grow(1);
        }
        props.memorySize += size;
        return oldMemorySize;
      },
    },
  };
};

const initializeStdProps = (p: unknown): Laze.Props => {
  if (!checkImportStdProps(p)) {
    throw new Error('The props in initializeStdProps does not include type importStdProps.');
  }
  const props = p as importStdProps;
  props.memory = new WebAssembly.Memory({ initial: 1000 });
  props.keyControl = initialKeyControl;
  props.memorySize = 0;
  return props;
};

export const stdModule: Laze.Module = {
  props: {
    memory: new WebAssembly.Memory({ initial: 1000 }),
    keyControl: initialKeyControl,
    memorySize: 0,
  },
  importFunc: importStd,
  initFunc: initializeStdProps,
};
