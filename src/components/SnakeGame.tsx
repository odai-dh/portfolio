'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';

const CELL = 32;
const COLS = 14;
const ROWS = 14;
const W = COLS * CELL;
const H = ROWS * CELL;
const SPEED = 130;

type Point = { x: number; y: number };
type Category = 'frontend' | 'backend';
type SkillItem = { name: string; category: Category; color: string };
type Food = Point & { skill: SkillItem };
type GameState = 'idle' | 'playing' | 'gameover';

// Ordered exactly as a developer grows — from absolute basics to advanced
const SKILLS: SkillItem[] = [
  { name: 'HTML',       category: 'frontend', color: '#E34F26' },  // 1 — where everyone starts
  { name: 'CSS',        category: 'frontend', color: '#1572B6' },  // 2
  { name: 'JavaScript', category: 'frontend', color: '#F7DF1E' },  // 3
  { name: 'SQL',        category: 'backend',  color: '#F59E0B' },  // 4 — first backend concept
  { name: 'TypeScript', category: 'frontend', color: '#60A5FA' },  // 5
  { name: 'Node.js',    category: 'backend',  color: '#4ADE80' },  // 6
  { name: 'React',      category: 'frontend', color: '#61DAFB' },  // 7
  { name: 'Express',    category: 'backend',  color: '#94A3B8' },  // 8
  { name: 'Tailwind',   category: 'frontend', color: '#38BDF8' },  // 9
  { name: 'REST API',   category: 'backend',  color: '#EC4899' },  // 10
  { name: 'MongoDB',    category: 'backend',  color: '#86EFAC' },  // 11
  { name: 'Next.js',    category: 'frontend', color: '#e2e8f0' },  // 12
  { name: 'SwiftUI',    category: 'frontend', color: '#F97316' },  // 13 — top tier
];

function getTitle(fe: number, be: number): string {
  const total = fe + be;
  if (total >= 13)              return 'God-Tier Engineer 👑';
  if (total >= 10)              return 'Senior Developer 🔥';
  if (fe >= 5 && be >= 4)       return 'Full Stack Architect';
  if (fe >= 3 && be >= 3)       return 'Full Stack Developer';
  if (fe >= 5)                  return 'Frontend Expert';
  if (be >= 4)                  return 'Backend Expert';
  if (fe >= 2 && be >= 2)       return 'Full Stack Developer';
  if (fe >= 3)                  return 'Frontend Developer';
  if (be >= 3)                  return 'Backend Developer';
  if (fe >= 2)                  return 'Junior Frontend Dev';
  if (be >= 2)                  return 'Junior Backend Dev';
  if (total === 1)              return 'Intern 👀';
  return 'Developer';
}

const GAME_OVER_MSGS = [
  'ok but hire me tho',
  'you lost. i didn\'t.',
  'skill issue. hire me.',
  'the snake died. my career didn\'t.',
  'git commit -m "L"',
  'even the snake has a portfolio',
  '404: win not found',
  'have you tried hiring me?',
  'console.log("hire odai")',
  'the snake is gone. i\'m still here.',
];

function randomMsg(): string {
  return GAME_OVER_MSGS[Math.floor(Math.random() * GAME_OVER_MSGS.length)];
}

function randomPos(exclude: Point[]): Point {
  let p: Point;
  do {
    p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (exclude.some(e => e.x === p.x && e.y === p.y));
  return p;
}

function drawRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [earnedTitle, setEarnedTitle] = useState('Developer');

  const snakeRef    = useRef<Point[]>([{ x: 9, y: 9 }]);
  const dirRef      = useRef<Point>({ x: 1, y: 0 });
  const nextDirRef  = useRef<Point>({ x: 1, y: 0 });
  const foodRef     = useRef<Food | null>(null);
  const feRef          = useRef(0);
  const beRef          = useRef(0);
  const skillIndexRef  = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stateRef    = useRef<GameState>('idle');
  const msgRef      = useRef<string>('');

  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, W, H);

    // Grid dots
    ctx.fillStyle = '#1e293b';
    for (let x = 0; x < COLS; x++) {
      for (let y = 0; y < ROWS; y++) {
        ctx.fillRect(x * CELL + CELL / 2 - 1, y * CELL + CELL / 2 - 1, 2, 2);
      }
    }

    // Snake
    snakeRef.current.forEach((seg, i) => {
      const isHead = i === 0;
      const alpha = Math.max(0.25, 1 - i * 0.04);
      ctx.fillStyle = isHead ? '#3B82F6' : `rgba(59,130,246,${alpha})`;
      const pad = isHead ? 2 : 3;
      drawRoundRect(ctx, seg.x * CELL + pad, seg.y * CELL + pad, CELL - pad * 2, CELL - pad * 2, isHead ? 5 : 3);
      ctx.fill();
    });

    // Food
    if (foodRef.current) {
      const { x, y, skill } = foodRef.current;
      const cx = x * CELL + CELL / 2;
      const cy = y * CELL + CELL / 2;

      // Glow
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, CELL * 0.9);
      grad.addColorStop(0, skill.color + '55');
      grad.addColorStop(1, skill.color + '00');
      ctx.fillStyle = grad;
      ctx.fillRect(x * CELL - 4, y * CELL - 4, CELL + 8, CELL + 8);

      // Dot
      ctx.fillStyle = skill.color;
      ctx.beginPath();
      ctx.arc(cx, cy - 5, 7, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.font = 'bold 10px monospace';
      ctx.fillStyle = skill.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(skill.name, cx, cy + 5);
    }

    // Current title (top left)
    const title = getTitle(feRef.current, beRef.current);
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = '#3B82F6';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(title, 8, 8);
  }, []);

  const spawnFood = useCallback(() => {
    const pos = randomPos(snakeRef.current);
    const skill = SKILLS[skillIndexRef.current % SKILLS.length];
    skillIndexRef.current++;
    foodRef.current = { ...pos, skill };
  }, []);

  const endGame = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const title = getTitle(feRef.current, beRef.current);
    msgRef.current = randomMsg();

    // Draw game over overlay on top of current scene
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        drawScene();
        ctx.fillStyle = 'rgba(15,23,42,0.82)';
        ctx.fillRect(0, 0, W, H);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 18px monospace';
        ctx.fillStyle = '#ef4444';
        ctx.fillText('GAME OVER', W / 2, H / 2 - 52);
        ctx.font = '13px monospace';
        ctx.fillStyle = '#64748b';
        ctx.fillText('you earned:', W / 2, H / 2 - 22);
        ctx.font = 'bold 18px monospace';
        ctx.fillStyle = '#3B82F6';
        ctx.fillText(title, W / 2, H / 2 + 10);
        ctx.font = '11px monospace';
        ctx.fillStyle = '#475569';
        ctx.fillText(`${feRef.current} frontend · ${beRef.current} backend`, W / 2, H / 2 + 36);
        ctx.font = 'italic 11px monospace';
        ctx.fillStyle = '#3B82F6';
        ctx.fillText(`"${msgRef.current}"`, W / 2, H / 2 + 58);
      }
    }

    setEarnedTitle(title);
    stateRef.current = 'gameover';
    setGameState('gameover');
  }, [drawScene]);

  const tick = useCallback(() => {
    if (stateRef.current !== 'playing') return;
    dirRef.current = nextDirRef.current;

    const head = snakeRef.current[0];
    const next = {
      x: ((head.x + dirRef.current.x) % COLS + COLS) % COLS,
      y: ((head.y + dirRef.current.y) % ROWS + ROWS) % ROWS,
    };

    if (snakeRef.current.some(s => s.x === next.x && s.y === next.y)) { endGame(); return; }

    const newSnake = [next, ...snakeRef.current];

    if (foodRef.current && next.x === foodRef.current.x && next.y === foodRef.current.y) {
      if (foodRef.current.skill.category === 'frontend') feRef.current++;
      else beRef.current++;
      spawnFood();
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;
    drawScene();
  }, [drawScene, spawnFood, endGame]);

  const startGame = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    snakeRef.current = [{ x: 7, y: 7 }, { x: 6, y: 7 }, { x: 5, y: 7 }];
    dirRef.current   = { x: 1, y: 0 };
    nextDirRef.current = { x: 1, y: 0 };
    feRef.current = 0;
    beRef.current = 0;
    skillIndexRef.current = 0;
    spawnFood();
    stateRef.current = 'playing';
    setGameState('playing');
  }, [spawnFood]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;
    drawScene();
    intervalRef.current = setInterval(tick, SPEED);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [gameState, tick, drawScene]);

  // Keyboard controls
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (stateRef.current !== 'playing') return;
      const d = dirRef.current;
      switch (e.key) {
        case 'ArrowUp':    case 'w': case 'W': if (d.y !== 1)  { nextDirRef.current = { x: 0, y: -1 }; e.preventDefault(); } break;
        case 'ArrowDown':  case 's': case 'S': if (d.y !== -1) { nextDirRef.current = { x: 0, y:  1 }; e.preventDefault(); } break;
        case 'ArrowLeft':  case 'a': case 'A': if (d.x !== 1)  { nextDirRef.current = { x: -1, y: 0 }; e.preventDefault(); } break;
        case 'ArrowRight': case 'd': case 'D': if (d.x !== -1) { nextDirRef.current = { x:  1, y: 0 }; e.preventDefault(); } break;
      }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, []);

  // Idle screen
  useEffect(() => {
    if (gameState !== 'idle') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#1e293b';
    for (let x = 0; x < COLS; x++)
      for (let y = 0; y < ROWS; y++)
        ctx.fillRect(x * CELL + CELL / 2 - 1, y * CELL + CELL / 2 - 1, 2, 2);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = '#3B82F6';
    ctx.fillText('Click to play', W / 2, H / 2 - 18);
    ctx.font = '12px monospace';
    ctx.fillStyle = '#475569';
    ctx.fillText('Collect skills · earn your title', W / 2, H / 2 + 12);
  }, [gameState]);

  const handleDirButton = useCallback((dx: number, dy: number) => {
    if (stateRef.current !== 'playing') return;
    const d = dirRef.current;
    if (dx === 0 && dy === -1 && d.y !== 1)  nextDirRef.current = { x: 0, y: -1 };
    if (dx === 0 && dy ===  1 && d.y !== -1) nextDirRef.current = { x: 0, y:  1 };
    if (dx === -1 && dy === 0 && d.x !== 1)  nextDirRef.current = { x: -1, y: 0 };
    if (dx ===  1 && dy === 0 && d.x !== -1) nextDirRef.current = { x:  1, y: 0 };
  }, []);

  return (
    <div className="flex flex-col items-center rounded-2xl bg-[#1a1a2e] border border-[#2d2d4e] shadow-2xl p-4 gap-3 w-fit select-none">
      {/* Header */}
      <div className="flex items-center justify-between w-full px-1">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 opacity-80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 opacity-80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400 opacity-80" />
        </div>
        <span className="font-mono text-xs font-bold tracking-widest text-[#3B82F6] uppercase">Skill·Boy</span>
        <div className="w-12" />
      </div>

      {/* Screen bezel */}
      <div className="rounded-lg bg-[#0d0d1a] border-2 border-[#2d2d4e] shadow-inner p-2">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="rounded cursor-pointer block"
          onClick={() => { if (gameState === 'idle') startGame(); }}
        />
      </div>

      {/* Controls hint */}
      <p className="font-mono text-[10px] text-[#475569] tracking-wide text-center">
        Arrow keys · WASD · or D-pad
      </p>

      {/* D-pad + action area */}
      <div className="flex items-center justify-between w-full px-2 mt-1">
        {/* D-pad */}
        <div className="grid grid-cols-3 grid-rows-3 gap-0.5 w-28 h-28">
          <div />
          <button
            onPointerDown={() => handleDirButton(0, -1)}
            className="flex items-center justify-center bg-[#2d2d4e] hover:bg-[#3d3d6e] active:bg-[#4d4d8e] rounded text-[#94a3b8] hover:text-white transition-colors"
            aria-label="Up"
          >▲</button>
          <div />
          <button
            onPointerDown={() => handleDirButton(-1, 0)}
            className="flex items-center justify-center bg-[#2d2d4e] hover:bg-[#3d3d6e] active:bg-[#4d4d8e] rounded text-[#94a3b8] hover:text-white transition-colors"
            aria-label="Left"
          >◀</button>
          <div className="flex items-center justify-center bg-[#1e1e38] rounded">
            <div className="w-2 h-2 rounded-full bg-[#2d2d4e]" />
          </div>
          <button
            onPointerDown={() => handleDirButton(1, 0)}
            className="flex items-center justify-center bg-[#2d2d4e] hover:bg-[#3d3d6e] active:bg-[#4d4d8e] rounded text-[#94a3b8] hover:text-white transition-colors"
            aria-label="Right"
          >▶</button>
          <div />
          <button
            onPointerDown={() => handleDirButton(0, 1)}
            className="flex items-center justify-center bg-[#2d2d4e] hover:bg-[#3d3d6e] active:bg-[#4d4d8e] rounded text-[#94a3b8] hover:text-white transition-colors"
            aria-label="Down"
          >▼</button>
          <div />
        </div>

        {/* Right side: status + button */}
        <div className="flex flex-col items-center gap-3">
          {gameState === 'gameover' && (
            <Button variant="outline" size="sm" onClick={startGame}
              className="border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white text-xs">
              Restart
            </Button>
          )}
          {/* Speaker grille */}
          <div className="flex gap-0.5">
            {[0,1,2,3].map(i => (
              <div key={i} className="w-0.5 h-6 bg-[#2d2d4e] rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
