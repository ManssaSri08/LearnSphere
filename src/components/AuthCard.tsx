import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function AuthCard({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="hidden flex-col justify-between bg-hero p-12 text-primary-foreground md:flex">
        <Link to="/" className="font-display text-xl font-bold">LearnSphere</Link>
        <div>
          <h2 className="text-4xl font-bold leading-tight">Keep learning,<br />keep growing.</h2>
          <p className="mt-4 max-w-sm opacity-85">Every lesson brings you one step closer to your goals.</p>
        </div>
        <p className="text-sm opacity-70">🎓 Join learners building real skills</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
