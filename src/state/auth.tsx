import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// NOTE: demo-only auth. Accounts (incl. plaintext passwords) live in AsyncStorage —
// fine for a course project, NOT secure for production (would need hashing).
export type User = { name: string; email: string; password: string; avatarUri?: string };
type Result = { ok: boolean; error?: ErrCode };
export type ErrCode = 'empty' | 'invalid_email' | 'short' | 'email_taken' | 'bad_credentials' | 'not_found' | 'mismatch';

const ADMIN: User = { name: 'Admin', email: 'admin@eggchef.com', password: 'admin123' };
const STORAGE_KEY = '@eggchef/users';
const MIN_PW = 4;

const norm = (e: string) => e.trim().toLowerCase();
const emailOk = (e: string) => /^\S+@\S+\.\S+$/.test(e.trim());

// Maps an error code to a localized message (screens pass their `L`).
export const authErr = (code: ErrCode | undefined, L: (tr: string, en: string) => string): string => {
  switch (code) {
    case 'empty': return L('Lütfen tüm alanları doldurun.', 'Please fill in all fields.');
    case 'invalid_email': return L('Geçerli bir e-posta girin.', 'Enter a valid email address.');
    case 'short': return L(`Şifre en az ${MIN_PW} karakter olmalı.`, `Password must be at least ${MIN_PW} characters.`);
    case 'email_taken': return L('Bu e-posta zaten kayıtlı.', 'This email is already registered.');
    case 'bad_credentials': return L('E-posta veya şifre hatalı.', 'Incorrect email or password.');
    case 'not_found': return L('Bu e-postayla kayıtlı hesap yok.', 'No account found for this email.');
    case 'mismatch': return L('Şifreler eşleşmiyor.', 'Passwords do not match.');
    default: return L('Bir hata oluştu.', 'Something went wrong.');
  }
};

type Auth = {
  ready: boolean;
  currentUser: User | null;
  signUp: (name: string, email: string, password: string) => Result;
  logIn: (email: string, password: string) => Result;
  logOut: () => void;
  resetPassword: (email: string, newPassword: string) => Result;
  setAvatar: (uri: string) => void;
};

const Ctx = createContext<Auth | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([ADMIN]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  // load persisted accounts on launch (always seed the admin account)
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        let list: User[] = raw ? JSON.parse(raw) : [];
        if (!list.some((u) => norm(u.email) === norm(ADMIN.email))) list = [ADMIN, ...list];
        setUsers(list);
      } catch {
        setUsers([ADMIN]);
      }
      setReady(true);
    })();
  }, []);

  // persist whenever the account list changes (after initial load)
  useEffect(() => {
    if (ready) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(users)).catch(() => {});
  }, [users, ready]);

  const value = useMemo<Auth>(
    () => ({
      ready,
      currentUser,
      signUp: (name, email, password) => {
        if (!name.trim() || !email.trim() || !password) return { ok: false, error: 'empty' };
        if (!emailOk(email)) return { ok: false, error: 'invalid_email' };
        if (password.length < MIN_PW) return { ok: false, error: 'short' };
        if (users.some((u) => norm(u.email) === norm(email))) return { ok: false, error: 'email_taken' };
        const u: User = { name: name.trim(), email: norm(email), password };
        setUsers((prev) => [...prev, u]);
        setCurrentUser(u);
        return { ok: true };
      },
      logIn: (email, password) => {
        if (!email.trim() || !password) return { ok: false, error: 'empty' };
        const u = users.find((u) => norm(u.email) === norm(email) && u.password === password);
        if (!u) return { ok: false, error: 'bad_credentials' };
        setCurrentUser(u);
        return { ok: true };
      },
      logOut: () => setCurrentUser(null),
      resetPassword: (email, newPassword) => {
        if (!email.trim() || !newPassword) return { ok: false, error: 'empty' };
        if (!emailOk(email)) return { ok: false, error: 'invalid_email' };
        if (newPassword.length < MIN_PW) return { ok: false, error: 'short' };
        const e = norm(email);
        if (!users.some((u) => norm(u.email) === e)) return { ok: false, error: 'not_found' };
        setUsers((prev) => prev.map((u) => (norm(u.email) === e ? { ...u, password: newPassword } : u)));
        return { ok: true };
      },
      setAvatar: (uri) => {
        if (!currentUser) return;
        const e = norm(currentUser.email);
        setCurrentUser({ ...currentUser, avatarUri: uri });
        setUsers((prev) => prev.map((u) => (norm(u.email) === e ? { ...u, avatarUri: uri } : u)));
      },
    }),
    [ready, currentUser, users],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth must be used within AuthProvider');
  return c;
};
