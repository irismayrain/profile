import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import {
  getProfile,
  parseSocials,
  parseNowItems,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export default function Home() {
  const profile = getProfile();

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center text-ink-soft">
        <div className="text-center">
          <p className="mb-4">数据库还没初始化。</p>
          <p className="text-sm">
            运行{" "}
            <code className="rounded bg-page-soft px-2 py-0.5">
              npm run seed:iris
            </code>{" "}
            来填充内容。
          </p>
        </div>
      </main>
    );
  }

  const socials = parseSocials(profile.socials);
  const nowItems = parseNowItems(profile.now_items);
  const nowLabel = (() => {
    const d = new Date();
    const m = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
    return `${m} ${d.getFullYear()}`;
  })();

  return (
    <div className="min-h-screen pt-5">
      <SiteNav name={profile.name} />

      <main className="mx-auto max-w-[1320px] px-5 pb-10 pt-8 md:px-9">
        {/* ===== HERO ===== */}
        <section className="fade-up grid grid-cols-1 gap-5 md:grid-cols-[1.15fr_0.85fr]">
          {/* identity card */}
          <article
            className="relative overflow-hidden rounded-xl border border-line px-8 py-8 shadow-soft2 md:px-10 md:py-10"
            style={{
              background:
                "linear-gradient(180deg, #fff 0%, #FAF8FD 100%)",
            }}
          >
            <span
              className="pointer-events-none absolute -right-10 -top-10 h-60 w-60"
              style={{
                background:
                  "radial-gradient(circle, rgba(217,201,238,.32) 0%, transparent 70%)",
              }}
            />
            <span className="inline-flex items-center gap-2.5 rounded-full border border-lav-100 bg-lav-50 px-3 py-1.5 font-mono text-[11px] tracking-[0.05em] text-lav-500">
              <span className="h-[5px] w-[5px] rounded-full bg-lav-400" />
              AI Product Manager
            </span>

            <h1 className="mt-5 text-[40px] font-medium leading-[1.05] tracking-tightest text-ink md:text-[44px]">
              <span className="font-cn">你好，我是</span>
              <span className="ml-2 font-serif-ac text-[46px] text-lav-500 md:text-[52px]">
                {profile.name}
              </span>
              <span className="font-cn">。</span>
            </h1>

            <p className="mt-5 max-w-[560px] font-cn text-[15px] leading-[1.75] text-ink-soft">
              <span className="mark-lav">{profile.tagline}</span>
            </p>

            <p className="mt-4 max-w-[600px] whitespace-pre-line font-cn text-[14px] leading-[1.85] text-ink-soft">
              {profile.bio}
            </p>

            {/* meta strip */}
            <div className="mt-7 grid grid-cols-3 gap-[1px] overflow-hidden rounded-lg border border-line bg-line">
              <MetaCell label="Focus" value="对话 · 记忆 · 安全" desc="主攻方向" />
              <MetaCell label="Years" value="8+" suffix="yrs" desc="行业年限" />
              <MetaCell label="Shipped" value="5+" desc="独立交付" />
            </div>

            {/* manifesto pull-quote */}
            {profile.manifesto && (
              <blockquote className="mt-6 rounded-r-md border-l-2 border-lav-300 bg-lav-50 px-5 py-3.5">
                <p className="font-serif-ac text-[17px] leading-[1.6] text-lav-600">
                  {profile.manifesto}
                </p>
              </blockquote>
            )}

            {/* CTA */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2 rounded-md border border-ink bg-ink px-[18px] py-2.5 text-[13px] font-medium tracking-tightish text-white transition-all hover:-translate-y-px hover:border-lav-600 hover:bg-lav-600"
                >
                  写信给我
                  <span className="font-serif-ac text-lav-200">→</span>
                </a>
              )}
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-[18px] py-2.5 text-[13px] font-medium tracking-tightish text-ink transition-all hover:-translate-y-px hover:border-lav-200 hover:shadow-soft1"
              >
                读我的自述
                <span className="font-serif-ac text-lav-400">→</span>
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-[18px] py-2.5 text-[13px] font-medium tracking-tightish text-ink transition-all hover:-translate-y-px hover:shadow-soft1"
              >
                看看作品
                <span className="font-serif-ac text-lav-400">→</span>
              </Link>
              <a
                href="/vibecoding.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-lav-200 bg-lav-50 px-[18px] py-2.5 text-[13px] font-medium tracking-tightish text-lav-600 transition-all hover:-translate-y-px hover:border-lav-300 hover:bg-lav-100"
              >
                Vibe Coding 分享
                <span className="font-mono text-[11px] text-lav-400">↗</span>
              </a>
            </div>

            <p className="mt-6 flex items-center gap-2 font-mono text-[11px] text-ink-mute">
              <span className="h-px w-5 bg-ink-faint" />
              last updated · {new Date().toISOString().slice(0, 10)}
            </p>
          </article>

          {/* right column: Now + Connect stack */}
          <div className="flex flex-col gap-5">
            {nowItems.length > 0 && (
              <aside
                className="relative overflow-hidden rounded-xl border border-line p-6 shadow-soft2 md:p-7"
                style={{
                  background:
                    "linear-gradient(160deg, #fff 0%, #FAF8FD 100%)",
                }}
              >
                <span
                  className="pointer-events-none absolute -right-12 -top-12 h-44 w-44"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(217,201,238,.28) 0%, transparent 70%)",
                  }}
                />
                <span
                  className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(248,232,239,.32) 0%, transparent 70%)",
                  }}
                />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="mono-label">NOW · {nowLabel}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-lav-500/10 px-2 py-[3px] font-mono text-[10px] text-lav-500">
                    <span
                      className="h-[5px] w-[5px] rounded-full bg-lav-400"
                      style={{ boxShadow: "0 0 0 3px rgba(149,130,201,.18)" }}
                    />
                    live
                  </span>
                </div>

                <ul className="relative z-10 mt-6 flex flex-col gap-5">
                  {nowItems.map((it, i) => (
                    <li
                      key={`${it.label}-${i}`}
                      className="border-l border-lav-200 pl-4"
                    >
                      <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-lav-500">
                        {it.label}
                      </p>
                      <p className="mt-1.5 font-cn text-[13px] leading-[1.7] text-ink-soft">
                        {it.body}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="relative z-10 mt-7 flex items-center justify-between border-t border-dashed border-line pt-4 font-mono text-[11px] text-ink-mute">
                  <span>what I&apos;m up to lately</span>
                  <span className="font-serif-ac text-lav-500">— now</span>
                </div>
              </aside>
            )}

            {/* Connect mini-card */}
            {(profile.email || socials.length > 0) && (
              <aside className="relative flex flex-1 flex-col overflow-hidden rounded-xl border border-line bg-white p-6 shadow-soft1 md:p-7">
                <div className="flex items-center justify-between">
                  <span className="mono-label">CONNECT · 联系</span>
                  <Link
                    href="/contact"
                    className="font-serif-ac text-[13px] text-lav-400 transition-colors hover:text-lav-500"
                  >
                    say hi →
                  </Link>
                </div>

                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="group -mx-2 mt-4 block rounded-md px-2 py-2 transition-colors hover:bg-page-soft"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-mute">
                      EMAIL · 邮件
                    </p>
                    <p className="mt-1 flex items-center justify-between font-cn text-[14px] text-ink group-hover:text-lav-500">
                      <span className="truncate">{profile.email}</span>
                      <span className="ml-2 shrink-0 font-mono text-[11px] text-lav-400 transition-transform group-hover:translate-x-0.5">
                        →
                      </span>
                    </p>
                  </a>
                )}

                {socials.length > 0 && (
                  <div
                    className={
                      profile.email
                        ? "mt-3 border-t border-dashed border-line pt-3"
                        : "mt-4"
                    }
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-mute">
                      ELSEWHERE · 别处
                    </p>
                    <ul className="mt-1.5 flex flex-col gap-0.5">
                      {socials.map((s) => (
                        <li key={s.label + s.url}>
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group -mx-2 flex items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-lav-50"
                          >
                            <span className="font-cn text-[13px] text-ink-soft group-hover:text-lav-500">
                              {s.label}
                            </span>
                            <span className="font-mono text-[11px] text-ink-mute transition-colors group-hover:text-lav-500">
                              ↗
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-auto flex items-center justify-between border-t border-dashed border-line pt-4 font-mono text-[11px] text-ink-mute">
                  <span>let&apos;s talk</span>
                  <span className="font-serif-ac text-lav-500">— connect</span>
                </div>
              </aside>
            )}
          </div>
        </section>
      </main>

      <Footer name={profile.name} />
    </div>
  );
}

/* ============================== helpers ============================== */

function MetaCell({
  label,
  value,
  suffix,
  desc,
}: {
  label: string;
  value: string;
  suffix?: string;
  desc?: string;
}) {
  return (
    <div className="flex flex-col gap-1 bg-white p-3.5">
      <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-mute">
        {label}
      </span>
      <span className="flex items-baseline gap-1 text-[20px] font-medium tracking-tighter2 text-ink">
        {value}
        {suffix && (
          <small className="text-[11px] font-normal text-ink-mute">{suffix}</small>
        )}
      </span>
      {desc && (
        <span className="font-cn text-[11px] text-ink-mute">{desc}</span>
      )}
    </div>
  );
}
