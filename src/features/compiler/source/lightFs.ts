export default `#version 300 es

#ifdef GL_ES
precision mediump float;
#endif

out vec4 FragColor;

void main(){
  FragColor = vec4(1.0);
}
`;
