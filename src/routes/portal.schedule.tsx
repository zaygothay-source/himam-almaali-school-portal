import { createFileRoute } from "@tanstack/react-router";
import { schedule } from "@/lib/portal-data";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/portal/schedule")({
  component: SchedulePage,
});

function SchedulePage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">{t("Weekly schedule")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("Monday to Friday timetable.")}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {schedule.map((day) => (
          <section key={day.day} className="rounded-xl border border-border bg-card p-4">
            <h2 className="text-sm font-semibold text-foreground">{day.day}</h2>
            <ul className="mt-3 space-y-3">
              {day.lessons.map((l) => (
                <li key={l.subject + l.start} className="rounded-lg border border-border/70 p-3 text-sm">
                  <p className="font-medium text-foreground">{l.subject}</p>
                  <p className="text-muted-foreground">{l.teacher}</p>
                  <p className="text-muted-foreground">{l.room}</p>
                  <p className="mt-1 text-xs text-primary">{l.start} – {l.end}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
