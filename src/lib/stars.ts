/**
 * Stars are a ceiling, not a requirement: a level finished with 0 stars still
 * counts as completed. The table counts *failed* checks before the successful
 * one, so a child who succeeds on the first try gets 3 stars.
 */
export function starsForAttempts(failedAttempts: number): 0 | 1 | 2 | 3 {
  if (failedAttempts <= 1) return 3;
  if (failedAttempts <= 3) return 2;
  if (failedAttempts <= 5) return 1;
  return 0;
}

export const MAX_STARS = 3;

export const MAX_ATTEMPTS_BEFORE_HINT = 6;