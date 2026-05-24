"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [menuOpen, setMenuOpen] = useState(false);

  // 路由变了自动关菜单
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // 菜单打开时禁止 body 滚动
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className="sticky top-5 z-40 mx-auto w-full max-w-[1320px] px-5 md:px-9">
      <nav
        className="flex items-center justify-between rounded-[14px] border border-line bg-white/60 px-4 py-2.5 shadow-soft1"
        style={{
          backdropFilter: "blur(14px) saturate(140%)",
          WebkitBackdropFilter: "blur(14px) saturate(140%)",
        }}
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

        {/* tabs · desktop */}
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

          {/* mobile hamburger */}
          <button
            type="button"
            aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-line bg-white/80 text-ink-soft transition-colors hover:text-ink md:hidden"
          >
            {menuOpen ? (
              // close icon
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              >
                <path d="M3 3l10 10M13 3L3 13" />
              </svg>
            ) : (
              // hamburger icon (3 lines)
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              >
                <path d="M2 4h12M2 8h12M2 12h12" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* mobile dropdown menu */}
      {menuOpen && (
        <>
          {/* backdrop, click to close */}
          <button
            type="button"
            aria-label="关闭菜单背景"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 top-0 z-30 bg-ink/10 backdrop-blur-[2px] md:hidden"
          />
          {/* panel */}
          <div className="absolute left-5 right-5 top-full z-40 mt-2 rounded-[14px] border border-line bg-white/95 p-3 shadow-soft2 md:hidden"
               style={{
                 backdropFilter: "blur(14px) saturate(140%)",
                 WebkitBackdropFilter: "blur(14px) saturate(140%)",
               }}
          >
            <ul className="flex flex-col gap-0.5">
              {items.map((it) => {
                const active = isActive(it.href, pathname ?? null);
                return (
                  <li key={it.href}>
                    <Link
                      href={it.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center justify-between rounded-[10px] px-4 py-3 transition-colors ${
                        active
                          ? "bg-lav-50 text-ink"
                          : "text-ink-soft hover:bg-page-soft hover:text-ink"
                      }`}
                    >
                      <span className="font-cn text-[15px] font-medium tracking-tightish">
                        {it.label}
                      </span>
                      <span
                        className={`font-mono text-[11px] ${
                          active ? "text-lav-500" : "text-ink-mute"
                        }`}
                      >
                        {it.ext}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-2 border-t border-dashed border-line pt-3 px-1">
              <span
                className="inline-flex items-center gap-2 rounded-full border px-3 py-[5px] text-[12px] font-medium tracking-tightish"
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
          </div>
        </>
      )}
    </div>
  );
}
