import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ClipboardList, LayoutDashboard, LogOut, Menu, UserPlus, Users, X } from "lucide-react";
import { logout, useHydrated, useSession } from "@/lib/auth";

export const Route = createFileRoute("/staff")({
  head: () => ({
    meta: [
      { title: "Staff Portal — Aldridge School" },
      {
        name: "description",
        content:
          "Aldridge School staff portal: publish homework and assignments, view your student list and create new student logins.",
      },
      { property: "og:title", content: "Staff Portal — Aldridge School" },
      {
        property: "og:description",
        content: "Publish homework, manage students and create new student logins.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StaffLayout,
});

const nav = [
  { to: "/staff", label: "Dashboard", icon: LayoutDashboard },
  { to: "/staff/homework", label: "Homework & assignments", icon: ClipboardList },
  { to: "/staff/students", label: "Students", icon: Users },
  { to: "/staff/accounts", label: "New student login", icon: UserPlus },
] as const;

function StaffLayout() {
  const session = useSession();
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (hydrated && (!session || session.role !== "teacher")) navigate({ to: "/" });
  }, [hydrated, session, navigate]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (!hydrated || !session || session.role !== "teacher") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Loading the staff portal…
      </div>
    );
  }

  const menu = (
    <nav className="flex flex-col gap-1 p-3">
      {nav.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          activeOptions={{ exact: item.to === "/staff" }}
          activeProps={{ className: "bg-primary/15 text-primary" }}
          inactiveProps={{ className: "text-muted-foreground hover:bg-muted/60 hover:text-foreground" }}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
      <button
        type="button"
        onClick={() => {
          logout();
          navigate({ to: "/" });
        }}
        className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </nav>
  );

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="hidden w-72 shrink-0 border-r border-border bg-card md:block">
        <div className="flex items-center gap-3 border-b border-border px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            A
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Aldridge School</p>
            <p className="text-xs text-muted-foreground">Staff portal</p>
          </div>
        </div>
        {menu}
      </aside>

      {open ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 border-r border-border bg-card shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <p className="text-sm font-semibold text-foreground">Aldridge School</p>
              <button type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            {menu}
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border bg-card/60 px-4 py-3 md:px-8">
          <button
            type="button"
            aria-label="Open menu"
            className="rounded-md p-2 text-foreground hover:bg-muted md:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <p className="text-sm font-medium text-foreground">
            {nav.find((n) => n.to === pathname)?.label ?? "Dashboard"}
          </p>
          <span className="ml-auto text-sm text-muted-foreground">
            {session.name} · {session.username}
          </span>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
