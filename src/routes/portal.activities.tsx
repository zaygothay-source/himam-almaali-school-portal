import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { activities } from "@/lib/portal-data";

export const Route = createFileRoute("/portal/activities")({
  component: ActivitiesPage,
});

function ActivitiesPage() {
  const [joined, setJoined] = useState<Record<string, boolean>>(
    Object.fromEntries(activities.map((a) => [a.id, a.joined])),
  );
  const [message, setMessage] = useState<string | null>(null);

  function toggle(id: string, name: string) {
    setJoined((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      setMessage(next[id] ? `You joined ${name}.` : `You left ${name}.`);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">Activities</h1>
        <p className="mt-1 text-sm text-muted-foreground">Clubs and extracurriculars you can join.</p>
      </header>

      {message ? (
        <p role="status" className="rounded-md bg-primary/10 px-4 py-2 text-sm text-primary">
          {message}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {activities.map((a) => (
          <article key={a.id} className="flex flex-col rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base font-semibold text-foreground">{a.name}</h2>
              {joined[a.id] ? (
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-400">Joined</span>
              ) : null}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{a.description}</p>
            <p className="mt-3 text-sm text-foreground">{a.when}</p>
            <p className="text-sm text-muted-foreground">{a.location}</p>
            <button
              type="button"
              onClick={() => toggle(a.id, a.name)}
              className={`mt-4 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                joined[a.id]
                  ? "border border-border text-foreground hover:bg-muted"
                  : "bg-primary text-primary-foreground hover:opacity-90"
              }`}
            >
              {joined[a.id] ? "Leave" : "Join"}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
