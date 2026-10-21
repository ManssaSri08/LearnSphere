import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthCard } from "@/components/AuthCard";
import { login } from "@/lib/learn";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — LearnSphere" },
      { name: "description", content: "Sign in to continue learning on LearnSphere." },
      { property: "og:title", content: "Sign in — LearnSphere" },
      { property: "og:description", content: "Sign in to continue learning on LearnSphere." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState(""); const [pw, setPw] = useState(""); const [err, setErr] = useState("");
  return (
    <AuthCard title="Welcome back" subtitle="Sign in to continue your learning.">
      <form className="space-y-4" onSubmit={(e) => {
        e.preventDefault();
        try { login(email, pw); nav({ to: "/dashboard" }); } catch (x) { setErr((x as Error).message); }
      }}>
        <input className="field" type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="field" type="password" placeholder="Password" required value={pw} onChange={(e) => setPw(e.target.value)} />
        {err && <p className="text-sm text-destructive">{err}</p>}
        <button className="btn-primary w-full">Sign in</button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New here? <Link to="/register" className="font-semibold text-primary">Create an account</Link>
      </p>
    </AuthCard>
  );
}
