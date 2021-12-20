export default `
varying highp vec2 vTexCoord;

uniform sampler2D uSampler;

void main() {
  gl_FragColor = texture2D(uSampler, vTexCoord);
}
`;
