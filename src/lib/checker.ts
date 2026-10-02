import type { TaskConfig, ExpectMode } from './taskLoader';

export type Declaration = {
  property: string;
  value: string;
};

/**
 * A child writes declarations, not full CSS — `background-color: lime`, or a
 * couple of them for a combination task. Shorthand blocks are read too, so a
 * child who types a real rule still gets a meaningful check.
 */
export function parseDeclarations(css: string): Declaration[] {
  const out: Declaration[] = [];

  for (const part of css.split(/[;{}]/)) {
    const chunk = part.trim();
    if (!chunk) continue;
    const colon = chunk.indexOf(':');
    if (colon <= 0) continue;
    const property = chunk.slice(0, colon).trim().toLowerCase();
    const value = chunk.slice(colon + 1).trim();
    if (!property || !value) continue;
    out.push({ property, value });
  }

  return out;
}

export function readComputed(iframe: HTMLIFrameElement | null, selector: string, property: string): string | null {
  const doc = iframe?.contentDocument;
  if (!doc) return null;
  const el = doc.querySelector(selector);
  if (!el) return null;
  return doc.defaultView?.getComputedStyle(el).getPropertyValue(property) ?? null;
}

/** Channels are within this distance of the expected value: children typing
 *  `#0f0` against `#00ff00` must not fail on rounding. */
const COLOR_TOLERANCE = 14;
const LENGTH_TOLERANCE = 1;

function parseRgb(computed: string): [number, number, number] | null {
  const match = computed.match(/-?[\d.]+/g);
  if (!match || match.length < 3) return null;
  return [Number(match[0]), Number(match[1]), Number(match[2])];
}

export function valueMatches(mode: ExpectMode, computed: string | null, expected: TaskConfig['expect']['value']): boolean {
  if (computed === null) return false;

  if (mode === 'rgb') {
    const actual = parseRgb(computed);
    if (!actual) return false;
    const target = expected as [number, number, number];
    return target.every((want, i) => Math.abs(actual[i] - want) <= COLOR_TOLERANCE);
  }

  const actual = parseFloat(computed);
  if (Number.isNaN(actual)) return false;
  const want = typeof expected === 'number' ? expected : parseFloat(String(expected));
  return Math.abs(actual - want) <= LENGTH_TOLERANCE;
}

export type CheckOutcome =
  | { kind: 'success'; property: string }
  | { kind: 'rightLookWrongProperty'; property: string; expected: string }
  | { kind: 'wrong'; property: string | null }
  | { kind: 'nothingTyped' };

/**
 * The check is two-part and answers a different question for each half:
 *
 *  - *which property* — compared by meaning against the task. Getting the look
 *    you wanted with the wrong property is deliberately not a pass: it would
 *    teach that any visual trick counts.
 *  - *the value* — never compared as a typed string. The browser is asked what
 *    the property actually computed to and that number is compared in pixels,
 *    so `1.25em` passes where `20px` was expected.
 */
export function check(
  iframe: HTMLIFrameElement | null,
  childCss: string,
  config: TaskConfig
): CheckOutcome {
  const declarations = parseDeclarations(childCss);
  if (declarations.length === 0) return { kind: 'nothingTyped' };

  const expectedProperty = config.expect.property;

  let producedTheRightLook = false;
  let rightLookProperty: string | null = null;

  for (const declaration of declarations) {
    const computed = readComputed(iframe, config.selector, declaration.property);
    if (valueMatches(config.expect.mode, computed, config.expect.value)) {
      producedTheRightLook = true;
      rightLookProperty = declaration.property;
      break;
    }
  }

  if (!producedTheRightLook) {
    const first = declarations[0];
    return { kind: 'wrong', property: first?.property ?? null };
  }

  if (rightLookProperty === expectedProperty) {
    return { kind: 'success', property: expectedProperty };
  }

  return {
    kind: 'rightLookWrongProperty',
    property: rightLookProperty ?? '',
    expected: expectedProperty,
  };
}