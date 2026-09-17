import { useSyncExternalStore } from "react";

// Bump this when the demo needs a clean slate across browsers. The previous
// client-side data remains in old storage keys and can still be recovered from
// the pre-reset backup if needed.
const KEY = "himam-almaali-school-store-v8";

export const SUBJECTS = ["Mathematics", "English", "Science", "History", "Computer Science", "Physical Education"] as const;
export type Subject = (typeof SUBJECTS)[number];

function createScores(seedValue: number): Record<Subject, number> {
  return Object.fromEntries(SUBJECTS.map((subject, index) => [subject, 8 + ((seedValue * 7 + index * 5) % 13)])) as Record<Subject, number>;
}

export type StudentAccount = {
  id: string;
  name: string;
  username: string;
  password: string;
  classGroup: string;
  year: string;
  teacherUsername: string;
  scores: Record<Subject, number>;
};

export type TeacherAccount = {
  username: string;
  password: string;
  name: string;
  subject: Subject;
};

export type SchoolAnnouncement = { id: string; title: string; body: string; date: string };
export type SchoolActivity = { id: string; name: string; description: string; when: string; location: string; joined: boolean };
export type ActivityRequest = { id: string; activityId: string; activityName: string; fullName: string; studentUsername: string; status: "pending" | "accepted" | "denied" };

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
  teachers: TeacherAccount[];
  published: PublishedWork[];
  announcements: SchoolAnnouncement[];
  activities: SchoolActivity[];
  activityRequests: ActivityRequest[];
};

const seed: SchoolStore = {
  students: [
    {
      id: "s1",
      name: "Alex Rivera", username: "Student", password: "Student",
      classGroup: "10B",
      year: "Year 10",
      teacherUsername: "Teacher", scores: createScores(1),
    },
    {
      id: "s2", name: "Priya Nair", username: "Student1", password: "Student1",
      classGroup: "10B", year: "Year 10", teacherUsername: "Teacher", scores: createScores(2),
    },
    {
      id: "s3", name: "Tomas Lindqvist", username: "Student2", password: "Student2",
      classGroup: "10A", year: "Year 10", teacherUsername: "Teacher1", scores: createScores(3),
    },
    {
      id: "s4", name: "Jade Okafor", username: "Student3", password: "Student3",
      classGroup: "10A", year: "Year 10", teacherUsername: "Teacher1", scores: createScores(4),
    },
    { id: "s5", name: "Jade Okafor", username: "Student4", password: "Student4", classGroup: "11C", year: "Year 11", teacherUsername: "Teacher2", scores: createScores(5) },
    { id: "s6", name: "Noah Bennett", username: "Student5", password: "Student5", classGroup: "11C", year: "Year 11", teacherUsername: "Teacher2", scores: createScores(6) },
    { id: "s7", name: "Maya Chen", username: "Student6", password: "Student6", classGroup: "11B", year: "Year 11", teacherUsername: "Teacher3", scores: createScores(7) },
    { id: "s8", name: "Ethan Okoro", username: "Student7", password: "Student7", classGroup: "11B", year: "Year 11", teacherUsername: "Teacher3", scores: createScores(8) },
    { id: "s9", name: "Sofia Martins", username: "Student8", password: "Student8", classGroup: "12A", year: "Year 12", teacherUsername: "Teacher4", scores: createScores(9) },
    { id: "s10", name: "Leo Williams", username: "Student9", password: "Student9", classGroup: "12A", year: "Year 12", teacherUsername: "Teacher4", scores: createScores(10) },
  ],
  teachers: [
    { username: "Teacher", password: "Teacher", name: "Ms. Halloran", subject: "Mathematics" },
    { username: "Teacher1", password: "Teacher1", name: "Mr. Adeyemi", subject: "English" },
    { username: "Teacher2", password: "Teacher2", name: "Dr. Ferreira", subject: "Science" },
    { username: "Teacher3", password: "Teacher3", name: "Mrs. Okonkwo", subject: "History" },
    { username: "Teacher4", password: "Teacher4", name: "Mr. Lindqvist", subject: "Computer Science" },
  ],
  published: [
    {
      id: "p1",
      title: "Quadratic equations worksheet",
      subject: "Mathematics",
      dueDate: "2026-09-19",
      type: "Homework",
      instructions: "Complete questions 1–18 in the worksheet and show all working.",
      publishedBy: "Teacher",
      publishedAt: "2026-09-14",
    },
    {
      id: "p2",
      title: "Persuasive essay draft",
      subject: "English",
      dueDate: "2026-09-22",
      type: "Assignment",
      instructions: "Write a 700-word first draft on a topic of your choice. Bring a printed copy.",
      publishedBy: "Teacher2",
      publishedAt: "2026-09-15",
    },
  ],
  announcements: [],
  activities: [],
  activityRequests: [],
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

export function addStudent(input: Omit<StudentAccount, "id" | "scores">) {
  const store = getStore();
  if (store.students.some((s) => s.username.toLowerCase() === input.username.trim().toLowerCase())) {
    return { ok: false as const, error: "That username is already taken." };
  }
  persist({
    ...store,
    students: [...store.students, { ...input, username: input.username.trim(), id: `s${Date.now()}`, scores: createScores(Date.now()) }],
  });
  return { ok: true as const };
}

export function updateStudent(id: string, input: Pick<StudentAccount, "name" | "classGroup" | "teacherUsername">) {
  const store = getStore();
  persist({
    ...store,
    students: store.students.map((student) => (student.id === id ? { ...student, ...input } : student)),
  });
}

export function updateTeacher(username: string, name: string) {
  const store = getStore();
  persist({
    ...store,
    teachers: store.teachers.map((teacher) => (teacher.username === username ? { ...teacher, name } : teacher)),
  });
}

export function updateStudentScore(id: string, subject: Subject, score: number) {
  const store = getStore();
  persist({
    ...store,
    students: store.students.map((student) =>
      student.id === id ? { ...student, scores: { ...student.scores, [subject]: score } } : student,
    ),
  });
}

export function addAnnouncement(input: Pick<SchoolAnnouncement, "title" | "body">) {
  const store = getStore();
  persist({ ...store, announcements: [{ ...input, id: `n${Date.now()}`, date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" }) }, ...store.announcements] });
}

export function addActivity(input: Omit<SchoolActivity, "id" | "joined">) {
  const store = getStore();
  persist({ ...store, activities: [...store.activities, { ...input, id: `a${Date.now()}`, joined: false }] });
}

export function submitActivityRequest(input: Omit<ActivityRequest, "id" | "status">) {
  const store = getStore();
  if (store.activityRequests.some((request) => request.activityId === input.activityId && request.studentUsername === input.studentUsername && request.status !== "denied")) return;
  persist({ ...store, activityRequests: [...store.activityRequests, { ...input, id: `r${Date.now()}`, status: "pending" }] });
}

export function decideActivityRequest(id: string, status: "accepted" | "denied") {
  const store = getStore();
  persist({ ...store, activityRequests: store.activityRequests.map((request) => request.id === id ? { ...request, status } : request) });
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
