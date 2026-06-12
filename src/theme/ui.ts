import { useSession } from '../state/session';
import { lightC, darkC, Palette } from './colors';

// One hook for runtime theme + language. Used as `const { C, L } = useUI();` at the
// top of a component: the local `C` shadows the imported light `C`, so every `C.x`
// in the component body resolves to the active palette with no other edits. `L(tr, en)`
// returns the string for the current language.
export function useUI(): { C: Palette; L: (tr: string, en: string) => string; theme: 'light' | 'dark' } {
  const { theme, lang } = useSession();
  const C = theme === 'dark' ? darkC : lightC;
  const L = (tr: string, en: string) => (lang === 'en' ? en : tr);
  return { C, L, theme };
}
