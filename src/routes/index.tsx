import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import { courses } from "@/lib/learn";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LearnSphere — Learn skills that move you forward" },
      { name: "description", content: "LearnSphere is a modern learning platform for programming, web, AI and data courses." },
      { property: "og:title", content: "LearnSphere — Learn skills that move you forward" },
      { property: "og:description", content: "Courses in Java, web development, AI and more, with progress tracking." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

export function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-hero text-primary-foreground">L</span>
      LearnSphere
    </Link>
  );
}

function Home() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Brand />
        <nav className="flex items-center gap-3">
          <Link to="/login" className="btn-ghost">Sign in</Link>
          <Link to="/register" className="btn-primary">Get started</Link>
        </nav>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-2">
        <div>
          <span className="rounded-full bg-accent px-3 py-1 text-sm font-semibold text-accent-foreground">New courses every month</span>
          <h1 className="mt-6 text-5xl font-bold leading-tight md:text-6xl">
            Learn skills that <span className="text-primary">move you forward.</span>
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">
            Bite-sized lessons in programming, web, AI and data — with progress tracking that keeps you motivated.
          </p>
          <div className="mt-8 flex gap-3">
            <Link to="/register" className="btn-primary">Start learning free</Link>
            <a href="#courses" className="btn-ghost">Browse courses</a>
          </div>
          <div className="mt-10 flex gap-10">
            {[["6+", "Courses"], ["40+", "Lessons"], ["100%", "Free"]].map(([n, l]) => (
              <div key={l}><div className="font-display text-3xl font-bold">{n}</div><div className="text-sm text-muted-foreground">{l}</div></div>
            ))}
          </div>
        </div>
        <img src={hero} alt="Student learning on a laptop" width={1280} height={960} className="rounded-3xl shadow-soft" />
      </section>

      <section id="courses" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold">Popular courses</h2>
        <p className="mt-2 text-muted-foreground">Pick a path and start today.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <div key={c.id} className="rounded-2xl border bg-card p-6 shadow-soft">
              <div className="text-4xl">{c.icon}</div>
              <span className="mt-4 inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">{c.level}</span>
              <h3 className="mt-3 text-lg font-semibold">{c.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
              <p className="mt-4 text-xs text-muted-foreground">{c.lessons.length} lessons · {c.hours} hrs</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl bg-ink p-12 text-center text-ink-foreground">
          <h2 className="text-3xl font-bold">Ready to start your journey?</h2>
          <p className="mt-3 opacity-80">Create your free account in seconds.</p>
          <Link to="/register" className="btn-primary mt-6">Create account</Link>
        </div>
      </section>
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">© 2026 LearnSphere</footer>
    </div>
  );
}
