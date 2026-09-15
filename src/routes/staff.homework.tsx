import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Trash2 } from "lucide-react";
import { useSession } from "@/lib/auth";
import { publishWork, removeWork, useSchoolStore } from "@/lib/school-store";

export const Route = createFileRoute("/staff/homework")({
  component: HomeworkPage,
});

const subjectOptions = [
  "Mathematics",
  "English",
  "Science",
  "History",
  "Computer Science",
  "Physical Education",
];

const inputClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary";

function HomeworkPage() {
  const session = useSession();
  const store = useSchoolStore();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(subjectOptions[0]!);
  const [type, setType] = useState<"Homework" | "Assignment">("Homework");
  const [dueDate, setDueDate] = useState("");
  const [instructions, setInstructions] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaved(null);
    if (!title.trim() || !dueDate || !instructions.trim()) {
      setError("Please add a title, a due date and the instructions.");
      return;
    }
    setError(null);
    publishWork({
      title: title.trim(),
      subject,
      type,
      dueDate,
      instructions: instructions.trim(),
      publishedBy: session?.username ?? "Admin",
    });
    setTitle("");
    setDueDate("");
    setInstructions("");
    setSaved("Published — students can see it in their portal now.");
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">Homework & assignments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Post work to the website; it appears instantly for students.
        </p>
      </header>

      <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border bg-card p-5" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="title" className="text-sm font-medium text-foreground">
              Title
            </label>
            <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="subject" className="text-sm font-medium text-foreground">
              Subject
            </label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={inputClass}
            >
              {subjectOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="type" className="text-sm font-medium text-foreground">
              Type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as "Homework" | "Assignment")}
              className={inputClass}
            >
              <option value="Homework">Homework</option>
              <option value="Assignment">Assignment</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="due" className="text-sm font-medium text-foreground">
              Due date
            </label>
            <input
              id="due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="instructions" className="text-sm font-medium text-foreground">
            Instructions
          </label>
          <textarea
            id="instructions"
            rows={4}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className={inputClass}
          />
        </div>

        {error ? (
          <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}
        {saved ? (
          <p className="rounded-md bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">{saved}</p>
        ) : null}

        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Publish
        </button>
      </form>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Published work</h2>
        {store.published.length === 0 ? (
          <p className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
            Nothing published yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {store.published.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border bg-card p-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{p.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {p.subject} · {p.type} · due {p.dueDate} · posted by {p.publishedBy}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{p.instructions}</p>
                </div>
                {p.publishedBy === session?.username ? (
                  <button
                    type="button"
                    onClick={() => removeWork(p.id)}
                    className="flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
