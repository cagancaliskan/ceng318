// EggChef palette — copied verbatim from the source design's `C2` object.
// Do not adjust these values; they define the entire look.
export const C = {
  primary: '#76919B',
  primaryDeep: '#5d7681',
  primarySoft: 'rgba(118,145,155,0.10)',
  primarySoftBorder: 'rgba(118,145,155,0.22)',
  dark: '#3a4448',
  darkSoft: '#696868',
  panel: '#EDEEEB',
  panelStrong: '#D7D8D4',
  med: '#9B9B9B',
  medSoft: '#BEBFBC',
  bg: '#FBFFF9',
  bgTint: '#F4F6F2',
  white: '#ffffff',
  text: '#2b2f31',
  textMute: '#8a8d8a',
} as const;

// A few one-off colors the design uses inline (warnings, iOS dock app icons).
export const Cx = {
  warn: '#ff9f0a',
  warnDeep: '#ff7a00',
  warnText: '#c46d00',
  warnTextDeep: '#a55a00',
  warnBg: '#fff8ee',
  red: '#ff3b30',
  green: '#34c759',
  greenDeep: '#248a3d',
  blue: '#0a84ff',
  blueSoft: '#5e9eff',
  phoneGreen: '#34c759',
} as const;

export type ColorKey = keyof typeof C;
