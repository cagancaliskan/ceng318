// EggChef palette — from the new Figma ("bordo" #5A1520 brand). These define the
// entire look; the app background is a near-white #faf9f9 and text is black.
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

export type ColorKey = keyof typeof C;
