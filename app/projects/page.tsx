import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import {
  getProfile,
  getProjects,
  parseTags,
  parseHighlights,
  parseSkills,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export default function ProjectsPage() {
  const profile = getProfile();
  const name = profile?.name ?? "Iris";
  const projects = getProjects();
  const skills = profile ? parseSkills(profile.skills) : [];

  return (
    <div className="min-h-screen pt-5">
      <SiteNav name={name} />

      <main className="mx-auto w-full max-w-[860px] px-5 pb-20 pt-8 md:px-9">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ink-mute transition-colors hover:text-lav-500"
        >
          <span className="font-serif-ac text-lav-400">←</span>
          back home
        </Link>

        <header className="fade-up mt-10">
          <p className="mono-label">projects · 代表项目</p>
          <h1 className="mt-3 text-[36px] font-medium leading-[1.15] tracking-tightest text-ink md:text-[44px]">
            <span className="font-cn">代表项目</span>
            <span className="ml-2 font-serif-ac text-[42px] text-lav-500 md:text-[50px]">
              Selected Cases
            </span>
          </h1>
          <div className="mt-6 h-px w-16 bg-lav-200" />
          <p className="mt-5 max-w-[680px] font-cn text-[14px] leading-[1.8] text-ink-soft">
            8 个独立 AI 作品 —— 6 个验证单项 AI 能力，另 2 个把这些能力编成共享 Memory 的 AI 陪伴双生子。
            <span className="text-ink"> 不是产品矩阵，是一条技术深度的演进轨迹。</span>
          </p>
        </header>

        {/* ===== Projects ===== */}
        <section className="fade-up mt-12 flex flex-col gap-5">
          {projects.map((p, i) => {
            const highlights = parseHighlights(p.highlights);
            const tags = parseTags(p.tags);
            const variants = ["", "alt", "warm"] as const;
            const isExternal = p.link && p.link !== "#";
            return (
              <details
                key={p.id}
                open={i === 0}
                className="group relative overflow-hidden rounded-xl border border-line bg-white transition-all duration-300 hover:border-lav-200 hover:shadow-soft2"
              >
                <summary className="cursor-pointer select-none list-none p-7 [&::-webkit-details-marker]:hidden md:p-9">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[11px] tracking-[0.08em] text-ink-mute">
                        PRJ-{String(i + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-2 font-cn text-[22px] font-semibold leading-[1.25] tracking-tighter2 text-ink md:text-[24px]">
                        {p.title}
                      </h3>
                      {p.subtitle && (
                        <p className="mt-1.5 font-serif-ac text-[15px] text-lav-500">
                          {p.subtitle}
                        </p>
                      )}
                      {p.description && (
                        <p className="mt-4 font-cn text-[13.5px] leading-[1.8] text-ink-soft">
                          {p.description}
                        </p>
                      )}
                      {tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {tags.map((t, idx) => {
                            const v = variants[idx % variants.length];
                            const cls =
                              v === "alt"
                                ? "bg-mist-100 text-mist-500 border-mist-200"
                                : v === "warm"
                                  ? "bg-peach-100 text-peach-500 border-blush-200"
                                  : "bg-lav-50 text-lav-500 border-lav-100";
                            return (
                              <span
                                key={t}
                                className={`rounded-full border px-2.5 py-[3px] font-cn text-[11px] ${cls}`}
                              >
                                {t}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    {highlights.length > 0 && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-line bg-page-soft px-2.5 py-1 font-mono text-[10px] text-ink-mute transition-colors group-open:border-lav-200 group-open:bg-lav-50 group-open:text-lav-500 group-hover:text-lav-500">
                        <span className="group-open:hidden">+ {highlights.length} 条细节</span>
                        <span className="hidden group-open:inline">− 收起</span>
                      </span>
                    )}
                  </div>
                </summary>

                {(highlights.length > 0 || isExternal) && (
                  <div className="border-t border-dashed border-line px-7 pb-7 pt-5 md:px-9">
                    {highlights.length > 0 && (
                      <ul className="flex flex-col gap-4">
                        {highlights.map((h, idx) => (
                          <li
                            key={idx}
                            className="border-l-2 border-lav-200 pl-5 transition-colors hover:border-lav-400"
                          >
                            {h.tag && (
                              <p className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-lav-500">
                                【{h.tag}】
                              </p>
                            )}
                            <p
                              className={`font-cn text-[13px] leading-[1.8] text-ink-soft ${h.tag ? "mt-1" : ""}`}
                            >
                              {h.body}
                            </p>
                            {h.link && (
                              <div className="mt-3">
                                <a
                                  href={h.link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 rounded-full border border-lav-200 bg-lav-50 px-2.5 py-[3px] font-mono text-[10px] text-lav-500 transition-all hover:-translate-y-px hover:border-lav-300 hover:bg-lav-100 hover:text-lav-600"
                                >
                                  {h.link.label}
                                  <span className="text-[9px]">↗</span>
                                </a>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                    {isExternal && (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-flex items-center gap-2 rounded-md border border-lav-200 bg-lav-50 px-4 py-2 font-mono text-[11px] text-lav-600 transition-all hover:-translate-y-px hover:border-lav-300 hover:bg-lav-100"
                      >
                        查看项目
                        <span className="text-[10px]">↗</span>
                      </a>
                    )}
                  </div>
                )}
              </details>
            );
          })}
        </section>

        {/* ===== 技能 ===== */}
        {skills.length > 0 && (
          <section className="fade-up mt-16">
            <div className="mb-5 flex items-baseline justify-between">
              <p className="mono-label">skills · 技能</p>
              <span className="font-serif-ac text-[14px] text-lav-400">
                — toolkit
              </span>
            </div>
            <div className="overflow-hidden rounded-xl border border-line bg-white">
              {skills.map((s, idx) => (
                <div
                  key={s.label}
                  className={`grid grid-cols-1 gap-2 px-6 py-4 md:grid-cols-[180px_1fr] md:gap-6 md:py-5 ${idx > 0 ? "border-t border-line-soft" : ""}`}
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-lav-500">
                    {s.label}
                  </p>
                  <p className="font-cn text-[13px] leading-[1.85] text-ink-soft">
                    {s.items}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-16 flex items-center justify-between font-mono text-[11px] text-ink-mute">
          <Link href="/experience" className="hover:text-lav-500">
            ← experience
          </Link>
          <span className="font-serif-ac text-lav-400">— end —</span>
          <Link href="/blog" className="hover:text-lav-500">
            writing →
          </Link>
        </div>
      </main>

      <Footer name={name} />
    </div>
  );
}
