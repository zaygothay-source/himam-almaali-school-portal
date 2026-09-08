export type Subject = {
  id: string;
  name: string;
  teacher: string;
  grade: string;
  percentage: number;
  recent: { title: string; score: string }[];
};

export const subjects: Subject[] = [
  {
    id: "math",
    name: "Mathematics",
    teacher: "Ms. Halloran",
    grade: "A-",
    percentage: 91,
    recent: [
      { title: "Quadratics test", score: "92%" },
      { title: "Problem set 6", score: "88%" },
      { title: "Midterm", score: "94%" },
    ],
  },
  {
    id: "english",
    name: "English",
    teacher: "Mr. Adeyemi",
    grade: "B+",
    percentage: 87,
    recent: [
      { title: "Essay: The Tempest", score: "86%" },
      { title: "Poetry response", score: "90%" },
      { title: "Reading quiz 4", score: "84%" },
    ],
  },
  {
    id: "science",
    name: "Science",
    teacher: "Dr. Ferreira",
    grade: "A",
    percentage: 95,
    recent: [
      { title: "Lab report: Enzymes", score: "97%" },
      { title: "Unit 3 test", score: "93%" },
      { title: "Field study", score: "95%" },
    ],
  },
  {
    id: "history",
    name: "History",
    teacher: "Mrs. Okonkwo",
    grade: "B",
    percentage: 83,
    recent: [
      { title: "Source analysis", score: "81%" },
      { title: "Cold War quiz", score: "85%" },
      { title: "Debate brief", score: "83%" },
    ],
  },
  {
    id: "cs",
    name: "Computer Science",
    teacher: "Mr. Lindqvist",
    grade: "A",
    percentage: 96,
    recent: [
      { title: "Sorting project", score: "98%" },
      { title: "Recursion quiz", score: "94%" },
      { title: "Web app sprint", score: "96%" },
    ],
  },
  {
    id: "pe",
    name: "Physical Education",
    teacher: "Coach Byrne",
    grade: "A-",
    percentage: 90,
    recent: [
      { title: "Fitness assessment", score: "90%" },
      { title: "Team unit: Volleyball", score: "92%" },
      { title: "Participation", score: "88%" },
    ],
  },
];

export const gpa = 3.7;

export type AssignmentStatus = "upcoming" | "completed" | "overdue";

export type Assignment = {
  id: string;
  title: string;
  subject: string;
  due: string;
  status: AssignmentStatus;
  grade?: string;
  description: string;
};

export const assignments: Assignment[] = [
  {
    id: "a1",
    title: "Quadratic functions problem set",
    subject: "Mathematics",
    due: "2026-09-12",
    status: "upcoming",
    description:
      "Complete problems 1–24 in chapter 7. Show all working, including the discriminant for each root calculation.",
  },
  {
    id: "a2",
    title: "Essay: Power in The Tempest",
    subject: "English",
    due: "2026-09-15",
    status: "upcoming",
    description:
      "A 1,200-word analytical essay on how Shakespeare presents power and control. Use at least four quotations.",
  },
  {
    id: "a3",
    title: "Enzyme lab report",
    subject: "Science",
    due: "2026-09-04",
    status: "completed",
    grade: "97%",
    description:
      "Full write-up of the catalase practical: hypothesis, method, results table, graph, and evaluation.",
  },
  {
    id: "a4",
    title: "Cold War source analysis",
    subject: "History",
    due: "2026-09-02",
    status: "overdue",
    description:
      "Compare two contemporary sources on the Berlin Airlift and evaluate their reliability in 600 words.",
  },
  {
    id: "a5",
    title: "Sorting algorithms project",
    subject: "Computer Science",
    due: "2026-09-01",
    status: "completed",
    grade: "98%",
    description:
      "Implement bubble, merge, and quick sort, then benchmark them on datasets of 10, 1k, and 100k items.",
  },
  {
    id: "a6",
    title: "Fitness log — week 3",
    subject: "Physical Education",
    due: "2026-09-18",
    status: "upcoming",
    description: "Record three training sessions with duration, intensity, and a short reflection.",
  },
  {
    id: "a7",
    title: "Poetry response journal",
    subject: "English",
    due: "2026-08-28",
    status: "overdue",
    description: "Two-page journal responding to the anthology's war poetry selection.",
  },
];

export type Activity = {
  id: string;
  name: string;
  description: string;
  when: string;
  location: string;
  joined: boolean;
};

export const activities: Activity[] = [
  {
    id: "football",
    name: "Football Club",
    description: "Training, drills, and fixtures against neighbouring schools.",
    when: "Mondays & Thursdays, 16:00–17:30",
    location: "South Field",
    joined: true,
  },
  {
    id: "basketball",
    name: "Basketball Club",
    description: "Open-gym sessions and league practice for all ability levels.",
    when: "Tuesdays, 16:00–17:30",
    location: "Main Gym",
    joined: false,
  },
  {
    id: "coding",
    name: "Coding Club",
    description: "Build games, apps, and robots; termly hackathon in the studio.",
    when: "Wednesdays, 15:45–17:00",
    location: "Lab 2",
    joined: true,
  },
  {
    id: "art",
    name: "Art Club",
    description: "Painting, printmaking, and ceramics with open studio time.",
    when: "Thursdays, 15:45–17:15",
    location: "Art Studio",
    joined: false,
  },
  {
    id: "debate",
    name: "Debate Club",
    description: "Weekly motions, British Parliamentary format, regional competitions.",
    when: "Fridays, 15:30–16:45",
    location: "Room 114",
    joined: false,
  },
  {
    id: "council",
    name: "Student Council",
    description: "Represent your year group and shape school life and events.",
    when: "Alternate Mondays, 12:30",
    location: "The Hall",
    joined: true,
  },
];

export type Exam = {
  id: string;
  subject: string;
  name: string;
  date: string;
  time: string;
  location: string;
  topics: string[];
};

export const exams: Exam[] = [
  {
    id: "e1",
    subject: "Mathematics",
    name: "Autumn Term Assessment",
    date: "2026-09-21",
    time: "09:00 – 10:30",
    location: "The Hall",
    topics: ["Quadratics", "Sequences", "Trigonometry", "Graph transformations"],
  },
  {
    id: "e2",
    subject: "Science",
    name: "Biology Unit 3 Exam",
    date: "2026-09-24",
    time: "11:00 – 12:15",
    location: "Lab 1",
    topics: ["Enzymes", "Respiration", "Transport in cells"],
  },
  {
    id: "e3",
    subject: "History",
    name: "Cold War Paper",
    date: "2026-10-02",
    time: "13:30 – 15:00",
    location: "Room 114",
    topics: ["Berlin Airlift", "Cuban Missile Crisis", "Détente"],
  },
  {
    id: "e4",
    subject: "Computer Science",
    name: "Algorithms Practical",
    date: "2026-10-09",
    time: "09:30 – 11:30",
    location: "Lab 2",
    topics: ["Sorting", "Searching", "Big-O notation", "Recursion"],
  },
];

export type Lesson = {
  subject: string;
  teacher: string;
  room: string;
  start: string;
  end: string;
};

export const schedule: { day: string; lessons: Lesson[] }[] = [
  {
    day: "Monday",
    lessons: [
      { subject: "Mathematics", teacher: "Ms. Halloran", room: "R201", start: "08:45", end: "09:45" },
      { subject: "English", teacher: "Mr. Adeyemi", room: "R108", start: "10:00", end: "11:00" },
      { subject: "Science", teacher: "Dr. Ferreira", room: "Lab 1", start: "11:15", end: "12:30" },
      { subject: "History", teacher: "Mrs. Okonkwo", room: "R114", start: "13:30", end: "14:30" },
    ],
  },
  {
    day: "Tuesday",
    lessons: [
      { subject: "Computer Science", teacher: "Mr. Lindqvist", room: "Lab 2", start: "08:45", end: "10:00" },
      { subject: "Mathematics", teacher: "Ms. Halloran", room: "R201", start: "10:15", end: "11:15" },
      { subject: "Physical Education", teacher: "Coach Byrne", room: "Main Gym", start: "11:30", end: "12:30" },
      { subject: "English", teacher: "Mr. Adeyemi", room: "R108", start: "13:30", end: "14:30" },
    ],
  },
  {
    day: "Wednesday",
    lessons: [
      { subject: "Science", teacher: "Dr. Ferreira", room: "Lab 1", start: "08:45", end: "10:00" },
      { subject: "History", teacher: "Mrs. Okonkwo", room: "R114", start: "10:15", end: "11:15" },
      { subject: "Mathematics", teacher: "Ms. Halloran", room: "R201", start: "11:30", end: "12:30" },
      { subject: "Coding Club", teacher: "Mr. Lindqvist", room: "Lab 2", start: "15:45", end: "17:00" },
    ],
  },
  {
    day: "Thursday",
    lessons: [
      { subject: "English", teacher: "Mr. Adeyemi", room: "R108", start: "08:45", end: "09:45" },
      { subject: "Computer Science", teacher: "Mr. Lindqvist", room: "Lab 2", start: "10:00", end: "11:15" },
      { subject: "Science", teacher: "Dr. Ferreira", room: "Lab 1", start: "11:30", end: "12:30" },
      { subject: "Physical Education", teacher: "Coach Byrne", room: "South Field", start: "13:30", end: "14:45" },
    ],
  },
  {
    day: "Friday",
    lessons: [
      { subject: "History", teacher: "Mrs. Okonkwo", room: "R114", start: "08:45", end: "09:45" },
      { subject: "Mathematics", teacher: "Ms. Halloran", room: "R201", start: "10:00", end: "11:00" },
      { subject: "English", teacher: "Mr. Adeyemi", room: "R108", start: "11:15", end: "12:15" },
      { subject: "Debate Club", teacher: "Mrs. Okonkwo", room: "R114", start: "15:30", end: "16:45" },
    ],
  },
];

export const announcements = [
  {
    id: "n1",
    title: "Winter concert tickets now open",
    body: "Reserve seats for the 24 October ensemble performance in the Hall.",
    date: "Sep 7",
  },
  {
    id: "n2",
    title: "Library extended hours",
    body: "The library is open until 18:00 on weekdays through exam season.",
    date: "Sep 5",
  },
  {
    id: "n3",
    title: "Photo day is Friday",
    body: "Full school uniform required. Sittings run through periods 1 and 2.",
    date: "Sep 3",
  },
];

export const profile = {
  name: "Alex User",
  studentId: "ALD-2026-0148",
  year: "Grade 11",
  email: "alex.user@aldridge.edu",
  className: "11-B",
  homeroom: "Mrs. Okonkwo",
};

export function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function daysUntil(iso: string) {
  const target = new Date(iso + "T00:00:00").getTime();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return Math.round((target - today) / 86400000);
}
