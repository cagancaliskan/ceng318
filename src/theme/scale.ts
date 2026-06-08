import { Dimensions } from 'react-native';

// The design's screens render inside PhoneFrame2's content area — 288 × 608 dp
// (the 300 × 620 frame minus its 6px padding). Every hard-coded design value is
// scaled by the real device width so the result is proportionally identical to
// the artboards on any phone. This is the key to "looks exactly like the design."
export const DESIGN_W = 288;
export const DESIGN_H = 608;

const { width, height } = Dimensions.get('window');
export const SCREEN_W = width;
export const SCREEN_H = height;

// Uniform scale factor (width-based, so circles stay round and icons keep aspect).
export const S = width / DESIGN_W;

/** design px → device dp */
export const ds = (n: number) => Math.round(n * S * 1000) / 1000;

/** The design content's natural height at the current scale (for letterboxed screens). */
export const SCALED_DESIGN_H = ds(DESIGN_H);
