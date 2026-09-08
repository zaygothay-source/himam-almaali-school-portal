import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { assignments, formatDate, type Assignment, type AssignmentStatus } from "@/lib/portal-data";

export const Route = createFileRoute("/portal/assignments")({
  component: AssignmentsPage,
});

const filters = ["all", "upcoming", "completed", "overdue"] as const;

const statusStyles: Record<AssignmentStatus, string> = {
  upcoming: "bg-primary/15 text-primary",
  completed: "bg-emerald-500/15 text-emerald-400",
  overdue: "bg-destructive/15 text-destructive",
};

function AssignmentsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const [selected, setSelected] = useState<Assignment | null>(null);

  const list = assignments.filter((a) => filter === "all" || a.status === filter);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">Assignments</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tap any assignment to see full details.</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Nothing here right now.
        </p>
      ) : (
        <ul className="space-y-3">
          {list.map((a) => (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => setSelected(a)}
                className="flex w-full flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/50"
              >
                <div>
                  <p className="font-medium text-foreground">{a.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {a.subject} · due {formatDate(a.due)}
                    {a.grade ? ` · ${a.grade}` : ""}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyles[a.status]}`}>
                  {a.status}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/70" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-foreground">{selected.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{selected.subject}</p>
            <p className="mt-4 text-sm text-foreground">{selected.description}</p>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Due date</dt>
                <dd className="font-medium text-foreground">{formatDate(selected.due)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Status</dt>
                <dd className="font-medium capitalize text-foreground">{selected.status}</dd>
              </div>
              {selected.grade ? (
                <div>
                  <dt className="text-muted-foreground">Grade</dt>
                  <dd className="font-medium text-foreground">{selected.grade}</dd>
                </div>
              ) : null}
            </dl>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mt-6 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
