import { memo, useMemo } from 'react';
import * as THREE from 'three';

/**
 * Top-down tropical island base.
 * Layers: underwater reef ring → sandy beach ring → green land circle → optional inner detail
 */
export const IslandBase = memo(function IslandBase() {
  // Sand color
  const sandMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#f5deb3',
    roughness: 0.9,
    metalness: 0,
    flatShading: true,
  }), []);

  // Lush green land
  const grassMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#4ade80',
    roughness: 0.8,
    metalness: 0,
    flatShading: true,
  }), []);

  // Shallow water / reef ring
  const reefMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#67e8f9',
    roughness: 0.4,
    metalness: 0.1,
    transparent: true,
    opacity: 0.6,
  }), []);

  // Dark green bushes/forest
  const forestMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#16a34a',
    roughness: 0.7,
    metalness: 0,
    flatShading: true,
  }), []);

  return (
    <group>
      {/* Shallow reef ring (outermost, underwater) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} material={reefMat}>
        <circleGeometry args={[2.2, 24]} />
      </mesh>

      {/* Sandy beach ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} material={sandMat}>
        <circleGeometry args={[1.7, 20]} />
      </mesh>

      {/* Main green land */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]} material={grassMat}>
        <circleGeometry args={[1.3, 16]} />
      </mesh>

    </group>
  );
});
