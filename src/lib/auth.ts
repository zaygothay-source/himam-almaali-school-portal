import { useSyncExternalStore } from "react";
import { getStore } from "@/lib/school-store";

const KEY = "aldridge-portal-session";

export type Role = "student" | "teacher";
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

export const DEMO_USER = "User";
export const DEMO_PASSWORD = "password";

export const TEACHERS: { username: string; password: string; name: string }[] = [
  { username: "Admin", password: "Admin", name: "Ms. Halloran" },
  { username: "Admin2", password: "Admin2", name: "Mr. Adeyemi" },
  { username: "Admin3", password: "Admin3", name: "Dr. Ferreira" },
];

export function login(username: string, password: string): Session {
  const u = username.trim().toLowerCase();

  const teacher = TEACHERS.find((t) => t.username.toLowerCase() === u && t.password === password);
  if (teacher) {
    const session: Session = { username: teacher.username, role: "teacher", name: teacher.name };
    window.localStorage.setItem(KEY, JSON.stringify(session));
    emit();
    return session;
  }

  const student = getStore().students.find(
    (s) => s.username.toLowerCase() === u && s.password === password,
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
