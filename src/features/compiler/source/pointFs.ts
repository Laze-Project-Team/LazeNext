export const pointFs = `
#ifdef GL_ES
precision mediump float;
#endif
uniform vec3 objectColor;

void main(){
  gl_FragColor = vec4(objectColor, 1.0);
}
`;
