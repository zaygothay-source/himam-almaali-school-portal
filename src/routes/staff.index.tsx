import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, UserPlus, Users } from "lucide-react";
import { useSession } from "@/lib/auth";
import { useSchoolStore } from "@/lib/school-store";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/staff/")({
  component: StaffDashboard,
});

function StaffDashboard() {
  const session = useSession();
  const store = useSchoolStore();
  const { t } = useLanguage();
  const mine = store.published.filter((p) => p.publishedBy === session?.username);
  const isPrincipal = session?.role === "principal";
  const assignedStudents = isPrincipal
    ? store.students
    : store.students.filter((student) => student.teacherUsername === session?.username);

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">{t("Welcome back")}, {session?.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{today}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: isPrincipal ? t("Students on roll") : t("Students assigned to you"), value: assignedStudents.length },
          { label: t("Teachers"), value: store.teachers.length },
          { label: t("Published school-wide"), value: store.published.length },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { to: "/staff/students", label: t("View students"), icon: Users },
          { to: "/staff/grades" as const, label: t("See grades"), icon: ClipboardList },
          ...(isPrincipal
            ? [
                { to: "/staff/homework" as const, label: t("Publish homework"), icon: ClipboardList },
                { to: "/staff/accounts" as const, label: t("Manage students & teachers"), icon: UserPlus },
              ]
            : []),
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

      {isPrincipal ? <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-lg font-semibold text-foreground">{t("Your latest posts")}</h2>
        {mine.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            {t("No school-wide posts yet.")}
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
      </section> : null}
    </div>
  );
}
