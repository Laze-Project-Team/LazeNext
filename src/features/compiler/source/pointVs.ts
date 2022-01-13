export const pointVs = `
#ifdef GL_ES
precision mediump float;
#endif
attribute vec3 aVertexPosition;

uniform mat4 uProjMat;
uniform mat4 uModelMat;
uniform mat4 uViewMat;

void main() {
  gl_Position = uProjMat * uViewMat * uModelMat * vec4(aVertexPosition, 1.0);
  gl_PointSize = 10.0;
}
`;
