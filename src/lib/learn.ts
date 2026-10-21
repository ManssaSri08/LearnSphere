export type Course = {
  id: string; title: string; category: string; level: "Beginner" | "Intermediate" | "Advanced";
  description: string; icon: string; lessons: string[]; hours: number;
};

export const courses: Course[] = [
  { id: "java", title: "Java Programming", category: "Programming", level: "Beginner", icon: "☕", hours: 12,
    description: "Learn Java fundamentals and object-oriented programming.",
    lessons: ["Setting up Java", "Variables & types", "Control flow", "Classes & objects", "Inheritance", "Collections", "Exceptions", "Mini project"] },
  { id: "web", title: "Web Development", category: "Web", level: "Beginner", icon: "🌐", hours: 10,
    description: "Build websites using HTML, CSS, and JavaScript.",
    lessons: ["How the web works", "HTML basics", "CSS layout", "Flexbox & grid", "JavaScript basics", "DOM events", "Build a portfolio"] },
  { id: "ai", title: "Introduction to AI", category: "AI", level: "Intermediate", icon: "🤖", hours: 8,
    description: "Discover artificial intelligence and its real-world applications.",
    lessons: ["What is AI?", "Machine learning basics", "Neural networks", "Data & ethics", "AI in practice"] },
  { id: "spring", title: "Spring Boot APIs", category: "Backend", level: "Intermediate", icon: "🍃", hours: 9,
    description: "Create REST APIs with Spring Boot and connect them to MySQL.",
    lessons: ["Project setup", "Controllers", "Services", "JPA & MySQL", "Validation", "Security basics"] },
  { id: "react", title: "React Essentials", category: "Web", level: "Intermediate", icon: "⚛️", hours: 7,
    description: "Build interactive interfaces with components, state and hooks.",
    lessons: ["Components", "Props & state", "Hooks", "Fetching data", "Forms", "Routing"] },
  { id: "sql", title: "SQL for Beginners", category: "Data", level: "Beginner", icon: "🗄️", hours: 6,
    description: "Query, filter and join data like a pro using MySQL.",
    lessons: ["Tables & rows", "SELECT queries", "Filtering", "Joins", "Grouping", "Indexes"] },
];

type User = { name: string; email: string; password: string };
type Store = { users: User[]; current: string | null; progress: Record<string, Record<string, number[]>> };

const KEY = "learnsphere";
function load(): Store {
  if (typeof window === "undefined") return { users: [], current: null, progress: {} };
  try { return { users: [], current: null, progress: {}, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; }
  catch { return { users: [], current: null, progress: {} }; }
}
const save = (s: Store) => localStorage.setItem(KEY, JSON.stringify(s));

export function register(name: string, email: string, password: string) {
  const s = load(); const e = email.trim().toLowerCase();
  if (s.users.some((u) => u.email === e)) throw new Error("An account with this email already exists.");
  s.users.push({ name: name.trim(), email: e, password }); s.current = e; save(s);
}
export function login(email: string, password: string) {
  const s = load(); const e = email.trim().toLowerCase();
  const u = s.users.find((x) => x.email === e && x.password === password);
  if (!u) throw new Error("Invalid email or password.");
  s.current = e; save(s);
}
export function logout() { const s = load(); s.current = null; save(s); }
export function currentUser() { const s = load(); return s.users.find((u) => u.email === s.current) ?? null; }
export function getDone(courseId: string): number[] {
  const s = load(); return (s.current && s.progress[s.current]?.[courseId]) || [];
}
export function toggleLesson(courseId: string, i: number) {
  const s = load(); if (!s.current) return;
  const p = (s.progress[s.current] ??= {}); const d = new Set(p[courseId] ?? []);
  d.has(i) ? d.delete(i) : d.add(i); p[courseId] = [...d]; save(s);
}
export const percent = (c: Course) => Math.round((getDone(c.id).length / c.lessons.length) * 100);
export function updateName(name: string) {
  const s = load(); const u = s.users.find((x) => x.email === s.current);
  if (u) { u.name = name.trim(); save(s); }
}
