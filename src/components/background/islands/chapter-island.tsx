import { ReactNode } from 'react';
import { IslandBase } from './island-base';

interface ChapterIslandProps {
  position: [number, number, number];
  element: ReactNode;
  color: string;
  label?: string;
}

export function ChapterIsland({ position, element, color }: ChapterIslandProps) {
  return (
    <group position={position}>

      {/* Chapter-specific element sits on the island */}
      {element}



      {/* Soft point light for glow */}
      <pointLight position={[0, 2, 0]} color={color} intensity={0.8} distance={5} />
    </group>
  );
}
