import { useSyncExternalStore } from "react";

const KEY = "aldridge-school-store";

export type StudentAccount = {
  id: string;
  name: string;
  username: string;
  password: string;
  classGroup: string;
  year: string;
};

export type PublishedWork = {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  type: "Homework" | "Assignment";
  instructions: string;
  publishedBy: string;
  publishedAt: string;
};

export type SchoolStore = {
  students: StudentAccount[];
  published: PublishedWork[];
};

const seed: SchoolStore = {
  students: [
    {
      id: "s1",
      name: "Alex Rivera",
      username: "User",
      password: "password",
      classGroup: "10B",
      year: "Year 10",
    },
    {
      id: "s2",
      name: "Priya Nair",
      username: "priya.nair",
      password: "student123",
      classGroup: "10B",
      year: "Year 10",
    },
    {
      id: "s3",
      name: "Tomas Lindqvist",
      username: "tomas.l",
      password: "student123",
      classGroup: "10A",
      year: "Year 10",
    },
    {
      id: "s4",
      name: "Jade Okafor",
      username: "jade.o",
      password: "student123",
      classGroup: "11C",
      year: "Year 11",
    },
  ],
  published: [
    {
      id: "p1",
      title: "Quadratic equations worksheet",
      subject: "Mathematics",
      dueDate: "2026-09-19",
      type: "Homework",
      instructions: "Complete questions 1–18 in the worksheet and show all working.",
      publishedBy: "Admin",
      publishedAt: "2026-09-14",
    },
    {
      id: "p2",
      title: "Persuasive essay draft",
      subject: "English",
      dueDate: "2026-09-22",
      type: "Assignment",
      instructions: "Write a 700-word first draft on a topic of your choice. Bring a printed copy.",
      publishedBy: "Admin2",
      publishedAt: "2026-09-15",
    },
  ],
};

let cache: SchoolStore | null = null;
const listeners = new Set<() => void>();

function persist(next: SchoolStore) {
  cache = next;
  window.localStorage.setItem(KEY, JSON.stringify(next));
  listeners.forEach((l) => l());
}

export function getStore(): SchoolStore {
  if (typeof window === "undefined") return seed;
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as SchoolStore) : seed;
  } catch {
    cache = seed;
  }
  return cache;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useSchoolStore(): SchoolStore {
  return useSyncExternalStore(subscribe, getStore, () => seed);
}

export function addStudent(input: Omit<StudentAccount, "id">) {
  const store = getStore();
  if (store.students.some((s) => s.username.toLowerCase() === input.username.trim().toLowerCase())) {
    return { ok: false as const, error: "That username is already taken." };
  }
  persist({
    ...store,
    students: [...store.students, { ...input, username: input.username.trim(), id: `s${Date.now()}` }],
  });
  return { ok: true as const };
}

export function removeStudent(id: string) {
  const store = getStore();
  persist({ ...store, students: store.students.filter((s) => s.id !== id) });
}

export function publishWork(input: Omit<PublishedWork, "id" | "publishedAt">) {
  const store = getStore();
  persist({
    ...store,
    published: [
      { ...input, id: `p${Date.now()}`, publishedAt: new Date().toISOString().slice(0, 10) },
      ...store.published,
    ],
  });
}

export function removeWork(id: string) {
  const store = getStore();
  persist({ ...store, published: store.published.filter((p) => p.id !== id) });
}
