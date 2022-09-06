import type { WasmImportProps } from '@/typings/compiler';

export const strToMem = (variables: WasmImportProps, str: string): number => {
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
  const temp = variables.variables.memorySize;
  const memoryBuffer = new Uint8Array(variables.variables.memory.buffer, variables.variables.memorySize, 12);
  variables.variables.memorySize += 12;
  const tempBytes = new Uint32Array(1);
  tempBytes.set([variables.variables.memorySize]);
  memoryBuffer.set(new Uint8Array(tempBytes.buffer), 0);
  tempBytes.set([str.length]);
  memoryBuffer.set(new Uint8Array(tempBytes.buffer), 4);
  memoryBuffer.set([0, 0, 0, 0], 8);
  const helloBytes = new Uint8Array(variables.variables.memory.buffer, variables.variables.memorySize, str.length * 4);
  helloBytes.set(resultBytes, 0);
  variables.variables.memorySize += str.length * 4;
  // console.log(temp);
  return temp;
};
