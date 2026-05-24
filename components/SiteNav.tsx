"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string; ext: string };

const items: Item[] = [
  { href: "/about", label: "自述", ext: "01" },
  { href: "/experience", label: "经历", ext: "02" },
  { href: "/projects", label: "项目", ext: "03" },
  { href: "/blog", label: "文章", ext: "04" },
  { href: "/contact", label: "联系", ext: "05" },
];

function isActive(href: string, pathname: string | null): boolean {
  if (!pathname) return false;
  if (href === "/blog") return pathname.startsWith("/blog");
  return pathname === href;
}

export default function SiteNav({ name }: { name: string }) {
  const pathname = usePathname();

  return (
    <div className="sticky top-5 z-40 mx-auto w-full max-w-[1320px] px-5 md:px-9">
      <nav
        className="flex items-center justify-between rounded-[14px] border border-line bg-white/60 px-4 py-2.5 shadow-soft1"
        style={{ backdropFilter: "blur(14px) saturate(140%)", WebkitBackdropFilter: "blur(14px) saturate(140%)" }}
      >
        {/* brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <span
            className="relative h-[22px] w-[22px] shrink-0 rounded-[6px]"
            style={{
              background:
                "linear-gradient(135deg, #B9A6DF 0%, #EBE4F6 60%, #EDCDDB 100%)",
              boxShadow:
                "inset 0 0 0 1px rgba(255,255,255,.7), 0 1px 6px rgba(120,100,170,.25)",
            }}
          >
            <span
              className="absolute inset-[5px] rounded-full bg-white"
              style={{ boxShadow: "inset 0 0 0 1.5px #9582C9" }}
            />
          </span>
          <span className="flex items-baseline gap-2 text-[14px] font-semibold tracking-[-0.01em] text-ink">
            <span>{name || "Profile"}</span>
            <span className="font-mono text-[11px] font-normal text-ink-mute">
              / portfolio
            </span>
          </span>
        </Link>

        {/* tabs */}
        <div className="hidden items-center gap-0.5 rounded-[10px] bg-page-soft p-1 md:flex">
          {items.map((it) => {
            const active = isActive(it.href, pathname ?? null);
            return (
              <Link
                key={it.href}
                href={it.href}
                className={`group inline-flex items-center rounded-[7px] px-3.5 py-[7px] text-[13px] font-medium tracking-tightish transition-all duration-200 ${
                  active
                    ? "bg-white text-ink shadow-soft1"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {it.label}
                <span
                  className={`ml-1.5 font-mono text-[10px] ${
                    active ? "text-lav-400" : "text-ink-mute"
                  }`}
                >
                  {it.ext}
                </span>
              </Link>
            );
          })}
        </div>

        {/* right side */}
        <div className="flex items-center gap-3">
          <span
            className="hidden items-center gap-2 rounded-full border px-3 py-[5px] text-[12px] font-medium tracking-tightish md:inline-flex"
            style={{
              color: "#3d8a72",
              background: "rgba(111,181,154,.08)",
              borderColor: "rgba(111,181,154,.22)",
            }}
          >
            <span className="pulse-dot" />
            available
          </span>
        </div>
      </nav>
    </div>
  );
}
