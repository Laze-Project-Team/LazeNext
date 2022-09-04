export type importObject = {
  console: {
    log: (arg: number) => void;
    debug: (arg: number) => void;
    logstring: (offset: number, length: number) => void;
    logMatrix: (offset: number) => void;
  };
  performance: {
    now: () => number;
  };
  js: {
    mem: WebAssembly.Memory;
    asin: (arg: number) => number;
    acos: (arg: number) => number;
    atan: (arg: number) => number;
    log: (arg: number) => number;
    exp: (arg: number, arg2: number) => number;
    ePow: (arg: number) => number;
    checkKeyPress: (keyCode: number) => bigint;
    checkMousePress: () => bigint;
    checkRelativeMouseX: () => number;
    checkRelativeMouseY: () => number;
    checkAbsoluteMouseX: () => number;
    checkAbsoluteMouseY: () => number;
    checkScrollY: () => number;
    rand: () => number;
    getTeapot: () => number;
    getMountains: () => number;
    getTeddybear: () => number;
    getCow: () => number;
    getRobot: () => number;
    alloc: (size: number) => number;
    lockPointer: () => void;
    updateLinetraceTime: (number) => void;
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
};

export type arduinoObjects = {
  port: SerialPort | null;
  serialReader: ReadableStreamDefaultReader<string> | null;
  lastCommand: {
    command: number;
    data: number;
  };
  receiveText: string;
  digitalInput: number[];
  analogInput: number[];
  pulseInput: number[];
};

export type getCompleteImportsFunction = (id: string) => importObject;

type keyControlType = {
  relativeMouseX: number;
  relativeMouseY: number;
  absoluteMouseX: number;
  absoluteMouseY: number;
  mousePressed: boolean;
  pressedKeys: boolean[];
  scrollY: number;
};

export type compilerProps = getImportsProps & {
  importObject: getCompleteImportsFunction;
};

export type compilerVariable = {
  memory: WebAssembly.Memory;
  keyControl: keyControlType;
  memorySize: number;
  wasm: string;
  id: string;
  lang: string;
  keyControl: keyControlType;
  interval: NodeJS.Timer | null;
  lazeCallNoParam: CallableFunction | null;
  linetraceTime: number | null;
  programUrl: string;
  wasmUrl: string;
};

export type getImportsProps = {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  webglObjects: webglObjects;
  arduinoObjects: arduinoObjects;
  variables: compilerVariable;
};

export type compileRequest = {
  code: string;
  option: {
    lang: string;
    label: string;
    langFile?: string;
  };
};

export type convertRequest = {
  code: string;
  option: {
    label: string;
    from: string;
    to: string;
    fromLangFile?: string;
    toLangFile?: string;
  };
};

export type compileResponse = {
  success: boolean;
  message: string;
  wasm: string;
  programUrl: string;
  wasmUrl: string;
};

export type successConvertResponse = {
  success: true;
  code: string;
};

export type failedConvertResponse = {
  success: false;
  message: string;
};

export type convertResponse = successConvertResponse | failedConvertResponse;

export type successedCompilerResult = {
  success: true;
  message: string;
  wasm: string;
  programUrl: string;
  wasmUrl: string;
};

export type failedCompilerResult = {
  success: false;
  message: string;
};

export type compilerResult = successedCompilerResult | failedCompilerResult;

export type compilerType = {
  compile: (code: string, label: string) => Promise<boolean>;
  convert: (path: string, code: string, lang: string, newLang: string, label: string) => Promise<boolean>;
  run: () => void | Promise<void>;
};
