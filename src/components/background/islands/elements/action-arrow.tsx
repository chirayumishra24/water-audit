import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** Ch7 — Little rocket/arrow launching upward */
export function ActionArrow({ color }: { color: string }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      ref.current.position.y = 0.5 + Math.abs(Math.sin(t * 2)) * 0.5;
      ref.current.rotation.y = t * 1.5;
    }
  });

  return (
    <group ref={ref} position={[0, 0.5, 0]}>
      {/* Rocket body */}
      <mesh>
        <cylinderGeometry args={[0.08, 0.1, 0.3, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
      </mesh>
      {/* Nose cone */}
      <mesh position={[0, 0.22, 0]}>
        <coneGeometry args={[0.08, 0.15, 8]} />
        <meshStandardMaterial color="#fca5a5" emissive="#f43f5e" emissiveIntensity={0.5} />
      </mesh>
      {/* Flame */}
      <mesh position={[0, -0.2, 0]}>
        <coneGeometry args={[0.07, 0.15, 6]} />
        <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}
