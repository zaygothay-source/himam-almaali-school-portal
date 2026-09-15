import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { removeStudent, useSchoolStore } from "@/lib/school-store";

export const Route = createFileRoute("/staff/students")({
  component: StudentsPage,
});

function StudentsPage() {
  const store = useSchoolStore();
  const [query, setQuery] = useState("");

  const list = store.students.filter((s) =>
    `${s.name} ${s.username} ${s.classGroup}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Students</h1>
          <p className="mt-1 text-sm text-muted-foreground">{store.students.length} students on roll.</p>
        </div>
        <Link
          to="/staff/accounts"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Add student
        </Link>
      </header>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, username or class"
        className="w-full max-w-sm rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
      />

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Class</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.id} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3 font-medium text-foreground">{s.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.username}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.classGroup}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.year}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => removeStudent(s.id)}
                    className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {list.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                  No students match that search.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
