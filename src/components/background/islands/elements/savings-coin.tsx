import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** Ch6 — Shiny spinning gold coin */
export function SavingsCoin({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      ref.current.rotation.y = t * 1.5;
      ref.current.position.y = 0.55 + Math.sin(t * 3) * 0.06;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0.55, 0]}>
      <cylinderGeometry args={[0.22, 0.22, 0.05, 20]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} metalness={0.9} roughness={0.1} />
    </mesh>
  );
}
