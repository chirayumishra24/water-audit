import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** Bright sparkle particles floating on the water surface */
export function UnderwaterParticles({ compact }: { compact: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = compact ? 40 : 120;

  const [positions, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const ph = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = 0.15 + Math.random() * 0.1; // just above water surface
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
      ph[i] = Math.random() * Math.PI * 2;
    }
    return [pos, ph];
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    const attr = pointsRef.current.geometry.attributes.position;

    for (let i = 0; i < count; i++) {
      // Gentle drift
      attr.setX(i, attr.getX(i) + Math.sin(t * 0.3 + phases[i]) * 0.003);
      attr.setZ(i, attr.getZ(i) + Math.cos(t * 0.2 + phases[i]) * 0.003);
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color="#ffffff"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
