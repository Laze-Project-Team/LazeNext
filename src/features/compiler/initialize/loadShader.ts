export const loadShader = (gl: WebGLRenderingContext, type: number, source: string): WebGLShader => {
  const shader = gl.createShader(type);

  if (shader) {
    // シェーダーにソースを送信
    gl.shaderSource(shader, source);

    // シェーダーをコンパイル
    gl.compileShader(shader);

    // 正しくコンパイルされたかチェック
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(shader) ?? '';
      gl.deleteShader(shader);
      throw new Error(`An error occurred compiling the shaders: ${log}`);
    }

    return shader;
  }
  throw new Error('Failed to create shader.');
};
