export const pointFs = `#version 300 es
#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 objectColor;

out vec4 FragColor;
void main(){
  FragColor = vec4(objectColor, 1.0);
}
`;
