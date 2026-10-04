/**
 * `px` and `rgb` compare a number the browser computed. `round` has no number
 * to compare: `getComputedStyle` hands back `border-radius` exactly as it was
 * written, so `50%` stays `50%` and can never be compared against pixels — the
 * task asks for a shape, so the check asks the shape.
 */
export type ExpectMode = 'px' | 'rgb' | 'round';

export type TaskExpect = {
  property: string;
  mode: ExpectMode;
  value?: number | [number, number, number];
};

export type TaskConfig = {
  id: string;
  selector: string;
  /**
   * Every entry must hold for the task to pass. A single-property task has one
   * entry; a combination task lists every property the scene needs, which is why
   * this is a list and not a single object.
   */
  expects: TaskExpect[];
  givesProperty: string | null;
  givesValue: boolean;
  basket: string[];
  solution: string;
};

export type LoadedTask = {
  config: TaskConfig;
  html: string;
};

export type TaskLoadError = { ok: false; error: string };
export type TaskLoadOk = { ok: true; task: LoadedTask };
export type TaskLoadResult = TaskLoadOk | TaskLoadError;

/**
 * A task html file must contain exactly one CSS comment marker, `CHILD_CSS`,
 * inside its `<style>` block. The child's CSS is injected where the marker is,
 * so it lands after the base styles and can override them. Nothing is
 * concatenated blindly, so a file without the marker is an authoring mistake we
 * can report instead of a blank playfield.
 */
export const CHILD_CSS_MARKER = '/* CHILD_CSS */';

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