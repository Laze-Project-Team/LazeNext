export default `#version 300 es
layout (location = 0) in vec3 aVertexPosition;
layout (location = 1) in vec3 aVertexNormal;

uniform mat4 uProjMat;
uniform mat4 uModelMat;
uniform mat4 uViewMat;

out vec3 vNormal;
out vec3 vPosition;
void main() {
  gl_Position = uProjMat * uViewMat * uModelMat * vec4(aVertexPosition, 1.0);
  vPosition = vec3(uModelMat * vec4(aVertexPosition, 1.0));
  vNormal = vec3(uModelMat * vec4(aVertexNormal, 1.0));
}
`;
