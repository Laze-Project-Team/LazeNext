import type { importGraphicsProps } from '@/features/laze/dependencies/graphics';

type ImportProps = importGraphicsProps;

export const strToMem = (variables: ImportProps, str: string): number => {
  const resultBytes = new Uint8Array(str.length * 4);
  const bytes = new TextEncoder().encode(str);
  for (let i = 0, j = 0; i < bytes.length; ) {
    resultBytes[j] = bytes[i];
    if (bytes[i] >= 128) {
      resultBytes[j + 1] = bytes[i + 1];
      resultBytes[j + 2] = bytes[i + 2];
      resultBytes[j + 3] = 0;
      i += 3;
      j += 4;
    } else {
      resultBytes[j + 1] = 0;
      resultBytes[j + 2] = 0;
      resultBytes[j + 3] = 0;
      i++;
      j += 4;
    }
  }
  if (!variables.memory) {
    throw new Error('Memory is not in this prop.');
  }
  const temp = variables.memorySize;
  const memoryBuffer = new Uint8Array(variables.memory.buffer, variables.memorySize, 12);
  variables.memorySize += 12;
  const tempBytes = new Uint32Array(1);
  tempBytes.set([variables.memorySize]);
  memoryBuffer.set(new Uint8Array(tempBytes.buffer), 0);
  tempBytes.set([str.length]);
  memoryBuffer.set(new Uint8Array(tempBytes.buffer), 4);
  memoryBuffer.set([0, 0, 0, 0], 8);
  const helloBytes = new Uint8Array(variables.memory.buffer, variables.memorySize, str.length * 4);
  helloBytes.set(resultBytes, 0);
  variables.memorySize += str.length * 4;
  // console.log(temp);
  return temp;
};
