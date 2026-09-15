import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type CSSProperties } from "react";
import { logout, useHydrated, useSession } from "@/lib/auth";
import {
  moveDashboardPanel,
  undoEditorChange,
  updateEditorContent,
  updateEditorElement,
  useEditorState,
  type DashboardPanel,
  type EditableElement,
  type PreviewRole,
} from "@/lib/editor-store";

export const Route = createFileRoute("/editor")({ component: EditorPage });

const panelLabels: Record<DashboardPanel, string> = {
  classes: "Today's classes",
  grades: "Recent grades",
  exams: "Upcoming exams",
  attendance: "Attendance summary",
};

const roles: Array<{ id: PreviewRole; label: string; description: string }> = [
  { id: "student", label: "Student", description: "Student portal" },
  { id: "teacher", label: "Teacher", description: "Teacher workspace" },
  { id: "principal", label: "Principal", description: "School overview" },
  { id: "organizer", label: "Organizer", description: "Activities hub" },
];

function EditorPage() {
  const session = useSession();
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const editor = useEditorState();
  const [draft, setDraft] = useState(editor.content);
  const [activeRole, setActiveRole] = useState<PreviewRole>("student");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (hydrated && (!session || session.username !== "Aztx")) navigate({ to: "/" });
  }, [hydrated, session, navigate]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        undoEditorChange();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => setSelectedId(null), [activeRole]);

  if (!hydrated || !session || session.username !== "Aztx") {
    return <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">Loading editor…</div>;
  }

  const selected = selectedId ? editor.elements[activeRole]?.[selectedId] ?? null : null;

  return (
    <main className="page-enter min-h-screen bg-background px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Himam Almaali editor</p>
            <h1 className="mt-2 text-3xl font-semibold text-foreground">Edit your site</h1>
            <p className="mt-1 text-sm text-muted-foreground">Preview each account and double-click any block to edit it. Press Ctrl+Z to undo.</p>
          </div>
          <button type="button" onClick={() => { logout(); navigate({ to: "/" }); }} className="rounded-md border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted">Exit editor</button>
        </header>

        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground">See website as</h2>
                <p className="mt-1 text-sm text-muted-foreground">Choose a role to preview its dashboard and controls.</p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Live local preview</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
              {roles.map((role) => (
                <button key={role.id} type="button" onClick={() => setActiveRole(role.id)} className={`rounded-xl border px-3 py-3 text-left transition-all ${activeRole === role.id ? "border-primary bg-primary/10 shadow-sm" : "border-border hover:bg-muted"}`}>
                  <span className="block text-sm font-semibold text-foreground">{role.label}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{role.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="min-w-0 bg-muted/30 p-4 md:p-6">
              <RolePreview role={activeRole} elements={editor.elements[activeRole]} selectedId={selectedId} onSelect={setSelectedId} />
              <p className="mt-3 text-center text-xs text-muted-foreground">Double-click a title or card to open its editor.</p>
            </div>
            <ElementInspector role={activeRole} element={selected} />
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">Website text</h2>
          <p className="mt-1 text-sm text-muted-foreground">Edit the text shown on the login screen and student dashboard.</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <EditorField label="Login title" value={draft.loginTitle} onChange={(value) => setDraft({ ...draft, loginTitle: value })} onBlur={() => updateEditorContent({ loginTitle: draft.loginTitle })} />
            <EditorField label="Login description" value={draft.loginDescription} onChange={(value) => setDraft({ ...draft, loginDescription: value })} onBlur={() => updateEditorContent({ loginDescription: draft.loginDescription })} />
            <EditorField label="Dashboard greeting" hint="Use {name} for the student's first name." value={draft.dashboardGreeting} onChange={(value) => setDraft({ ...draft, dashboardGreeting: value })} onBlur={() => updateEditorContent({ dashboardGreeting: draft.dashboardGreeting })} />
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">Student dashboard layout</h2>
          <p className="mt-1 text-sm text-muted-foreground">Move the student dashboard panels up or down.</p>
          <div className="mt-4 space-y-2">
            {editor.dashboardOrder.map((panel, index) => (
              <div key={panel} className="flex items-center justify-between rounded-lg border border-border/70 px-4 py-3">
                <span className="text-sm font-medium text-foreground">{index + 1}. {panelLabels[panel]}</span>
                <div className="flex gap-2">
                  <button type="button" disabled={index === 0} onClick={() => moveDashboardPanel(panel, -1)} className="rounded-md border border-border px-3 py-1 text-xs text-foreground hover:bg-muted disabled:opacity-30">↑</button>
                  <button type="button" disabled={index === editor.dashboardOrder.length - 1} onClick={() => moveDashboardPanel(panel, 1)} className="rounded-md border border-border px-3 py-1 text-xs text-foreground hover:bg-muted disabled:opacity-30">↓</button>
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={undoEditorChange} className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">Undo last change</button>
        </section>
      </div>
    </main>
  );
}

function RolePreview({ role, elements, selectedId, onSelect }: { role: PreviewRole; elements: Record<string, EditableElement>; selectedId: string | null; onSelect: (id: string) => void }) {
  const get = (id: string) => elements[`${role}-${id}`];
  const cards = role === "student"
    ? [get("grades"), get("attendance"), get("classes")]
    : role === "teacher"
      ? [get("class"), get("gradebook"), get("students")]
      : role === "principal"
        ? [get("students"), get("announcements"), get("results")]
        : [get("football"), get("basketball"), get("requests")];

  return (
    <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border bg-background shadow-lg">
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">H</span><span className="text-sm font-semibold text-foreground">Himam Almaali</span></div>
        <span className="rounded-full border border-border px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{roles.find((item) => item.id === role)?.label} view</span>
      </div>
      <div className="space-y-4 p-5 md:p-7">
        <PreviewItem element={get("title")} selected={selectedId === get("title")?.id} onSelect={onSelect} className="font-semibold" />
        <PreviewItem element={get("welcome")} selected={selectedId === get("welcome")?.id} onSelect={onSelect} className="font-medium shadow-sm" />
        <div className="grid gap-3 sm:grid-cols-3">
          {cards.map((card) => <PreviewItem key={card?.id} element={card} selected={selectedId === card?.id} onSelect={onSelect} className="min-h-24 font-medium shadow-sm" />)}
        </div>
        <div className="flex items-center justify-between rounded-lg border border-dashed border-border bg-card/60 px-3 py-2 text-xs text-muted-foreground"><span>Navigation</span><span>Dashboard · Schedule · Grades · Settings</span></div>
      </div>
    </div>
  );
}

function PreviewItem({ element, selected, onSelect, className = "" }: { element?: EditableElement; selected: boolean; onSelect: (id: string) => void; className?: string }) {
  if (!element) return null;
  const style: CSSProperties = {
    background: element.background,
    color: element.color,
    borderRadius: `${element.borderRadius}px`,
    padding: `${element.padding}px`,
    fontSize: `${element.fontSize}px`,
    transform: `translate(${element.x}px, ${element.y}px)`,
  };
  return <div role="button" tabIndex={0} title="Double-click to edit" onDoubleClick={(event) => { event.stopPropagation(); onSelect(element.id); }} onKeyDown={(event) => { if (event.key === "Enter") onSelect(element.id); }} style={style} className={`relative cursor-pointer border transition-all hover:ring-2 hover:ring-primary/40 ${selected ? "border-primary ring-2 ring-primary/30" : "border-border/70"} ${className}`}>{element.text}</div>;
}

function ElementInspector({ role, element }: { role: PreviewRole; element: EditableElement | null }) {
  const [draft, setDraft] = useState<EditableElement | null>(element);

  useEffect(() => setDraft(element), [element]);

  if (!element || !draft) {
    return <aside className="border-t border-border p-5 lg:border-l lg:border-t-0"><p className="text-sm font-semibold text-foreground">Element editor</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Double-click a preview element to edit its text, size, position, colors, spacing, and corner radius.</p></aside>;
  }

  const set = <K extends keyof EditableElement>(key: K, value: EditableElement[K]) => setDraft({ ...draft, [key]: value });
  const apply = () => updateEditorElement(role, element.id, draft);

  return (
    <aside className="border-t border-border p-5 lg:border-l lg:border-t-0">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Editing</p>
      <h3 className="mt-1 text-lg font-semibold text-foreground">{element.label}</h3>
      <div className="mt-4 space-y-4">
        <label className="block space-y-1.5"><span className="text-xs font-medium text-muted-foreground">Text</span><textarea value={draft.text} onChange={(event) => set("text", event.target.value)} rows={3} className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary" /></label>
        <div className="grid grid-cols-2 gap-3">
          <NumberField label="Font size" value={draft.fontSize} min={10} max={48} onChange={(value) => set("fontSize", value)} />
          <NumberField label="Padding" value={draft.padding} min={0} max={48} onChange={(value) => set("padding", value)} />
          <NumberField label="Move left/right" value={draft.x} min={-80} max={80} onChange={(value) => set("x", value)} />
          <NumberField label="Move up/down" value={draft.y} min={-80} max={80} onChange={(value) => set("y", value)} />
          <NumberField label="Corner radius" value={draft.borderRadius} min={0} max={40} onChange={(value) => set("borderRadius", value)} />
        </div>
        <label className="block space-y-1.5"><span className="text-xs font-medium text-muted-foreground">Background</span><select value={draft.background} onChange={(event) => set("background", event.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"><option value="var(--card)">Card</option><option value="var(--card-2)">Soft card</option><option value="var(--primary)">Primary</option><option value="transparent">Transparent</option></select></label>
        <label className="block space-y-1.5"><span className="text-xs font-medium text-muted-foreground">Text color</span><select value={draft.color} onChange={(event) => set("color", event.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"><option value="var(--foreground)">Normal text</option><option value="var(--primary-foreground)">Primary contrast</option><option value="var(--muted-foreground)">Muted text</option></select></label>
        <button type="button" onClick={apply} className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">Apply changes</button>
      </div>
    </aside>
  );
}

function NumberField({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return <label className="block space-y-1.5"><span className="text-xs font-medium text-muted-foreground">{label}</span><input type="number" value={value} min={min} max={max} onChange={(event) => onChange(Number(event.target.value))} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary" /></label>;
}

function EditorField({ label, hint, value, onChange, onBlur }: { label: string; hint?: string; value: string; onChange: (value: string) => void; onBlur: () => void }) {
  return <label className="block space-y-1.5"><span className="text-sm font-medium text-foreground">{label}</span>{hint ? <span className="block text-xs text-muted-foreground">{hint}</span> : null}<input value={value} onChange={(event) => onChange(event.target.value)} onBlur={onBlur} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary" /></label>;
}
