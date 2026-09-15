import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, UserPlus, Users } from "lucide-react";
import { useSession } from "@/lib/auth";
import { useSchoolStore } from "@/lib/school-store";

export const Route = createFileRoute("/staff/")({
  component: StaffDashboard,
});

function StaffDashboard() {
  const session = useSession();
  const store = useSchoolStore();
  const mine = store.published.filter((p) => p.publishedBy === session?.username);

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">Welcome back, {session?.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{today}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Students on roll", value: store.students.length },
          { label: "Published by you", value: mine.length },
          { label: "Published school-wide", value: store.published.length },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { to: "/staff/homework", label: "Publish homework", icon: ClipboardList },
          { to: "/staff/students", label: "Student list", icon: Users },
          { to: "/staff/accounts", label: "Add a student login", icon: UserPlus },
        ].map((q) => (
          <Link
            key={q.to}
            to={q.to}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-5 text-sm font-medium text-foreground transition-colors hover:border-primary/50"
          >
            <q.icon className="h-5 w-5 text-primary" />
            {q.label}
          </Link>
        ))}
      </div>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-lg font-semibold text-foreground">Your latest posts</h2>
        {mine.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            You haven't published anything yet. Start from “Homework & assignments”.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {mine.slice(0, 5).map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{p.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.subject} · {p.type}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">Due {p.dueDate}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
