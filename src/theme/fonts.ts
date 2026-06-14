import { Platform } from 'react-native';

// The new design uses Helvetica Neue (Thin / Light / Regular / Medium) — a native
// iOS system font, so nothing needs bundling. On iOS we map each design weight to
// its exact PostScript family; Android falls back to its sans-serif weights; on the
// WEB build we use the real CSS family and apply the weight separately via hnWeight()
// (web ignores PostScript names and won't render Thin/Light without an explicit
// font-weight — that's what made the web build look "off").
function family(weight: number): string {
  if (Platform.OS === 'ios') {
    if (weight <= 100) return 'HelveticaNeue-Thin';
    if (weight <= 300) return 'HelveticaNeue-Light';
    if (weight <= 400) return 'HelveticaNeue';
    if (weight <= 500) return 'HelveticaNeue-Medium';
    return 'HelveticaNeue-Bold';
  }
  if (Platform.OS === 'web') {
    return "'Helvetica Neue','HelveticaNeue',Helvetica,Arial,sans-serif";
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

/**
 * Web only: the CSS family carries no weight, so callers must ALSO set fontWeight
 * for Thin/Light/Medium to actually render. Returns undefined on iOS/Android (the
 * family name already encodes the weight there) so native rendering is untouched.
 */
export function hnWeight(weight: number = 400): '100' | '300' | '400' | '500' | '700' | undefined {
  if (Platform.OS !== 'web') return undefined;
  if (weight <= 100) return '100';
  if (weight <= 300) return '300';
  if (weight <= 400) return '400';
  if (weight <= 500) return '500';
  return '700';
}

/** Back-compat alias so older call sites keep resolving. */
export const manrope = hn;
