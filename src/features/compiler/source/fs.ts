export const fs = `
#ifdef GL_ES
precision mediump float;
#endif

varying highp vec3 vNormal;
varying highp vec3 vPosition;

struct PointLight {    
  vec3 position;
  
  float radius;

  vec3 ambient;
  vec3 diffuse;
  vec3 specular;
};  
#define NUM_POINT_LIGHTS 16
uniform PointLight pointLights[NUM_POINT_LIGHTS];

struct DirLight {
  vec3 direction;

  vec3 ambient;
  vec3 diffuse;
  vec3 specular;
};  
uniform DirLight dirLight;

uniform vec3 objectColor;
uniform vec3 viewPos;

vec3 CalcPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir){
  vec3 lightDir = normalize(light.position - fragPos);
  // diffuse shading
  float diff = max(dot(normal, lightDir), 0.0);
  // specular shading
  vec3 reflectDir = reflect(-lightDir, normal);
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
  // attenuation
  float distance    = length(light.position - fragPos);
  float attenuation = 1.0 / ((0.75 + distance/light.radius) * (0.75 + distance/light.radius));    
  // combine results
  vec3 ambient  = light.ambient  * objectColor;
  vec3 diffuse  = light.diffuse  * diff * objectColor;
  vec3 specular = light.specular * spec * objectColor;
  ambient  *= attenuation;
  diffuse  *= attenuation;
  specular *= attenuation;
  return (ambient + diffuse + specular);
}

vec3 CalcDirLight(DirLight light, vec3 normal, vec3 viewDir)
{
    vec3 lightDir = normalize(-light.direction);
    // diffuse shading
    float diff = max(dot(normal, lightDir), 0.0);
    // specular shading
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    // combine results
    vec3 ambient  = light.ambient  * objectColor;
    vec3 diffuse  = light.diffuse  * diff * objectColor;
    vec3 specular = light.specular * spec * objectColor;
    return (ambient + diffuse + specular);
}

void main() {
  vec3 norm = normalize(vNormal);
  vec3 viewDir = normalize(viewPos - vPosition);

  vec3 result = CalcDirLight(dirLight, norm, viewDir);
  for(int i = 0; i < NUM_POINT_LIGHTS; i++){
    result += CalcPointLight(pointLights[i], norm, vPosition, viewDir);
  }

  gl_FragColor = vec4(result, 1.0);
}
`;
