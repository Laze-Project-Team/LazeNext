export const vs = `
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uProjMat;
uniform mat4 uModelMat;
uniform mat4 uViewMat;

varying highp vec3 vNormal;
varying highp vec3 vPosition;
void main() {
  gl_Position = uProjMat * uViewMat * uModelMat * vec4(aVertexPosition, 1.0);
  vPosition = vec3(uModelMat * vec4(aVertexPosition, 1.0));
  vNormal = vec3(uModelMat * vec4(aVertexNormal, 1.0));
}
`;
