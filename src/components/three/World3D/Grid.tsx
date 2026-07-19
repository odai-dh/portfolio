'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { PALETTE } from './palette';
import { GRID } from './GridSnakeGame';

// Floating neon board over the page: primary-blue grid lines, a brighter
// border frame, a faint cell fill, and a transparent shadow-catcher so the
// snake casts soft shadows on "nothing".
export function Grid({ isDark = true }: { isDark?: boolean }) {
  const w = GRID.cols * GRID.cell;
  const h = GRID.rows * GRID.cell;
  // light mode: lines slightly stronger, but the cell fill nearly gone —
  // any fill over a white page reads as a solid slab
  const lineOpacity = isDark ? 0.22 : 0.26;
  const fillOpacity = isDark ? 0.05 : 0.015;
  const borderOpacity = isDark ? 0.8 : 0.85;

  const lines = useMemo(() => {
    const pts: number[] = [];
    for (let i = 1; i < GRID.cols; i++) {
      const x = -w / 2 + i * GRID.cell;
      pts.push(x, 0, -h / 2, x, 0, h / 2);
    }
    for (let j = 1; j < GRID.rows; j++) {
      const z = -h / 2 + j * GRID.cell;
      pts.push(-w / 2, 0, z, w / 2, 0, z);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return geo;
  }, [w, h]);

  const border = useMemo(() => {
    const pts = [
      -w / 2, 0, -h / 2, w / 2, 0, -h / 2,
      w / 2, 0, -h / 2, w / 2, 0, h / 2,
      w / 2, 0, h / 2, -w / 2, 0, h / 2,
      -w / 2, 0, h / 2, -w / 2, 0, -h / 2,
    ];
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return geo;
  }, [w, h]);

  return (
    <group>
      {/* faint cell fill */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial color={PALETTE.snake} transparent opacity={fillOpacity} depthWrite={false} />
      </mesh>
      {/* inner grid lines */}
      <lineSegments geometry={lines}>
        <lineBasicMaterial color={PALETTE.snake} transparent opacity={lineOpacity} />
      </lineSegments>
      {/* border frame — the edge you wrap through */}
      <lineSegments geometry={border} position={[0, 0.01, 0]}>
        <lineBasicMaterial color={PALETTE.snake} transparent opacity={borderOpacity} />
      </lineSegments>
      {/* soft shadows with no visible ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[w + 4, h + 4]} />
        <shadowMaterial transparent opacity={isDark ? 0.3 : 0.18} />
      </mesh>
    </group>
  );
}
