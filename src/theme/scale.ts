import { Dimensions, Platform } from 'react-native';

// The new Figma artboards are full-screen iPhone frames at 402 × 874 dp. Every
// hard-coded design value is scaled by the real device width so the result is
// proportionally identical to the artboards on any phone.
export const DESIGN_W = 402;
export const DESIGN_H = 874;

const { width, height } = Dimensions.get('window');

// On WEB the app is rendered as a fixed phone-width column (see App.tsx WebFrame),
// so we must NEVER scale UP past the design width — otherwise a desktop browser
// window (e.g. 1440px) would blow every dimension up ~3-4x and overflow. Narrower
// viewports (mobile web) still scale down. On native, scale to the device width.
const baseW = Platform.OS === 'web' ? Math.min(width, DESIGN_W) : width;

export const SCREEN_W = baseW;
export const SCREEN_H = height;

// Uniform scale factor (width-based, so circles stay round and icons keep aspect).
export const S = baseW / DESIGN_W;

/** design px → device dp */
export const ds = (n: number) => Math.round(n * S * 1000) / 1000;

/** The design content's natural height at the current scale. */
export const SCALED_DESIGN_H = ds(DESIGN_H);
