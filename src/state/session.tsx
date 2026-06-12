import React, { createContext, useContext, useState, useMemo } from 'react';

export type Doneness = 'Rafadan' | 'Kayısı' | 'Katı';

// Cook duration per doneness, in minutes (Rafadan soft → Katı hard).
const DONENESS_MIN: Record<Doneness, number> = { Rafadan: 6, Kayısı: 8, Katı: 10 };

type Session = {
  count: number; // derived: number of selected eggs
  selectedEggs: boolean[]; // per-position on/off (6 slots)
  toggleEgg: (i: number) => void;
  // app-wide preferences (Profile)
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  lang: 'tr' | 'en';
  toggleLang: () => void;
  doneness: Doneness;
  setDoneness: (d: Doneness) => void;
  lowWater: boolean;
  refillWater: () => void;
  water: string;
  timeLabel: string; // "8 Dakika", derived from doneness
  durationSec: number; // doneness duration in seconds
  customMin: number;
  customSec: number;
  setCustom: (m: number, s: number) => void;
  // active cook (a cook only runs once explicitly started)
  cookActive: boolean;
  cookTotal: number; // seconds
  cookStartedAt: number; // ms epoch
  startCook: (totalSec: number) => void;
  stopCook: () => void;
};

const Ctx = createContext<Session | null>(null);

// The cooking timer lives here (not in the screen) so visiting the Cooking tab
// never auto-starts a cook, and an in-progress cook survives tab switches.
export function SessionProvider({ children }: { children: React.ReactNode }) {
  // Each egg slot is independently on/off; tapping a slot toggles it (positions matter).
  const [selectedEggs, setSelectedEggs] = useState<boolean[]>([true, true, true, false, false, false]);
  const count = selectedEggs.filter(Boolean).length;
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [lang, setLang] = useState<'tr' | 'en'>('tr');
  const [doneness, setDoneness] = useState<Doneness>('Rafadan');
  const [lowWater, setLowWater] = useState(true);
  const [customMin, setCM] = useState(7);
  const [customSec, setCS] = useState(45);
  const [cook, setCook] = useState({ active: false, total: 0, startedAt: 0 });

  const durationSec = DONENESS_MIN[doneness] * 60;

  const value = useMemo<Session>(
    () => ({
      count,
      selectedEggs,
      toggleEgg: (i: number) =>
        setSelectedEggs((prev) => {
          const next = prev.map((v, idx) => (idx === i ? !v : v));
          return next.some(Boolean) ? next : prev; // always keep at least 1 egg
        }),
      theme,
      toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
      lang,
      toggleLang: () => setLang((l) => (l === 'tr' ? 'en' : 'tr')),
      doneness,
      setDoneness,
      lowWater,
      refillWater: () => setLowWater(false),
      water: '~65 ml',
      timeLabel: `${DONENESS_MIN[doneness]} ${lang === 'en' ? 'Minutes' : 'Dakika'}`,
      durationSec,
      customMin,
      customSec,
      setCustom: (m, s) => {
        setCM(m);
        setCS(s);
      },
      cookActive: cook.active,
      cookTotal: cook.total,
      cookStartedAt: cook.startedAt,
      startCook: (totalSec) => setCook({ active: true, total: totalSec, startedAt: Date.now() }),
      stopCook: () => setCook({ active: false, total: 0, startedAt: 0 }),
    }),
    [selectedEggs, count, theme, lang, doneness, lowWater, customMin, customSec, cook, durationSec],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useSession = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useSession must be used within SessionProvider');
  return c;
};
