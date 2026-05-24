"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useTransition } from "react";
import type {
  Profile,
  Experience,
  Project,
  Article,
} from "@/lib/db";

type Tab = "profile" | "experience" | "projects" | "articles";

export default function AdminClient({
  initialProfile,
  initialExperience,
  initialProjects,
  initialArticles,
}: {
  initialProfile: Profile;
  initialExperience: Experience[];
  initialProjects: Project[];
  initialArticles: Article[];
}) {
  const [tab, setTab] = useState<Tab>("profile");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [seedRunning, setSeedRunning] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  function refresh() {
    startTransition(() => router.refresh());
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  async function runSeed() {
    if (
      !confirm(
        "把 scripts/ 里的种子数据 + 文章灌进当前 DB？\n（UPSERT 操作，已有内容会被代码里的版本覆盖。本地 DB 通常不用跑这个；线上首次部署后跑一次。）"
      )
    )
      return;
    setSeedRunning(true);
    setSeedResult(null);
    try {
      const res = await fetch("/api/admin/seed-all", { method: "POST" });
      const json = await res.json();
      setSeedResult(JSON.stringify(json, null, 2));
      if (res.ok) router.refresh();
    } catch (e: any) {
      setSeedResult("Network error: " + (e?.message ?? String(e)));
    } finally {
      setSeedRunning(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-serif text-lg text-ink hover:text-iris-deep">
              ← 返回主站
            </Link>
            <span className="text-ink-mute">/</span>
            <span className="font-mono text-xs uppercase tracking-wider text-ink-mute">
              admin
            </span>
            {isPending && (
              <span className="text-xs text-iris-deep ml-2">同步中。。.</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={runSeed}
              disabled={seedRunning}
              className="text-sm text-iris-deep hover:text-rose-deep transition-colors disabled:opacity-50"
              title="把 scripts/ 里的种子数据灌进当前 DB（UPSERT，重复跑安全）"
            >
              {seedRunning ? "灌数据中..." : "灌种子数据"}
            </button>
            <span className="text-ink-mute">/</span>
            <button
              onClick={logout}
              className="text-sm text-ink-mute hover:text-rose-deep transition-colors"
            >
              退出
            </button>
          </div>
        </div>
        {seedResult && (
          <div className="mx-auto max-w-5xl px-6 pb-3">
            <pre className="max-h-64 overflow-auto rounded-lg border border-black/10 bg-paper/60 p-3 text-xs font-mono leading-relaxed text-ink-soft">
              {seedResult}
            </pre>
            <button
              onClick={() => setSeedResult(null)}
              className="mt-1 text-xs text-ink-mute hover:text-rose-deep"
            >
              关闭日志
            </button>
          </div>
        )}
        <div className="mx-auto flex max-w-5xl gap-1 px-6">
          {(
            [
              ["profile", "个人信息"],
              ["experience", "工作经历"],
              ["projects", "项目"],
              ["articles", "文章"],
            ] as [Tab, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`relative px-4 py-3 text-sm transition-colors ${
                tab === key
                  ? "text-ink"
                  : "text-ink-mute hover:text-ink"
              }`}
            >
              {label}
              {tab === key && (
                <span className="absolute inset-x-3 -bottom-px h-0.5 bg-rose-deep" />
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        {tab === "profile" && (
          <ProfileEditor profile={initialProfile} onSaved={refresh} />
        )}
        {tab === "experience" && (
          <ExperienceEditor items={initialExperience} onChanged={refresh} />
        )}
        {tab === "projects" && (
          <ProjectsEditor items={initialProjects} onChanged={refresh} />
        )}
        {tab === "articles" && (
          <ArticlesEditor items={initialArticles} onChanged={refresh} />
        )}
      </main>
    </div>
  );
}

/* ------------------------------ shared bits ------------------------------ */

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-mono uppercase tracking-wider text-ink-mute">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1 text-xs text-ink-mute">{hint}</p>}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-ink outline-none focus:border-rose-deep focus:ring-2 focus:ring-rose-soft/40 transition";

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-6">
      {children}
    </div>
  );
}

function PrimaryBtn({
  children,
  onClick,
  disabled,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="rounded-lg bg-ink px-4 py-2 text-sm text-paper hover:bg-iris-deep transition-colors disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function GhostBtn({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm text-ink-soft hover:border-rose-deep hover:text-rose-deep transition-colors"
    >
      {children}
    </button>
  );
}

function DangerBtn({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-rose-deep/30 px-3 py-1.5 text-xs text-rose-deep hover:bg-rose-soft/30 transition-colors"
    >
      {children}
    </button>
  );
}

/* ----------- structured JSON editors (used by profile + exp + proj) ----------- */

type HL = { tag?: string; body: string; link?: { url: string; label: string } };

function HighlightsEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  let items: HL[] = [];
  try {
    const parsed = JSON.parse(value || "[]");
    if (Array.isArray(parsed)) items = parsed;
  } catch {}

  const push = (next: HL[]) => onChange(JSON.stringify(next));
  const add = () => push([...items, { tag: "", body: "" }]);
  const patch = (i: number, f: Partial<HL>) =>
    push(items.map((h, idx) => (idx === i ? { ...h, ...f } : h)));
  const remove = (i: number) => push(items.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    push(next);
  };
  const setLink = (i: number, url: string, label: string) => {
    const link = url || label ? { url, label } : undefined;
    push(items.map((h, idx) => (idx === i ? { ...h, link } : h)));
  };

  return (
    <div className="space-y-3">
      {items.map((h, i) => (
        <div
          key={i}
          className="rounded-lg border border-black/10 bg-paper/60 p-3"
        >
          <div className="flex items-center gap-2">
            <input
              className={inputCls + " flex-1 text-sm"}
              placeholder="TAG（如：项目简介 / 技术架构设计）"
              value={h.tag ?? ""}
              onChange={(e) => patch(i, { tag: e.target.value })}
            />
            <button
              type="button"
              onClick={() => move(i, -1)}
              disabled={i === 0}
              className="px-2 text-xs text-ink-mute hover:text-ink disabled:opacity-30"
              title="上移"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => move(i, 1)}
              disabled={i === items.length - 1}
              className="px-2 text-xs text-ink-mute hover:text-ink disabled:opacity-30"
              title="下移"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => remove(i)}
              className="px-2 text-xs text-rose-deep"
            >
              删
            </button>
          </div>
          <textarea
            className={inputCls + " mt-2 min-h-[64px] text-sm leading-relaxed"}
            placeholder="正文"
            value={h.body}
            onChange={(e) => patch(i, { body: e.target.value })}
          />
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
            <input
              className={inputCls + " text-xs font-mono"}
              placeholder="可选：link URL"
              value={h.link?.url ?? ""}
              onChange={(e) => setLink(i, e.target.value, h.link?.label ?? "")}
            />
            <input
              className={inputCls + " text-xs"}
              placeholder="可选：link 标签（如「展示视频」）"
              value={h.link?.label ?? ""}
              onChange={(e) => setLink(i, h.link?.url ?? "", e.target.value)}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="block w-full rounded-lg border border-dashed border-black/20 px-3 py-2 text-sm text-ink-mute hover:border-rose-deep hover:text-rose-deep"
      >
        + 添加一条
      </button>
    </div>
  );
}

type ST = { kicker: string; title: string; tagline: string; body: string };

function StrengthsEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  let items: ST[] = [];
  try {
    const parsed = JSON.parse(value || "[]");
    if (Array.isArray(parsed)) items = parsed;
  } catch {}

  const push = (next: ST[]) => onChange(JSON.stringify(next));
  const add = () => {
    const nextKicker = String(items.length + 1).padStart(2, "0");
    push([
      ...items,
      { kicker: nextKicker, title: "", tagline: "", body: "" },
    ]);
  };
  const patch = (i: number, f: Partial<ST>) =>
    push(items.map((s, idx) => (idx === i ? { ...s, ...f } : s)));
  const remove = (i: number) => push(items.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      {items.map((s, i) => (
        <div
          key={i}
          className="rounded-lg border border-black/10 bg-paper/60 p-3"
        >
          <div className="grid grid-cols-[80px_1fr_auto] items-center gap-2">
            <input
              className={inputCls + " text-sm font-mono"}
              placeholder="01"
              value={s.kicker}
              onChange={(e) => patch(i, { kicker: e.target.value })}
            />
            <input
              className={inputCls + " text-sm"}
              placeholder="标题（如：6 年互联网 + 3 年 AI 产品实战）"
              value={s.title}
              onChange={(e) => patch(i, { title: e.target.value })}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="px-2 text-xs text-rose-deep"
            >
              删
            </button>
          </div>
          <input
            className={inputCls + " mt-2 text-sm"}
            placeholder="tagline（如：具备 0 → 1 项目主导经验）"
            value={s.tagline}
            onChange={(e) => patch(i, { tagline: e.target.value })}
          />
          <textarea
            className={inputCls + " mt-2 min-h-[90px] text-sm leading-relaxed"}
            placeholder="正文（多句用 。 分段，前台会自动按句断行）"
            value={s.body}
            onChange={(e) => patch(i, { body: e.target.value })}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="block w-full rounded-lg border border-dashed border-black/20 px-3 py-2 text-sm text-ink-mute hover:border-rose-deep hover:text-rose-deep"
      >
        + 添加一条优势
      </button>
    </div>
  );
}

type SK = { label: string; items: string };

function SkillsEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  let rows: SK[] = [];
  try {
    const parsed = JSON.parse(value || "[]");
    if (Array.isArray(parsed)) rows = parsed;
  } catch {}

  const push = (next: SK[]) => onChange(JSON.stringify(next));
  const add = () => push([...rows, { label: "", items: "" }]);
  const patch = (i: number, f: Partial<SK>) =>
    push(rows.map((r, idx) => (idx === i ? { ...r, ...f } : r)));
  const remove = (i: number) => push(rows.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      {rows.map((r, i) => (
        <div
          key={i}
          className="rounded-lg border border-black/10 bg-paper/60 p-3"
        >
          <div className="flex items-center gap-2">
            <input
              className={inputCls + " w-40 text-sm"}
              placeholder="分类（如：AI 产品方法论）"
              value={r.label}
              onChange={(e) => patch(i, { label: e.target.value })}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="ml-auto px-2 text-xs text-rose-deep"
            >
              删
            </button>
          </div>
          <textarea
            className={inputCls + " mt-2 min-h-[60px] text-sm leading-relaxed"}
            placeholder="技能列表（用 · 或 / 分隔）"
            value={r.items}
            onChange={(e) => patch(i, { items: e.target.value })}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="block w-full rounded-lg border border-dashed border-black/20 px-3 py-2 text-sm text-ink-mute hover:border-rose-deep hover:text-rose-deep"
      >
        + 添加一个技能分类
      </button>
    </div>
  );
}

/* ------------------------------ profile ------------------------------ */

function ProfileEditor({
  profile,
  onSaved,
}: {
  profile: Profile;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(profile);
  const [socialsText, setSocialsText] = useState(() => {
    try {
      const parsed = JSON.parse(profile.socials);
      return Array.isArray(parsed)
        ? parsed.map((s: any) => `${s.label} | ${s.url}`).join("\n")
        : "";
    } catch {
      return "";
    }
  });
  const [nowItemsText, setNowItemsText] = useState(() => {
    try {
      const parsed = JSON.parse(profile.now_items);
      return Array.isArray(parsed)
        ? parsed.map((n: any) => `${n.label} | ${n.body}`).join("\n")
        : "";
    } catch {
      return "";
    }
  });
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  // structured JSON fields (stored as JSON-stringified state, kept as strings)
  const [strengthsJSON, setStrengthsJSON] = useState<string>(
    profile.strengths || "[]"
  );
  const [skillsJSON, setSkillsJSON] = useState<string>(profile.skills || "[]");

  async function save() {
    setSaving(true);
    const socials = socialsText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        const [label, url] = l.split("|").map((s) => s.trim());
        return { label: label ?? l, url: url ?? "#" };
      });
    const now_items = nowItemsText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        const [label, body] = l.split("|").map((s) => s.trim());
        return { label: label ?? l, body: body ?? "" };
      });
    await fetch("/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        socials,
        now_items,
        strengths: strengthsJSON,
        skills: skillsJSON,
        education: form.education,
      }),
    });
    setSaving(false);
    setSavedAt(Date.now());
    onSaved();
  }

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="font-serif text-xl text-ink">个人信息</h2>
        <p className="mt-1 text-sm text-ink-mute">
          这些会显示在主页的 Hero 区。
        </p>
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="名字">
            <input
              className={inputCls}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="头像 emoji">
            <input
              className={inputCls}
              value={form.avatar_emoji}
              onChange={(e) => setForm({ ...form, avatar_emoji: e.target.value })}
            />
          </Field>
          <Field label="一句话定位">
            <input
              className={inputCls}
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            />
          </Field>
          <Field label="所在地">
            <input
              className={inputCls}
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </Field>
          <Field label="邮箱">
            <input
              className={inputCls}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="自我介绍" hint="支持换行，每段一行。">
              <textarea
                className={inputCls + " min-h-[140px] leading-relaxed"}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field
              label="Manifesto / 信念金句"
              hint="一段斜体衬线引文，显示在身份卡里。留空则不显示。"
            >
              <textarea
                className={inputCls + " min-h-[80px] leading-relaxed"}
                value={form.manifesto}
                onChange={(e) => setForm({ ...form, manifesto: e.target.value })}
              />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field
              label="Now / 现在"
              hint="右侧 Now 卡片的几行内容。一行一条，格式：LABEL | 描述。例如：BUILDING | 一个写作 Agent"
            >
              <textarea
                className={inputCls + " min-h-[110px] font-mono text-sm"}
                value={nowItemsText}
                onChange={(e) => setNowItemsText(e.target.value)}
              />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field
              label="社交链接"
              hint="一行一个，格式：标签 | 链接。例如：Twitter | https://twitter.com/xxx"
            >
              <textarea
                className={inputCls + " min-h-[100px] font-mono text-sm"}
                value={socialsText}
                onChange={(e) => setSocialsText(e.target.value)}
              />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field
              label="教育"
              hint="一行就够，显示在 /experience 页面底部。"
            >
              <input
                className={inputCls}
                value={form.education ?? ""}
                onChange={(e) =>
                  setForm({ ...form, education: e.target.value })
                }
              />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field
              label="个人优势 / Strengths"
              hint="/experience 页面顶部的 3 张 STR 卡片。每条:01 / 标题 / tagline / 正文。"
            >
              <StrengthsEditor
                value={strengthsJSON}
                onChange={setStrengthsJSON}
              />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field
              label="技能 / Skills"
              hint="/projects 页面底部的技能列表。每条:分类标签 + 技能描述。"
            >
              <SkillsEditor value={skillsJSON} onChange={setSkillsJSON} />
            </Field>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <PrimaryBtn onClick={save} disabled={saving}>
            {saving ? "保存中。。." : "保存"}
          </PrimaryBtn>
          {savedAt && (
            <span className="text-xs text-iris-deep">已保存 ✓</span>
          )}
        </div>
      </Card>
    </div>
  );
}

/* ------------------------------ experience ------------------------------ */

function emptyExp(): Experience {
  return {
    id: 0,
    company: "",
    role: "",
    period: "",
    summary: "",
    highlights: "[]",
    sort_order: 0,
  };
}

function ExperienceEditor({
  items,
  onChanged,
}: {
  items: Experience[];
  onChanged: () => void;
}) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Experience>(emptyExp());

  async function add() {
    await fetch("/api/admin/experience", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    setDraft(emptyExp());
    setAdding(false);
    onChanged();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl text-ink">工作经历</h2>
        {!adding && (
          <PrimaryBtn onClick={() => setAdding(true)}>+ 新增一段</PrimaryBtn>
        )}
      </div>

      {adding && (
        <Card>
          <h3 className="font-serif text-base text-ink mb-4">新增经历</h3>
          <ExpFields exp={draft} setExp={setDraft} />
          <div className="mt-5 flex gap-3">
            <PrimaryBtn onClick={add}>添加</PrimaryBtn>
            <GhostBtn
              onClick={() => {
                setAdding(false);
                setDraft(emptyExp());
              }}
            >
              取消
            </GhostBtn>
          </div>
        </Card>
      )}

      {items.map((it) => (
        <ExperienceRow key={it.id} item={it} onChanged={onChanged} />
      ))}
      {items.length === 0 && !adding && (
        <p className="text-ink-mute text-sm">还没有添加任何经历。</p>
      )}
    </div>
  );
}

function ExpFields({
  exp,
  setExp,
}: {
  exp: Experience;
  setExp: (e: Experience) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Field label="公司">
        <input
          className={inputCls}
          value={exp.company}
          onChange={(e) => setExp({ ...exp, company: e.target.value })}
        />
      </Field>
      <Field label="职位">
        <input
          className={inputCls}
          value={exp.role}
          onChange={(e) => setExp({ ...exp, role: e.target.value })}
        />
      </Field>
      <Field label="时间段" hint="例如:2024 — 至今">
        <input
          className={inputCls}
          value={exp.period}
          onChange={(e) => setExp({ ...exp, period: e.target.value })}
        />
      </Field>
      <Field label="排序" hint="数字越小越靠上。">
        <input
          type="number"
          className={inputCls}
          value={exp.sort_order}
          onChange={(e) =>
            setExp({ ...exp, sort_order: Number(e.target.value) })
          }
        />
      </Field>
      <div className="md:col-span-2">
        <Field label="工作内容 / Summary" hint="一段总览，显示在 highlights 之上。">
          <textarea
            className={inputCls + " min-h-[100px] leading-relaxed"}
            value={exp.summary}
            onChange={(e) => setExp({ ...exp, summary: e.target.value })}
          />
        </Field>
      </div>
      <div className="md:col-span-2">
        <Field
          label="Highlights / 分项要点"
          hint="每条要点带一个 TAG（如「项目简介」）+ 正文，可选加链接角标。"
        >
          <HighlightsEditor
            value={exp.highlights}
            onChange={(next) => setExp({ ...exp, highlights: next })}
          />
        </Field>
      </div>
    </div>
  );
}

function ExperienceRow({
  item,
  onChanged,
}: {
  item: Experience;
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(item);

  async function save() {
    await fetch("/api/admin/experience", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setEditing(false);
    onChanged();
  }

  async function remove() {
    if (!confirm(`确定删除「${item.company} · ${item.role}」？`)) return;
    await fetch(`/api/admin/experience?id=${item.id}`, { method: "DELETE" });
    onChanged();
  }

  if (editing) {
    return (
      <Card>
        <ExpFields exp={form} setExp={setForm} />
        <div className="mt-5 flex gap-3">
          <PrimaryBtn onClick={save}>保存</PrimaryBtn>
          <GhostBtn
            onClick={() => {
              setEditing(false);
              setForm(item);
            }}
          >
            取消
          </GhostBtn>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-baseline gap-3">
            <h3 className="font-serif text-lg text-ink">{item.role}</h3>
            <span className="font-mono text-xs text-ink-mute">{item.period}</span>
          </div>
          <p className="mt-1 text-sm text-iris-deep">{item.company}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft whitespace-pre-line">
            {item.summary}
          </p>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <GhostBtn onClick={() => setEditing(true)}>编辑</GhostBtn>
          <DangerBtn onClick={remove}>删除</DangerBtn>
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------ projects ------------------------------ */

function emptyProject(): Project {
  return {
    id: 0,
    title: "",
    subtitle: "",
    description: "",
    highlights: "[]",
    tags: "[]",
    link: "",
    sort_order: 0,
  };
}

function ProjectsEditor({
  items,
  onChanged,
}: {
  items: Project[];
  onChanged: () => void;
}) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Project>(emptyProject());
  const [draftTags, setDraftTags] = useState("");

  async function add() {
    await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...draft, tags: draftTags }),
    });
    setDraft(emptyProject());
    setDraftTags("");
    setAdding(false);
    onChanged();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl text-ink">项目</h2>
        {!adding && (
          <PrimaryBtn onClick={() => setAdding(true)}>+ 新增项目</PrimaryBtn>
        )}
      </div>
      {adding && (
        <Card>
          <h3 className="font-serif text-base text-ink mb-4">新增项目</h3>
          <ProjFields
            proj={draft}
            setProj={setDraft}
            tagsText={draftTags}
            setTagsText={setDraftTags}
          />
          <div className="mt-5 flex gap-3">
            <PrimaryBtn onClick={add}>添加</PrimaryBtn>
            <GhostBtn
              onClick={() => {
                setAdding(false);
                setDraft(emptyProject());
                setDraftTags("");
              }}
            >
              取消
            </GhostBtn>
          </div>
        </Card>
      )}
      {items.map((it) => (
        <ProjectRow key={it.id} item={it} onChanged={onChanged} />
      ))}
      {items.length === 0 && !adding && (
        <p className="text-ink-mute text-sm">还没有添加任何项目。</p>
      )}
    </div>
  );
}

function ProjFields({
  proj,
  setProj,
  tagsText,
  setTagsText,
}: {
  proj: Project;
  setProj: (p: Project) => void;
  tagsText: string;
  setTagsText: (t: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Field label="标题">
        <input
          className={inputCls}
          value={proj.title}
          onChange={(e) => setProj({ ...proj, title: e.target.value })}
        />
      </Field>
      <Field label="副标题">
        <input
          className={inputCls}
          value={proj.subtitle}
          onChange={(e) => setProj({ ...proj, subtitle: e.target.value })}
        />
      </Field>
      <Field label="标签" hint="用英文逗号分隔，例如：Agent, Writing, 0→1">
        <input
          className={inputCls}
          value={tagsText}
          onChange={(e) => setTagsText(e.target.value)}
        />
      </Field>
      <Field label="链接" hint="可选。留空或留 # 则不显示「了解更多」。">
        <input
          className={inputCls}
          value={proj.link}
          onChange={(e) => setProj({ ...proj, link: e.target.value })}
        />
      </Field>
      <Field label="排序" hint="数字越小越靠前。">
        <input
          type="number"
          className={inputCls}
          value={proj.sort_order}
          onChange={(e) =>
            setProj({ ...proj, sort_order: Number(e.target.value) })
          }
        />
      </Field>
      <div className="md:col-span-2">
        <Field label="描述 / Description" hint="一段总览，显示在 highlights 之上。">
          <textarea
            className={inputCls + " min-h-[100px] leading-relaxed"}
            value={proj.description}
            onChange={(e) => setProj({ ...proj, description: e.target.value })}
          />
        </Field>
      </div>
      <div className="md:col-span-2">
        <Field
          label="Highlights / 分项要点"
          hint="每条要点带一个 TAG（如「Prompt 多模板架构」）+ 正文，可选加链接角标。"
        >
          <HighlightsEditor
            value={proj.highlights}
            onChange={(next) => setProj({ ...proj, highlights: next })}
          />
        </Field>
      </div>
    </div>
  );
}

function ProjectRow({
  item,
  onChanged,
}: {
  item: Project;
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(item);
  const [tagsText, setTagsText] = useState(() => {
    try {
      const arr = JSON.parse(item.tags);
      return Array.isArray(arr) ? arr.join(", ") : "";
    } catch {
      return "";
    }
  });

  async function save() {
    await fetch("/api/admin/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, tags: tagsText }),
    });
    setEditing(false);
    onChanged();
  }

  async function remove() {
    if (!confirm(`确定删除「${item.title}」？`)) return;
    await fetch(`/api/admin/projects?id=${item.id}`, { method: "DELETE" });
    onChanged();
  }

  const tags = (() => {
    try {
      const a = JSON.parse(item.tags);
      return Array.isArray(a) ? a : [];
    } catch {
      return [];
    }
  })();

  if (editing) {
    return (
      <Card>
        <ProjFields
          proj={form}
          setProj={setForm}
          tagsText={tagsText}
          setTagsText={setTagsText}
        />
        <div className="mt-5 flex gap-3">
          <PrimaryBtn onClick={save}>保存</PrimaryBtn>
          <GhostBtn
            onClick={() => {
              setEditing(false);
              setForm(item);
            }}
          >
            取消
          </GhostBtn>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {tags.map((t: string) => (
              <span
                key={t}
                className="rounded-full bg-iris-soft/30 px-2 py-0.5 text-[11px] text-iris-deep"
              >
                {t}
              </span>
            ))}
          </div>
          <h3 className="font-serif text-lg text-ink">{item.title}</h3>
          {item.subtitle && (
            <p className="text-sm text-ink-mute">{item.subtitle}</p>
          )}
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {item.description}
          </p>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <GhostBtn onClick={() => setEditing(true)}>编辑</GhostBtn>
          <DangerBtn onClick={remove}>删除</DangerBtn>
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------ articles ------------------------------ */

function emptyArticle(): Article {
  return {
    id: 0,
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    published_at: new Date().toISOString().slice(0, 10),
    is_published: 1,
  };
}

function ArticlesEditor({
  items,
  onChanged,
}: {
  items: Article[];
  onChanged: () => void;
}) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Article>(emptyArticle());

  async function add() {
    await fetch("/api/admin/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    setDraft(emptyArticle());
    setAdding(false);
    onChanged();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl text-ink">文章</h2>
        {!adding && (
          <PrimaryBtn onClick={() => setAdding(true)}>+ 写新文章</PrimaryBtn>
        )}
      </div>

      {adding && (
        <Card>
          <h3 className="font-serif text-base text-ink mb-4">新文章</h3>
          <ArticleFields article={draft} setArticle={setDraft} />
          <div className="mt-5 flex gap-3">
            <PrimaryBtn onClick={add}>创建</PrimaryBtn>
            <GhostBtn
              onClick={() => {
                setAdding(false);
                setDraft(emptyArticle());
              }}
            >
              取消
            </GhostBtn>
          </div>
        </Card>
      )}

      {items.map((it) => (
        <ArticleRow key={it.id} item={it} onChanged={onChanged} />
      ))}
      {items.length === 0 && !adding && (
        <p className="text-ink-mute text-sm">还没有写过文章。</p>
      )}
    </div>
  );
}

function ArticleFields({
  article,
  setArticle,
}: {
  article: Article;
  setArticle: (a: Article) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="标题">
          <input
            className={inputCls}
            value={article.title}
            onChange={(e) => setArticle({ ...article, title: e.target.value })}
          />
        </Field>
        <Field label="Slug" hint="留空会自动生成。">
          <input
            className={inputCls + " font-mono text-sm"}
            value={article.slug}
            onChange={(e) => setArticle({ ...article, slug: e.target.value })}
          />
        </Field>
        <Field label="发布日期" hint="格式：YYYY-MM-DD">
          <input
            className={inputCls + " font-mono text-sm"}
            value={article.published_at}
            onChange={(e) =>
              setArticle({ ...article, published_at: e.target.value })
            }
          />
        </Field>
        <Field label="状态">
          <label className="inline-flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={!!article.is_published}
              onChange={(e) =>
                setArticle({ ...article, is_published: e.target.checked ? 1 : 0 })
              }
              className="h-4 w-4 accent-rose-deep"
            />
            <span className="text-sm text-ink-soft">公开发布</span>
          </label>
        </Field>
      </div>
      <Field label="摘要">
        <textarea
          className={inputCls + " min-h-[60px] leading-relaxed"}
          value={article.excerpt}
          onChange={(e) => setArticle({ ...article, excerpt: e.target.value })}
        />
      </Field>
      <Field label="正文 (Markdown)" hint="支持 GFM：标题、列表、引用、代码块等。">
        <textarea
          className={inputCls + " min-h-[300px] font-mono text-sm leading-relaxed"}
          value={article.content}
          onChange={(e) => setArticle({ ...article, content: e.target.value })}
        />
      </Field>
    </div>
  );
}

function ArticleRow({
  item,
  onChanged,
}: {
  item: Article;
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(item);

  async function save() {
    await fetch("/api/admin/articles", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setEditing(false);
    onChanged();
  }

  async function remove() {
    if (!confirm(`确定删除「${item.title}」？`)) return;
    await fetch(`/api/admin/articles?id=${item.id}`, { method: "DELETE" });
    onChanged();
  }

  if (editing) {
    return (
      <Card>
        <ArticleFields article={form} setArticle={setForm} />
        <div className="mt-5 flex gap-3">
          <PrimaryBtn onClick={save}>保存</PrimaryBtn>
          <GhostBtn
            onClick={() => {
              setEditing(false);
              setForm(item);
            }}
          >
            取消
          </GhostBtn>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="font-serif text-lg text-ink truncate">
              {item.title}
            </h3>
            {!item.is_published && (
              <span className="rounded-full bg-paper-warm px-2 py-0.5 text-[11px] text-ink-mute">
                草稿
              </span>
            )}
          </div>
          <p className="mt-1 font-mono text-xs text-ink-mute">
            /{item.slug} · {item.published_at}
          </p>
          {item.excerpt && (
            <p className="mt-2 text-sm leading-relaxed text-ink-soft line-clamp-2">
              {item.excerpt}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <Link
            href={`/blog/${item.slug}`}
            target="_blank"
            className="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm text-ink-soft hover:border-iris-deep hover:text-iris-deep transition-colors text-center"
          >
            预览
          </Link>
          <GhostBtn onClick={() => setEditing(true)}>编辑</GhostBtn>
          <DangerBtn onClick={remove}>删除</DangerBtn>
        </div>
      </div>
    </Card>
  );
}
