import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FISH_COLORS = ['#f472b6', '#fb923c', '#facc15', '#4ade80', '#60a5fa', '#c084fc'];

export function FishSchool({ compact }: { compact: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const fishCount = compact ? 6 : 10;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const jumpStates = useMemo(() => Array.from({ length: 12 }, () => ({
    jumping: false,
    start: 0,
    duration: 1.2,
  })), []);

  const geometry = useMemo(() => {
    // Simple fish shape — elongated sphere
    const geo = new THREE.ConeGeometry(0.08, 0.3, 4);
    geo.rotateX(Math.PI / 2);
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    for (let i = 0; i < fishCount; i++) {
      const state = jumpStates[i];

      // Random jump trigger
      if (!state.jumping && Math.random() < 0.003) {
        state.jumping = true;
        state.start = t;
      }

      const angle = t * 0.4 + (i / fishCount) * Math.PI * 2;
      const r = 6 + (i % 3) * 2.5;

      let y = 0.1;
      if (state.jumping) {
        const progress = (t - state.start) / state.duration;
        if (progress >= 1) {
          state.jumping = false;
        } else {
          y = 0.1 + Math.sin(progress * Math.PI) * 1.5;
        }
      }

      dummy.position.set(r * Math.cos(angle), y, r * Math.sin(angle));
      dummy.rotation.set(0, -angle + Math.PI, 0);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // Assign color per fish
      meshRef.current.setColorAt(i, new THREE.Color(FISH_COLORS[i % FISH_COLORS.length]));
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, fishCount]}>
      <meshStandardMaterial vertexColors roughness={0.3} metalness={0.4} />
    </instancedMesh>
  );
}
