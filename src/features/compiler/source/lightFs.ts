export const lightFs = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 lightColor;

void main(){
  gl_FragColor = vec4(lightColor, 1.0);
}
`;
