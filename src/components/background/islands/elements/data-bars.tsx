import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BAR_COLORS = ['#818cf8', '#a78bfa', '#c084fc', '#e879f9'];

/** Ch5 — Colorful animated bar chart */
export function DataBars({ color }: { color: string }) {
  const barsRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!barsRef.current) return;
    const t = clock.getElapsedTime();
    barsRef.current.children.forEach((child, i) => {
      const base = [0.2, 0.35, 0.5, 0.3][i] || 0.3;
      (child as THREE.Mesh).scale.y = base + Math.sin(t * 2 + i * 1.2) * 0.12;
    });
  });

  return (
    <group ref={barsRef} position={[0, 0.3, 0]}>
      {BAR_COLORS.map((c, i) => (
        <mesh key={i} position={[(i - 1.5) * 0.16, 0.15, 0]}>
          <boxGeometry args={[0.1, 0.5, 0.1]} />
          <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.3} />
        </mesh>
      ))}
    </group>
  );
}
