// Records a short silent loop of a live site for a featured project card.
//
//   node scripts/capture-clip.mjs <name> <url> <plan> <start-seconds> <length-seconds>
//   node scripts/capture-clip.mjs niarr https://niarr.eu/ "hold:2500,scroll:2200:7000,hold:2000" 3.5 8
//
// <plan> is what to do while recording: hold:<ms> waits, scroll:<px>:<ms> scrolls smoothly.
// The whole recording is saved as scratch/<name>-raw.mp4 first; look at it, then pick the start
// and length of the part to keep. The result is public/videos/<name>.mp4 (960 px wide, H.264,
// fades in and out so the loop doesn't jump). Add `video: "/videos/<name>.mp4"` to the project.
//
// Needs Google Chrome (real GPU, so WebGL sites run at 60 fps; Playwright's bundled browser
// renders WebGL in software at a few fps) and ffmpeg.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const [name, url, plan, start, length] = process.argv.slice(2);
if (!name || !url || !plan) {
  console.error('usage: node scripts/capture-clip.mjs <name> <url> <plan> [start-seconds length-seconds]');
  process.exit(1);
}

const scratch = path.resolve('scratch', `clip-${name}`);
fs.rmSync(scratch, { recursive: true, force: true });
fs.mkdirSync(scratch, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', args: ['--use-angle=metal', '--ignore-gpu-blocklist', '--hide-scrollbars'] });
const context = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 });
const page = await context.newPage();
await page.goto(url, { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(3000);

// The DevTools screencast gives every frame as a high-quality JPEG with its timestamp
const cdp = await context.newCDPSession(page);
const frames = [];
cdp.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
  const file = path.join(scratch, `${String(frames.length).padStart(5, '0')}.jpg`);
  fs.writeFileSync(file, Buffer.from(data, 'base64'));
  frames.push({ file, t: metadata.timestamp });
  await cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
});
await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: 2400, maxHeight: 1260 });

await page.mouse.move(600, 315);
for (const step of plan.split(',')) {
  const [kind, a, b] = step.split(':');
  if (kind === 'hold') await page.waitForTimeout(Number(a));
  if (kind === 'scroll') {
    const steps = Math.round(Number(b) / 16);
    for (let i = 0; i < steps; i++) {
      await page.mouse.wheel(0, Number(a) / steps);
      await page.waitForTimeout(16);
    }
  }
}
await cdp.send('Page.stopScreencast');
await browser.close();

// Frames arrive at an uneven rate; the concat list keeps their real timing
const list = frames.flatMap((frame, i) => {
  const next = frames[i + 1];
  const duration = next ? Math.max(1 / 60, next.t - frame.t) : 1 / 30;
  return [`file '${frame.file}'`, `duration ${duration.toFixed(4)}`];
});
fs.writeFileSync(path.join(scratch, 'list.txt'), list.join('\n'));
const raw = path.resolve('scratch', `${name}-raw.mp4`);
execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', path.join(scratch, 'list.txt'),
  '-vf', 'fps=30,scale=1200:-2', '-c:v', 'libx264', '-crf', '20', '-pix_fmt', 'yuv420p', raw]);
console.log(`recorded ${frames.length} frames: ${raw}`);

if (start && length) {
  const fadeOut = Number(length) - 0.5;
  const out = path.resolve('public', 'videos', `${name}.mp4`);
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', raw, '-an',
    '-vf', `trim=start=${start}:duration=${length},setpts=PTS-STARTPTS,scale=960:-2:flags=lanczos,fade=t=in:st=0:d=0.5,fade=t=out:st=${fadeOut}:d=0.5,format=yuv420p`,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '27', '-profile:v', 'high', '-movflags', '+faststart', out]);
  console.log(`clip: ${out} (${Math.round(fs.statSync(out).size / 1024)} KB)`);
}
fs.rmSync(scratch, { recursive: true, force: true });
