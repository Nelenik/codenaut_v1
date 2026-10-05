/**
 * The CSS colour names the game teaches, and nothing else.
 *
 * A dictionary string marks a colour with `[[green]]` and this module decides
 * whether that token is a real one. Keeping the list explicit means a typo in a
 * dictionary degrades to plain text instead of painting a word in a colour the
 * child has never been taught, and the dictionary check asserts the list still
 * matches the values the task configs actually use.
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

export function isCssColor(token: string): boolean {
  return CSS_COLORS.has(token);
}