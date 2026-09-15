import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { addActivity, addAnnouncement, addStudent, decideActivityRequest, updateTeacher, useSchoolStore } from "@/lib/school-store";
import { useSession } from "@/lib/auth";
import { activities as builtInActivities } from "@/lib/portal-data";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/staff/accounts")({
  component: AccountsPage,
});

const inputClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary";

function AccountsPage() {
  const session = useSession();
  const store = useSchoolStore();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [classGroup, setClassGroup] = useState("");
  const [year, setYear] = useState("Year 10");
  const [teacherUsername, setTeacherUsername] = useState("Teacher");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementBody, setAnnouncementBody] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSuccess(null);
    if (!name.trim() || !username.trim() || !password.trim() || !classGroup.trim()) {
      setError(t("Please complete every field."));
      return;
    }
    const result = addStudent({
      name: name.trim(),
      username: username.trim(),
      password,
      classGroup: classGroup.trim(),
      year,
      teacherUsername,
    });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    setSuccess(`${name.trim()} ${t("can now sign in with")} “${username.trim()}”.`);
    setName("");
    setUsername("");
    setPassword("");
    setClassGroup("");
  }

  if (session?.role === "organizer") {
    return <OrganizerPanel />;
  }
  if (session?.role !== "principal") {
    return <p className="text-sm text-muted-foreground">{t("Only the Principal or Organizer can use this management area.")}</p>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">{t("Principal management")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("Add students and review each teacher's assigned subject.")}
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
              {t("Full name")}
            </label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="teacher" className="text-sm font-medium text-foreground">{t("Assigned teacher")}</label>
            <select id="teacher" value={teacherUsername} onChange={(e) => setTeacherUsername(e.target.value)} className={inputClass}>
              {store.teachers.map((teacher) => <option key={teacher.username} value={teacher.username}>{teacher.name}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="class" className="text-sm font-medium text-foreground">
              {t("Class")}
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
              {t("Username")}
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
              {t("Password")}
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
              {t("Year group")}
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
          {t("Create login")}
        </button>
      </form>

      <section className="max-w-2xl rounded-xl border border-border bg-card p-5">
        <h2 className="text-lg font-semibold text-foreground">{t("Teachers")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("Each teacher has two assigned demo students.")}</p>
        <div className="mt-4 space-y-3">
          {store.teachers.map((teacher) => (
            <TeacherRow key={teacher.username} username={teacher.username} name={teacher.name} subject={teacher.subject} />
          ))}
        </div>
      </section>

      <section className="max-w-2xl rounded-xl border border-border bg-card p-5">
        <h2 className="text-lg font-semibold text-foreground">{t("Post announcement")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("Publish a message that students will see on their dashboard.")}</p>
        <form className="mt-4 space-y-3" onSubmit={(event) => { event.preventDefault(); if (!announcementTitle.trim() || !announcementBody.trim()) return; addAnnouncement({ title: announcementTitle.trim(), body: announcementBody.trim() }); setAnnouncementTitle(""); setAnnouncementBody(""); setSuccess("Announcement posted for students."); }}>
          <input value={announcementTitle} onChange={(event) => setAnnouncementTitle(event.target.value)} placeholder="Announcement title" className={inputClass} />
          <textarea value={announcementBody} onChange={(event) => setAnnouncementBody(event.target.value)} placeholder="Write the announcement" rows={3} className={inputClass} />
          <button type="submit" className="rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">{t("Post announcement")}</button>
        </form>
      </section>
    </div>
  );
}

function OrganizerPanel() {
  const store = useSchoolStore();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [when, setWhen] = useState("");
  const [location, setLocation] = useState("");
  const [saved, setSaved] = useState(false);
  const inputClass = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary";
  function submit(event: FormEvent) { event.preventDefault(); if (!name.trim() || !description.trim() || !when.trim() || !location.trim()) return; addActivity({ name: name.trim(), description: description.trim(), when: when.trim(), location: location.trim() }); setName(""); setDescription(""); setWhen(""); setLocation(""); setSaved(true); }
  const pending = store.activityRequests.filter((request) => request.status === "pending");
  const allActivities = [...builtInActivities, ...store.activities];
  return <div className="max-w-3xl space-y-6"><header><h1 className="text-2xl font-semibold text-foreground">Activities organizer</h1><p className="mt-1 text-sm text-muted-foreground">Add activities and review student join requests.</p></header><form onSubmit={submit} className="space-y-4 rounded-xl border border-border bg-card p-5"><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Activity name" className={inputClass} /><textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description" rows={3} className={inputClass} /><div className="grid gap-4 sm:grid-cols-2"><input value={when} onChange={(event) => setWhen(event.target.value)} placeholder="When (e.g. Fridays, 16:00)" className={inputClass} /><input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Location" className={inputClass} /></div>{saved ? <p className="text-sm text-emerald-400">Activity added to the student portal.</p> : null}<button type="submit" className="rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">Add upcoming activity</button></form><section className="rounded-xl border border-border bg-card p-5"><h2 className="text-lg font-semibold text-foreground">Join requests</h2>{pending.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">No pending requests.</p> : <div className="mt-4 space-y-3">{pending.map((request) => <div key={request.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 p-3"><div><p className="font-medium text-foreground">{request.fullName}</p><p className="text-sm text-muted-foreground">{request.activityName}</p></div><div className="flex gap-2"><button type="button" onClick={() => decideActivityRequest(request.id, "denied")} className="rounded-md border border-border px-3 py-1.5 text-xs text-foreground hover:bg-muted">Deny</button><button type="button" onClick={() => decideActivityRequest(request.id, "accepted")} className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90">Accept</button></div></div>)}</div>}</section><section className="rounded-xl border border-border bg-card p-5"><h2 className="text-lg font-semibold text-foreground">Activity rosters</h2><div className="mt-4 space-y-4">{allActivities.map((activity) => { const requests = store.activityRequests.filter((request) => request.activityId === activity.id && request.status === "accepted"); return <div key={activity.id} className="rounded-lg border border-border/60 p-3"><p className="font-medium text-foreground">{activity.name}</p><p className="mt-1 text-sm text-muted-foreground">{requests.length ? requests.map((request) => request.fullName).join(", ") : "No accepted students yet."}</p></div>; })}</div></section></div>;
}

function TeacherRow({ username, name, subject }: { username: string; name: string; subject: string }) {
  const [draft, setDraft] = useState(name);
  const [saved, setSaved] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border/60 p-3">
      <span className="w-16 text-sm text-muted-foreground">{username}</span>
      <input value={draft} onChange={(e) => { setDraft(e.target.value); setSaved(false); }} className={`${inputClass} min-w-48 flex-1`} />
      <span className="text-sm text-muted-foreground">{subject}</span>
      <button type="button" onClick={() => { updateTeacher(username, draft.trim() || name); setSaved(true); }} className="rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">Save</button>
      {saved ? <span className="text-xs text-emerald-400">Saved</span> : null}
    </div>
  );
}
