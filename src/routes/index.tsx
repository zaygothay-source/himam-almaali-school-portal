import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { login } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Student Login — Aldridge School Portal" },
      {
        name: "description",
        content:
          "Sign in to the Aldridge School student portal to view grades, assignments, exams and your weekly timetable.",
      },
      { property: "og:title", content: "Student Login — Aldridge School Portal" },
      {
        property: "og:description",
        content: "Sign in to the Aldridge School student portal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"student" | "teacher">("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!username.trim() || !password) {
      setError("Please fill in both your username and password.");
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      const session = login(username, password);
      if (!session) {
        setError("Those details don't match our records. Try again.");
        setLoading(false);
        return;
      }
      if (session.role !== mode) {
        setError(
          session.role === "teacher"
            ? "That's a staff account — switch to Teacher to sign in."
            : "That's a student account — switch to Student to sign in.",
        );
        setLoading(false);
        return;
      }
      navigate({ to: session.role === "teacher" ? "/staff" : "/portal" });
    }, 400);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground">
            A
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-foreground">Aldridge School</h1>
          <p className="mt-1 text-sm text-muted-foreground">Student portal sign in</p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
          <div className="space-y-1.5">
            <label htmlFor="username" className="text-sm font-medium text-foreground">
              Username
            </label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-muted-foreground">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-input"
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={() =>
                setError("Please ask the school office to reset your password.")
              }
              className="text-primary transition-opacity hover:opacity-80"
            >
              Forgot password?
            </button>
          </div>

          {error ? (
            <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Log In"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Demo access — username <span className="font-medium text-foreground">User</span>, password{" "}
          <span className="font-medium text-foreground">password</span>
        </p>
      </div>
    </main>
  );
}
