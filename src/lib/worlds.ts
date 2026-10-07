export type WorldId = 'colors' | 'sizes';

export type TaskRef = {
  id: string;
  file: string;
};

export type LevelRef = {
  id: string;
  file: string;
};

export type WorldMeta = {
  id: WorldId;
  labelKey: string;
  color: string;
  glow: string;
  levels: LevelRef[];
};

export const WORLDS: WorldMeta[] = [
  {
    id: 'colors',
    labelKey: 'map.worlds.colors',
    color: '#ffd600',
    glow: '#ffaa00',
    levels: [
      { id: '00', file: '00-command-parts' },
      { id: '01', file: '01-ball-color' },
      { id: '02', file: '02-color-too-dark' },
      { id: '03', file: '03-pick-background' },
      { id: '04', file: '04-pick-border' },
      { id: '05', file: '05-color-combo' },
    ],
  },
  {
    id: 'sizes',
    labelKey: 'map.worlds.sizes',
    color: '#00e5ff',
    glow: '#00aaff',
    levels: [
      { id: '01', file: '01-how-wide' },
      { id: '02', file: '02-how-tall' },
      { id: '03', file: '03-pick-height' },
      { id: '04', file: '04-make-round' },
      { id: '05', file: '05-size-combo' },
    ],
  },
];

export function getWorld(id: string): WorldMeta | undefined {
  return WORLDS.find((w) => w.id === id);
}

export function taskId(world: string, levelFile: string): string {
  return `${world}/${levelFile}`;
}

export function levelKey(world: string, levelId: string): string {
  return `${world}/${levelId}`;
}

export function nextLevel(worldId: string, levelId: string): LevelRef | null {
  const world = getWorld(worldId);
  if (!world) return null;
  const index = world.levels.findIndex((l) => l.id === levelId);
  if (index < 0) return null;
  return world.levels[index + 1] ?? null;
}

/** Completing the last level of colors lights up the next planet. */
export function worldAfter(worldId: string): WorldId | null {
  const order: WorldId[] = ['colors', 'sizes'];
  const index = order.indexOf(worldId as WorldId);
  if (index < 0 || index === order.length - 1) return null;
  return order[index + 1];
}
