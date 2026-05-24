import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import {
  getProfile,
  getExperience,
  parseHighlights,
  parseStrengths,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export default function ExperiencePage() {
  const profile = getProfile();
  const name = profile?.name ?? "Iris";
  const experience = getExperience();
  const strengths = profile ? parseStrengths(profile.strengths) : [];
  const education = profile?.education ?? "";

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
          <p className="mono-label">experience · 经历</p>
          <h1 className="mt-3 text-[36px] font-medium leading-[1.15] tracking-tightest text-ink md:text-[44px]">
            <span className="font-cn">工作经历</span>
            <span className="ml-2 font-serif-ac text-[42px] text-lav-500 md:text-[50px]">
              Experience
            </span>
          </h1>
          <div className="mt-6 h-px w-16 bg-lav-200" />
        </header>

        {/* ===== 个人优势 ===== */}
        {strengths.length > 0 && (
          <section className="fade-up mt-14">
            <div className="mb-5 flex items-baseline justify-between">
              <p className="mono-label">strengths · 个人优势</p>
              <span className="font-serif-ac text-[14px] text-lav-400">
                — what I&apos;m good at
              </span>
            </div>
            <div className="flex flex-col gap-4">
              {strengths.map((s) => (
                <article
                  key={s.kicker + s.title}
                  className="group relative grid grid-cols-1 gap-5 overflow-hidden rounded-xl border border-line bg-white p-7 transition-all duration-300 hover:border-lav-200 hover:shadow-soft2 md:grid-cols-[110px_1fr] md:gap-8 md:p-9"
                >
                  {/* left rail: kicker */}
                  <div className="flex items-baseline gap-3 md:block md:border-r md:border-line md:pr-6">
                    <p className="font-mono text-[11px] tracking-[0.08em] text-ink-mute">
                      STR-{s.kicker}
                    </p>
                    <span className="md:hidden font-serif-ac text-[12px] italic text-lav-400">
                      / strength
                    </span>
                    <div className="hidden md:block md:mt-3 h-px w-8 bg-lav-300" />
                    <p className="hidden md:block md:mt-3 font-serif-ac text-[12px] italic text-lav-400">
                      strength
                    </p>
                  </div>

                  {/* right content */}
                  <div>
                    <h3 className="font-cn text-[20px] font-semibold leading-[1.3] tracking-tighter2 text-ink md:text-[22px]">
                      {s.title}
                    </h3>
                    <p className="mt-2 font-serif-ac text-[15px] leading-[1.55] text-lav-500">
                      {s.tagline}
                    </p>
                    <div className="mt-4 flex flex-col gap-3 font-cn text-[13.5px] leading-[1.9] text-ink-soft">
                      {s.body
                        .split("。")
                        .map((p) => p.trim())
                        .filter(Boolean)
                        .map((p, idx) => (
                          <p key={idx}>{p}。</p>
                        ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ===== 工作经历 ===== */}
        <section className="fade-up mt-16">
          <div className="mb-5 flex items-baseline justify-between">
            <p className="mono-label">work · 工作经历</p>
            <span className="font-serif-ac text-[14px] text-lav-400">
              — where I&apos;ve been
            </span>
          </div>
          <div className="flex flex-col gap-5">
            {experience.map((e, i) => {
              const highlights = parseHighlights(e.highlights);
              return (
                <article
                  key={e.id}
                  className="group relative overflow-hidden rounded-xl border border-line bg-white p-7 transition-all duration-300 hover:border-lav-200 hover:shadow-soft2 md:p-9"
                >
                  {/* header row */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[11px] tracking-[0.08em] text-ink-mute">
                        EXP-{String(i + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-2 font-cn text-[22px] font-semibold leading-[1.25] tracking-tighter2 text-ink md:text-[24px]">
                        {e.role}
                      </h3>
                      {e.company && e.company !== "—" && (
                        <p className="mt-1 font-mono text-[12px] tracking-[0.04em] text-lav-500">
                          @ {e.company}
                        </p>
                      )}
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-lav-100 bg-lav-50 px-3 py-1 font-mono text-[11px] text-lav-500">
                      {e.period}
                    </span>
                  </div>

                  {/* summary */}
                  {e.summary && (
                    <p className="mt-5 font-cn text-[13.5px] leading-[1.75] text-ink-soft">
                      {e.summary}
                    </p>
                  )}

                  {/* highlights */}
                  {highlights.length > 0 && (
                    <ul className="mt-6 flex flex-col gap-5">
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
                            className={`font-cn text-[13.5px] leading-[1.8] text-ink-soft ${h.tag ? "mt-1.5" : ""}`}
                          >
                            {renderWithLinks(h.body)}
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
                </article>
              );
            })}
          </div>
        </section>

        {/* ===== 教育 ===== */}
        {education && (
          <section className="fade-up mt-12 rounded-lg border border-dashed border-line bg-white/50 p-6">
            <div className="flex items-baseline justify-between">
              <p className="mono-label">education · 教育</p>
              <span className="font-serif-ac text-[13px] text-lav-400">
                — academic
              </span>
            </div>
            <p className="mt-3 font-cn text-[13.5px] leading-[1.75] text-ink-soft">
              {education}
            </p>
          </section>
        )}

        <div className="mt-16 flex items-center justify-between font-mono text-[11px] text-ink-mute">
          <Link href="/about" className="hover:text-lav-500">
            ← about
          </Link>
          <span className="font-serif-ac text-lav-400">— end —</span>
          <Link href="/projects" className="hover:text-lav-500">
            projects →
          </Link>
        </div>
      </main>

      <Footer name={name} />
    </div>
  );
}

/* ---- helper: turn bare URLs in a string into <a> tags ---- */
function renderWithLinks(text: string): React.ReactNode[] {
  const urlRe = /(https?:\/\/[^\s)）]+)/g;
  const parts = text.split(urlRe);
  return parts.map((p, i) =>
    /^https?:\/\//.test(p) ? (
      <a
        key={i}
        href={p}
        target="_blank"
        rel="noopener noreferrer"
        className="break-all text-lav-500 underline underline-offset-2 transition-colors hover:text-lav-600"
      >
        {p}
      </a>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}
