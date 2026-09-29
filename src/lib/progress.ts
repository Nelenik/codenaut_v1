export type Progress = {
  lang: 'en' | 'ru';
  tasks: Record<string, { stars: number; completed: boolean; attempts: number }>;
  unlocked: {
    worlds: string[];
    levels: string[];
  };
};

const DEFAULT_PROGRESS: Progress = {
  lang: 'en',
  tasks: {},
  unlocked: {
    worlds: ['colors'],
    levels: ['colors/01'],
  },
};

const STORAGE_KEY = 'roundball.progress.v1';

export function loadProgress(): Progress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_PROGRESS;
    
    const parsed = JSON.parse(stored);
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      tasks: { ...DEFAULT_PROGRESS.tasks, ...parsed.tasks },
      unlocked: {
        worlds: [...new Set([...DEFAULT_PROGRESS.unlocked.worlds, ...(parsed.unlocked?.worlds || [])])],
        levels: [...new Set([...DEFAULT_PROGRESS.unlocked.levels, ...(parsed.unlocked?.levels || [])])],
      },
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress: Progress): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore quota exceeded, private mode, etc.
  }
}

export function getTaskProgress(taskId: string): { stars: number; completed: boolean; attempts: number } {
  const progress = loadProgress();
  return progress.tasks[taskId] || { stars: 0, completed: false, attempts: 0 };
}

export function setTaskProgress(taskId: string, data: { stars: number; completed: boolean; attempts: number }): void {
  const progress = loadProgress();
  progress.tasks[taskId] = data;
  saveProgress(progress);
}

export function incrementAttempts(taskId: string): number {
  const progress = loadProgress();
  const current = progress.tasks[taskId] || { stars: 0, completed: false, attempts: 0 };
  current.attempts += 1;
  progress.tasks[taskId] = current;
  saveProgress(progress);
  return current.attempts;
}

export function awardStars(taskId: string, attempts: number): number {
  let stars = 0;
  if (attempts <= 2) stars = 3;
  else if (attempts <= 4) stars = 2;
  else if (attempts <= 6) stars = 1;
  else stars = 0;
  
  const progress = loadProgress();
  progress.tasks[taskId] = { stars, completed: true, attempts };
  
  // Unlock next level
  const [world, levelNum] = taskId.split('/');
  const levelIndex = parseInt(levelNum.replace('-', '').replace('what-color', '').replace('how-tall', '').replace('make-round', '').replace('paint-background', '').replace('add-border', '').replace('color-combo', '').replace('size-combo', '')) || 1;
  
  if (levelIndex < 5) {
    const nextLevelNum = String(levelIndex + 1).padStart(2, '0');
    const nextLevelKey = `${world}/${nextLevelNum}`;
    if (!progress.unlocked.levels.includes(nextLevelKey)) {
      progress.unlocked.levels.push(nextLevelKey);
    }
  } else if (levelIndex === 5) {
    // Unlock next world
    const nextWorld = world === 'colors' ? 'sizes' : null;
    if (nextWorld && !progress.unlocked.worlds.includes(nextWorld)) {
      progress.unlocked.worlds.push(nextWorld);
      progress.unlocked.levels.push(`${nextWorld}/01`);
    }
  }
  
  saveProgress(progress);
  return stars;
}

export function isWorldUnlocked(world: string): boolean {
  const progress = loadProgress();
  return progress.unlocked.worlds.includes(world);
}

export function isLevelUnlocked(levelId: string): boolean {
  const progress = loadProgress();
  return progress.unlocked.levels.includes(levelId);
}

export function getLanguage(): 'en' | 'ru' {
  const progress = loadProgress();
  return progress.lang;
}

export function setLanguage(lang: 'en' | 'ru'): void {
  const progress = loadProgress();
  progress.lang = lang;
  saveProgress(progress);
}

export function replayLevel(taskId: string): void {
  const progress = loadProgress();
  // Reset this level and all subsequent levels in the same world
  const [world, levelNum] = taskId.split('/');
  const levelIndex = parseInt(levelNum) || 1;
  
  // Reset stars for this level
  if (progress.tasks[taskId]) {
    progress.tasks[taskId] = { stars: 0, completed: false, attempts: 0 };
  }
  
  // Lock subsequent levels in this world
  for (let i = levelIndex + 1; i <= 5; i++) {
    const levelKey = `${world}/${String(i).padStart(2, '0')}`;
    if (progress.tasks[levelKey]) {
      progress.tasks[levelKey] = { stars: 0, completed: false, attempts: 0 };
    }
    progress.unlocked.levels = progress.unlocked.levels.filter(l => l !== levelKey);
  }
  
  saveProgress(progress);
}

export function resetAllProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}