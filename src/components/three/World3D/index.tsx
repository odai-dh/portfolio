'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Html, Text3D } from '@react-three/drei';
import * as THREE from 'three';
import helvetiker from 'three/examples/fonts/helvetiker_bold.typeface.json';
import { Button } from '@/components/ui/button';
import { getTitle, randomMsg, type SkillItem } from '@/lib/skillboy';
import { PALETTE } from './palette';
import { Grid } from './Grid';
import { GRID, GridSnakeGame, elasticOut, isGameKey, type Fx, type Phase } from './GridSnakeGame';
import { closeAudio, sfx } from './sfx';
import type { Framing } from '@/components/HeroMode';

type Backdrop = 'off' | 'dim' | 'deep';
const BACKDROP_ORDER: Backdrop[] = ['off', 'dim', 'deep'];
const BEST_KEY = 'skillboy-3d-best';

// font ships inside the three package — self-hosted, no CDN
const FONT = helvetiker as unknown as NonNullable<React.ComponentProps<typeof Text3D>['font']>;

// Reference camera feel: spawn wide, sweep in with damping, then breathe.
// In the full-width fallback the frame is shifted so the board sits right of the text.
const FRAME_SHIFT = -6.2;

function BoardCamera({ fx, framing }: { fx: React.RefObject<Fx>; framing: Framing }) {
  const t = useRef(0);
  useFrame((state, dt) => {
    t.current += dt;
    const intro = Math.min(1, t.current / 1.6);
    const e = 1 - Math.pow(1 - intro, 3); // easeOutCubic
    const breathe = Math.sin(t.current * 0.5) * 0.18;

    // aspect-adaptive framing: on narrower/square windows pull back and shift less
    const aspect = state.size.width / Math.max(1, state.size.height);
    let dist: number;
    let shift: number;
    if (framing === 'side') {
      // the canvas already sits right of the hero text: center the board and fit it
      dist = THREE.MathUtils.clamp(1.25 / aspect, 1, 1.8);
      shift = 0;
    } else {
      // full-width fallback for narrow windows: push the board right and pull back
      const narrow = THREE.MathUtils.clamp(1.5 - aspect, 0, 0.5);
      dist = THREE.MathUtils.clamp(1.65 / aspect, 1, 1.7) * (1 + narrow * 0.7);
      shift = FRAME_SHIFT * THREE.MathUtils.clamp(aspect / 1.65, 0.8, 1);
    }

    const from = new THREE.Vector3(8 + shift, 6.5 * dist, 16.5 * dist);
    const to = new THREE.Vector3(shift, (15.2 + breathe) * dist, 12.2 * dist);
    state.camera.position.lerpVectors(from, to, e);

    // death shake, decaying over 0.45s
    const since = state.clock.elapsedTime - fx.current.shakeAt;
    if (since < 0.45) {
      const k = (1 - since / 0.45) * 0.35;
      state.camera.position.x += (Math.random() - 0.5) * k;
      state.camera.position.y += (Math.random() - 0.5) * k;
    }
    state.camera.lookAt(shift, 0, 0.6);
  });
  return null;
}

// Big 3D score behind the board; pops elastically when it changes
function Score3D({ score }: { score: number }) {
  const group = useRef<THREE.Group>(null);
  const bornAt = useRef(0);
  const prev = useRef(score);
  const z = -(GRID.rows * GRID.cell) / 2 - 1.4;

  useFrame((state) => {
    if (prev.current !== score) {
      prev.current = score;
      bornAt.current = state.clock.elapsedTime;
    }
    const s = elasticOut(Math.min(1, (state.clock.elapsedTime - bornAt.current) / 1)) || 0.0001;
    group.current?.scale.setScalar(s);
  });

  return (
    <group ref={group} position={[3.8, 0.8, z]}>
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
          <meshStandardMaterial color={PALETTE.snake} emissive={PALETTE.snake} emissiveIntensity={0.15} roughness={0.5} />
        </Text3D>
      </Center>
    </group>
  );
}

type Result = {
  score: number;
  best: number;
  newBest: boolean;
  title: string;
  skills: SkillItem[];
  msg: string;
};

// Prompts and cards pinned to the middle of the board, whatever the framing
function BoardOverlay({
  phase,
  count,
  paused,
  result,
  onRestart,
  onContact,
  onExit,
}: {
  phase: Phase;
  count: number;
  paused: boolean;
  result: Result | null;
  onRestart: () => void;
  onContact: () => void;
  onExit?: () => void;
}) {
  return (
    <Html position={[0, 0.8, phase === 'ready' ? 1.7 : 0]} center zIndexRange={[30, 20]}>
      {phase === 'ready' && (
        <div className="pointer-events-none flex flex-col items-center gap-2 text-center">
          <span className="animate-pulse whitespace-nowrap rounded-md border border-primary/60 bg-background/85 px-4 py-2 font-mono text-sm tracking-[0.2em] text-foreground backdrop-blur">
            PRESS ← ↑ ↓ → TO START
          </span>
          <span className="whitespace-nowrap rounded bg-background/70 px-2 py-0.5 font-mono text-[11px] text-muted-foreground backdrop-blur">
            collect skills · earn your title
          </span>
        </div>
      )}

      {(phase === 'countdown' || (phase === 'playing' && count === 0)) && (
        <span
          key={count}
          className="pointer-events-none block font-mono text-7xl font-bold text-foreground drop-shadow-[0_4px_20px_rgba(0,153,255,0.6)] animate-in zoom-in-50 fade-in duration-300"
        >
          {count > 0 ? count : 'GO'}
        </span>
      )}

      {phase === 'playing' && paused && (
        <span className="pointer-events-none whitespace-nowrap rounded-md border border-border bg-background/85 px-4 py-2 font-mono text-sm tracking-[0.3em] text-foreground backdrop-blur">
          PAUSED
        </span>
      )}

      {phase === 'dead' && result && (
        <div className="pointer-events-auto w-[22rem] rounded-xl border border-border bg-background/95 px-6 py-5 text-center shadow-2xl backdrop-blur animate-in zoom-in-95 fade-in duration-300">
          <p className="font-mono text-lg font-bold tracking-[0.3em] text-red-400">GAME OVER</p>
          <p className="mt-1 font-mono text-[11px] text-muted-foreground">{result.msg}</p>

          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">you earned</p>
          <p className="font-headline text-2xl font-bold text-foreground">{result.title}</p>

          <div className="mt-3 flex items-center justify-center gap-3 font-mono text-sm">
            <span className="text-foreground">score {result.score}</span>
            <span className="text-muted-foreground">·</span>
            {result.newBest ? (
              <span className="rounded bg-primary px-1.5 py-0.5 text-xs font-bold text-primary-foreground">NEW BEST!</span>
            ) : (
              <span className="text-muted-foreground">best {result.best}</span>
            )}
          </div>

          {result.skills.length > 0 && (
            <>
            <div className="mt-3 flex flex-wrap justify-center gap-1">
              {result.skills.map((skill) => (
                <span
                  key={skill.name}
                  className="rounded border px-1.5 py-0.5 font-mono text-[10px] text-foreground"
                  style={{ borderColor: skill.color }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Odai already has all of these. Want to work together?</p>
            </>
          )}

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Button size="sm" onClick={onRestart} className="font-mono">▶ PLAY AGAIN</Button>
            <Button size="sm" variant="outline" onClick={onContact} className="font-mono">GET IN TOUCH</Button>
            {onExit && (
              <Button size="sm" variant="ghost" onClick={onExit} className="font-mono">✕ EXIT</Button>
            )}
          </div>
          <p className="mt-2 font-mono text-[10px] text-muted-foreground">enter to play again</p>
        </div>
      )}
    </Html>
  );
}

export default function World3D({ onExit, framing = 'full' }: { onExit?: () => void; framing?: Framing }) {
  const [phase, setPhase] = useState<Phase>('ready');
  const [count, setCount] = useState(3);
  const [paused, setPaused] = useState(false);
  const [runId, setRunId] = useState(0);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  // Side framing leaves the text clear, so no backdrop; the full-width fallback
  // overlaps the text, so it starts dimmed. Either way BG cycles it.
  const [backdrop, setBackdrop] = useState<Backdrop>(framing === 'full' ? 'dim' : 'off');
  useEffect(() => setBackdrop(framing === 'full' ? 'dim' : 'off'), [framing]);
  const collected = useRef<SkillItem[]>([]);
  const scoreRef = useRef(0);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const fx = useRef<Fx>({ shakeAt: -10 });
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    try {
      setBest(Number(localStorage.getItem(BEST_KEY)) || 0);
    } catch {
      // storage blocked — best score just won't persist
    }
    return closeAudio;
  }, []);

  const cycleBackdrop = useCallback(() => {
    setBackdrop((prev) => BACKDROP_ORDER[(BACKDROP_ORDER.indexOf(prev) + 1) % BACKDROP_ORDER.length]);
  }, []);

  const startRun = useCallback(() => {
    collected.current = [];
    scoreRef.current = 0;
    setScore(0);
    setResult(null);
    setPaused(false);
    setRunId((r) => r + 1);
    setCount(3);
    setPhase('countdown');
  }, []);

  // 3 · 2 · 1 · GO
  useEffect(() => {
    if (phase !== 'countdown') return;
    sfx.beep();
    let n = 3;
    const id = window.setInterval(() => {
      n -= 1;
      setCount(n);
      if (n > 0) {
        sfx.beep();
      } else {
        sfx.beep(true);
        window.clearInterval(id);
        setPhase('playing');
        window.setTimeout(() => setCount(-1), 600); // hide GO
      }
    }, 650);
    return () => window.clearInterval(id);
  }, [phase, runId]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const p = phaseRef.current;
      if (p === 'ready' && isGameKey(e.key)) {
        // the game also queues this key, so the first press sets the direction
        setCount(3);
        setPhase('countdown');
      } else if (p === 'playing' && e.key === ' ') {
        e.preventDefault();
        setPaused((v) => !v);
      } else if (p === 'dead' && e.key === 'Enter') {
        startRun();
      }
    };
    window.addEventListener('keydown', down);
    return () => window.removeEventListener('keydown', down);
  }, [startRun]);

  const onCollect = useCallback((skill: SkillItem, points: number) => {
    collected.current.push(skill);
    scoreRef.current += points;
    setScore(scoreRef.current);
  }, []);

  const onDeath = useCallback(() => {
    const finalScore = scoreRef.current;
    let prevBest = 0;
    try {
      prevBest = Number(localStorage.getItem(BEST_KEY)) || 0;
      if (finalScore > prevBest) localStorage.setItem(BEST_KEY, String(finalScore));
    } catch {
      // ignore
    }
    const newBest = finalScore > prevBest && finalScore > 0;
    const nextBest = Math.max(prevBest, finalScore);
    setBest(nextBest);
    const fe = collected.current.filter((s) => s.category === 'frontend').length;
    const be = collected.current.length - fe;
    const unique = [...new Map(collected.current.map((s) => [s.name, s])).values()];
    setPhase('dead');
    // let the shatter play before the card comes up
    window.setTimeout(() => {
      setResult({
        score: finalScore,
        best: nextBest,
        newBest,
        title: getTitle(fe, be),
        skills: unique,
        msg: randomMsg(),
      });
    }, 900);
  }, []);

  const goToContact = useCallback(() => {
    onExit?.();
    window.setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 550);
  }, [onExit]);

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
            phase={phase}
            paused={paused}
            runId={runId}
            isDark={isDark}
            fx={fx}
            onCollect={onCollect}
            onDeath={onDeath}
          />
          <Suspense fallback={null}>
            <Score3D score={score} />
          </Suspense>
          <BoardOverlay
            phase={phase}
            count={count}
            paused={paused}
            result={result}
            onRestart={startRun}
            onContact={goToContact}
            onExit={onExit}
          />
          <BoardCamera fx={fx} framing={framing} />
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
        <span className="rounded-md border border-border/60 bg-background/70 px-3 py-1 font-mono text-xs tracking-widest text-muted-foreground backdrop-blur">
          BEST {best}
        </span>
      </div>
      <div className="pointer-events-none absolute bottom-3 right-6 z-20">
        <span className="rounded-md bg-background/60 px-3 py-1 font-mono text-[10px] tracking-wide text-muted-foreground backdrop-blur">
          arrows / WASD · space pause · esc exit · rocks kill · edges wrap
        </span>
      </div>
    </div>
  );
}
