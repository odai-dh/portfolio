'use client';

import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { SKILLS, type SkillItem } from '@/lib/skillboy';
import { PALETTE } from './palette';
import { sfx } from './sfx';

// ---------------------------------------------------------------------------
// Grid snake, first ported from rock-biter/three-snake-live:
// - grid cells, perpendicular-only turns, self and rock collisions kill, edges wrap
// - an eaten pickup rides down the body and the tail grows when it arrives
// On top of that: skill pickups shared with the 2D Skill·Boy, a turn buffer,
// speed that ramps with length, and effects (bursts, portals, shatter).
// All per-frame animation goes through refs: React only re-renders on real
// changes (length, pickups), never per frame.
// ---------------------------------------------------------------------------

export const GRID = {
  cols: 14,
  rows: 14,
  cell: 0.9,
  startLength: 3,
  pickupCount: 2,
  tickStartMs: 240,
  tickMinMs: 125,
  tickStepMs: 7, // faster by this much per segment grown
  maxQueuedTurns: 3,
} as const;

export type Phase = 'ready' | 'countdown' | 'playing' | 'dead';
export type Fx = { shakeAt: number };

type Cell = { x: number; z: number };
type Dir = { x: number; z: number };
type Pickup = { id: number; cell: Cell; skill: SkillItem; points: number; bornAt: number };
type Ride = { index: number };
type Floater = { id: number; x: number; z: number; text: string; color: string };

const DIRS: Record<string, Dir> = {
  ArrowUp: { x: 0, z: -1 }, w: { x: 0, z: -1 }, W: { x: 0, z: -1 },
  ArrowDown: { x: 0, z: 1 }, s: { x: 0, z: 1 }, S: { x: 0, z: 1 },
  ArrowLeft: { x: -1, z: 0 }, a: { x: -1, z: 0 }, A: { x: -1, z: 0 },
  ArrowRight: { x: 1, z: 0 }, d: { x: 1, z: 0 }, D: { x: 1, z: 0 },
};
export const isGameKey = (key: string) => key in DIRS;

export const ROCKS: Cell[] = [
  { x: 2, z: 2 },
  { x: 11, z: 4 },
  { x: 4, z: 11 },
];

const START_ROW = 10;
// Off the start row, so nothing gets eaten before the player moves
const FIRST_PICKUP_CELLS: Cell[] = [
  { x: 10, z: 6 },
  { x: 5, z: 6 },
];

const HALF_W = (GRID.cols * GRID.cell) / 2;
const HALF_H = (GRID.rows * GRID.cell) / 2;

export function cellToWorld(c: Cell): [number, number] {
  return [
    (c.x - (GRID.cols - 1) / 2) * GRID.cell,
    (c.z - (GRID.rows - 1) / 2) * GRID.cell,
  ];
}

const sameCell = (a: Cell, b: Cell) => a.x === b.x && a.z === b.z;

// gsap elastic.out(1.5, 0.5), hand-rolled — the reference spawn-in feel
export function elasticOut(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return 1 + 1.5 * Math.pow(2, -10 * t) * Math.sin(((t * 10 - 0.75) * (2 * Math.PI)) / 3);
}

// Skills are served in the 2D game's order (basics first); later ones are worth more
function skillAt(n: number): { skill: SkillItem; points: number } {
  const i = n % SKILLS.length;
  return { skill: SKILLS[i], points: i < 4 ? 1 : i < 9 ? 2 : 3 };
}

function randomFreeCell(occupied: Cell[]): Cell {
  let c: Cell;
  do {
    c = { x: Math.floor(Math.random() * GRID.cols), z: Math.floor(Math.random() * GRID.rows) };
  } while (occupied.some((o) => sameCell(o, c)) || ROCKS.some((r) => sameCell(r, c)));
  return c;
}

// Step between two cells, accounting for the wrap: always a unit move
function unitStep(from: Cell, to: Cell): Dir {
  let dx = to.x - from.x;
  let dz = to.z - from.z;
  if (Math.abs(dx) > 1) dx = -Math.sign(dx);
  if (Math.abs(dz) > 1) dz = -Math.sign(dz);
  return { x: dx, z: dz };
}

// 1 well inside the board, 0 at the edge line — used to shrink blocks through a portal
function edgeFade(x: number, z: number): number {
  const inside = Math.min(HALF_W - Math.abs(x), HALF_H - Math.abs(z));
  return THREE.MathUtils.clamp(inside / (GRID.cell * 0.5), 0, 1);
}

// ---------------------------------------------------------------------------

function PickupMesh({ pickup }: { pickup: Pickup }) {
  const group = useRef<THREE.Group>(null);
  const gem = useRef<THREE.Mesh>(null);
  const [wx, wz] = cellToWorld(pickup.cell);
  const size = 0.3 + pickup.points * 0.06;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const s = elasticOut(Math.min(1, (t - pickup.bornAt) / 1)) || 0.0001;
    group.current?.scale.setScalar(s);
    if (gem.current) {
      gem.current.position.y = 0.5 + Math.sin(t * 2.4 + pickup.cell.x) * 0.08;
      gem.current.rotation.y = t * 1.3;
    }
  });

  return (
    <group ref={group} position={[wx, 0, wz]}>
      <mesh ref={gem} castShadow>
        <octahedronGeometry args={[size, 0]} />
        <meshStandardMaterial
          color={pickup.skill.color}
          emissive={pickup.skill.color}
          emissiveIntensity={0.35}
          roughness={0.3}
          flatShading
        />
      </mesh>
      {/* glow ring on the board under the gem */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.28, 0.38, 24]} />
        <meshBasicMaterial color={pickup.skill.color} transparent opacity={0.55} depthWrite={false} />
      </mesh>
      <Html position={[0, 1.15, 0]} center zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
        <span
          className="whitespace-nowrap rounded border bg-background/80 px-1.5 py-0.5 font-mono text-[10px] text-foreground backdrop-blur"
          style={{ borderColor: pickup.skill.color }}
        >
          {pickup.skill.name}
        </span>
      </Html>
    </group>
  );
}

function RockMesh({ cell, index, isDark }: { cell: Cell; index: number; isDark: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const [wx, wz] = cellToWorld(cell);
  const color = isDark ? PALETTE.rock : '#94a3b8';
  const variants = [
    { scale: [0.8, 0.9, 1] as const, rotY: 0.8 },
    { scale: [0.65, 1.4, 1] as const, rotY: 2.1 },
    { scale: [0.95, 0.7, 1] as const, rotY: 4.4 },
  ];
  const v = variants[index % variants.length];
  useFrame((state) => {
    const s = elasticOut(Math.min(1, (state.clock.elapsedTime - (0.2 + index * 0.15)) / 1)) || 0.0001;
    ref.current?.scale.set(v.scale[0] * s, v.scale[1] * s, v.scale[2] * s);
  });
  return (
    <mesh ref={ref} position={[wx, 0.25, wz]} rotation={[0.08, v.rotY, 0]} castShadow>
      <icosahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color={color} flatShading roughness={0.9} />
    </mesh>
  );
}

// One instanced mesh for every burst particle on the board
const MAX_PARTICLES = 200;
type Particle = { p: THREE.Vector3; v: THREE.Vector3; life: number; color: THREE.Color };

function Bursts({ spawnRef }: { spawnRef: RefObject<(x: number, z: number, color: string) => void> }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const particles = useRef<Particle[]>([]);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    spawnRef.current = (x, z, color) => {
      const c = new THREE.Color(color);
      for (let i = 0; i < 18; i++) {
        const a = (i / 18) * Math.PI * 2 + Math.random() * 0.4;
        const speed = 2 + Math.random() * 2.5;
        particles.current.push({
          p: new THREE.Vector3(x, 0.5, z),
          v: new THREE.Vector3(Math.cos(a) * speed, 2.5 + Math.random() * 3, Math.sin(a) * speed),
          life: 0.7 + Math.random() * 0.3,
          color: c,
        });
      }
      if (particles.current.length > MAX_PARTICLES) {
        particles.current.splice(0, particles.current.length - MAX_PARTICLES);
      }
    };
  }, [spawnRef]);

  useFrame((_, rawDt) => {
    const m = mesh.current;
    if (!m) return;
    const dt = Math.min(rawDt, 0.05);
    particles.current = particles.current.filter((pt) => (pt.life -= dt) > 0);
    for (let i = 0; i < MAX_PARTICLES; i++) {
      const pt = particles.current[i];
      if (pt) {
        pt.v.y -= 9.8 * dt;
        pt.p.addScaledVector(pt.v, dt);
        if (pt.p.y < 0.05) {
          pt.p.y = 0.05;
          pt.v.y *= -0.4;
        }
        dummy.position.copy(pt.p);
        dummy.scale.setScalar(Math.min(1, pt.life * 1.6) * 0.09);
        m.setColorAt(i, pt.color);
      } else {
        dummy.scale.setScalar(0);
      }
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, MAX_PARTICLES]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

// Glowing slabs where the head leaves one edge and comes in at the other
function Portals({ wrapRef }: { wrapRef: RefObject<{ at: number; exit: Cell; enter: Cell; dir: Dir } | null> }) {
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const w = wrapRef.current;
    const k = w ? Math.max(0, 1 - (state.clock.elapsedTime - w.at) / 0.5) : 0;
    for (const [mesh, cell, sign] of [
      [a.current, w?.exit, 1],
      [b.current, w?.enter, -1],
    ] as const) {
      if (!mesh) continue;
      mesh.visible = k > 0 && !!cell;
      if (!mesh.visible || !cell || !w) continue;
      const [cx, cz] = cellToWorld(cell);
      mesh.position.set(cx + w.dir.x * sign * GRID.cell * 0.5, 0.45, cz + w.dir.z * sign * GRID.cell * 0.5);
      mesh.rotation.y = w.dir.x !== 0 ? Math.PI / 2 : 0;
      mesh.scale.set(1, 0.4 + k * 0.6, 1);
      (mesh.material as THREE.MeshBasicMaterial).opacity = k * 0.8;
    }
  });
  return (
    <>
      {[a, b].map((ref, i) => (
        <mesh key={i} ref={ref} visible={false}>
          <planeGeometry args={[GRID.cell, GRID.cell]} />
          <meshBasicMaterial
            color={PALETTE.snakeBelly}
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------

export function GridSnakeGame({
  phase,
  paused,
  runId,
  isDark = true,
  fx,
  onCollect,
  onDeath,
}: {
  phase: Phase;
  paused: boolean;
  runId: number;
  isDark?: boolean;
  fx: RefObject<Fx>;
  onCollect: (skill: SkillItem, points: number) => void;
  onDeath: () => void;
}) {
  const snakeRef = useRef<Cell[]>([]);
  const prevSnakeRef = useRef<Cell[]>([]);
  const dirRef = useRef<Dir>({ x: 1, z: 0 });
  const queueRef = useRef<Dir[]>([]);
  const tickAccum = useRef(0);
  const ridesRef = useRef<Ride[]>([]);
  const bornAtRef = useRef<number[]>([]);
  const clockRef = useRef(0);
  const skillCountRef = useRef(0);
  const pickupsRef = useRef<Pickup[]>([]);
  const headAngle = useRef(Math.PI / 2);
  const wrapRef = useRef<{ at: number; exit: Cell; enter: Cell; dir: Dir } | null>(null);
  const spawnBurst = useRef<(x: number, z: number, color: string) => void>(() => undefined);
  const scatterRef = useRef<{ v: THREE.Vector3; spin: THREE.Vector3 }[]>([]);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const [length, setLength] = useState<number>(GRID.startLength);
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [floaters, setFloaters] = useState<Floater[]>([]);

  const segRefs = useRef<(THREE.Group | null)[]>([]);
  const bodyMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: PALETTE.snake, roughness: 0.55, emissive: new THREE.Color(PALETTE.snake), emissiveIntensity: 0.07 }),
    []
  );
  const headMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: PALETTE.snake, roughness: 0.5, emissive: new THREE.Color(PALETTE.snake), emissiveIntensity: 0.16 }),
    []
  );

  const replacePickups = (next: Pickup[]) => {
    pickupsRef.current = next;
    setPickups(next);
  };

  // (re)spawn on mount / restart
  useEffect(() => {
    snakeRef.current = Array.from({ length: GRID.startLength }, (_, i) => ({ x: 6 - i, z: START_ROW }));
    prevSnakeRef.current = snakeRef.current.map((c) => ({ ...c }));
    dirRef.current = { x: 1, z: 0 };
    queueRef.current = [];
    ridesRef.current = [];
    tickAccum.current = 0;
    skillCountRef.current = 0;
    headAngle.current = Math.PI / 2;
    wrapRef.current = null;
    scatterRef.current = [];
    bornAtRef.current = Array.from({ length: GRID.startLength }, () => clockRef.current);
    bodyMat.emissive.set(PALETTE.snake);
    headMat.emissive.set(PALETTE.snake);
    bodyMat.emissiveIntensity = 0.07;
    headMat.emissiveIntensity = 0.16;
    setLength(GRID.startLength);
    setFloaters([]);
    replacePickups(
      FIRST_PICKUP_CELLS.map((cell) => {
        const { skill, points } = skillAt(skillCountRef.current++);
        return { id: Math.random(), cell, skill, points, bornAt: clockRef.current };
      })
    );
  }, [runId, bodyMat, headMat]);

  // Turn buffer: each press is checked against the previous queued turn, so a quick
  // "up then left" plays out over two ticks instead of reversing into the neck
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const dir = DIRS[e.key];
      if (!dir || phaseRef.current === 'dead') return;
      e.preventDefault();
      const queue = queueRef.current;
      const last = queue[queue.length - 1] ?? dirRef.current;
      if (last.x * dir.x + last.z * dir.z === 0 && queue.length < GRID.maxQueuedTurns) {
        queue.push(dir);
      }
    };
    window.addEventListener('keydown', down);
    return () => window.removeEventListener('keydown', down);
  }, []);

  const die = () => {
    const now = clockRef.current;
    fx.current.shakeAt = now;
    sfx.die();
    bodyMat.emissive.set('#ef4444');
    headMat.emissive.set('#ef4444');
    bodyMat.emissiveIntensity = 0.7;
    headMat.emissiveIntensity = 0.8;
    scatterRef.current = snakeRef.current.map(() => ({
      v: new THREE.Vector3((Math.random() - 0.5) * 6, 3 + Math.random() * 4, (Math.random() - 0.5) * 6),
      spin: new THREE.Vector3(Math.random() * 8 - 4, Math.random() * 8 - 4, Math.random() * 8 - 4),
    }));
    onDeath();
  };

  const step = () => {
    const snake = snakeRef.current;
    prevSnakeRef.current = snake.map((c) => ({ ...c }));

    const turn = queueRef.current.shift();
    if (turn) dirRef.current = turn;
    const dir = dirRef.current;
    const head = snake[0];
    const next: Cell = { x: head.x + dir.x, z: head.z + dir.z };

    let wrapped = false;
    if (next.x < 0) { next.x = GRID.cols - 1; wrapped = true; }
    else if (next.x > GRID.cols - 1) { next.x = 0; wrapped = true; }
    if (next.z < 0) { next.z = GRID.rows - 1; wrapped = true; }
    else if (next.z > GRID.rows - 1) { next.z = 0; wrapped = true; }

    // the tail cell frees up this tick, so it's safe to move into
    const body = snake.slice(0, -1);
    if (body.some((c) => sameCell(c, next)) || ROCKS.some((r) => sameCell(r, next))) {
      die();
      return;
    }

    if (wrapped) {
      wrapRef.current = { at: clockRef.current, exit: head, enter: next, dir };
      sfx.wrap();
    }

    snake.unshift(next);

    let grew = false;
    ridesRef.current = ridesRef.current
      .map((r) => ({ index: r.index + 1 }))
      .filter((r) => {
        if (r.index >= snake.length - 1) {
          grew = true;
          return false;
        }
        return true;
      });
    if (grew) {
      bornAtRef.current.push(clockRef.current);
      setLength(snake.length);
    } else {
      snake.pop();
    }

    const hit = pickupsRef.current.findIndex((p) => sameCell(p.cell, next));
    if (hit >= 0) {
      const eaten = pickupsRef.current[hit];
      const [wx, wz] = cellToWorld(eaten.cell);
      ridesRef.current.push({ index: 0 });
      sfx.eat(eaten.points);
      spawnBurst.current(wx, wz, eaten.skill.color);
      onCollect(eaten.skill, eaten.points);

      const floater: Floater = {
        id: Math.random(),
        x: wx,
        z: wz,
        text: `+${eaten.points} ${eaten.skill.name}`,
        color: eaten.skill.color,
      };
      setFloaters((f) => [...f, floater]);
      setTimeout(() => setFloaters((f) => f.filter((x) => x.id !== floater.id)), 1000);

      const { skill, points } = skillAt(skillCountRef.current++);
      const next2 = [...pickupsRef.current];
      next2[hit] = {
        id: Math.random(),
        cell: randomFreeCell([...snake, ...pickupsRef.current.map((p) => p.cell)]),
        skill,
        points,
        bornAt: clockRef.current,
      };
      replacePickups(next2);
    }
  };

  useFrame((state, rawDt) => {
    const now = state.clock.elapsedTime;
    clockRef.current = now;
    const dt = Math.min(rawDt, 0.1);
    const snake = snakeRef.current;

    if (phase === 'playing' && !paused) {
      const tickMs = Math.max(
        GRID.tickMinMs,
        GRID.tickStartMs - (snake.length - GRID.startLength) * GRID.tickStepMs
      );
      tickAccum.current += dt * 1000;
      while (tickAccum.current >= tickMs && phaseRef.current === 'playing') {
        tickAccum.current -= tickMs;
        step();
        if (scatterRef.current.length) break; // died this tick
      }
    }

    const tickMs = Math.max(GRID.tickMinMs, GRID.tickStartMs - (snake.length - GRID.startLength) * GRID.tickStepMs);
    const t = phase === 'playing' ? Math.min(1, tickAccum.current / (tickMs * 0.8)) : 1;
    const prev = prevSnakeRef.current;
    const dying = scatterRef.current.length > 0;

    for (let i = 0; i < snake.length; i++) {
      const g = segRefs.current[i];
      if (!g) continue;

      if (dying) {
        // shatter: every block flies off, spins and falls
        const s = scatterRef.current[i];
        if (s) {
          s.v.y -= 12 * dt;
          g.position.addScaledVector(s.v, dt);
          g.rotation.x += s.spin.x * dt;
          g.rotation.y += s.spin.y * dt;
          g.rotation.z += s.spin.z * dt;
          g.scale.multiplyScalar(Math.max(0, 1 - dt * 1.4));
        }
        continue;
      }

      const cell = snake[i];
      const from = prev[i] ?? prev[prev.length - 1] ?? cell;
      const d = unitStep(from, cell);
      const [cx, cz] = cellToWorld(cell);
      const [fx0, fz0] = cellToWorld(from);
      const crossing = Math.abs(cx - fx0) > GRID.cell * 1.5 || Math.abs(cz - fz0) > GRID.cell * 1.5;

      // wrap: slide out through one edge for the first half, in through the other for the second
      let x: number;
      let z: number;
      if (crossing) {
        if (t < 0.5) {
          x = fx0 + d.x * GRID.cell * t;
          z = fz0 + d.z * GRID.cell * t;
        } else {
          x = cx - d.x * GRID.cell * (1 - t);
          z = cz - d.z * GRID.cell * (1 - t);
        }
      } else {
        x = fx0 + (cx - fx0) * t;
        z = fz0 + (cz - fz0) * t;
      }
      g.position.set(x, GRID.cell / 2 + 0.02, z);
      g.rotation.set(0, i === 0 ? headAngle.current : 0, 0);

      const born = bornAtRef.current[i] ?? 0;
      let scale = elasticOut(Math.min(1, (now - born) / 1)) || 0.0001;
      if (ridesRef.current.some((r) => r.index === i)) scale *= 1.15;
      // tapered tail
      const fromEnd = snake.length - 1 - i;
      if (i > 0 && fromEnd < 3) scale *= 0.76 + fromEnd * 0.08;
      scale *= edgeFade(x, z);
      g.scale.setScalar(Math.max(scale, 0.0001));
    }

    // head turns smoothly toward its heading instead of snapping
    if (!dying) {
      const target = Math.atan2(dirRef.current.x, dirRef.current.z);
      const diff = Math.atan2(Math.sin(target - headAngle.current), Math.cos(target - headAngle.current));
      headAngle.current += diff * Math.min(1, dt * 16);
    }
  });

  const segments = useMemo(() => Array.from({ length }, (_, i) => i), [length]);
  const size = GRID.cell;

  return (
    <group>
      {segments.map((i) => {
        const bodySize = i === 0 ? size * 0.95 : size * 0.8;
        return (
          <group key={`${runId}-${i}`} ref={(el) => { segRefs.current[i] = el; }}>
            <RoundedBox
              args={[bodySize, bodySize, bodySize]}
              radius={0.14}
              smoothness={5}
              castShadow
              material={i === 0 ? headMat : bodyMat}
            />
            {i === 0 && (
              <group>
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
                <RoundedBox args={[0.16, 0.06, 0.3]} radius={0.03} position={[0, 0.05, bodySize / 2 + 0.12]}>
                  <meshStandardMaterial color="#f87171" roughness={0.6} />
                </RoundedBox>
              </group>
            )}
          </group>
        );
      })}

      {pickups.map((pickup) => (
        <PickupMesh key={pickup.id} pickup={pickup} />
      ))}

      {ROCKS.map((cell, i) => (
        <RockMesh key={`rock-${i}`} cell={cell} index={i} isDark={isDark} />
      ))}

      {floaters.map((f) => (
        <Html key={f.id} position={[f.x, 1.3, f.z]} center zIndexRange={[6, 0]} style={{ pointerEvents: 'none' }}>
          <span
            className="block whitespace-nowrap font-mono text-sm font-bold animate-out fade-out-0 slide-out-to-top-8 duration-1000 fill-mode-forwards"
            style={{ color: f.color, textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
          >
            {f.text}
          </span>
        </Html>
      ))}

      <Bursts spawnRef={spawnBurst} />
      <Portals wrapRef={wrapRef} />
    </group>
  );
}
