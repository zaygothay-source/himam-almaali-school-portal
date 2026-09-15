import { createFileRoute, Link } from "@tanstack/react-router";
import {
  announcements,
  assignments,
  daysUntil,
  exams,
  formatDate,
  gpa,
  profile,
  schedule,
  subjects,
} from "@/lib/portal-data";

export const Route = createFileRoute("/portal/")({
  component: DashboardPage,
});

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function DashboardPage() {
  const today = new Date();
  const todayName = dayNames[today.getDay()];
  const todayLessons = schedule.find((d) => d.day === todayName)?.lessons ?? schedule[0]?.lessons ?? [];
  const nextExam = exams[0];
  const upcoming = assignments.filter((a) => a.status === "upcoming").slice(0, 4);
  const nextExams = exams.slice(0, 3);
  const recentGrades = subjects.slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h1 className="text-2xl font-semibold text-foreground">Welcome back, {profile.name.split(" ")[0]}!</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {today.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link to="/portal/assignments" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
            View assignments
          </Link>
          <Link to="/portal/schedule" className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
            Today's timetable
          </Link>
          <Link to="/portal/exams" className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
            Exam schedule
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Overall GPA" value={gpa.toFixed(2)} hint="Out of 4.0" />
        <Stat label="Assignments due" value={String(assignments.filter((a) => a.status === "upcoming").length)} hint="This month" />
        <Stat label="Overdue" value={String(assignments.filter((a) => a.status === "overdue").length)} hint="Needs attention" />
        <Stat label="Next exam" value={nextExam ? `${daysUntil(nextExam.date)}d` : "—"} hint={nextExam?.subject ?? "None scheduled"} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Today's classes" link="/portal/schedule">
          <ul className="divide-y divide-border">
            {todayLessons.map((l) => (
              <li key={l.subject + l.start} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">{l.subject}</p>
                  <p className="text-muted-foreground">{l.teacher} · {l.room}</p>
                </div>
                <span className="text-muted-foreground">{l.start}–{l.end}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Upcoming assignments" link="/portal/assignments">
          <ul className="divide-y divide-border">
            {upcoming.map((a) => (
              <li key={a.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">{a.title}</p>
                  <p className="text-muted-foreground">{a.subject}</p>
                </div>
                <span className="text-muted-foreground">{formatDate(a.due)}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Upcoming exams" link="/portal/exams">
          <ul className="divide-y divide-border">
            {nextExams.map((e) => (
              <li key={e.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">{e.name}</p>
                  <p className="text-muted-foreground">{e.subject} · {e.location}</p>
                </div>
                <span className="text-muted-foreground">in {daysUntil(e.date)} days</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Recent grades" link="/portal/grades">
          <ul className="divide-y divide-border">
            {recentGrades.map((s) => (
              <li key={s.id} className="py-3 text-sm">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground">{s.name}</p>
                  <span className="font-medium text-primary">{s.grade} · {s.percentage}%</span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                  <div className="h-1.5 rounded-full bg-primary" style={{ width: `${s.percentage}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="School announcements">
        <ul className="divide-y divide-border">
          {announcements.map((n) => (
            <li key={n.id} className="py-3 text-sm">
              <div className="flex items-center justify-between">
                <p className="font-medium text-foreground">{n.title}</p>
                <span className="text-xs text-muted-foreground">{n.date}</span>
              </div>
              <p className="mt-1 text-muted-foreground">{n.body}</p>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function Panel({
  title,
  link,
  children,
}: {
  title: string;
  link?: "/portal/schedule" | "/portal/assignments" | "/portal/exams" | "/portal/grades";
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {link ? (
          <Link to={link} className="text-xs text-primary hover:opacity-80">
            View all
          </Link>
        ) : null}
      </div>
      <div className="mt-2">{children}</div>
    </section>
  );
}
