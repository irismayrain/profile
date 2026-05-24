import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import { getProfile, getArticleBySlug } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const profile = getProfile();
  const article = getArticleBySlug(params.slug);
  if (!article || !article.is_published) notFound();
  const name = profile?.name ?? "";

  return (
    <div className="min-h-screen pt-5">
      <SiteNav name={name} />
      <main className="mx-auto w-full max-w-[760px] px-5 pb-20 pt-8 md:px-9">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ink-mute transition-colors hover:text-lav-500"
        >
          <span className="font-serif-ac text-lav-400">←</span>
          back to writing
        </Link>

        <header className="fade-up mt-8 mb-10">
          <div className="mb-3 flex items-center gap-3 font-mono text-[11px] tracking-[0.06em] text-ink-mute">
            <span>{article.published_at}</span>
            <span className="text-ink-faint">/</span>
            <span className="rounded-sm bg-lav-50 px-2 py-0.5 font-medium text-lav-500">
              ai · note
            </span>
          </div>
          <h1 className="text-[32px] font-medium leading-[1.18] tracking-tightest text-ink md:text-[40px]">
            <span className="font-cn">{article.title}</span>
          </h1>
          {article.excerpt && (
            <p className="mt-5 font-cn text-[16px] leading-[1.8] text-ink-soft">
              {article.excerpt}
            </p>
          )}
          <div className="mt-7 h-px w-16 bg-lav-200" />
        </header>

        <article className="prose-soft">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
        </article>

        <footer className="mt-16 flex items-center justify-between border-t border-dashed border-line pt-6 font-mono text-[11px] text-ink-mute">
          <Link href="/blog" className="hover:text-lav-500">
            ← all notes
          </Link>
          <span className="font-serif-ac text-lav-400">— end —</span>
          <Link href="/" className="hover:text-lav-500">
            home →
          </Link>
        </footer>
      </main>
      <Footer name={name} />
    </div>
  );
}
