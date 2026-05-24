"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setErr("密码不对，再试试。");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-black/[0.06] bg-white p-8 shadow-sm"
      >
        <h1 className="font-serif text-2xl text-ink">后台登录</h1>
        <p className="mt-1 text-sm text-ink-mute">
          密码在项目根目录的 <code className="font-mono">.env.local</code> 里。
        </p>
        <div className="mt-6">
          <label className="block text-xs font-mono uppercase tracking-wider text-ink-mute">
            密码
          </label>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-lg border border-black/10 bg-paper/60 px-3 py-2 text-ink outline-none focus:border-rose-deep focus:bg-white"
          />
        </div>
        {err && <p className="mt-3 text-sm text-rose-deep">{err}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-ink py-2.5 text-sm text-paper hover:bg-iris-deep transition-colors disabled:opacity-50"
        >
          {loading ? "登录中。。." : "登录"}
        </button>
      </form>
    </main>
  );
}
