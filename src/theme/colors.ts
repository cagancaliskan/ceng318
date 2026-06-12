// EggChef palette — from the new Figma ("bordo" #5A1520 brand). These define the
// entire look; the LIGHT app background is a near-white #faf9f9 and text is black.
// `C` stays the light palette (back-compat + module-level/static use). Components
// pick the active palette at runtime via `useUI()` (see ./ui), which shadows `C`.
export const C = {
  bg: '#faf9f9',
  white: '#ffffff',
  black: '#000000',

  // brand reds (deepest → brightest)
  bordo: '#5a1520', // egg count, highlighted values, accents
  bordoMid: '#8a2032', // "EggChef" wordmark
  bordoBright: '#ad283e', // primary button (Başlat) base

  // neutrals
  gray: '#9b9b9b', // secondary text / inactive
  grayLight: '#d9d9d9', // borders, empty-egg fill, dividers
  panel: '#f0efef', // subtle panels / chips
  panelTint: '#f2eef0', // faint bordo-tinted panel
} as const;

export type Palette = { [K in keyof typeof C]: string };
export type ColorKey = keyof Palette;

export const lightC: Palette = C;

// Dark theme — same keys, warm near-black surfaces with the bordo accent lifted to
// a rose so it stays legible on dark. Gradient buttons keep their literal bordo.
export const darkC: Palette = {
  bg: '#16100f',
  white: '#241d20', // cards / surfaces / dial
  black: '#f3edef', // primary text (now light)

  bordo: '#e98da1', // accents, icons, egg count (lifted for contrast)
  bordoMid: '#f1a8b8', // "EggChef" wordmark
  bordoBright: '#ad283e', // primary button base (gradients use literals anyway)

  gray: '#9b9296', // secondary text / inactive
  grayLight: '#3b3033', // borders, empty-egg outline, dividers
  panel: '#2c2327', // subtle panels / chips
  panelTint: '#332a2e', // faint tinted panel
};
