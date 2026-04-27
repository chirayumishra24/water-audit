import * as THREE from 'three';

const vertexShader = `
varying vec3 vWorldPosition;
void main() {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;

const fragmentShader = `
uniform vec3 topColor;
uniform vec3 bottomColor;
uniform float offset;
uniform float exponent;
varying vec3 vWorldPosition;
void main() {
  float h = normalize(vWorldPosition + offset).y;
  gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
}
`;

export function SkyGradient() {
  return (
    <mesh>
      <sphereGeometry args={[50, 16, 16]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          topColor: { value: new THREE.Color('#0a1628') },
          bottomColor: { value: new THREE.Color('#1e3a5f') },
          offset: { value: 33 },
          exponent: { value: 0.6 },
        }}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}
