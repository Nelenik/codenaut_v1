export type Progress = {
  lang: 'en' | 'ru';
  playerName: string;
  onboardingDone: boolean;
  tasks: Record<string, { stars: number; completed: boolean; attempts: number }>;
  unlocked: {
    worlds: string[];
    levels: string[];
  };
};

const DEFAULT_PROGRESS: Progress = {
  lang: 'en',
  playerName: '',
  onboardingDone: false,
  tasks: {},
  unlocked: {
    worlds: ['colors'],
    levels: ['colors/01'],
  },
};

const STORAGE_KEY = 'codenaut.progress.v1';

/**
 * A fresh state, built fresh every time.
 *
 * Nothing may hand out `DEFAULT_PROGRESS` itself. Every write in this file goes
 * through `loadProgress` and then mutates what it got back, so a shared default
 * would be mutated by the first thing that unlocks a level — and the next reader
 * would inherit an unlock nobody played for.
 */
export function defaultProgress(): Progress {
  return {
    lang: DEFAULT_PROGRESS.lang,
    playerName: '',
    onboardingDone: false,
    tasks: {},
    unlocked: {
      worlds: [...DEFAULT_PROGRESS.unlocked.worlds],
      levels: [...DEFAULT_PROGRESS.unlocked.levels],
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

/**
 * A stored value can be anything — half-written, hand-edited in devtools, or
 * left by an older version of the game. Only the parts that are the right shape
 * are believed and the rest falls back, so a corrupt store reads as a fresh game
 * rather than as a broken one.
 *
 * `lang` is checked against the two languages the game actually ships: an
 * unrecognised value falls back to English, because i18next would happily switch
 * to a language with no dictionaries and leave the player reading blank screens.
 */
function sanitise(parsed: unknown): Progress {
  const base = defaultProgress();
  if (!isRecord(parsed)) return base;

  const tasks: Progress['tasks'] = {};
  if (isRecord(parsed.tasks)) {
    for (const [id, entry] of Object.entries(parsed.tasks)) {
      if (!isRecord(entry) || typeof entry.stars !== 'number') continue;
      tasks[id] = {
        stars: entry.stars,
        completed: entry.completed === true,
        attempts: typeof entry.attempts === 'number' ? entry.attempts : 0,
      };
    }
  }

  const unlocked = isRecord(parsed.unlocked) ? parsed.unlocked : {};

  return {
    lang: parsed.lang === 'ru' || parsed.lang === 'en' ? parsed.lang : base.lang,
    playerName: typeof parsed.playerName === 'string' ? parsed.playerName : base.playerName,
    onboardingDone: parsed.onboardingDone === true,
    tasks,
    unlocked: {
      worlds: [...new Set([...base.unlocked.worlds, ...stringList(unlocked.worlds)])],
      levels: [...new Set([...base.unlocked.levels, ...stringList(unlocked.levels)])],
    },
  };
}

export function markOnboardingDone(): void {
  const progress = loadProgress();
  progress.onboardingDone = true;
  saveProgress(progress);
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
  if (typeof window === 'undefined') return defaultProgress();

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultProgress();
    return sanitise(JSON.parse(stored));
  } catch {
    return defaultProgress();
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