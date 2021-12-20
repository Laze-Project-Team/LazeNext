export default `
uniform highp vec3 objectColor;
uniform highp float transparency;

 void main() {
   gl_FragColor = vec4(objectColor, transparency);
 }
`;
