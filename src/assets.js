import { BoxGeometry, RawShaderMaterial }  from './three/Three.js';

export const COLOR = {
  YELLOW : [255, 255, 100],
  ORANGE : [255, 200, 100],
  BLACK : [50, 50, 50],
  BLUE : [100, 200, 255]
}

export const VertexMat = new RawShaderMaterial( {
    transparent : false,
    uniforms : {
    },
    vertexShader: `
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      attribute vec3 position;
      attribute vec3 color;
      varying lowp vec3 vColor;
      varying float vHeight;
      varying float vDepth;
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
        vColor = color;
        vHeight = gl_Position.y;
        vDepth = gl_Position.z;
      }`,
    fragmentShader : `
    precision highp float;
    varying lowp vec3 vColor;
    varying float vHeight;
    varying float vDepth;
    vec3 waterColor = vec3(0.48, 0.78, 1.);
    vec3 fogColor = vec3(240./255., 128./255., 1.);
    float getFogFactor(float d)
    {
      const float FogMax = 65.0;
      const float FogMin = 10.0;

      if (d>=FogMax) return 1.;
      if (d<=FogMin) return 0.;

      return 1. - (FogMax - d) / (FogMax - FogMin);
    } 

    void main(void) {

      vec3 color;
      
      if (vHeight < -6.4) {
        color = mix(vColor.rgb, waterColor, 0.65);
      } else {
        color = vec3(vColor.rgb);
      }

      float fog_alpha = getFogFactor(vDepth);
      color = mix(color, fogColor, fog_alpha);
      
      
      gl_FragColor= vec4(color, 1.0);
    }`
  });


export const MATERIAL = {
  YELLOW : VertexMat,
  ORANGE : VertexMat,
  BLACK : VertexMat,
  WATER : VertexMat
}