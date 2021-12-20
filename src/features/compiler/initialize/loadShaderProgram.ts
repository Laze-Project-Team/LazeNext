export const loadShader = (gl: WebGL2RenderingContext, type: number, source: string): WebGLShader => {
  const shader = gl.createShader(type);

  // Send the source to the shader object
  if (shader) {
    gl.shaderSource(shader, source);

    // Compile the shader program
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(shader) ?? '';
      gl.deleteShader(shader);
      throw Error(`An error occurred compiling the shaders: ${log}`);
    }

    return shader;
  }

  throw Error('Failed to initialize WebGLShader');
};
