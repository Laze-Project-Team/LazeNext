export default `#version 300 es
#ifdef GL_ES
precision mediump float;
#endif
layout (location = 0) in vec3 aVertexPosition;

uniform mat4 uProjMat;
uniform mat4 uModelMat;
uniform mat4 uViewMat;

void main() {
  gl_Position = uProjMat * uViewMat * uModelMat * vec4(aVertexPosition, 1.0);
  gl_PointSize = 10.0;
}
`;
