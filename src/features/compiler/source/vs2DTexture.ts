export const vs2DTexture = `
attribute vec3 aVertexPosition;
attribute vec2 aTexCoord;

uniform mat4 model;
uniform mat4 projection;

varying highp vec2 vTexCoord;
void main() {
  gl_Position = model * projection * vec4(aVertexPosition, 1.0);
  vTexCoord = aTexCoord;
}
`;
