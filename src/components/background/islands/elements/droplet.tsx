import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** Ch1 — Animated water droplet bouncing on the island */
export function Droplet({ color }: { color: string }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      ref.current.position.y = 0.6 + Math.abs(Math.sin(t * 2.5)) * 0.4;
      ref.current.scale.setScalar(1 + Math.sin(t * 5) * 0.08);
    }
  });

  return (
    <group ref={ref} position={[0, 0.6, 0]}>
      <mesh>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} roughness={0.1} metalness={0.3} />
      </mesh>
      {/* Small splash ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
        <ringGeometry args={[0.15, 0.25, 12]} />
        <meshStandardMaterial color={color} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}
