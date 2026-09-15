import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { addStudent } from "@/lib/school-store";

export const Route = createFileRoute("/staff/accounts")({
  component: AccountsPage,
});

const inputClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary";

function AccountsPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [classGroup, setClassGroup] = useState("");
  const [year, setYear] = useState("Year 10");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSuccess(null);
    if (!name.trim() || !username.trim() || !password.trim() || !classGroup.trim()) {
      setError("Please complete every field.");
      return;
    }
    const result = addStudent({
      name: name.trim(),
      username: username.trim(),
      password,
      classGroup: classGroup.trim(),
      year,
    });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    setSuccess(`${name.trim()} can now sign in with “${username.trim()}”.`);
    setName("");
    setUsername("");
    setPassword("");
    setClassGroup("");
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">New student login</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create sign-in details for a student joining the school.
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="max-w-2xl space-y-4 rounded-xl border border-border bg-card p-5"
        noValidate
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              Full name
            </label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="class" className="text-sm font-medium text-foreground">
              Class
            </label>
            <input
              id="class"
              value={classGroup}
              onChange={(e) => setClassGroup(e.target.value)}
              placeholder="10B"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="newusername" className="text-sm font-medium text-foreground">
              Username
            </label>
            <input
              id="newusername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="newpassword" className="text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="newpassword"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="year" className="text-sm font-medium text-foreground">
              Year group
            </label>
            <select id="year" value={year} onChange={(e) => setYear(e.target.value)} className={inputClass}>
              {["Year 9", "Year 10", "Year 11", "Year 12"].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error ? (
          <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="rounded-md bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">{success}</p>
        ) : null}

        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Create login
        </button>
      </form>
    </div>
  );
}
