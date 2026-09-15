import { useSyncExternalStore } from "react";

export type EditableContent = {
  loginTitle: string;
  loginDescription: string;
  dashboardGreeting: string;
};

export type DashboardPanel = "classes" | "grades" | "exams" | "attendance";

export type PreviewRole = "student" | "teacher" | "principal" | "organizer";

export type EditableElement = {
  id: string;
  label: string;
  text: string;
  fontSize: number;
  x: number;
  y: number;
  background: string;
  color: string;
  borderRadius: number;
  padding: number;
};

type EditorState = {
  content: EditableContent;
  dashboardOrder: DashboardPanel[];
  elements: Record<PreviewRole, Record<string, EditableElement>>;
};
const KEY = "himam-almaali-editor-content-v1";

const element = (role: PreviewRole, id: string, label: string, text: string, overrides: Partial<EditableElement> = {}): EditableElement => ({
  id: `${role}-${id}`,
  label,
  text,
  fontSize: 14,
  x: 0,
  y: 0,
  background: "var(--card)",
  color: "var(--foreground)",
  borderRadius: 12,
  padding: 16,
  ...overrides,
});

const defaults: EditorState = {
  content: {
    loginTitle: "Himam Almaali",
    loginDescription: "Student portal sign in",
    dashboardGreeting: "Welcome back, {name}!",
  },
  dashboardOrder: ["classes", "grades", "exams", "attendance"],
  elements: {
    student: {
      "student-title": element("student", "title", "Page title", "Student dashboard", { fontSize: 24, background: "transparent", padding: 4 }),
      "student-welcome": element("student", "welcome", "Welcome card", "Welcome back, Student!", { fontSize: 18, background: "var(--primary)", color: "var(--primary-foreground)", padding: 20 }),
      "student-grades": element("student", "grades", "Grades card", "Recent grades · 16/20", { background: "var(--card-2)" }),
      "student-attendance": element("student", "attendance", "Attendance card", "Days missed · 3", { background: "var(--card-2)" }),
      "student-classes": element("student", "classes", "Classes card", "Today's classes · Mathematics", { background: "var(--card-2)" }),
    },
    teacher: {
      "teacher-title": element("teacher", "title", "Page title", "Teacher dashboard", { fontSize: 24, background: "transparent", padding: 4 }),
      "teacher-welcome": element("teacher", "welcome", "Welcome card", "Good morning, Teacher", { fontSize: 18, background: "var(--primary)", color: "var(--primary-foreground)", padding: 20 }),
      "teacher-class": element("teacher", "class", "Class card", "My class · 10B", { background: "var(--card-2)" }),
      "teacher-gradebook": element("teacher", "gradebook", "Gradebook card", "Gradebook · Mathematics", { background: "var(--card-2)" }),
      "teacher-students": element("teacher", "students", "Students card", "Students · 2 assigned", { background: "var(--card-2)" }),
    },
    principal: {
      "principal-title": element("principal", "title", "Page title", "Principal overview", { fontSize: 24, background: "transparent", padding: 4 }),
      "principal-welcome": element("principal", "welcome", "Welcome card", "School overview", { fontSize: 18, background: "var(--primary)", color: "var(--primary-foreground)", padding: 20 }),
      "principal-students": element("principal", "students", "Students card", "Students · 10 enrolled", { background: "var(--card-2)" }),
      "principal-announcements": element("principal", "announcements", "Announcements card", "Announcements · 2 published", { background: "var(--card-2)" }),
      "principal-results": element("principal", "results", "Results card", "Exam results · View all", { background: "var(--card-2)" }),
    },
    organizer: {
      "organizer-title": element("organizer", "title", "Page title", "Activities organizer", { fontSize: 24, background: "transparent", padding: 4 }),
      "organizer-welcome": element("organizer", "welcome", "Welcome card", "Plan something great", { fontSize: 18, background: "var(--primary)", color: "var(--primary-foreground)", padding: 20 }),
      "organizer-football": element("organizer", "football", "Football card", "Football club · 12 joined", { background: "var(--card-2)" }),
      "organizer-basketball": element("organizer", "basketball", "Basketball card", "Basketball · 8 joined", { background: "var(--card-2)" }),
      "organizer-requests": element("organizer", "requests", "Requests card", "Join requests · 4 pending", { background: "var(--card-2)" }),
    },
  },
};

let state: EditorState = defaults;
let loaded = false;
const listeners = new Set<() => void>();
const history: EditorState[] = [];

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const saved = JSON.parse(window.localStorage.getItem(KEY) ?? "null") as Partial<EditorState> | null;
    state = {
      content: { ...defaults.content, ...(saved?.content ?? {}) },
      dashboardOrder: saved?.dashboardOrder?.length ? saved.dashboardOrder : defaults.dashboardOrder,
      elements: {
        student: { ...defaults.elements.student, ...(saved?.elements?.student ?? {}) },
        teacher: { ...defaults.elements.teacher, ...(saved?.elements?.teacher ?? {}) },
        principal: { ...defaults.elements.principal, ...(saved?.elements?.principal ?? {}) },
        organizer: { ...defaults.elements.organizer, ...(saved?.elements?.organizer ?? {}) },
      },
    };
  } catch {
    state = defaults;
  }
}

export function getEditorState() { load(); return state; }
export function useEditorState() { return useSyncExternalStore((cb) => { listeners.add(cb); return () => listeners.delete(cb); }, getEditorState, () => defaults); }

function commit(next: EditorState) {
  history.push(state);
  state = next;
  window.localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((listener) => listener());
}

export function updateEditorContent(content: Partial<EditableContent>) { commit({ ...state, content: { ...state.content, ...content } }); }

export function updateEditorElement(role: PreviewRole, id: string, patch: Partial<EditableElement>) {
  const current = state.elements[role]?.[id];
  if (!current) return;
  commit({
    ...state,
    elements: {
      ...state.elements,
      [role]: {
        ...state.elements[role],
        [id]: { ...current, ...patch },
      },
    },
  });
}

export function moveDashboardPanel(panel: DashboardPanel, direction: -1 | 1) {
  const order = [...state.dashboardOrder];
  const index = order.indexOf(panel);
  const nextIndex = index + direction;
  if (index < 0 || nextIndex < 0 || nextIndex >= order.length) return;
  [order[index], order[nextIndex]] = [order[nextIndex], order[index]];
  commit({ ...state, dashboardOrder: order });
}

export function undoEditorChange() {
  const previous = history.pop();
  if (!previous) return;
  state = previous;
  window.localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((listener) => listener());
}
