import { createFileRoute } from "@tanstack/react-router";
import { subjects } from "@/lib/portal-data";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/portal/grades")({
  component: GradesPage,
});

function GradesPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">{t("Grades")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("Marks for")} {subjects.length} {t("subjects, each scored out of 20.")}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {subjects.map((s) => (
          <article key={s.id} className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold text-foreground">{s.name}</h2>
                <p className="text-sm text-muted-foreground">{s.teacher}</p>
              </div>
              <span className="rounded-md bg-primary/15 px-2.5 py-1 text-sm font-semibold text-primary">{s.mark}/20</span>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{t("Progress")}</span>
                <span>{s.mark}/20</span>
              </div>
              <div className="mt-1.5 h-2 w-full rounded-full bg-muted">
                <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${s.mark * 5}%` }} />
              </div>
            </div>

            <ul className="mt-4 space-y-2 text-sm">
              {s.recent.map((r) => (
                <li key={r.title} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{r.title}</span>
                  <span className="font-medium text-foreground">{r.score}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
