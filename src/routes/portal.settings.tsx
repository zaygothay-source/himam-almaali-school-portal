import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { logout } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/portal/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [prefs, setPrefs] = useState({
    emailAlerts: true,
    examReminders: true,
    activityUpdates: false,
    compactView: false,
  });
  const [saved, setSaved] = useState(false);

  const toggles: { key: keyof typeof prefs; label: string; hint: string }[] = [
    { key: "emailAlerts", label: t("Email alerts"), hint: t("Get an email when a new grade is posted.") },
    { key: "examReminders", label: t("Exam reminders"), hint: t("Reminders three days before each exam.") },
    { key: "activityUpdates", label: t("Activity updates"), hint: t("News from clubs you have joined.") },
    { key: "compactView", label: t("Compact lists"), hint: t("Show more rows per screen.") },
  ];

  return (
    <div className="max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">{t("Settings")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("Notification and display preferences.")}</p>
      </header>

      {saved ? (
        <p role="status" className="rounded-md bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
          {t("Preferences saved.")}
        </p>
      ) : null}

      <div className="divide-y divide-border rounded-xl border border-border bg-card">
        {toggles.map((t) => (
          <div key={t.key} className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="text-sm font-medium text-foreground">{t.label}</p>
              <p className="text-sm text-muted-foreground">{t.hint}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={prefs[t.key]}
              aria-label={t.label}
              onClick={() => {
                setPrefs((p) => ({ ...p, [t.key]: !p[t.key] }));
                setSaved(true);
              }}
              className={`h-6 w-11 shrink-0 rounded-full p-0.5 transition-colors ${prefs[t.key] ? "bg-primary" : "bg-muted"}`}
            >
              <span
                className={`block h-5 w-5 rounded-full bg-background transition-transform ${prefs[t.key] ? "translate-x-5" : ""}`}
              />
            </button>
          </div>
        ))}
      </div>


      <button
        type="button"
        onClick={() => {
          logout();
          navigate({ to: "/" });
        }}
        className="rounded-md border border-destructive/50 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
      >
        {t("Logout")}
      </button>
    </div>
  );
}
