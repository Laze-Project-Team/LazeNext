export type importObject = {
  console: {
    log: (arg: number) => void;
    logstring: (offset: number, length: number) => void;
    logMatrix: (offset: number) => void;
  };
  performance: {
    now: () => number;
  };
  js: {
    mem: WebAssembly.Memory;
    checkKeyPress: (keyCode: number) => bigint;
    checkMousePress: () => bigint;
    checkRelativeMouseX: () => number;
    checkRelativeMouseY: () => number;
    checkAbsoluteMouseX: () => number;
    checkAbsoluteMouseY: () => number;
    rand: () => number;
    alloc: (size: number) => number;
    lockPointer: () => void;
  };
  webgl: {
    clearColor: (r: number, g: number, b: number, a: number) => void;
    clear: (i: number) => void;
    clearDepth: (i: number) => void;
    depthFunc: (i: number) => void;
    blendFunc: (i: number, j: number) => void;
    enable: (i: number) => void;
    vertexAttribPointer: (
      index: number,
      size: number,
      type: number,
      normalized: number,
      stride: number,
      offset: number
    ) => void;
    enableVertexAttribArray: (index: number) => void;
    disable: (i: number) => void;
    createProgram: () => number;
    createBuffer: () => number;
    bindBuffer: (i: number, j: number) => void;
    bufferData: (i: number, offset: number, size: number, j: number) => void;
    elementBufferData: (i: number, offset: number, size: number, j: number) => void;
    useProgram: (i: number) => void;
    getAttribLocation: (i: number, offset: number, length: number) => number;
    getUniformLocation: (i: number, offset: number, length: number) => number;
    uniformMatrix2fv: (i: number, transpose: boolean, offset: number) => void;
    uniformMatrix3fv: (i: number, transpose: boolean, offset: number) => void;
    uniformMatrix4fv: (i: number, transpose: boolean, offset: number) => void;
    uniform1f: (i: number, v0: number) => void;
    uniform1fv: (i: number, v: Float32List) => void;
    uniform1i: (i: number, v0: number) => void;
    uniform1iv: (i: number, v: Float32List) => void;
    uniform2f: (i: number, v0: number, v1: number) => void;
    uniform2fv: (i: number, v: Float32List) => void;
    uniform2i: (i: number, v0: number, v1: number) => void;
    uniform2iv: (i: number, v: Float32List) => void;
    uniform3f: (i: number, v0: number, v1: number, v2: number) => void;
    uniform3fv: (i: number, v: Float32List) => void;
    uniform3i: (i: number, v0: number, v1: number, v2: number) => void;
    uniform3iv: (i: number, v: Float32List) => void;
    uniform4f: (i: number, v0: number, v1: number, v2: number, v3: number) => void;
    uniform4fv: (i: number, v: Float32List) => void;
    uniform4i: (i: number, v0: number, v1: number, v2: number, v3: number) => void;
    uniform4iv: (i: number, v: Float32List) => void;
    drawArrays: (i: number, first: number, count: number) => void;
    drawElements: (i: number, count: number, type: number, offset: number) => void;
    loadTexture: (offset: number, length: number) => void;
    activeTexture: (i: number) => void;
    bindTexture: (i: number, j: number) => void;
  };
};

export type webglObjects = {
  webglBuffers: WebGLBuffer[];
  webglPrograms: WebGLProgram[];
  webglUniformLoc: WebGLUniformLocation[];
  webglTextures: WebGLTexture[];
  webglShaders: WebGLShader[];
};

export type getCompleteImportsFunction = (id: string) => importObject;

type keyControlType = {
  relativeMouseX: number;
  relativeMouseY: number;
  absoluteMouseX: number;
  absoluteMouseY: number;
  mousePressed: boolean;
  pressedKeys: boolean[];
};

export type compilerProps = {
  canvas: HTMLCanvasElement;
  gl: WebGL2RenderingContext;
  importObject: getCompleteImportsFunction;
  webglObjects: webglObjects;
  variables: compilerVariable;
};

export type compilerVariable = {
  memory: WebAssembly.Memory;
  keyControl: keyControlType;
  memorySize: number;
  wasm: string;
  id: string;
  keyControl: keyControlType;
  compiled: boolean;
};

export type getImportsProps = {
  canvas: HTMLCanvasElement;
  gl: WebGL2RenderingContext;
  webglObjects: webglObjects;
  variables: compilerVariable;
};

export type compileResponse = {
  success: boolean;
  message: string;
  wasm: string;
};

export type compilerType = {
  compile: (code: string, label: string) => void;
  run: () => void;
};
