import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { updateStudent, useSchoolStore, type StudentAccount } from "@/lib/school-store";
import { useSession } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/staff/students")({ component: StudentsPage });

function StudentsPage() {
  const store = useSchoolStore();
  const session = useSession();
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const isPrincipal = session?.role === "principal";
  const assigned = isPrincipal ? store.students : store.students.filter((student) => student.teacherUsername === session?.username);
  const list = assigned.filter((student) => `${student.name} ${student.username} ${student.classGroup}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{t("Students")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{isPrincipal ? t("Update each student's assigned teacher and classroom.") : t("Your two assigned students.")}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/staff/grades" className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">{t("See grades")}</Link>
          {isPrincipal ? <Link to="/staff/accounts" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">{t("Add student")}</Link> : null}
        </div>
      </header>

      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("Search by name, username or classroom")} className="w-full max-w-sm rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="px-4 py-3">{t("Name")}</th><th className="px-4 py-3">{t("Username")}</th><th className="px-4 py-3">{t("Classroom")}</th><th className="px-4 py-3">{t("Teacher")}</th>{isPrincipal ? <th className="px-4 py-3" /> : null}</tr></thead>
          <tbody>
            {list.map((student) => <StudentRow key={student.id} student={student} isPrincipal={isPrincipal} teachers={store.teachers} />)}
            {list.length === 0 ? <tr><td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">{t("No students match that search.")}</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StudentRow({ student, isPrincipal, teachers }: { student: StudentAccount; isPrincipal: boolean; teachers: { username: string; name: string }[] }) {
  const { t } = useLanguage();
  const [classGroup, setClassGroup] = useState(student.classGroup);
  const [teacherUsername, setTeacherUsername] = useState(student.teacherUsername);
  const [saved, setSaved] = useState(false);
  const teacherName = teachers.find((teacher) => teacher.username === student.teacherUsername)?.name ?? student.teacherUsername;
  return (
    <tr className="border-b border-border/60 last:border-0">
      <td className="px-4 py-3 font-medium text-foreground">{student.name}</td>
      <td className="px-4 py-3 text-muted-foreground">{student.username}</td>
      <td className="px-4 py-3">{isPrincipal ? <input value={classGroup} onChange={(e) => { setClassGroup(e.target.value); setSaved(false); }} className="w-24 rounded border border-input bg-background px-2 py-1.5 text-foreground" /> : <span className="text-muted-foreground">{student.classGroup}</span>}</td>
      <td className="px-4 py-3">{isPrincipal ? <select value={teacherUsername} onChange={(e) => { setTeacherUsername(e.target.value); setSaved(false); }} className="rounded border border-input bg-background px-2 py-1.5 text-foreground">{teachers.map((teacher) => <option key={teacher.username} value={teacher.username}>{teacher.name}</option>)}</select> : <span className="text-muted-foreground">{teacherName}</span>}</td>
      {isPrincipal ? <td className="px-4 py-3 text-right"><button type="button" onClick={() => { updateStudent(student.id, { name: student.name, classGroup: classGroup.trim() || student.classGroup, teacherUsername }); setSaved(true); }} className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">{saved ? t("Saved") : t("Save")}</button></td> : null}
    </tr>
  );
}
