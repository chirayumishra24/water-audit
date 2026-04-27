"use client";

import { useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import { OceanScene } from "@/components/background/ocean-scene";

function detectWebGLSupport() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}

function subscribeToMediaQuery(query: string, onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const mediaQueryList = window.matchMedia(query);
  mediaQueryList.addEventListener("change", onStoreChange);

  return () => {
    mediaQueryList.removeEventListener("change", onStoreChange);
  };
}

function readMediaQuery(query: string) {
  return typeof window !== "undefined" && window.matchMedia(query).matches;
}

export function BackgroundScene() {
  const canRender3d = useSyncExternalStore(
    () => () => undefined,
    detectWebGLSupport,
    () => false,
  );
  const reduceMotion = useSyncExternalStore(
    (onStoreChange) => subscribeToMediaQuery("(prefers-reduced-motion: reduce)", onStoreChange),
    () => readMediaQuery("(prefers-reduced-motion: reduce)"),
    () => false,
  );
  const compact = useSyncExternalStore(
    (onStoreChange) => subscribeToMediaQuery("(max-width: 900px)", onStoreChange),
    () => readMediaQuery("(max-width: 900px)"),
    () => false,
  );

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Light ocean gradient fallback */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#b3e8ff] via-[#d4f3ff] to-[#e8f8ff]" />

      {canRender3d ? (
        <Canvas
          className="absolute inset-0"
          orthographic
          camera={{
            position: [0, 50, 0],
            zoom: compact ? 18 : 28,
            near: 0.1,
            far: 200,
          }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          aria-hidden="true"
        >
          <OceanScene compact={compact} reduceMotion={reduceMotion} />
        </Canvas>
      ) : null}
    </div>
  );
}
