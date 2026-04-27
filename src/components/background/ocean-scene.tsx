"use client";

import { useFrame } from '@react-three/fiber';
import { OceanPlane } from './ocean/ocean-plane';
import { UnderwaterParticles } from './ocean/underwater-particles';
import { ChapterIsland } from './islands/chapter-island';
import { Droplet } from './islands/elements/droplet';
import { CompassRing } from './islands/elements/compass-ring';
import { Pipeline } from './islands/elements/pipeline';
import { BalanceBeam } from './islands/elements/balance-beam';
import { DataBars } from './islands/elements/data-bars';
import { SavingsCoin } from './islands/elements/savings-coin';
import { ActionArrow } from './islands/elements/action-arrow';
import { FishSchool } from './creatures/fish-school';

const CHAPTERS = [
  { id: 1, color: '#22d3ee', Element: Droplet },
  { id: 2, color: '#818cf8', Element: CompassRing },
  { id: 3, color: '#f97316', Element: Pipeline },
  { id: 4, color: '#34d399', Element: BalanceBeam },
  { id: 5, color: '#a78bfa', Element: DataBars },
  { id: 6, color: '#fbbf24', Element: SavingsCoin },
  { id: 7, color: '#f43f5e', Element: ActionArrow },
];

// Arrange islands in a fun scattered layout (not a perfect circle)
const ISLAND_POSITIONS: [number, number, number][] = [
  [-8, 0, -6],    // Ch1 — top-left area
  [0, 0, -8],     // Ch2 — top-center
  [8, 0, -5],     // Ch3 — top-right
  [-10, 0, 2],    // Ch4 — mid-left
  [10, 0, 3],     // Ch5 — mid-right
  [-5, 0, 9],     // Ch6 — bottom-left
  [5, 0, 10],     // Ch7 — bottom-right
];

export function OceanScene({ compact, reduceMotion }: { compact: boolean; reduceMotion: boolean }) {
  // Very slow gentle drift of the camera for life
  useFrame(({ camera, clock }) => {
    if (!reduceMotion) {
      const t = clock.getElapsedTime();
      camera.position.x = Math.sin(t * 0.03) * 2;
      camera.position.z = Math.cos(t * 0.03) * 2;
      camera.lookAt(0, 0, 0);
    }
  });

  return (
    <group>
      {/* Bright warm lighting */}
      <ambientLight intensity={0.8} color="#fffbe6" />
      <directionalLight position={[10, 20, 5]} intensity={1.8} color="#fff7ed" />
      <directionalLight position={[-5, 15, -5]} intensity={0.5} color="#bae6fd" />

      {/* Ocean water */}
      <OceanPlane compact={compact} />

      {/* Sparkle particles on water */}
      <UnderwaterParticles compact={compact} />

      {/* Colorful fish swimming around */}
      <FishSchool compact={compact} />

      {/* Chapter islands scattered across the ocean */}
      {CHAPTERS.map((chap, i) => (
        <ChapterIsland
          key={chap.id}
          position={ISLAND_POSITIONS[i]}
          color={chap.color}
          element={<chap.Element color={chap.color} />}
        />
      ))}
    </group>
  );
}
