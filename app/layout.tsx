import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Iris · AI Product Manager",
  description:
    "AI 产品经理 · 教培 1600 万规模化 → 3 年 AI 实战 → 5 个独立交付。技术可以很酷，但它得对人是温柔的、是诚实的。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@300;400;500;600;700&family=Noto+Sans+SC:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
