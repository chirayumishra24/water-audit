import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** Ch4 — Little rocking balance/scale */
export function BalanceBeam({ color }: { color: string }) {
  const beamRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (beamRef.current) {
      beamRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 1.2) * 0.2;
    }
  });

  return (
    <group position={[0, 0.35, 0]}>
      {/* Base triangle */}
      <mesh>
        <coneGeometry args={[0.12, 0.25, 3]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </mesh>
      {/* Rocking beam */}
      <group ref={beamRef} position={[0, 0.18, 0]}>
        <mesh>
          <boxGeometry args={[0.7, 0.04, 0.08]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
        </mesh>
        {/* Left bucket */}
        <mesh position={[-0.3, -0.08, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 0.12, 8]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
        {/* Right bucket */}
        <mesh position={[0.3, -0.08, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 0.12, 8]} />
          <meshStandardMaterial color="#fb923c" />
        </mesh>
      </group>
    </group>
  );
}
