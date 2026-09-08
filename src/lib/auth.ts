import { useSyncExternalStore } from "react";

const KEY = "aldridge-portal-session";

export type Session = { username: string } | null;

let cached: Session = null;
let cachedRaw: string | null = null;
const listeners = new Set<() => void>();

function read(): Session {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cached = raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      cached = null;
    }
  }
  return cached;
}

function emit() {
  listeners.forEach((l) => l());
}

export function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

export const DEMO_USER = "User";
export const DEMO_PASSWORD = "password";

export function login(username: string, password: string): boolean {
  if (username.trim().toLowerCase() !== DEMO_USER.toLowerCase() || password !== DEMO_PASSWORD) {
    return false;
  }
  window.localStorage.setItem(KEY, JSON.stringify({ username: DEMO_USER }));
  emit();
  return true;
}

export function logout() {
  window.localStorage.removeItem(KEY);
  emit();
}

export function useSession() {
  return useSyncExternalStore(
    subscribe,
    () => read(),
    () => null,
  );
}

export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
