import { ds } from './scale';

/**
 * Faithful box-shadow. RN's New Architecture (RN 0.76+, used by Expo SDK 56)
 * supports the CSS-like `boxShadow` style prop — multiple layers AND `inset`.
 * This scales every px length in a CSS box-shadow string by the device scale
 * factor so shadows stay proportional, and returns it for `style={{ boxShadow }}`.
 *
 * Usage: boxShadow: bs('0 30px 70px -10px rgba(60,70,75,0.35), inset 0 0 0 1px rgba(255,255,255,0.06)')
 */
export function bs(css: string): string {
  return css.replace(/(-?\d*\.?\d+)px/g, (_m, n: string) => `${ds(parseFloat(n))}px`);
}
