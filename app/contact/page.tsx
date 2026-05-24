import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import { getProfile, parseSocials } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function ContactPage() {
  const profile = getProfile();
  const name = profile?.name ?? "Iris";
  const email = profile?.email ?? "";
  const socials = profile ? parseSocials(profile.socials) : [];

  return (
    <div className="min-h-screen pt-5">
      <SiteNav name={name} />

      <main className="mx-auto w-full max-w-[820px] px-5 pb-20 pt-8 md:px-9">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ink-mute transition-colors hover:text-lav-500"
        >
          <span className="font-serif-ac text-lav-400">←</span>
          back home
        </Link>

        <header className="fade-up mt-10">
          <p className="mono-label">contact · 联系</p>
          <h1 className="mt-3 text-[36px] font-medium leading-[1.15] tracking-tightest text-ink md:text-[44px]">
            <span className="font-cn">联系我</span>
            <span className="ml-2 font-serif-ac text-[42px] text-lav-500 md:text-[50px]">
              Get in touch
            </span>
          </h1>
          <div className="mt-6 h-px w-16 bg-lav-200" />
        </header>

        <section
          className="fade-up relative mt-10 overflow-hidden rounded-xl border border-line p-10 md:p-12"
          style={{
            background:
              "linear-gradient(160deg, #fff 0%, #F6F3FB 60%, #F8E8EF 200%)",
          }}
        >
          <span
            className="pointer-events-none absolute -right-[10%] -top-[20%] h-[80%] w-[60%]"
            style={{
              background:
                "radial-gradient(circle, rgba(217,201,238,.4), transparent 60%)",
            }}
          />
          <div className="relative">
            <p className="font-mono text-[11px] tracking-[0.08em] text-ink-mute">
              ALWAYS OPEN · 随时来聊
            </p>
            <h2 className="mt-2 text-[28px] font-medium leading-[1.15] tracking-tightest text-ink md:text-[32px]">
              <span className="font-cn">如果你也在做有意思的 AI 产品，</span>
              <br />
              <span className="font-serif-ac text-[32px] text-lav-500 md:text-[36px]">
                let&apos;s talk.
              </span>
            </h2>
            <p className="mt-5 max-w-[520px] font-cn text-[14px] leading-[1.75] text-ink-soft">
              不限于 PM 同行 —— 设计师、研究员、独立开发者、写字的人，都欢迎。
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-2.5">
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 rounded-md border border-ink bg-ink px-5 py-2.5 text-[13px] font-medium text-white transition-all hover:-translate-y-px hover:border-lav-600 hover:bg-lav-600"
                >
                  {email}
                  <span className="font-serif-ac text-lav-200">→</span>
                </a>
              )}
              {socials.map((s) => (
                <a
                  key={s.label + s.url}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-line bg-white/70 px-5 py-2.5 text-[13px] font-medium text-ink-soft transition-all hover:-translate-y-px hover:border-lav-200 hover:text-lav-500"
                  style={{ backdropFilter: "blur(10px)" }}
                >
                  {s.label}
                  <span className="font-mono text-[10px] text-ink-mute">↗</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-16 flex items-center justify-between font-mono text-[11px] text-ink-mute">
          <Link href="/blog" className="hover:text-lav-500">
            ← writing
          </Link>
          <span className="font-serif-ac text-lav-400">— end —</span>
          <Link href="/" className="hover:text-lav-500">
            home →
          </Link>
        </div>
      </main>

      <Footer name={name} />
    </div>
  );
}
