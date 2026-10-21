import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { courses, currentUser, getDone, logout, percent, updateName, type Course } from "@/lib/learn";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — LearnSphere" },
      { name: "description", content: "Your LearnSphere courses and progress." },
      { property: "og:title", content: "Dashboard — LearnSphere" },
      { property: "og:description", content: "Your LearnSphere courses and progress." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

const TABS = ["Dashboard", "My Courses", "Progress", "Profile"] as const;
type Tab = (typeof TABS)[number];

function CourseCard({ c }: { c: Course }) {
  const p = percent(c);
  return (
    <article className="flex flex-col rounded-2xl border bg-card p-6 shadow-soft">
      <div className="text-4xl">{c.icon}</div>
      <span className="mt-3 w-fit rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">{c.level}</span>
      <h3 className="mt-3 text-lg font-semibold">{c.title}</h3>
      <p className="mt-1 flex-1 text-sm text-muted-foreground">{c.description}</p>
      <div className="mt-4 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${p}%` }} /></div>
      <p className="mt-2 text-xs text-muted-foreground">{p}% completed</p>
      <Link to="/courses/$id" params={{ id: c.id }} className="btn-primary mt-4">{p > 0 ? "Continue learning" : "Start course"}</Link>
    </article>
  );
}

function Dashboard() {
  const nav = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [tab, setTab] = useState<Tab>("Dashboard");
  const [q, setQ] = useState(""); const [cat, setCat] = useState("All");
  const [draft, setDraft] = useState(""); const [saved, setSaved] = useState(false);
  useEffect(() => { const u = currentUser(); if (!u) nav({ to: "/login" }); else { setUser(u); setDraft(u.name); } }, [nav]);
  const cats = ["All", ...new Set(courses.map((c) => c.category))];
  const list = useMemo(() => courses.filter((c) => (cat === "All" || c.category === cat) && c.title.toLowerCase().includes(q.toLowerCase())), [q, cat]);
  if (!user) return null;
  const name = user.name;
  const done = courses.reduce((n, c) => n + getDone(c.id).length, 0);
  const total = courses.reduce((n, c) => n + c.lessons.length, 0);
  const mine = courses.filter((c) => getDone(c.id).length > 0);
  const finished = mine.filter((c) => percent(c) === 100).length;

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="flex flex-col bg-ink p-4 text-ink-foreground md:w-64 md:p-6">
        <div className="font-display text-xl font-bold">LearnSphere</div>
        <nav className="mt-4 flex gap-1 overflow-x-auto text-sm md:mt-10 md:flex-col">
          {TABS.map((l) => (
            <button key={l} onClick={() => setTab(l)}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-left transition ${tab === l ? "bg-primary text-primary-foreground" : "opacity-75 hover:opacity-100"}`}>{l}</button>
          ))}
        </nav>
        <button className="mt-4 rounded-lg border border-ink-foreground/20 px-3 py-2 text-sm md:mt-auto" onClick={() => { logout(); nav({ to: "/" }); }}>Sign out</button>
      </aside>

      <main className="flex-1 p-6 md:p-10">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{tab === "Dashboard" ? `Welcome back, ${name}!` : tab}</h1>
            <p className="text-muted-foreground">
              {{ Dashboard: "Continue your learning journey today.", "My Courses": "Courses you've started.", Progress: "See how far you've come.", Profile: "Manage your account details." }[tab]}
            </p>
          </div>
          <button onClick={() => setTab("Profile")} className="grid h-12 w-12 place-items-center rounded-full bg-hero font-bold text-primary-foreground">{name[0]?.toUpperCase()}</button>
        </header>

        {tab === "Dashboard" && (<>
          <section className="mt-8 flex items-center justify-between rounded-3xl bg-hero p-8 text-primary-foreground">
            <div><h2 className="text-2xl font-bold">Keep learning, keep growing!</h2><p className="mt-1 opacity-85">Every lesson brings you one step closer to your goals.</p></div>
            <span className="text-5xl">🎓</span>
          </section>
          <section className="mt-6 grid gap-4 sm:grid-cols-3">
            {[["📚", "Courses started", mine.length], ["✅", "Lessons completed", done], ["🏆", "Courses finished", finished]].map(([i, l, n]) => (
              <div key={l as string} className="rounded-2xl border bg-card p-5 shadow-soft">
                <span className="text-2xl">{i}</span><p className="mt-2 text-sm text-muted-foreground">{l}</p><p className="font-display text-3xl font-bold">{n}</p>
              </div>
            ))}
          </section>
          <section className="mt-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-2xl font-bold">All courses</h2>
              <input className="field max-w-xs" placeholder="Search courses…" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {cats.map((c) => (
                <button key={c} onClick={() => setCat(c)} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${cat === c ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>{c}</button>
              ))}
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {list.map((c) => <CourseCard key={c.id} c={c} />)}
              {list.length === 0 && <p className="text-muted-foreground">No courses match your search.</p>}
            </div>
          </section>
        </>)}

        {tab === "My Courses" && (
          <section className="mt-8">
            {mine.length === 0 ? (
              <div className="rounded-2xl border bg-card p-10 text-center shadow-soft">
                <p className="text-4xl">📚</p>
                <p className="mt-3 font-semibold">You haven't started any courses yet.</p>
                <button className="btn-primary mt-5" onClick={() => setTab("Dashboard")}>Browse courses</button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{mine.map((c) => <CourseCard key={c.id} c={c} />)}</div>
            )}
          </section>
        )}

        {tab === "Progress" && (
          <section className="mt-8 space-y-6">
            <div className="rounded-3xl bg-hero p-8 text-primary-foreground">
              <p className="opacity-85">Overall progress</p>
              <p className="font-display text-5xl font-bold">{Math.round((done / total) * 100)}%</p>
              <div className="mt-4 h-2 rounded-full bg-primary-foreground/25"><div className="h-2 rounded-full bg-highlight" style={{ width: `${(done / total) * 100}%` }} /></div>
              <p className="mt-2 text-sm opacity-85">{done} of {total} lessons completed</p>
            </div>
            <div className="rounded-2xl border bg-card p-6 shadow-soft">
              {courses.map((c) => { const p = percent(c); return (
                <Link key={c.id} to="/courses/$id" params={{ id: c.id }} className="flex items-center gap-4 border-b py-4 last:border-0">
                  <span className="text-2xl">{c.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm font-semibold"><span>{c.title}</span><span>{p}%</span></div>
                    <div className="mt-2 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${p}%` }} /></div>
                    <p className="mt-1 text-xs text-muted-foreground">{getDone(c.id).length} / {c.lessons.length} lessons</p>
                  </div>
                </Link>
              ); })}
            </div>
          </section>
        )}

        {tab === "Profile" && (
          <section className="mt-8 max-w-lg rounded-2xl border bg-card p-8 shadow-soft">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-hero text-2xl font-bold text-primary-foreground">{name[0]?.toUpperCase()}</div>
              <div><p className="text-xl font-semibold">{name}</p><p className="text-sm text-muted-foreground">{user.email}</p></div>
            </div>
            <form className="mt-8 space-y-4" onSubmit={(e) => {
              e.preventDefault(); if (!draft.trim()) return;
              updateName(draft); setUser({ ...user, name: draft.trim() }); setSaved(true); setTimeout(() => setSaved(false), 2000);
            }}>
              <label className="block text-sm font-semibold">Full name
                <input className="field mt-1" value={draft} onChange={(e) => setDraft(e.target.value)} />
              </label>
              <label className="block text-sm font-semibold">Email
                <input className="field mt-1 opacity-60" value={user.email} disabled />
              </label>
              <div className="flex items-center gap-3">
                <button className="btn-primary">Save changes</button>
                {saved && <span className="text-sm text-primary">Saved ✓</span>}
              </div>
            </form>
            <div className="mt-8 grid grid-cols-3 gap-3 text-center">
              {[["Started", mine.length], ["Lessons", done], ["Finished", finished]].map(([l, n]) => (
                <div key={l as string} className="rounded-xl bg-secondary p-3"><p className="font-display text-2xl font-bold">{n}</p><p className="text-xs text-muted-foreground">{l}</p></div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
