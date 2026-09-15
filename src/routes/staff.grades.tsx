import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SUBJECTS, updateStudentScore, useSchoolStore, type Subject } from "@/lib/school-store";
import { useSession } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/staff/grades")({ component: GradesPage });

function GradesPage() {
  const store = useSchoolStore();
  const session = useSession();
  const isPrincipal = session?.role === "principal";
  const teacher = store.teachers.find((account) => account.username === session?.username);
  const students = isPrincipal ? store.students : store.students.filter((student) => student.teacherUsername === session?.username);
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{t("Grades")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isPrincipal ? t("All student marks across every subject.") : `${teacher?.subject ?? t("Your subject")} · ${t("Edit marks from 0 to 20 for your assigned class.")}`}
          </p>
        </div>
        <Link to="/staff/students" className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">{t("Back to students")}</Link>
      </header>

      {isPrincipal ? <PrincipalGrades students={students} /> : teacher ? <TeacherGrades students={students} subject={teacher.subject} /> : null}
    </div>
  );
}

function TeacherGrades({ students, subject }: { students: ReturnType<typeof useSchoolStore>["students"]; subject: Subject }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full min-w-[620px] text-left text-sm">
        <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Classroom</th><th className="px-4 py-3">{subject}</th><th className="px-4 py-3" /></tr></thead>
        <tbody>{students.map((student) => <EditableScore key={student.id} id={student.id} name={student.name} classGroup={student.classGroup} score={student.scores[subject]} subject={subject} />)}</tbody>
      </table>
    </div>
  );
}

function EditableScore({ id, name, classGroup, score, subject }: { id: string; name: string; classGroup: string; score: number; subject: Subject }) {
  const { t } = useLanguage();
  const [draft, setDraft] = useState(String(score));
  const [saved, setSaved] = useState(false);
  const validScore = Number(draft);
  function save() {
    if (!Number.isInteger(validScore) || validScore < 0 || validScore > 20) return;
    updateStudentScore(id, subject, validScore);
    setSaved(true);
  }
  return <tr className="border-b border-border/60 last:border-0"><td className="px-4 py-3 font-medium text-foreground">{name}</td><td className="px-4 py-3 text-muted-foreground">{classGroup}</td><td className="px-4 py-3"><div className="flex items-center gap-2"><input aria-label={`${name} ${subject} score`} type="number" min="0" max="20" value={draft} onChange={(event) => { setDraft(event.target.value); setSaved(false); }} className="w-20 rounded border border-input bg-background px-2 py-1.5 text-foreground" /><span className="text-muted-foreground">/20</span></div></td><td className="px-4 py-3 text-right"><button type="button" onClick={save} disabled={!Number.isInteger(validScore) || validScore < 0 || validScore > 20} className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-50">{saved ? t("Saved") : t("Save")}</button></td></tr>;
}

function PrincipalGrades({ students }: { students: ReturnType<typeof useSchoolStore>["students"] }) {
  return <div className="overflow-x-auto rounded-xl border border-border bg-card"><table className="w-full min-w-[900px] text-left text-sm"><thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="sticky left-0 bg-card px-4 py-3">Student</th><th className="px-4 py-3">Classroom</th>{SUBJECTS.map((subject) => <th key={subject} className="px-4 py-3 whitespace-nowrap">{subject}</th>)}</tr></thead><tbody>{students.map((student) => <tr key={student.id} className="border-b border-border/60 last:border-0"><td className="sticky left-0 bg-card px-4 py-3 font-medium text-foreground">{student.name}</td><td className="px-4 py-3 text-muted-foreground">{student.classGroup}</td>{SUBJECTS.map((subject) => <td key={subject} className="px-4 py-3 font-medium text-foreground">{student.scores[subject]}/20</td>)}</tr>)}</tbody></table></div>;
}
