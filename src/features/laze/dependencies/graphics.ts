import { initialKeyControl } from '@/features/compiler/keycontrol';
import { checkpoint, cow, fox, mountains, robot, teapot, teddybear } from '@/features/compiler/source/model';
import { strToMem } from '@/features/laze/dependencies/utilities/strToMem';
import type { keyControlType } from '@/typings/compiler';
import type { Laze } from '@/typings/laze';

import { updateAbsolutePosition } from './utilities/updatePosition';

// eslint-disable-next-line no-bitwise
const isPowerOf2 = (value: number) => {
  return (value & (value - 1)) === 0;
};

export const loadTexture = (gl: WebGLRenderingContext, url: string): WebGLTexture => {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue

  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);

  const image = new Image();
  image.src = url;
  image.addEventListener('load', () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);

    // 画像の幅,高さが2の累乗かチェック
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      // 2の累乗ならmapを生成
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      // No, it's not a power of 2. Turn off mips and set
      // wrapping to clamp to edge
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  });

  if (texture) {
    return texture;
  }
  throw new Error('Failed to create texture');
};

type webglObjects = {
  webglBuffers: WebGLBuffer[];
  webglPrograms: WebGLProgram[];
  webglUniformLoc: WebGLUniformLocation[];
  webglTextures: WebGLTexture[];
};

export type importGraphicsProps = {
  canvas: HTMLCanvasElement | null;
  gl: WebGLRenderingContext | null;
  webglObjects: webglObjects;
  memory: WebAssembly.Memory;
  memorySize: number;
  keyControl: keyControlType;
};

const checkImportGraphicsProps = (arg: unknown): arg is importGraphicsProps => {
  const props = arg as importGraphicsProps;

  return (
    typeof props?.canvas === 'object' &&
    typeof props?.gl === 'object' &&
    typeof props?.webglObjects === 'object' &&
    typeof props?.memory === 'object' &&
    typeof props?.memorySize === 'number' &&
    typeof props?.keyControl === 'object'
  );
};

const initialWebglObjects: webglObjects = {
  webglBuffers: [],
  webglPrograms: [],
  webglTextures: [],
  webglUniformLoc: [],
};

const importGraphics = (props: unknown): WebAssembly.Imports => {
  if (!checkImportGraphicsProps(props)) {
    throw new Error('The props in importGraphics is not of type importGraphicsProps.');
  }

  const { gl, memory, canvas } = props;
  if (!gl) {
    throw new Error('Could not find webgl context.');
  }
  if (!canvas) {
    throw new Error('Could not find canvas.');
  }

  return {
    graphics: {
      clearColor: (r: number, g: number, b: number, a: number) => {
        gl.clearColor(r, g, b, a);
      },
      clear: (i: number) => {
        gl.clear(i);
      },
      clearDepth: (i: number) => {
        gl.clearDepth(i);
      },
      depthFunc: (i: number) => {
        gl.depthFunc(i);
      },
      blendFunc: (i: number, j: number) => {
        gl.blendFunc(i, j);
      },
      enable: (i: number) => {
        gl.enable(i);
      },
      vertexAttribPointer: (
        index: number,
        size: number,
        type: number,
        normalized: number,
        stride: number,
        offset: number
      ) => {
        gl.vertexAttribPointer(index, size, type, false, stride, offset);
      },
      enableVertexAttribArray: (index: number) => {
        gl.enableVertexAttribArray(index);
      },
      disable: (i: number) => {
        gl.disable(i);
      },
      createProgram: () => {
        const { webglPrograms } = props.webglObjects;

        const program = gl.createProgram();
        if (program) {
          webglPrograms.push(program);
        } else {
          throw new Error('Failed to create program');
        }

        return webglPrograms.length - 1;
      },
      createBuffer: () => {
        const { webglBuffers } = props.webglObjects;

        const buffer = gl.createBuffer();
        if (buffer) {
          webglBuffers.push(buffer);
        } else {
          throw new Error('Failed to create the buffer object');
        }

        return webglBuffers.length - 1;
      },
      bindBuffer: (i: number, j: number) => {
        const { webglBuffers } = props.webglObjects;

        gl.bindBuffer(i, webglBuffers[j]);
      },
      bufferData: (i: number, offset: number, size: number, j: number) => {
        const buffer = memory.buffer.slice(offset, size * 8 + offset);
        const f64Array = new Float64Array(buffer);
        const f32Array = Float32Array.from(f64Array);
        gl.bufferData(i, f32Array, j);
      },
      elementBufferData: (i: number, offset: number, size: number, j: number) => {
        const i32Array = new Uint32Array(memory.buffer, offset, size);
        const i16Array = Uint16Array.from(i32Array);
        gl.bufferData(i, i16Array, j);
      },
      useProgram: (i: number) => {
        const { webglPrograms } = props.webglObjects;

        gl.useProgram(webglPrograms[i]);
      },
      getAttribLocation: (i: number, offset: number, length: number) => {
        const { webglPrograms } = props.webglObjects;

        let bytes = new Uint8Array(memory.buffer, offset, Number(length) * 4);
        // bytes.reverse();
        bytes = bytes.filter((element) => {
          return element !== 0;
        });
        const string = new TextDecoder('utf-8').decode(bytes);

        // string = [...string].reverse().join("");
        return gl.getAttribLocation(webglPrograms[i], string);
      },
      getUniformLocation: (i: number, offset: number, length: number) => {
        const { webglPrograms, webglUniformLoc } = props.webglObjects;

        let bytes = new Uint8Array(memory.buffer, offset, Number(length) * 4);
        bytes = bytes.filter((element) => {
          return element !== 0;
        });
        const string = new TextDecoder('utf-8').decode(bytes);
        const location = gl.getUniformLocation(webglPrograms[i], string);
        if (location) {
          webglUniformLoc.push(location);
        } else {
          throw new Error('Failed to get the uniform location');
        }

        return webglUniformLoc.length - 1;
      },
      uniformMatrix2fv: (i: number, transpose: boolean, offset: number) => {
        const f64Array = new Float64Array(memory.buffer, offset, 4);
        const f32Array = Float32Array.from(f64Array);
        gl.uniformMatrix2fv(props.webglObjects.webglUniformLoc[i], false, f32Array);
      },
      uniformMatrix3fv: (i: number, transpose: boolean, offset: number) => {
        const f64Array = new Float64Array(memory.buffer, offset, 9);
        const f32Array = Float32Array.from(f64Array);
        gl.uniformMatrix3fv(props.webglObjects.webglUniformLoc[i], transpose, f32Array);
      },
      uniformMatrix4fv: (i: number, transpose: boolean, offset: number) => {
        const buffer = memory.buffer.slice(offset, 128 + offset);
        const f64Array = new Float64Array(buffer);
        const f32Array = Float32Array.from(f64Array);
        gl.uniformMatrix4fv(props.webglObjects.webglUniformLoc[i], transpose, f32Array);
      },
      uniform1f: (i: number, v0: number) => {
        gl.uniform1f(props.webglObjects.webglUniformLoc[i], v0);
      },
      uniform1fv: (i: number, v: Float32List) => {
        gl.uniform1fv(props.webglObjects.webglUniformLoc[i], v);
      },
      uniform1i: (i: number, v0: number) => {
        gl.uniform1i(props.webglObjects.webglUniformLoc[i], v0);
      },
      uniform1iv: (i: number, v: Float32List) => {
        gl.uniform1iv(props.webglObjects.webglUniformLoc[i], v);
      },
      uniform2f: (i: number, v0: number, v1: number) => {
        gl.uniform2f(props.webglObjects.webglUniformLoc[i], v0, v1);
      },
      uniform2fv: (i: number, v: Float32List) => {
        gl.uniform2fv(props.webglObjects.webglUniformLoc[i], v);
      },
      uniform2i: (i: number, v0: number, v1: number) => {
        gl.uniform2i(props.webglObjects.webglUniformLoc[i], v0, v1);
      },
      uniform2iv: (i: number, v: Float32List) => {
        gl.uniform2iv(props.webglObjects.webglUniformLoc[i], v);
      },
      uniform3f: (i: number, v0: number, v1: number, v2: number) => {
        gl.uniform3f(props.webglObjects.webglUniformLoc[i], v0, v1, v2);
      },
      uniform3fv: (i: number, v: Float32List) => {
        gl.uniform3fv(props.webglObjects.webglUniformLoc[i], v);
      },
      uniform3i: (i: number, v0: number, v1: number, v2: number) => {
        gl.uniform3i(props.webglObjects.webglUniformLoc[i], v0, v1, v2);
      },
      uniform3iv: (i: number, v: Float32List) => {
        gl.uniform3iv(props.webglObjects.webglUniformLoc[i], v);
      },
      uniform4f: (i: number, v0: number, v1: number, v2: number, v3: number) => {
        gl.uniform4f(props.webglObjects.webglUniformLoc[i], v0, v1, v2, v3);
      },
      uniform4fv: (i: number, v: Float32List) => {
        gl.uniform4fv(props.webglObjects.webglUniformLoc[i], v);
      },
      uniform4i: (i: number, v0: number, v1: number, v2: number, v3: number) => {
        gl.uniform4i(props.webglObjects.webglUniformLoc[i], v0, v1, v2, v3);
      },
      uniform4iv: (i: number, v: Float32List) => {
        gl.uniform4iv(props.webglObjects.webglUniformLoc[i], v);
      },
      drawArrays: (i: number, first: number, count: number) => {
        gl.drawArrays(i, first, count);
      },
      drawElements: (i: number, count: number, type: number, offset: number) => {
        gl.drawElements(i, count, type, offset);
      },
      loadTexture: (offset: number, length: number) => {
        let bytes = new Uint8Array(memory.buffer, offset, Number(length) * 4);
        bytes = bytes.filter((element) => {
          return element !== 0;
        });
        const string = new TextDecoder('utf-8').decode(bytes);

        return loadTexture(gl, string);
      },
      activeTexture: (i: number) => {
        gl.activeTexture(i);
      },
      bindTexture: (i: number, j: number) => {
        gl.bindTexture(i, props.webglObjects.webglTextures[j]);
      },
      getTeapot: () => {
        return strToMem(props, teapot);
      },
      getMountains: () => {
        return strToMem(props, mountains);
      },
      getTeddybear: () => {
        return strToMem(props, teddybear);
      },
      getCow: () => {
        return strToMem(props, cow);
      },
      getFox: () => {
        return strToMem(props, fox);
      },
      getRobot: () => {
        return strToMem(props, robot);
      },
      getCheckpoint: () => {
        return strToMem(props, checkpoint);
      },
      lockPointer: () => {
        const requestPointerLock = () => {
          return canvas.requestPointerLock();
        };
        canvas.removeEventListener('click', requestPointerLock, false);
        canvas.addEventListener('click', requestPointerLock, false);
        const update = updateAbsolutePosition(props);

        const lockChangeAlert = () => {
          if (document.pointerLockElement === canvas) {
            document.addEventListener('mousemove', update, false);
          } else {
            document.removeEventListener('mousemove', update, false);
          }
        };

        document.removeEventListener('pointerlockchange', lockChangeAlert, false);
        document.addEventListener('pointerlockchange', lockChangeAlert, false);
      },
    },
  };
};

const initializeGraphicsProps = (props: unknown): Laze.Props => {
  if (!checkImportGraphicsProps(props)) {
    throw new Error('The props in initializeStdProps does not include type importGraphicsProps.');
  }
  props.webglObjects.webglBuffers = [];
  props.webglObjects.webglPrograms = [];
  props.webglObjects.webglTextures = [];
  props.webglObjects.webglUniformLoc = [];
  props.memory = new WebAssembly.Memory({ initial: 1000 });
  props.keyControl = initialKeyControl;
  props.memorySize = 0;
  return props;
};

export const graphicsModule: Laze.Module = {
  props: {
    webglObjects: { ...initialWebglObjects },
    canvas: null,
    gl: null,
    memory: new WebAssembly.Memory({ initial: 1000 }),
    memorySize: 0,
    keyControl: initialKeyControl,
  },
  importFunc: importGraphics,
  initFunc: initializeGraphicsProps,
};
