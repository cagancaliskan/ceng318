import React from 'react';
import Svg, { Path, Circle, Rect, Ellipse, Line } from 'react-native-svg';
import { ds } from '../theme/scale';

// Every icon below is transcribed element-for-element from the source design's
// inline SVGs (same viewBox, same paths). `size` is design px (auto-scaled);
// `color` drives stroke or fill depending on the glyph; `sw` is strokeWidth.
type IP = { size?: number; color?: string; sw?: number };
const px = (n: number) => ds(n);

// ── Bottom-nav ───────────────────────────────────────────────
export const NavMenu = ({ size = 22, color = '#000', sw = 2 }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <Rect x={3.5} y={4.5} width={7} height={7} rx={2} />
    <Rect x={13.5} y={4.5} width={7} height={7} rx={2} />
    <Rect x={3.5} y={14.5} width={7} height={7} rx={2} />
    <Rect x={13.5} y={14.5} width={7} height={7} rx={2} />
  </Svg>
);

export const NavCooking = ({ size = 22, color = '#000', sw = 1.9 }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M6 4c1.5 2 1.5 3 0 5s-1.5 3 0 5" />
    <Path d="M12 4c1.5 2 1.5 3 0 5s-1.5 3 0 5" />
    <Path d="M18 4c1.5 2 1.5 3 0 5s-1.5 3 0 5" />
    <Path d="M3 17h18" />
    <Path d="M5 17c.5 2.5 2 4 7 4s6.5-1.5 7-4" />
  </Svg>
);

export const NavProfile = ({ size = 22, color = '#000', sw = 2 }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round">
    <Circle cx={12} cy={8.5} r={3.8} />
    <Path d="M4.5 20.5c1.2-3.8 4.2-6 7.5-6s6.3 2.2 7.5 6" />
  </Svg>
);

// ── Egg doneness glyphs (presets / history / device cards) ───
export const EggOutline = ({ size = 22, color = '#000', sw = 1.8 }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw}>
    <Ellipse cx={12} cy={13} rx={6} ry={8} />
  </Svg>
);
export const EggKayisi = ({ size = 22, color = '#000', sw = 1.8 }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw}>
    <Ellipse cx={12} cy={13} rx={6} ry={8} />
    <Circle cx={12} cy={14} r={2.5} fill={color} fillOpacity={0.4} />
  </Svg>
);
export const EggKati = ({ size = 22, color = '#000', sw = 1.8 }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw}>
    <Ellipse cx={12} cy={13} rx={6} ry={8} />
    <Circle cx={12} cy={14} r={2.5} fill={color} />
  </Svg>
);
// History "settings/clock" glyph variant
export const ClockSmall = ({ size = 14, color = '#000', sw = 2 }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw}>
    <Circle cx={12} cy={12} r={8} />
    <Path d="M12 8v4l3 2" />
  </Svg>
);

// ── Common UI glyphs ─────────────────────────────────────────
export const Back = ({ size = 12, color = '#000', sw = 2.5 }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round">
    <Path d="M15 6l-6 6 6 6" />
  </Svg>
);

export const Hamburger = ({ size = 10, color = '#000', sw = 2.5 }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round">
    <Line x1={4} y1={6} x2={20} y2={6} />
    <Line x1={4} y1={12} x2={14} y2={12} />
    <Line x1={4} y1={18} x2={20} y2={18} />
  </Svg>
);

export const WaterDrop = ({ size = 14, color = '#000' }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2c-4 5-6 8-6 12a6 6 0 0012 0c0-4-2-7-6-12z" />
  </Svg>
);

export const ClockMenu = ({ size = 14, color = '#000', sw = 2 }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw}>
    <Circle cx={12} cy={13} r={7} />
    <Path d="M12 9v4l2 2M9 3h6" />
  </Svg>
);

export const Play = ({ size = 13, color = '#fff' }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 24 24" fill={color}>
    <Path d="M6 4l14 8-14 8z" />
  </Svg>
);

export const Pause = ({ size = 13, color = '#fff' }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 24 24" fill={color}>
    <Rect x={6} y={4} width={4} height={16} rx={1.5} />
    <Rect x={14} y={4} width={4} height={16} rx={1.5} />
  </Svg>
);

export const Check = ({ size = 22, color = '#fff', sw = 3 }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M5 12.5l5 5L20 7" />
  </Svg>
);

export const Plus = ({ size = 18, color = '#000', sw = 2.6 }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round">
    <Line x1={5} y1={12} x2={19} y2={12} />
    <Line x1={12} y1={5} x2={12} y2={19} />
  </Svg>
);

export const Minus = ({ size = 18, color = '#000', sw = 2.6 }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round">
    <Line x1={5} y1={12} x2={19} y2={12} />
  </Svg>
);

// Header avatar glyph (small, on the gradient circle)
export const HeaderUser = ({ size = 13, color = '#fff' }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 24 24" fill={color}>
    <Circle cx={12} cy={8} r={4} />
    <Path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
  </Svg>
);

// Bluetooth (pair device)
export const Bluetooth = ({ size = 13, color = '#fff', sw = 2.2 }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M7 8l10 8-5 4V4l5 4-10 8" />
  </Svg>
);

// Search (lockscreen / dock)
export const Search = ({ size = 11, color = '#fff', sw = 2.4 }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round">
    <Circle cx={11} cy={11} r={6} />
    <Line x1={20} y1={20} x2={15.5} y2={15.5} />
  </Svg>
);
