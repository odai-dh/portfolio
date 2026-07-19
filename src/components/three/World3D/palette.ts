// Warm-shifted variant of snake-3d.dev's green palette (rock-biter).
// Reference values: ground #56f854, fog/bg #39c09f, trees #639541,
// rocks #ebebeb, ACESFilmic @ 1.2, VSM shadows r7. We warm the sky to
// cream per the toy-world brief and keep the saturation.
export const PALETTE = {
  sky: '#f7e7c4', // cream — also the fog color, like the reference ties fog to bg
  grassA: '#5ede4c', // saturated warm green (ref #56f854, slightly warmed)
  grassB: '#8ee65a', // lighter blade green for vertex variation
  sand: '#ecca8a', // warm sand for the island rim
  pedestal: '#d9b273', // island base
  tree: '#639541', // straight from the reference
  trunk: '#8a5a33',
  rock: '#ebebeb', // straight from the reference
  snake: '#3B82F6', // the hero Snake's actual blue — same snake, broken out
  snakeBelly: '#60A5FA',
  lemon: '#ffd23f',
  lemonLeaf: '#3f9b2f',
  keyLight: '#fff2dc', // warm key
  hemiSky: '#cfe8ff', // cool sky fill
  hemiGround: '#e8c48a', // warm ground bounce
  signBoard: '#f7ead0',
  signText: '#513c22',
} as const;

export const WORLD = {
  islandRadius: 9.6, // soft wall starts a bit inside this
  softWallRadius: 8.4,
  snakeSpeed: 4.2,
  turnRate: 2.9, // rad/s — tight, car-like
  segmentSize: 0.62,
  segmentSpacing: 0.6,
  startSegments: 3,
  lemonCount: 3,
  eatDistance: 0.95,
} as const;
