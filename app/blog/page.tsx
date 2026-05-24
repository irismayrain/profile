import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import { getProfile, getArticles } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function BlogIndex() {
  const profile = getProfile();
  const articles = getArticles({ onlyPublished: true });
  const name = profile?.name ?? "";

  return (
    <div className="min-h-screen pt-5">
      <SiteNav name={name} />
      <main className="mx-auto max-w-[1320px] px-5 pb-16 pt-8 md:px-9">
        <header className="fade-up mb-10 flex items-end justify-between px-1">
          <div>
            <p className="font-mono text-[11px] tracking-[0.08em] text-ink-mute">
              writing — notes
            </p>
            <h1 className="mt-1.5 text-[36px] font-medium leading-[1.1] tracking-tightest text-ink md:text-[42px]">
              <span className="font-cn">文章</span>
              <span className="ml-2.5 font-serif-ac text-[42px] text-lav-400 md:text-[46px]">
                Notes &amp; Drafts
              </span>
            </h1>
            <p className="mt-3 max-w-[560px] font-cn text-[14px] leading-[1.75] text-ink-soft">
              关于 AI 产品、设计语言，以及一点点生活。
            </p>
          </div>
          <div className="hidden font-mono text-[11px] text-ink-mute md:block">
            total · {articles.length}
          </div>
        </header>

        {articles.length === 0 ? (
          <p className="rounded-lg border border-line bg-white p-10 text-center font-cn text-[13px] text-ink-mute">
            还没有发布的文章。
          </p>
        ) : (
          <section className="overflow-hidden rounded-lg border border-line bg-white">
            {articles.map((a, i) => (
              <Link
                key={a.id}
                href={`/blog/${a.slug}`}
                className="grid items-baseline gap-4 border-b border-line-soft px-7 py-5 transition-colors last:border-b-0 hover:bg-surface-tint md:grid-cols-[64px_80px_1fr_auto]"
              >
                <span className="font-mono text-[11px] text-ink-mute">
                  {String(i + 1).padStart(3, "0")}
                </span>
                <span className="font-mono text-[11px] text-ink-mute">
                  {a.published_at}
                </span>
                <div>
                  <h3 className="font-cn text-[15px] font-medium tracking-tightish text-ink">
                    {a.title}
                  </h3>
                  {a.excerpt && (
                    <p className="mt-1.5 font-cn text-[12.5px] leading-[1.6] text-ink-mute">
                      {a.excerpt}
                    </p>
                  )}
                </div>
                <span className="hidden rounded-sm bg-lav-50 px-2 py-0.5 font-mono text-[10px] font-medium tracking-[0.04em] text-lav-500 md:inline">
                  ai · note
                </span>
              </Link>
            ))}
          </section>
        )}
      </main>
      <Footer name={name} />
    </div>
  );
}
