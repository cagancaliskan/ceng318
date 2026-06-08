import type { Tab } from '../components/BottomNav';

// Maps a BottomNav tab id to its route name (used by screens that sit OUTSIDE the
// tab navigator — CustomCooking / History — to jump back into a tab).
export function tabRoute(t: Tab): 'Menu' | 'Cooking' | 'Profile' {
  return t === 'menu' ? 'Menu' : t === 'cooking' ? 'Cooking' : 'Profile';
}
