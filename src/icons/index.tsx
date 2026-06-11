import React from 'react';
import Svg, { Path, Circle, Rect, Ellipse, Line, G } from 'react-native-svg';
import { ds } from '../theme/scale';

// Icons recreated as SVG to match the new Figma (bordo line icons). `size` is
// design px (auto-scaled); `color` drives stroke/fill; `sw` is strokeWidth.
type IP = { size?: number; color?: string; sw?: number };
const px = (n: number) => ds(n);

// ── Bottom nav ───────────────────────────────────────────────
export const NavMenu = ({ size = 24, color = '#000', sw = 2.4 }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round">
    <Line x1={4} y1={7} x2={20} y2={7} />
    <Line x1={4} y1={12} x2={20} y2={12} />
    <Line x1={4} y1={17} x2={20} y2={17} />
  </Svg>
);

// "Pişirme" — three rising steam waves.
export const NavCooking = ({ size = 24, color = '#000', sw = 2 }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M7 14c1.4-1.6 1.4-2.8 0-4.4s-1.4-2.8 0-4.4" />
    <Path d="M12 14c1.4-1.6 1.4-2.8 0-4.4s-1.4-2.8 0-4.4" />
    <Path d="M17 14c1.4-1.6 1.4-2.8 0-4.4s-1.4-2.8 0-4.4" />
    <Path d="M5 18h14" />
  </Svg>
);

export const NavProfile = ({ size = 24, color = '#000', sw = 2 }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round">
    <Circle cx={12} cy={8.5} r={3.8} />
    <Path d="M4.5 20.5c1.2-3.8 4.2-6 7.5-6s6.3 2.2 7.5 6" />
  </Svg>
);

// ── Doneness presets (line icons, bordo) ─────────────────────
// Rafadan (soft) — fried egg: white + yolk.
export const RafadanIcon = ({ size = 28, color = '#000', sw = 1.8 }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 28 28" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M14 5c4 0 6.5 2.2 6.5 5 0 1.4 1.8 2 1.8 4.4 0 3-2.4 4.8-5 4.8-1 0-1.9-.3-2.6-.8-.8.5-1.8.9-3 .9-2.8 0-5-1.9-5-4.7 0-2 1.3-2.8 1.3-4.6C8 7.2 10.4 5 14 5Z" />
    <Circle cx={13} cy={13.5} r={3.3} />
  </Svg>
);
// Kayısı (medium) — runny ring.
export const KayisiIcon = ({ size = 28, color = '#000', sw = 1.8 }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 28 28" fill="none" stroke={color} strokeWidth={sw}>
    <Circle cx={14} cy={14} r={9} />
    <Circle cx={14} cy={14} r={3.6} />
  </Svg>
);
// Katı (hard) — sunburst.
export const KatiIcon = ({ size = 28, color = '#000', sw = 1.8 }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 28 28" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round">
    <Circle cx={14} cy={14} r={5} />
    {Array.from({ length: 8 }).map((_, i) => {
      const a = (i / 8) * Math.PI * 2;
      const x1 = 14 + Math.cos(a) * 7.5;
      const y1 = 14 + Math.sin(a) * 7.5;
      const x2 = 14 + Math.cos(a) * 10;
      const y2 = 14 + Math.sin(a) * 10;
      return <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
    })}
  </Svg>
);

// ── Egg illustration for the dial ────────────────────────────
export const Egg = ({ size = 40, fill = '#ffffff', stroke = '#e6e2e3', sw = 1 }: { size?: number; fill?: string; stroke?: string; sw?: number }) => (
  <Svg width={px(size)} height={px(size * 1.3)} viewBox="0 0 40 52" fill="none">
    <Path
      d="M20 2C29 2 35 21 35 33C35 43.5 28.3 50 20 50C11.7 50 5 43.5 5 33C5 21 11 2 20 2Z"
      fill={fill}
      stroke={stroke}
      strokeWidth={sw}
    />
  </Svg>
);

// ── Common UI glyphs ─────────────────────────────────────────
export const Back = ({ size = 24, color = '#000', sw = 2.4 }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M15 5l-7 7 7 7" />
  </Svg>
);

export const ArrowRight = ({ size = 24, color = '#000', sw = 2 }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);

export const Hamburger = ({ size = 24, color = '#000', sw = 2.4 }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round">
    <Line x1={4} y1={7} x2={20} y2={7} />
    <Line x1={4} y1={12} x2={20} y2={12} />
    <Line x1={4} y1={17} x2={20} y2={17} />
  </Svg>
);

// Water drop — outline (material-symbols water-drop-outline).
export const WaterDrop = ({ size = 24, color = '#000', sw = 1.8 }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinejoin="round">
    <Path d="M12 3.5c-3.5 4.2-6 7.2-6 10.5a6 6 0 0012 0c0-3.3-2.5-6.3-6-10.5z" />
  </Svg>
);
export const WaterDropFill = ({ size = 24, color = '#000' }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 3.5c-3.5 4.2-6 7.2-6 10.5a6 6 0 0012 0c0-3.3-2.5-6.3-6-10.5z" />
  </Svg>
);

export const Clock = ({ size = 24, color = '#000', sw = 1.8 }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round">
    <Circle cx={12} cy={12} r={8.5} />
    <Path d="M12 7.5v4.8l3 2" />
  </Svg>
);

export const History = ({ size = 24, color = '#000', sw = 1.8 }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3.5 12a8.5 8.5 0 108.5-8.5A8.5 8.5 0 005 7" />
    <Path d="M5 3.5V7h3.5" />
    <Path d="M12 7.5v4.8l3 2" />
  </Svg>
);

export const Check = ({ size = 24, color = '#fff', sw = 3 }: IP) => (
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

export const Mail = ({ size = 24, color = '#000', sw = 1.9 }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <Rect x={3} y={5.5} width={18} height={13} rx={2.5} />
    <Path d="M4 7l8 6 8-6" />
  </Svg>
);
export const Lock = ({ size = 24, color = '#000', sw = 1.9 }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <Rect x={5} y={11} width={14} height={9.5} rx={2.5} />
    <Path d="M8 11V8a4 4 0 018 0v3" />
  </Svg>
);

export const Bluetooth = ({ size = 24, color = '#fff', sw = 2.2 }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M7 8l10 8-5 4V4l5 4-10 8" />
  </Svg>
);

export const Edit = ({ size = 24, color = '#fff', sw = 2 }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 20l4-1L20 7l-3-3L5 16l-1 4z" />
  </Svg>
);
export const Phone = ({ size = 24, color = '#000', sw = 1.9 }: IP) => (
  <Svg width={px(size)} height={px(size)} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M6.5 4h-2A1.5 1.5 0 003 5.5C3 13 11 21 18.5 21A1.5 1.5 0 0020 19.5v-2a1 1 0 00-.8-1l-3-.6a1 1 0 00-1 .3l-1.2 1.2a13 13 0 01-5.6-5.6l1.2-1.2a1 1 0 00.3-1l-.6-3a1 1 0 00-1-.8z" />
  </Svg>
);
