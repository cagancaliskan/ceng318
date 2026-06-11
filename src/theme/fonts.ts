import { Platform } from 'react-native';

// The new design uses Helvetica Neue (Thin / Light / Regular / Medium) — a native
// iOS system font, so nothing needs bundling. On iOS we map each design weight to
// its exact PostScript family; Android falls back to its sans-serif weights.
function family(weight: number): string {
  if (Platform.OS === 'ios') {
    if (weight <= 100) return 'HelveticaNeue-Thin';
    if (weight <= 300) return 'HelveticaNeue-Light';
    if (weight <= 400) return 'HelveticaNeue';
    if (weight <= 500) return 'HelveticaNeue-Medium';
    return 'HelveticaNeue-Bold';
  }
  if (weight <= 100) return 'sans-serif-thin';
  if (weight <= 300) return 'sans-serif-light';
  if (weight <= 400) return 'sans-serif';
  if (weight <= 500) return 'sans-serif-medium';
  return 'sans-serif';
}

/**
 * design weight → platform font family.
 * Helvetica Neue weights used by the design: Thin=100, Light=300, Regular=400, Medium=500.
 */
export function hn(weight: number = 400): string {
  return family(weight);
}

/** Back-compat alias so older call sites keep resolving. */
export const manrope = hn;
