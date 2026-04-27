import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** Ch2 — Spinning compass ring with a pointer */
export function CompassRing({ color }: { color: string }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.8;
    }
  });

  return (
    <group ref={ref} position={[0, 0.5, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.35, 0.05, 8, 20]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      {/* Compass needle */}
      <mesh position={[0, 0.05, 0]}>
        <coneGeometry args={[0.06, 0.3, 4]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}
