import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { login } from "@/lib/auth";
import { useEditorState } from "@/lib/editor-store";
import { useLanguage, type Language } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Student Login — Himam Almaali Portal" },
      {
        name: "description",
        content:
          "Sign in to the Himam Almaali student portal to view grades, attendance, exams and your weekly timetable.",
      },
      { property: "og:title", content: "Student Login — Himam Almaali Portal" },
      {
        property: "og:description",
        content: "Sign in to the Himam Almaali student portal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"student" | "admin">("student");
  const [adminRole, setAdminRole] = useState<"teacher" | "principal" | "organizer">("teacher");
  const [theme, setTheme] = useState(() => typeof window === "undefined" ? "blue" : window.localStorage.getItem("himam-almaali-theme") ?? "blue");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const editor = useEditorState();
  const { language, setLanguage, t } = useLanguage();
  const languageOptions: Array<{ id: Language; label: string }> = [
    { id: "fr", label: "Français" },
    { id: "ar", label: "العربية" },
    { id: "en", label: "English" },
  ];

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!username.trim() || !password) {
      setError(t("Please fill in both your username and password."));
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      const session = login(username, password);
      if (!session) {
        setError(t("Those details don't match our records. Try again."));
        setLoading(false);
        return;
      }
      if (session.role !== (mode === "student" ? "student" : adminRole)) {
        setError(
          session.role === "teacher"
            ? t("That's an admin account — switch to Admin to sign in.")
            : session.role === "principal"
              ? t("That's the Principal account — choose Principal under Admin to sign in.")
              : session.role === "organizer"
                ? t("That's the Organizer account — choose Organizer under Admin to sign in.")
              : t("That's a student account — switch to Student to sign in."),
        );
        setLoading(false);
        return;
      }
      navigate({ to: session.role === "student" ? (session.username === "Aztx" ? "/editor" : "/portal") : "/staff" });
    }, 400);
  }

  return (
    <main className="login-shell relative flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <div className="page-enter w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl">
        <div className="text-center">
          <div className="glow-pulse mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground">
            H
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-foreground">{editor.content.loginTitle}</h1>
          <p key={`${mode}-${adminRole}`} className="mode-swap mt-1 text-sm text-muted-foreground">
            {mode === "admin" ? `${t(adminRole[0].toUpperCase() + adminRole.slice(1))} · ${t("Log In")}` : (editor.content.loginDescription === "Student portal sign in" ? t("Student portal sign in") : editor.content.loginDescription)}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-1 rounded-lg border border-border bg-muted/40 p-1">
          {(["student", "admin"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setError(null);
              }}
              className={`rounded-md px-3 py-2 text-sm font-medium capitalize transition-all duration-300 ${
                mode === m
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m === "admin" ? t("Admin") : t("Student")}
            </button>
          ))}
        </div>

        {mode === "admin" ? (
          <div key={`admin-${adminRole}`} className="mode-swap mt-4 grid grid-cols-3 gap-1 rounded-lg border border-border bg-muted/40 p-1">
            {(["teacher", "principal", "organizer"] as const).map((role) => (
              <button key={role} type="button" onClick={() => { setAdminRole(role); setError(null); }} className={`rounded-md px-2 py-2 text-xs font-medium capitalize transition-colors ${adminRole === role ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{t(role[0].toUpperCase() + role.slice(1))}</button>
            ))}
          </div>
        ) : null}

        <div className="fixed right-4 top-4 z-10 rounded-xl border border-border bg-card/90 p-1.5 shadow-lg backdrop-blur">
          <div className="flex items-center gap-1.5">
            <span className="px-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{t("Language")}</span>
            {languageOptions.map((option) => <button key={option.id} type="button" onClick={() => setLanguage(option.id)} aria-label={option.label} className={`rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${language === option.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>{option.id === "ar" ? "ع" : option.id === "fr" ? "Fr" : "En"}</button>)}
          </div>
          <div className="mt-1 flex gap-1.5">
            {[{ id: "orange", label: "Orange", swatch: "bg-amber-400" }, { id: "paper", label: "B&W", swatch: "bg-black" }, { id: "blue", label: "Blue", swatch: "bg-blue-600" }, { id: "forest", label: "Forest", swatch: "bg-emerald-600" }, { id: "plum", label: "Plum", swatch: "bg-purple-500" }].map((option) => (
              <button key={option.id} type="button" title={option.label} aria-label={`Use ${option.label} theme`} onClick={() => { setTheme(option.id); window.localStorage.setItem("himam-almaali-theme", option.id); document.documentElement.classList.remove("theme-blue", "theme-paper", "theme-forest", "theme-plum"); if (option.id !== "orange") document.documentElement.classList.add(`theme-${option.id}`); }} className={`rounded-full border p-1 transition-transform hover:scale-110 ${theme === option.id ? "border-primary" : "border-transparent"}`}><span className={`block h-4 w-4 rounded-full ${option.swatch}`} /></button>
            ))}
          </div>
        </div>


        <form key={mode} onSubmit={onSubmit} className="mode-swap mt-8 space-y-4" noValidate>
          <div className="space-y-1.5">
            <label htmlFor="username" className="text-sm font-medium text-foreground">
              {t("Username")}
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
              {t("Password")}
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
              {t("Remember me")}
            </label>
            <button
              type="button"
              onClick={() =>
                setError(t("Please ask the school office to reset your password."))
              }
              className="text-primary transition-opacity hover:opacity-80"
            >
              {t("Forgot password?")}
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
            {loading ? t("Signing in…") : t("Log In")}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {mode === "admin" && adminRole === "organizer" ? (
            <>{t("Demo Organizer access —")} <span className="font-medium text-foreground">Organizer / Organizer</span></>
          ) : mode === "admin" && adminRole === "principal" ? (
            <>{t("Demo Principal access —")} <span className="font-medium text-foreground">Principal / Principal</span></>
          ) : mode === "admin" ? (
            <>
              {t("Demo teacher access —")} <span className="font-medium text-foreground">Teacher / Teacher</span> · <span className="font-medium text-foreground">Teacher4 / Teacher4</span>
            </>
          ) : (
            <>
              {t("Demo student access —")} <span className="font-medium text-foreground">Student / Student</span> · <span className="font-medium text-foreground">Student9 / Student9</span>
              <br />{t("Editor access —")} <span className="font-medium text-foreground">Aztx / Aztx</span>
            </>
          )}
        </p>
      </div>
    </main>
  );
}
