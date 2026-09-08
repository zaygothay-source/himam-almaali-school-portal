import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { daysUntil, exams, formatDate, type Exam } from "@/lib/portal-data";

export const Route = createFileRoute("/portal/exams")({
  component: ExamsPage,
});

function ExamsPage() {
  const [selected, setSelected] = useState<Exam | null>(null);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">Exams</h1>
        <p className="mt-1 text-sm text-muted-foreground">Select an exam for topics and details.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {exams.map((e) => (
          <button
            key={e.id}
            type="button"
            onClick={() => setSelected(e)}
            className="rounded-xl border border-border bg-card p-5 text-left transition-colors hover:border-primary/50"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold text-foreground">{e.name}</h2>
                <p className="text-sm text-muted-foreground">{e.subject}</p>
              </div>
              <span className="rounded-md bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary">
                {daysUntil(e.date)} days
              </span>
            </div>
            <p className="mt-3 text-sm text-foreground">{formatDate(e.date)} · {e.time}</p>
            <p className="text-sm text-muted-foreground">{e.location}</p>
          </button>
        ))}
      </div>

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/70" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-foreground">{selected.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{selected.subject}</p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Date</dt>
                <dd className="font-medium text-foreground">{formatDate(selected.date)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Time</dt>
                <dd className="font-medium text-foreground">{selected.time}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Location</dt>
                <dd className="font-medium text-foreground">{selected.location}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Countdown</dt>
                <dd className="font-medium text-foreground">{daysUntil(selected.date)} days</dd>
              </div>
            </dl>
            <p className="mt-4 text-sm font-medium text-foreground">Topics covered</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {selected.topics.map((t) => (
                <li key={t} className="rounded-full bg-muted px-3 py-1 text-xs text-foreground">
                  {t}
                </li>
              ))}
            </ul>
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
