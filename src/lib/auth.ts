import { useSyncExternalStore } from "react";
import { getStore } from "@/lib/school-store";

const KEY = "himam-almaali-portal-session-v2";

export type Role = "student" | "teacher" | "principal" | "organizer";
export type Session = { username: string; role: Role; name: string } | null;

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

export const PRINCIPAL = { username: "Principal", password: "Principal", name: "Principal" };
export const ORGANIZER = { username: "Organizer", password: "Organizer", name: "Activities Organizer" };
export const EDITOR = { username: "Aztx", password: "Aztx", name: "Site Editor" };

export function login(username: string, password: string): Session {
  const u = username.trim().toLowerCase();
  const p = password.trim();

  if (PRINCIPAL.username.toLowerCase() === u && PRINCIPAL.password === p) {
    const session: Session = { username: PRINCIPAL.username, role: "principal", name: PRINCIPAL.name };
    window.localStorage.setItem(KEY, JSON.stringify(session));
    emit();
    return session;
  }

  if (ORGANIZER.username.toLowerCase() === u && ORGANIZER.password === p) {
    const session: Session = { username: ORGANIZER.username, role: "organizer", name: ORGANIZER.name };
    window.localStorage.setItem(KEY, JSON.stringify(session));
    emit();
    return session;
  }

  if (EDITOR.username.toLowerCase() === u && EDITOR.password.toLowerCase() === p.toLowerCase()) {
    const session: Session = { username: EDITOR.username, role: "student", name: EDITOR.name };
    window.localStorage.setItem(KEY, JSON.stringify(session));
    emit();
    return session;
  }

  const teacher = getStore().teachers.find((t) => t.username.toLowerCase() === u && t.password === p);
  if (teacher) {
    const session: Session = { username: teacher.username, role: "teacher", name: teacher.name };
    window.localStorage.setItem(KEY, JSON.stringify(session));
    emit();
    return session;
  }

  const student = getStore().students.find(
    (s) => s.username.toLowerCase() === u && s.password === p,
  );
  if (student) {
    const session: Session = { username: student.username, role: "student", name: student.name };
    window.localStorage.setItem(KEY, JSON.stringify(session));
    emit();
    return session;
  }

  return null;
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
