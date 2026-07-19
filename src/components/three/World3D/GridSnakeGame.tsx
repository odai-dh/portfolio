'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { PALETTE } from './palette';

// ---------------------------------------------------------------------------
// Ported from rock-biter/three-snake-live (Odai's local clone) — faithfully:
// - grid cells, 240ms tick, dot-product direction lock (no 180° turns)
// - candy attaches to the HEAD on eat, rides backward one node per tick at
//   1.15× scale, and the tail grows only when it arrives at the end
// - candies are worth 1–3 points and are sized 0.5 + points*0.5/3
// - self-collision AND rock collision = death; edges wrap
// - entities spawn with an elastic pop (gsap elastic.out → hand-rolled)
// - Space pauses/resumes, like the reference
// ---------------------------------------------------------------------------

export const GRID = {
  cols: 14,
  rows: 14,
  cell: 0.9,
  tickMs: 240,
  startLength: 3,
  lemonCount: 2,
} as const;

type Cell = { x: number; z: number };
type Dir = { x: number; z: number };
type Lemon = { cell: Cell; points: number; bornAt: number };
type Ride = { index: number }; // candy position along the body

const DIRS: Record<string, Dir> = {
  ArrowUp: { x: 0, z: -1 }, w: { x: 0, z: -1 }, W: { x: 0, z: -1 },
  ArrowDown: { x: 0, z: 1 }, s: { x: 0, z: 1 }, S: { x: 0, z: 1 },
  ArrowLeft: { x: -1, z: 0 }, a: { x: -1, z: 0 }, A: { x: -1, z: 0 },
  ArrowRight: { x: 1, z: 0 }, d: { x: 1, z: 0 }, D: { x: 1, z: 0 },
};

// deadly obstacles, reference-style — parked off the start row and lemon lanes
export const ROCKS: Cell[] = [
  { x: 2, z: 2 },
  { x: 11, z: 4 },
  { x: 4, z: 11 },
];

export function cellToWorld(c: Cell): [number, number] {
  return [
    (c.x - (GRID.cols - 1) / 2) * GRID.cell,
    (c.z - (GRID.rows - 1) / 2) * GRID.cell,
  ];
}

function sameCell(a: Cell, b: Cell): boolean {
  return a.x === b.x && a.z === b.z;
}

// gsap elastic.out(1.5, 0.5), hand-rolled — the reference spawn-in feel
export function elasticOut(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return 1 + 1.5 * Math.pow(2, -10 * t) * Math.sin(((t * 10 - 0.75) * (2 * Math.PI)) / 3);
}

// spawn row — sits in the clear lane between the hero subtitle and the buttons
const START_ROW = 10;

const INITIAL_LEMON_CELLS: Cell[] = [
  { x: 10, z: START_ROW },
  { x: 12, z: START_ROW },
];

function rollPoints(): number {
  return Math.floor(Math.random() * 3) + 1; // 1..3, reference Candy.points
}

function lemonScale(points: number): number {
  return 0.5 + (points * 0.5) / 3; // reference Candy scale
}

function randomFreeCell(occupied: Cell[]): Cell {
  let c: Cell;
  do {
    c = {
      x: Math.floor(Math.random() * GRID.cols),
      z: Math.floor(Math.random() * GRID.rows),
    };
  } while (occupied.some((o) => sameCell(o, c)) || ROCKS.some((r) => sameCell(r, c)));
  return c;
}

function usePop() {
  const ctxRef = useRef<AudioContext | null>(null);
  useEffect(() => () => { ctxRef.current?.close().catch(() => undefined); }, []);
  return useCallback((freq = 520) => {
    try {
      ctxRef.current ??= new AudioContext();
      const ctx = ctxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.8, ctx.currentTime + 0.09);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.16);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch {
      // no audio — fine
    }
  }, []);
}

function LemonMesh({ lemon, now }: { lemon: Lemon; now: number }) {
  const [wx, wz] = cellToWorld(lemon.cell);
  const s = lemonScale(lemon.points) * elasticOut(Math.min(1, (now - lemon.bornAt) / 1));
  return (
    <group
      position={[wx, 0.45 + Math.sin(now * 2.4 + lemon.cell.x) * 0.07, wz]}
      rotation={[0, now * 1.2, 0]}
      scale={s}
    >
      <mesh castShadow scale={[1, 1.22, 1]}>
        <sphereGeometry args={[0.38, 14, 12]} />
        <meshStandardMaterial color={PALETTE.lemon} flatShading roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.52, 0]}>
        <cylinderGeometry args={[0.04, 0.055, 0.15, 6]} />
        <meshStandardMaterial color={PALETTE.trunk} roughness={1} />
      </mesh>
      <mesh position={[0.12, 0.57, 0]} rotation={[0, 0, -0.9]}>
        <coneGeometry args={[0.1, 0.24, 6]} />
        <meshStandardMaterial color={PALETTE.lemonLeaf} flatShading roughness={0.8} />
      </mesh>
    </group>
  );
}

function RockMesh({
  cell,
  index,
  bornAt,
  now,
  isDark,
}: {
  cell: Cell;
  index: number;
  bornAt: number;
  now: number;
  isDark: boolean;
}) {
  const [wx, wz] = cellToWorld(cell);
  // reference off-white rocks vanish on a light page — go slate there
  const color = isDark ? PALETTE.rock : '#94a3b8';
  // reference rocks: squashed/rotated icosahedrons
  const variants = [
    { scale: [0.8, 0.9, 1] as const, rotY: 0.8 },
    { scale: [0.65, 1.4, 1] as const, rotY: 2.1 },
    { scale: [0.95, 0.7, 1] as const, rotY: 4.4 },
  ];
  const v = variants[index % variants.length];
  const s = elasticOut(Math.min(1, (now - bornAt) / 1));
  return (
    <mesh
      position={[wx, 0.25, wz]}
      rotation={[0.08, v.rotY, 0]}
      scale={[v.scale[0] * s, v.scale[1] * s, v.scale[2] * s]}
      castShadow
    >
      <icosahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color={color} flatShading roughness={0.9} />
    </mesh>
  );
}

export function GridSnakeGame({
  running,
  paused,
  onScore,
  onDeath,
  runId,
  isDark = true,
}: {
  running: boolean;
  paused: boolean;
  onScore: (score: number) => void;
  onDeath: () => void;
  runId: number;
  isDark?: boolean;
}) {
  const snakeRef = useRef<Cell[]>([]);
  const prevSnakeRef = useRef<Cell[]>([]);
  const dirRef = useRef<Dir>({ x: 1, z: 0 });
  const queuedRef = useRef<Dir | null>(null);
  const tickAccum = useRef(0);
  const aliveRef = useRef(true);
  const scoreRef = useRef(0);
  const ridesRef = useRef<Ride[]>([]); // candies traveling down the body
  const bornAtRef = useRef<number[]>([]); // per-segment spawn time (elastic in)
  const clockRef = useRef(0);

  const [length, setLength] = useState<number>(GRID.startLength);
  const [lemons, setLemons] = useState<Lemon[]>([]);
  const [clock, setClock] = useState(0);

  const segRefs = useRef<(THREE.Group | null)[]>([]);
  const pop = usePop();

  // (re)spawn on mount / restart
  useEffect(() => {
    snakeRef.current = Array.from({ length: GRID.startLength }, (_, i) => ({
      x: 7 - i,
      z: START_ROW,
    }));
    prevSnakeRef.current = snakeRef.current.map((c) => ({ ...c }));
    dirRef.current = { x: 1, z: 0 };
    queuedRef.current = null;
    aliveRef.current = true;
    scoreRef.current = 0;
    ridesRef.current = [];
    tickAccum.current = 0;
    bornAtRef.current = Array.from({ length: GRID.startLength }, () => clockRef.current);
    setLength(GRID.startLength);
    setLemons(
      INITIAL_LEMON_CELLS.map((cell) => ({ cell, points: rollPoints(), bornAt: clockRef.current }))
    );
  }, [runId]);

  // keyboard — perpendicular turns only, like the reference setDirection
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const dir = DIRS[e.key];
      if (!dir) return;
      e.preventDefault();
      const cur = queuedRef.current ?? dirRef.current;
      const dot = cur.x * dir.x + cur.z * dir.z;
      if (dot === 0) queuedRef.current = dir;
    };
    window.addEventListener('keydown', down);
    return () => window.removeEventListener('keydown', down);
  }, []);

  const step = useCallback(() => {
    const snake = snakeRef.current;
    prevSnakeRef.current = snake.map((c) => ({ ...c }));

    if (queuedRef.current) {
      dirRef.current = queuedRef.current;
      queuedRef.current = null;
    }
    const dir = dirRef.current;
    const head = snake[0];
    const next: Cell = { x: head.x + dir.x, z: head.z + dir.z };

    // wrap — hit the border, come out the other side
    if (next.x < 0) next.x = GRID.cols - 1;
    else if (next.x > GRID.cols - 1) next.x = 0;
    if (next.z < 0) next.z = GRID.rows - 1;
    else if (next.z > GRID.rows - 1) next.z = 0;

    // death: self bite or rock
    const body = snake.slice(0, -1);
    if (body.some((c) => sameCell(c, next)) || ROCKS.some((r) => sameCell(r, next))) {
      aliveRef.current = false;
      onDeath();
      return;
    }

    snake.unshift(next);

    // rides move backward one node per tick; at the end → the tail grows
    let grewThisTick = false;
    ridesRef.current = ridesRef.current
      .map((r) => ({ index: r.index + 1 }))
      .filter((r) => {
        if (r.index >= snake.length - 1) {
          grewThisTick = true;
          return false;
        }
        return true;
      });

    if (grewThisTick) {
      // keep the tail cell — that's the growth (reference addTailNode)
      bornAtRef.current.push(clockRef.current);
      setLength(snake.length);
    } else {
      snake.pop();
    }

    const lemonIdx = lemons.findIndex((l) => sameCell(l.cell, next));
    if (lemonIdx >= 0) {
      const lemon = lemons[lemonIdx];
      scoreRef.current += lemon.points; // reference: score += candy.points at eat
      ridesRef.current.push({ index: 0 });
      pop(420 + lemon.points * 120);
      onScore(scoreRef.current);
      setLemons((prev) => {
        const nextLemons = [...prev];
        nextLemons[lemonIdx] = {
          cell: randomFreeCell([...snake, ...prev.map((p) => p.cell)]),
          points: rollPoints(),
          bornAt: clockRef.current,
        };
        return nextLemons;
      });
    }
  }, [lemons, onDeath, onScore, pop]);

  useFrame((state, dt) => {
    clockRef.current = state.clock.elapsedTime;
    setClock(state.clock.elapsedTime);
    if (!running || paused || !aliveRef.current) return;

    tickAccum.current += Math.min(dt, 0.1) * 1000;
    while (tickAccum.current >= GRID.tickMs) {
      tickAccum.current -= GRID.tickMs;
      step();
    }

    const t = Math.min(1, tickAccum.current / (GRID.tickMs * 0.8));
    const snake = snakeRef.current;
    const prev = prevSnakeRef.current;
    for (let i = 0; i < snake.length; i++) {
      const g = segRefs.current[i];
      if (!g) continue;
      const [cx, cz] = cellToWorld(snake[i]);
      const from = prev[i] ?? prev[prev.length - 1] ?? snake[i];
      const [px, pz] = cellToWorld(from);
      const jump = Math.abs(cx - px) > GRID.cell * 1.5 || Math.abs(cz - pz) > GRID.cell * 1.5;
      g.position.x = jump ? cx : px + (cx - px) * t;
      g.position.z = jump ? cz : pz + (cz - pz) * t;

      // scale: elastic spawn-in × candy ride bump (1.15, reference)
      const born = bornAtRef.current[i] ?? 0;
      let scale = elasticOut(Math.min(1, (clockRef.current - born) / 1));
      if (ridesRef.current.some((r) => r.index === i)) scale *= 1.15;
      g.scale.setScalar(scale);

      if (i === 0) g.rotation.y = Math.atan2(dirRef.current.x, dirRef.current.z);
    }
  });

  const segments = useMemo(() => Array.from({ length }, (_, i) => i), [length]);
  const size = GRID.cell;

  return (
    <group>
      {segments.map((i) => {
        // visible gaps between segments so the body reads as a snake, not a slab
        const bodySize = i === 0 ? size * 0.95 : size * 0.8;
        return (
          <group key={`${runId}-${i}`} ref={(el) => { segRefs.current[i] = el; }} position={[0, size / 2 + 0.02, 0]}>
            <RoundedBox args={[bodySize, bodySize, bodySize]} radius={0.14} smoothness={5} castShadow>
              <meshStandardMaterial
                color={PALETTE.snake}
                roughness={0.55}
                emissive={PALETTE.snake}
                emissiveIntensity={i === 0 ? 0.16 : 0.07}
              />
            </RoundedBox>
            {i === 0 && (
              <group>
                {/* eyes on TOP of the head — this camera looks down, so the face
                    must read from above (reference's side-eyes vanish from here) */}
                {[-1, 1].map((side) => (
                  <group key={side} position={[side * 0.2, bodySize / 2, 0.16]}>
                    <mesh castShadow>
                      <sphereGeometry args={[0.13, 12, 10]} />
                      <meshStandardMaterial color="#ffffff" roughness={0.35} />
                    </mesh>
                    <mesh position={[0, 0.06, 0.06]}>
                      <sphereGeometry args={[0.065, 10, 8]} />
                      <meshStandardMaterial color="#0f172a" roughness={0.4} />
                    </mesh>
                  </group>
                ))}
                {/* tongue tip peeking forward — readable from above */}
                <RoundedBox
                  args={[0.16, 0.06, 0.3]}
                  radius={0.03}
                  position={[0, 0.05, bodySize / 2 + 0.12]}
                >
                  <meshStandardMaterial color="#f87171" roughness={0.6} />
                </RoundedBox>
              </group>
            )}
          </group>
        );
      })}

      {lemons.map((lemon, i) => (
        <LemonMesh key={`lemon-${i}-${lemon.cell.x}-${lemon.cell.z}`} lemon={lemon} now={clock} />
      ))}

      {ROCKS.map((cell, i) => (
        <RockMesh key={`rock-${i}`} cell={cell} index={i} bornAt={0.2 + i * 0.15} now={clock} isDark={isDark} />
      ))}
    </group>
  );
}
