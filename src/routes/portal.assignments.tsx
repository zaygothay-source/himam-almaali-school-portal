import { createFileRoute } from "@tanstack/react-router";
import { missedDays } from "@/lib/portal-data";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/portal/assignments")({ component: AttendancePage });

function AttendancePage() {
  const totalPeriods = missedDays.reduce((sum, item) => sum + item.periods, 0);
  const { t, language } = useLanguage();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">{t("Days missed")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("Your attendance record for this school year.")}</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5"><p className="text-xs uppercase tracking-wide text-muted-foreground">{t("Days recorded")}</p><p className="mt-2 text-3xl font-semibold text-foreground">{missedDays.length}</p><p className="mt-1 text-sm text-muted-foreground">{t("Absence dates")}</p></div>
        <div className="rounded-xl border border-border bg-card p-5"><p className="text-xs uppercase tracking-wide text-muted-foreground">{t("Periods missed")}</p><p className="mt-2 text-3xl font-semibold text-foreground">{totalPeriods}</p><p className="mt-1 text-sm text-muted-foreground">{t("Across those dates")}</p></div>
      </div>
      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground">{t("Attendance details")}</h2>
        <div className="mt-3 divide-y divide-border">
          {missedDays.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm"><div><p className="font-medium text-foreground">{new Date(item.date + "T00:00:00").toLocaleDateString(language === "ar" ? "ar" : language === "fr" ? "fr-FR" : "en-GB", { weekday: "short", month: "short", day: "numeric" })}</p><p className="text-muted-foreground">{item.reason}</p></div><span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">{item.periods} {item.periods === 1 ? t("period") : t("periods")}</span></div>)}
        </div>
      </section>
    </div>
  );
}
