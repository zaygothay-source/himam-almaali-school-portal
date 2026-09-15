import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { profile as demoProfile } from "@/lib/portal-data";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/portal/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { t } = useLanguage();
  const [profile, setProfile] = useState(demoProfile);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(demoProfile);
  const [saved, setSaved] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setProfile(draft);
    setEditing(false);
    setSaved(true);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">{t("Profile")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("Your student record.")}</p>
      </header>

      {saved ? (
        <p role="status" className="rounded-md bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
          {t("Profile updated.")}
        </p>
      ) : null}

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
            {profile.name.charAt(0)}
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{profile.name}</p>
            <p className="text-sm text-muted-foreground">{profile.year} · {profile.className}</p>
          </div>
        </div>

        {editing ? (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <Field label={t("Full name")} value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
            <Field label={t("Email")} value={draft.email} onChange={(v) => setDraft({ ...draft, email: v })} />
            <Field label={t("Class")} value={draft.className} onChange={(v) => setDraft({ ...draft, className: v })} />
            <div className="flex gap-2">
              <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
                {t("Save changes")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraft(profile);
                  setEditing(false);
                }}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                {t("Cancel")}
              </button>
            </div>
          </form>
        ) : (
          <>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2 text-sm">
              <Row label={t("Student ID")} value={profile.studentId} />
              <Row label={t("Grade / year")} value={profile.year} />
              <Row label={t("Email")} value={profile.email} />
              <Row label={t("Class")} value={profile.className} />
              <Row label={t("Homeroom teacher")} value={profile.homeroom} />
            </dl>
            <button
              type="button"
              onClick={() => {
                setDraft(profile);
                setSaved(false);
                setEditing(true);
              }}
              className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              {t("Edit profile")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <input
        value={value}
        required
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
      />
    </label>
  );
}
