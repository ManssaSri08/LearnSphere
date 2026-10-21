import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthCard } from "@/components/AuthCard";
import { register } from "@/lib/learn";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — LearnSphere" },
      { name: "description", content: "Create your free LearnSphere account." },
      { property: "og:title", content: "Create account — LearnSphere" },
      { property: "og:description", content: "Create your free LearnSphere account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Register,
});

function Register() {
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", email: "", pw: "" }); const [err, setErr] = useState("");
  return (
    <AuthCard title="Create your account" subtitle="Start learning in under a minute.">
      <form className="space-y-4" onSubmit={(e) => {
        e.preventDefault();
        if (f.pw.length < 6) return setErr("Password must be at least 6 characters.");
        try { register(f.name, f.email, f.pw); nav({ to: "/dashboard" }); } catch (x) { setErr((x as Error).message); }
      }}>
        <input className="field" placeholder="Full name" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        <input className="field" type="email" placeholder="Email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <input className="field" type="password" placeholder="Password (min 6 characters)" required value={f.pw} onChange={(e) => setF({ ...f, pw: e.target.value })} />
        {err && <p className="text-sm text-destructive">{err}</p>}
        <button className="btn-primary w-full">Create account</button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account? <Link to="/login" className="font-semibold text-primary">Sign in</Link>
      </p>
    </AuthCard>
  );
}
