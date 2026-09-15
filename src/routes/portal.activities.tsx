import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { activities } from "@/lib/portal-data";
import { submitActivityRequest, useSchoolStore } from "@/lib/school-store";
import { useSession } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/portal/activities")({ component: ActivitiesPage });

function ActivitiesPage() {
  const store = useSchoolStore();
  const session = useSession();
  const { t } = useLanguage();
  const allActivities = [...activities, ...store.activities];
  const [selected, setSelected] = useState<{ id: string; name: string } | null>(null);
  const [fullName, setFullName] = useState(session?.name ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const requests = store.activityRequests.filter((request) => request.studentUsername === session?.username);

  function sendRequest() {
    if (!selected || !fullName.trim()) return;
    submitActivityRequest({ activityId: selected.id, activityName: selected.name, fullName: fullName.trim(), studentUsername: session?.username ?? "Student" });
    setSelected(null);
    setMessage(`${t("Your request to join")} ${selected.name} ${t("was sent to the organizer.")}`);
  }

  return (
    <div className="space-y-6">
      <header><h1 className="text-2xl font-semibold text-foreground">{t("Activities")}</h1><p className="mt-1 text-sm text-muted-foreground">{t("Request to join a club or activity. The organizer will review it.")}</p></header>
      {message ? <p role="status" className="rounded-md bg-primary/10 px-4 py-2 text-sm text-primary">{message}</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        {allActivities.map((activity) => {
          const request = requests.find((item) => item.activityId === activity.id && item.status !== "denied");
          const joined = activity.joined || request?.status === "accepted";
          return <article key={activity.id} className="flex flex-col rounded-xl border border-border bg-card p-5"><div className="flex items-start justify-between gap-3"><h2 className="text-base font-semibold text-foreground">{activity.name}</h2>{joined ? <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-400">{t("Joined")}</span> : request?.status === "pending" ? <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">{t("Request pending")}</span> : null}</div><p className="mt-2 text-sm text-muted-foreground">{activity.description}</p><p className="mt-3 text-sm text-foreground">{activity.when}</p><p className="text-sm text-muted-foreground">{activity.location}</p><button type="button" disabled={joined || request?.status === "pending"} onClick={() => { setFullName(session?.name ?? ""); setSelected({ id: activity.id, name: activity.name }); }} className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">{joined ? t("Joined") : request?.status === "pending" ? t("Request pending") : t("Request to join")}</button></article>;
        })}
      </div>
      {selected ? <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true"><div className="absolute inset-0 bg-black/70" onClick={() => setSelected(null)} /><form onSubmit={(event) => { event.preventDefault(); sendRequest(); }} className="relative w-full max-w-md space-y-4 rounded-2xl border border-border bg-card p-6 shadow-xl"><h2 className="text-lg font-semibold text-foreground">{t("Request to join")} {selected.name}</h2><p className="text-sm text-muted-foreground">{t("Enter your full name. The organizer will accept or deny your request.")}</p><input autoFocus required value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder={t("Full name")} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary" /><div className="flex justify-end gap-2"><button type="button" onClick={() => setSelected(null)} className="rounded-md border border-border px-4 py-2 text-sm text-foreground hover:bg-muted">{t("Cancel")}</button><button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">{t("Send request")}</button></div></form></div> : null}
    </div>
  );
}
