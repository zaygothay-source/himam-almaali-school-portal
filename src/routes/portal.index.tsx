import { createFileRoute, Link } from "@tanstack/react-router";
import {
  announcements,
  daysUntil,
  exams,
  missedDays,
  profile,
  schedule,
  subjects,
} from "@/lib/portal-data";
import { useSchoolStore } from "@/lib/school-store";
import { useEditorState } from "@/lib/editor-store";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/portal/")({
  component: DashboardPage,
});

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function DashboardPage() {
  const today = new Date();
  const todayName = dayNames[today.getDay()];
  const todayLessons = schedule.find((d) => d.day === todayName)?.lessons ?? schedule[0]?.lessons ?? [];
  const nextExam = exams[0];
  const nextExams = exams.slice(0, 3);
  const recentGrades = subjects.slice(0, 4);
  const store = useSchoolStore();
  const visibleAnnouncements = [...store.announcements, ...announcements];
  const editor = useEditorState();
  const { t, language } = useLanguage();
  const firstName = profile.name.split(" ")[0];
  const greeting = editor.content.dashboardGreeting === "Welcome back, {name}!"
    ? `${t("Welcome back")}, ${firstName}!`
    : editor.content.dashboardGreeting.replace("{name}", firstName);
  const locale = language === "ar" ? "ar" : language === "fr" ? "fr-FR" : "en-GB";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h1 className="text-2xl font-semibold text-foreground">{greeting}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {today.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link to="/portal/assignments" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
          {t("View attendance")}
          </Link>
          <Link to="/portal/schedule" className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
            {t("Today's timetable")}
          </Link>
          <Link to="/portal/exams" className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
            {t("Exam schedule")}
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label={t("Days missed")} value={String(missedDays.length)} hint={t("This school year")} />
        <Stat label={t("Periods missed")} value={String(missedDays.reduce((sum, item) => sum + item.periods, 0))} hint={t("Across all dates")} />
        <Stat label={t("Subjects")} value={String(subjects.length)} hint={t("Current timetable")} />
        <Stat label={t("Next exam")} value={nextExam ? `${daysUntil(nextExam.date)}d` : "—"} hint={nextExam?.subject ?? t("None scheduled")} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div style={{ order: editor.dashboardOrder.indexOf("classes") }}><Panel title={t("Today's classes")} link="/portal/schedule">
          <ul className="divide-y divide-border">
            {todayLessons.map((l) => (
              <li key={l.subject + l.start} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">{t(l.subject)}</p>
                  <p className="text-muted-foreground">{l.teacher} · {l.room}</p>
                </div>
                <span className="text-muted-foreground">{l.start}–{l.end}</span>
              </li>
            ))}
          </ul>
        </Panel></div>

        <div style={{ order: editor.dashboardOrder.indexOf("grades") }}><Panel title={t("Recent grades")} link="/portal/grades">
          <ul className="divide-y divide-border">
            {recentGrades.map((s) => (
              <li key={s.id} className="py-3 text-sm">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground">{t(s.name)}</p>
                  <span className="font-medium text-primary">{s.mark}/20</span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                  <div className="h-1.5 rounded-full bg-primary" style={{ width: `${s.mark * 5}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Panel></div>

        <div style={{ order: editor.dashboardOrder.indexOf("exams") }}><Panel title={t("Upcoming exams")} link="/portal/exams">
          <ul className="divide-y divide-border">
            {nextExams.map((e) => (
              <li key={e.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">{t(e.name)}</p>
                  <p className="text-muted-foreground">{t(e.subject)} · {e.location}</p>
                </div>
                <span className="text-muted-foreground">{t("in")} {daysUntil(e.date)} {t("days")}</span>
              </li>
            ))}
          </ul>
        </Panel></div>

        <div style={{ order: editor.dashboardOrder.indexOf("attendance") }}><Panel title={t("Attendance summary")} link="/portal/assignments">
          <p className="py-3 text-sm text-muted-foreground">{t("You have")} {missedDays.length} {t("recorded absence dates")}, {t("covering")} {missedDays.reduce((sum, item) => sum + item.periods, 0)} {t("missed periods.")}</p>
        </Panel></div>
      </div>

      <Panel title={t("School announcements")}>
        <ul className="divide-y divide-border">
          {visibleAnnouncements.map((n) => (
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
  const { t, language } = useLanguage();
  return (
    <section className="card-lift rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {link ? (
          <Link to={link} className="text-xs text-primary hover:opacity-80">
            {t("View all")}
          </Link>
        ) : null}
      </div>
      <div className="mt-2">{children}</div>
    </section>
  );
}
