# Iris · 个人主页

> AI 产品经理 · 6 年互联网 + 3 年 AI 实战 · 7 个独立 AI 作品

**🌐 不想看代码,直接打开网站 → <https://profile-production-909e.up.railway.app>**

> 下面是给好奇这个站怎么实现的工程同事看的。
> Live edit 在 `/admin`,运维细节见 [操作手册.md](./操作手册.md)。

---

## 这不是一个静态 portfolio

大多数个人站是「把 markdown 渲染成 HTML」。这个站做了一件更费力但更有用的事:

**把"简历内容"和"代码"分开** —— 一份可在线编辑、即时同步、用 SQLite 存的真实数据库,而不是把内容硬编码进 .md 文件。

| 改一句话的成本 | 静态站 | 这个站 |
|---|---|---|
| 改 hero 的 tagline | 改 md → commit → push → 等 CI → 等部署 | 开 `/admin` → 改 → 保存 → 刷新主页(**即时**) |
| 加一篇文章 | 写 md → commit → push | 改 import 脚本 → push → 后台一键灌入 |
| 改某段经历的 5 个要点之一 | 编辑深度嵌套的 markdown 列表 | 在 admin 的结构化表单里改 |

代价:不能用 Vercel / Netlify 这类无文件系统的平台。所以选 Railway + 持久卷。

---

## 几个值得讲的设计决定

### 1 · SQLite + 持久卷,不上 Postgres

个人站没有并发问题。SQLite 跑在同进程,**0 网络延迟**,迁移就一行 ALTER TABLE。
schema 在 `lib/db.ts` 里跟 TypeScript 类型**同源** —— 没有 ORM,没有迁移工具,**`getDb().migrate()` 函数自己维护 schema 演进**。

### 2 · `/admin` 编辑器是手写的,不是套 CMS

为了把"结构化的简历"(经历里嵌套 highlights,每个 highlight 又有可选 link)做成**人可编辑**的 UI,自己写了 3 个结构化 JSON 编辑器:`HighlightsEditor` / `StrengthsEditor` / `SkillsEditor`。
每个都是"列表 + 行级表单 + 上下移 / 删 / 加",约 100 行 React。

### 3 · 数据源职责分离

| 数据 | 真相在哪 | 谁能改 |
|---|---|---|
| profile / 经历 / 项目 / strengths / skills | `/admin` 后台(SQLite) | 浏览器直接改,即时同步 |
| 博客文章 | `scripts/import-woshipm.ts`(代码) | 改代码 + push + 后台点「灌种子数据」 |
| 静态资源(演讲 PDF / HTML) | `public/`(代码) | 改代码 + push |

简历类内容**频繁改、改完即看**;长文类内容**改起来慢、需要 code review** —— 分别用不同的"真相源"。

### 4 · 部署即时同步,不破坏 admin 编辑

`scripts/seed-iris.ts` **故意不动 articles 表**;`/api/admin/seed-all` 跑的是 UPSERT,不是 DELETE+INSERT。这样:
- 代码部署不会覆盖你在 admin 改的内容
- 重跑 seed 不会清空文章

(这条是踩过坑学到的 —— 早期 seed-iris.ts 末尾有 `DELETE FROM articles`,每次部署文章全消失。现在不会了。)

### 5 · 安全:fail closed,不是 fail open

`lib/auth.ts` 里 `SESSION_SECRET` 缺失 → **production 直接抛错,拒绝认证**。
代码即使全公开,攻击者也拿不到 fallback 字符串 —— 因为 production 模式下根本没 fallback。

---

## 技术栈

```
Frontend       Next.js 14 (App Router) · React 18 · TypeScript · Tailwind 3
Backend        Next.js API Routes · server components
Database       SQLite (better-sqlite3) · pgvector-ready schema
Auth           HMAC-signed cookie · 环境变量驱动
Markdown       react-markdown + remark-gfm
Deploy         Railway (Volume + auto-deploy from GitHub)
Dev            tsx · npm scripts
```

---

## 本地跑

```bash
# 1. 装依赖
npm install

# 2. 设置本地 admin 密码
echo "ADMIN_PASSWORD=本地密码" > .env.local

# 3. 灌种子数据(首次)
npm run seed:iris        # profile / 经历 / 项目 / strengths / skills
npm run import:articles  # 5 篇博客

# 4. 起 dev server
npm run dev              # http://localhost:3001(或 3002,看端口占用)
```

后台:`http://localhost:3001/admin`,输入 `.env.local` 的密码。

---

## 部署到 Railway

详细一步步过见 [操作手册.md](./操作手册.md)。核心步骤:

1. GitHub 接 Railway
2. 添加 Volume,mount 到 `/app/data`(SQLite 文件位置)
3. 配环境变量:
   - `ADMIN_PASSWORD` — 强密码
   - `SESSION_SECRET` — 32+ 字符随机串(`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
4. 部署完后,登 `/admin` 点「灌种子数据」按钮
5. 完事

---

## 项目结构

```
profile/
├── app/
│   ├── page.tsx              # 主页:Hero + Now + Connect
│   ├── about/                # 自述长信(/about)
│   ├── experience/           # 个人优势 + 经历 + 教育
│   ├── projects/             # 7 个项目 + 技能
│   ├── blog/                 # 文章列表 + 详情
│   ├── contact/              # 联系
│   ├── admin/                # 后台 + 编辑器
│   └── api/admin/            # admin API(profile/exp/projects/articles/seed-all)
├── components/               # SiteNav · Footer
├── lib/
│   ├── db.ts                 # SQLite + schema 迁移 + 类型
│   └── auth.ts               # HMAC cookie auth
├── scripts/
│   ├── seed-iris.ts          # 灌入简历内容(UPSERT)
│   └── import-woshipm.ts     # 灌入 5 篇博客(UPSERT)
├── public/                   # 静态资源(Vibe Coding 演讲 HTML/PDF)
└── 操作手册.md                # 完整运维 / 出错对照 / 命令速查
```

---

## 内容来源

文章正文同步自 [人人都是产品经理 · @Iris](https://www.woshipm.com/u/1678595)(AIPM 主题主编推荐作者)。

代码内的简历内容(经历 / 项目 / 优势 / 技能)以 `scripts/seed-iris.ts` 为源 —— 改了 push 后,在 `/admin` 点「灌种子数据」即可同步到生产 DB。

---

## 联系

| | |
|---|---|
| Email | 944797659@qq.com |
| GitHub | [@irismayrain](https://github.com/irismayrain) |
| 文章 | [人人都是产品经理 · @Iris](https://www.woshipm.com/u/1678595) |
| 演讲 | [Vibe Coding 全流程实战](https://profile-production-909e.up.railway.app/vibecoding.html) |

---

> 这个 repo 同时是简历、是作品集、是一份证明:**做 AI 产品的人,自己也能 vibe coding 把架构落地。**
