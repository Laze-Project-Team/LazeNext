import { loadShader } from './loadShader';

export const initShaderProgram = (gl: WebGLRenderingContext, vsSource: string, fsSource: string): WebGLProgram => {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program
  const shaderProgram = gl.createProgram();
  if (shaderProgram && vertexShader && fragmentShader) {
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // ShaderProgram作成失敗時に警告を表示
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      throw new Error(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram) ?? ''}`);
    }

    return shaderProgram;
  }
  throw new Error('Failed to create shader program');
};
