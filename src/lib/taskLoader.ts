export type ExpectMode = 'px' | 'rgb';

export type TaskExpect = {
  property: string;
  mode: ExpectMode;
  value: number | [number, number, number];
};

export type TaskConfig = {
  id: string;
  selector: string;
  expect: TaskExpect;
  givesProperty: string | null;
  givesValue: boolean;
  basket: string[];
  solution: string;
  hints: string[];
};

export type LoadedTask = {
  config: TaskConfig;
  html: string;
};

export type TaskLoadError = { ok: false; error: string };
export type TaskLoadOk = { ok: true; task: LoadedTask };
export type TaskLoadResult = TaskLoadOk | TaskLoadError;

/**
 * A task html file must contain exactly one `<!--CHILD_CSS-->` marker.
 * The child's CSS is injected there, so it lands after the base styles and
 * can override them. Nothing is concatenated blindly, so a file without the
 * marker is an authoring mistake we can report instead of a blank playfield.
 */
export const CHILD_CSS_MARKER = '<!--CHILD_CSS-->';

/**
 * The child types declarations, not full rules — `color: lime`, not
 * `#target { color: lime }`. A bare declaration is invalid CSS and the browser
 * drops it silently, so declarations are wrapped in the task's own selector.
 * Anything that already contains a block is passed through untouched, which
 * keeps full-rule answers working for later tasks.
 */
export function wrapDeclarations(css: string, selector: string): string {
  const trimmed = css.trim();
  if (!trimmed) return '';
  if (trimmed.includes('{')) return trimmed;
  return `${selector} {\n  ${trimmed}\n}`;
}

export function assemblePlayfield(html: string, childCss: string, selector: string): string {
  const wrapped = wrapDeclarations(childCss, selector);
  if (!html.includes(CHILD_CSS_MARKER)) {
    return html.replace('</style>', `${wrapped}\n</style>`);
  }
  return html.replace(CHILD_CSS_MARKER, () => wrapped);
}

export function assembleReference(html: string, solutionCss: string, selector: string): string {
  return assemblePlayfield(html, solutionCss, selector);
}

export async function loadTask(world: string, file: string): Promise<TaskLoadResult> {
  const base = `/tasks/${world}/${file}`;

  try {
    const [configRes, htmlRes] = await Promise.all([
      fetch(`${base}.json`),
      fetch(`${base}.html`),
    ]);

    if (!configRes.ok) {
      return { ok: false, error: `${base}.json — ${configRes.status}` };
    }
    if (!htmlRes.ok) {
      return { ok: false, error: `${base}.html — ${htmlRes.status}` };
    }

    const config = (await configRes.json()) as TaskConfig;
    const html = await htmlRes.text();

    return { ok: true, task: { config, html } };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}