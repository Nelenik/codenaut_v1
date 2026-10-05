/**
 * The CSS words the game teaches, and nothing else.
 *
 * A dictionary string marks one with `[[green]]` or `[[background-color]]` and
 * this module decides what that token is. Keeping both lists explicit means a
 * typo in a dictionary degrades to plain text instead of painting a word in a
 * colour the child has never been taught, and the dictionary check asserts the
 * lists still match the values and properties the task configs actually use.
 *
 * The two lists cannot collide: every member here is either a property name or a
 * colour value, and no CSS property is named after a colour value except `color`
 * itself, which is a property and so lives in the second list only.
 */
export const CSS_COLORS = new Set([
  'blue',
  'darkblue',
  'green',
  'lime',
  'orange',
  'white',
  'yellow',
]);

export const CSS_PROPERTIES = new Set([
  'background-color',
  'border-color',
  'border-radius',
  'color',
  'font-size',
  'height',
  'width',
]);

export function isCssColor(token: string): boolean {
  return CSS_COLORS.has(token);
}

export function isCssProperty(token: string): boolean {
  return CSS_PROPERTIES.has(token);
}