import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** Ch3 — Little pipe network on the island */
export function Pipeline({ color }: { color: string }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      // Gentle pulse
      const s = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.05;
      ref.current.scale.set(s, s, s);
    }
  });

  return (
    <group ref={ref} position={[0, 0.3, 0]}>
      {/* Horizontal pipe */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.7, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      {/* Vertical pipe */}
      <mesh position={[0.25, 0.15, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.35, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      {/* Drip drop */}
      <mesh position={[0.25, -0.1, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}
