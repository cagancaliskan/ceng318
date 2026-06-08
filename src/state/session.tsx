import React, { createContext, useContext, useState, useMemo } from 'react';

export type Doneness = 'Rafadan' | 'Kayısı' | 'Katı';

type Session = {
  count: number;
  setCount: (n: number) => void;
  doneness: Doneness;
  setDoneness: (d: Doneness) => void;
  lowWater: boolean;
  water: string;
  time: string;
  refillWater: () => void;
  customMin: number;
  customSec: number;
  setCustom: (m: number, s: number) => void;
};

const Ctx = createContext<Session | null>(null);

// Holds the live cooking session. Defaults mirror the design's first Menu artboard
// (4 eggs, low water) so the Başlat → Su Uyarısı → (refill) → Cooking flow is real.
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(4);
  const [doneness, setDoneness] = useState<Doneness>('Rafadan');
  const [lowWater, setLowWater] = useState(true);
  const [water, setWater] = useState('~5ml');
  const [time] = useState('8 dakika');
  const [customMin, setCM] = useState(8);
  const [customSec, setCS] = useState(30);

  const value = useMemo<Session>(
    () => ({
      count,
      setCount,
      doneness,
      setDoneness,
      lowWater,
      water,
      time,
      refillWater: () => {
        setLowWater(false);
        setWater('~65ml');
      },
      customMin,
      customSec,
      setCustom: (m: number, s: number) => {
        setCM(m);
        setCS(s);
      },
    }),
    [count, doneness, lowWater, water, time, customMin, customSec],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useSession = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useSession must be used within SessionProvider');
  return c;
};
