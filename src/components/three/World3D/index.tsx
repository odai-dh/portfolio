'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Text3D } from '@react-three/drei';
import * as THREE from 'three';
import helvetiker from 'three/examples/fonts/helvetiker_bold.typeface.json';
import { Button } from '@/components/ui/button';
import { PALETTE } from './palette';
import { Grid } from './Grid';
import { GRID, GridSnakeGame, elasticOut } from './GridSnakeGame';

const GAME_OVER_MSGS = [
  'ok but hire me tho',
  'skill issue. hire me.',
  'git commit -m "L"',
  '404: win not found',
  'console.log("hire odai")',
  'even in 3D you lost',
];

type Backdrop = 'off' | 'dim' | 'deep';
const BACKDROP_ORDER: Backdrop[] = ['off', 'dim', 'deep'];

// font ships inside the three package — self-hosted, no CDN
const FONT = helvetiker as unknown as NonNullable<
  React.ComponentProps<typeof Text3D>['font']
>;

// Reference camera feel: spawn wide, sweep in with damping, then breathe.
// Frame is shifted left so the BOARD occupies the empty right half of the
// hero — the text keeps the left half.
const FRAME_SHIFT = -6.2;

function BoardCamera() {
  const t = useRef(0);
  useFrame((state, dt) => {
    t.current += dt;
    const intro = Math.min(1, t.current / 1.6);
    const e = 1 - Math.pow(1 - intro, 3); // easeOutCubic
    const breathe = Math.sin(t.current * 0.5) * 0.18;

    // aspect-adaptive framing: tuned at 16:10 wide — on narrower/square
    // windows pull the camera back and shift less, so the board never
    // swallows the page
    const aspect = state.size.width / Math.max(1, state.size.height);
    const dist = THREE.MathUtils.clamp(1.65 / aspect, 1, 1.7);
    const shift = FRAME_SHIFT * THREE.MathUtils.clamp(aspect / 1.65, 0.45, 1);

    const from = new THREE.Vector3(8 + shift, 6.5 * dist, 16.5 * dist);
    const to = new THREE.Vector3(shift, (15.2 + breathe) * dist, 12.2 * dist);
    state.camera.position.lerpVectors(from, to, e);
    state.camera.lookAt(shift, 0, 0.6);
  });
  return null;
}

// The reference renders the score as a big 3D number behind the board
function Score3D({ score, clock }: { score: number; clock: number }) {
  const bornAt = useRef(0);
  const prev = useRef(score);
  if (prev.current !== score) {
    prev.current = score;
    bornAt.current = clock;
  }
  const s = elasticOut(Math.min(1, (clock - bornAt.current) / 1)) || 0.0001;
  const z = -(GRID.rows * GRID.cell) / 2 - 1.4;

  return (
    <group position={[3.8, 0.8, z]} scale={s}>
      <Center>
        <Text3D
          font={FONT}
          size={1.9}
          height={0.55}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.1}
          bevelSize={0.08}
          bevelSegments={5}
          castShadow
        >
          {String(score)}
          <meshStandardMaterial
            color={PALETTE.snake}
            emissive={PALETTE.snake}
            emissiveIntensity={0.15}
            roughness={0.5}
          />
        </Text3D>
      </Center>
    </group>
  );
}

function ClockBridge({ onClock }: { onClock: (t: number) => void }) {
  useFrame((state) => onClock(state.clock.elapsedTime));
  return null;
}

export default function World3D({ onExit }: { onExit?: () => void }) {
  const [score, setScore] = useState(0);
  const [dead, setDead] = useState(false);
  const [paused, setPaused] = useState(false);
  const [runId, setRunId] = useState(0);
  const [clock, setClock] = useState(0);
  // OFF is always the default — the backdrop is a per-session choice
  const [backdrop, setBackdrop] = useState<Backdrop>('off');
  const msgRef = useRef(GAME_OVER_MSGS[0]);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const cycleBackdrop = useCallback(() => {
    setBackdrop(
      (prev) => BACKDROP_ORDER[(BACKDROP_ORDER.indexOf(prev) + 1) % BACKDROP_ORDER.length]
    );
  }, []);

  // Space pauses/resumes, like the reference
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };
    window.addEventListener('keydown', down);
    return () => window.removeEventListener('keydown', down);
  }, []);

  const onDeath = useCallback(() => {
    msgRef.current = GAME_OVER_MSGS[Math.floor(Math.random() * GAME_OVER_MSGS.length)];
    setDead(true);
  }, []);

  const restart = useCallback(() => {
    setScore(0);
    setDead(false);
    setPaused(false);
    setRunId((r) => r + 1);
  }, []);

  return (
    <div className="relative h-full w-full">
      {/* backdrop presets — theme-aware; cycles with the BG button */}
      {backdrop === 'dim' && (
        <div
          className={
            isDark
              ? 'absolute inset-0 z-0 bg-[#050b14]/60 backdrop-blur-[2px]'
              : 'absolute inset-0 z-0 bg-white/60 backdrop-blur-[2px]'
          }
        />
      )}
      {backdrop === 'deep' && (
        <div
          className="absolute inset-0 z-0"
          style={{
            background: isDark
              ? 'radial-gradient(120% 90% at 50% 40%, rgba(10,25,50,0.92) 0%, rgba(4,9,18,0.97) 70%)'
              : 'radial-gradient(120% 90% at 50% 40%, rgba(219,234,254,0.94) 0%, rgba(203,213,225,0.97) 70%)',
          }}
        />
      )}

      <div className="absolute inset-0 z-10">
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{ alpha: true, antialias: true }}
          camera={{ fov: 42, near: 0.1, far: 60, position: [7, 5.5, 14.5] }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.15;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
            gl.setClearColor(0x000000, 0);
          }}
        >
          <hemisphereLight args={[PALETTE.hemiSky, PALETTE.hemiGround, 0.5]} />
          <directionalLight
            color={PALETTE.keyLight}
            position={[10, 16, 8]}
            intensity={2.0}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-radius={6}
            shadow-bias={-0.0004}
            shadow-normalBias={0.04}
            shadow-camera-left={-12}
            shadow-camera-right={12}
            shadow-camera-top={12}
            shadow-camera-bottom={-12}
            shadow-camera-far={45}
          />
          <pointLight color={PALETTE.snake} position={[-8, 3, -6]} intensity={18} distance={22} />

          <Grid isDark={isDark} />
          <GridSnakeGame
            running={!dead}
            paused={paused}
            onScore={setScore}
            onDeath={onDeath}
            runId={runId}
            isDark={isDark}
          />
          <Suspense fallback={null}>
            <Score3D score={score} clock={clock} />
          </Suspense>
          <ClockBridge onClock={setClock} />
          <BoardCamera />
        </Canvas>
      </div>

      {/* live score for screen readers (and tests) — visual score is 3D */}
      <span data-testid="score" aria-live="polite" className="sr-only">
        score: {score}
      </span>

      {/* HUD — control stack below the fixed 2D/3D toggle so nothing overlaps */}
      <div className="absolute right-4 top-14 z-20 flex flex-col items-end gap-2">
        <button
          onClick={onExit}
          className="pointer-events-auto rounded-md border border-border bg-background/70 px-3 py-1 font-mono text-xs tracking-widest text-muted-foreground backdrop-blur transition-colors hover:border-red-400 hover:text-red-400"
        >
          ✕ EXIT 3D
        </button>
        <button
          onClick={cycleBackdrop}
          className="pointer-events-auto rounded-md border border-border bg-background/70 px-3 py-1 font-mono text-xs tracking-widest text-muted-foreground backdrop-blur transition-colors hover:border-primary hover:text-primary"
        >
          BG: {backdrop.toUpperCase()}
        </button>
      </div>
      <div className="pointer-events-none absolute bottom-3 right-6 z-20">
        <span className="rounded-md bg-background/60 px-3 py-1 font-mono text-[10px] tracking-wide text-muted-foreground backdrop-blur">
          ← ↑ ↓ → move · space pause · esc exit · rocks kill · edges wrap
        </span>
      </div>

      {paused && !dead && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <span className="rounded-md border border-border bg-background/80 px-4 py-2 font-mono text-sm tracking-[0.3em] text-foreground backdrop-blur">
            PAUSED
          </span>
        </div>
      )}

      {dead && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div className="pointer-events-auto flex flex-col items-center gap-2 rounded-xl border border-border bg-background/90 px-8 py-6 text-center shadow-2xl backdrop-blur">
            <p className="font-mono text-xl font-bold tracking-[0.3em] text-red-400">GAME OVER</p>
            <p className="font-mono text-xs text-muted-foreground">{msgRef.current}</p>
            <p className="font-mono text-sm text-foreground">🍋 score: {score}</p>
            <div className="mt-2 flex gap-2">
              <Button size="sm" onClick={restart} className="font-mono">
                ▶ RESTART
              </Button>
              {onExit && (
                <Button size="sm" variant="outline" onClick={onExit} className="font-mono">
                  ✕ EXIT 3D
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
