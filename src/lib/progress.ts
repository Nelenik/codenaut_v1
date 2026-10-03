export type Progress = {
  lang: 'en' | 'ru';
  playerName: string;
  tasks: Record<string, { stars: number; completed: boolean; attempts: number }>;
  unlocked: {
    worlds: string[];
    levels: string[];
  };
};

const DEFAULT_PROGRESS: Progress = {
  lang: 'en',
  playerName: '',
  tasks: {},
  unlocked: {
    worlds: ['colors'],
    levels: ['colors/01'],
  },
};

const STORAGE_KEY = 'codenaut.progress.v1';

export function defaultProgress(): Progress {
  return {
    lang: DEFAULT_PROGRESS.lang,
    playerName: '',
    tasks: {},
    unlocked: { worlds: [...DEFAULT_PROGRESS.unlocked.worlds], levels: [...DEFAULT_PROGRESS.unlocked.levels] },
  };
}

export function setPlayerName(name: string): void {
  const progress = loadProgress();
  progress.playerName = name.trim();
  saveProgress(progress);
}

export function getPlayerName(): string {
  return loadProgress().playerName;
}

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

export function recordTaskSuccess(taskId: string, stars: number, attempts: number): void {
  const progress = loadProgress();
  progress.tasks[taskId] = { stars, completed: true, attempts };
  saveProgress(progress);
}

/**
 * Drops a completed level's star count when the child actually starts a replay.
 * Called only once they have written something and pressed Check: opening a
 * level, or pressing Check with nothing written, leaves the earlier result
 * intact. The PRD wants replay to replace the old score rather than bank it, so
 * the stars stay honest — but a score must not disappear just for being looked at.
 */
export function resetTaskForReplay(taskId: string): void {
  const progress = loadProgress();
  if (!progress.tasks[taskId]?.completed) return;
  progress.tasks[taskId] = { stars: 0, completed: false, attempts: 0 };
  saveProgress(progress);
}

export function unlockLevel(levelKey: string): void {
  const progress = loadProgress();
  if (!progress.unlocked.levels.includes(levelKey)) {
    progress.unlocked.levels.push(levelKey);
    saveProgress(progress);
  }
}

export function unlockWorld(world: string): void {
  const progress = loadProgress();
  if (!progress.unlocked.worlds.includes(world)) {
    progress.unlocked.worlds.push(world);
    saveProgress(progress);
  }
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

export function resetAllProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}