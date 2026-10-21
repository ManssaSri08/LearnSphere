import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { courses, currentUser, getDone, toggleLesson } from "@/lib/learn";

export const Route = createFileRoute("/courses/$id")({
  loader: ({ params }) => {
    const course = courses.find((c) => c.id === params.id);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.course.title ?? "Course"} — LearnSphere` },
      { name: "description", content: loaderData?.course.description ?? "" },
      { property: "og:title", content: `${loaderData?.course.title ?? "Course"} — LearnSphere` },
      { property: "og:description", content: loaderData?.course.description ?? "" },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CoursePage,
});

function CoursePage() {
  const { course } = Route.useLoaderData();
  const nav = useNavigate();
  const [done, setDone] = useState<number[]>([]);
  useEffect(() => { if (!currentUser()) nav({ to: "/login" }); else setDone(getDone(course.id)); }, [course.id, nav]);
  const p = Math.round((done.length / course.lessons.length) * 100);

  return (
    <div className="mx-auto max-w-3xl p-6 md:p-10">
      <Link to="/dashboard" className="text-sm font-semibold text-primary">← Back to dashboard</Link>
      <div className="mt-6 rounded-3xl bg-hero p-8 text-primary-foreground">
        <div className="text-5xl">{course.icon}</div>
        <h1 className="mt-4 text-4xl font-bold">{course.title}</h1>
        <p className="mt-2 opacity-85">{course.description}</p>
        <p className="mt-4 text-sm opacity-80">{course.level} · {course.lessons.length} lessons · {course.hours} hrs</p>
        <div className="mt-5 h-2 rounded-full bg-primary-foreground/25"><div className="h-2 rounded-full bg-highlight transition-all" style={{ width: `${p}%` }} /></div>
        <p className="mt-2 text-sm">{p}% completed</p>
      </div>
      <h2 className="mt-10 text-2xl font-bold">Lessons</h2>
      <ol className="mt-4 space-y-3">
        {course.lessons.map((l, i) => {
          const d = done.includes(i);
          return (
            <li key={l}>
              <button onClick={() => { toggleLesson(course.id, i); setDone(getDone(course.id)); }}
                className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${d ? "border-primary bg-accent" : "bg-card hover:bg-muted"}`}>
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-semibold ${d ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>{d ? "✓" : i + 1}</span>
                <span className="flex-1 font-medium">{l}</span>
                <span className="text-xs text-muted-foreground">{d ? "Completed" : "Mark complete"}</span>
              </button>
            </li>
          );
        })}
      </ol>
      {p === 100 && <p className="mt-8 rounded-2xl bg-highlight p-5 text-center font-semibold text-highlight-foreground">🎉 Congratulations! You finished this course.</p>}
    </div>
  );
}
