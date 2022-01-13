export const fs2DTexture = `
#ifdef GL_ES
precision mediump float;
#endif

varying highp vec2 vTexCoord;

uniform sampler2D uSampler;

void main() {
  gl_FragColor = texture2D(uSampler, vTexCoord);
}
`;
