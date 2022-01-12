export const fs = `
varing highp vec3 vNormal;
varing highp vec3 vPosition;

uniform vec3 lightPos;
uniform vec3 lightColor;
uniform vec3 objectColor;
uniform vec3 viewPos;

void main() {
  float ambientStrength = 1.0;
  vec3 ambient = ambientStrength * lightColor;

  vec3 norm = normalize(vNormal);
  vec3 lightDir = normalize(lightPos - vPosition);

  float diff = max(dot(norm, lightDir), 0.0);
  vec3 diffuse = diff * lightColor;

  float specularStrength = 0.5;
  vec3 viewDir = normalize(viewPos - vPosition);
  vec3 reflectDir = reflect(-lightDir, norm);
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
  vec3 specular = specularStrength * spec * lightColor;

  vec3 result = (ambient + diffuse + specular) * objectColor;
  gl_FragColor = vec4(result, 1.0);
}
`;
