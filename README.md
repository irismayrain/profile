# Iris · 个人主页

AI 产品经理的个人网站。Next.js 14 + Tailwind + SQLite,带后台编辑器。

## 快速开始

```bash
npm install
npm run seed    # 首次:填充示例内容
npm run dev     # http://localhost:3000
```

## 后台

- 地址:`http://localhost:3000/admin`
- 密码:在 `.env.local` 的 `ADMIN_PASSWORD`(默认 `changeme`,**部署前一定改掉**)
- 编辑后会自动保存到 SQLite,主站实时刷新

后台四个 tab:
- **个人信息** — Hero 区(名字、定位、自我介绍、头像 emoji、社交链接)
- **工作经历** — 增删改 + 排序
- **项目** — 增删改 + 标签 + 链接
- **文章** — Markdown 编辑器,支持草稿/发布、自动 slug

## 数据存哪

- SQLite 文件:`data/site.db`(已 .gitignore)
- 想换电脑?直接 copy 这个文件过去

## 部署提示

SQLite 需要持久磁盘,**不能直接部署到 Vercel**(serverless 文件系统不持久)。
推荐:
- **Railway / Fly.io / Render** — 带持久卷,SQLite 直接跑
- **想用 Vercel** — 后续把存储层换成 Turso / Postgres / Neon,改 `lib/db.ts` 一个文件就行

## 文件结构

```
app/
  page.tsx             # 主页(About → Experience → Projects → Contact)
  blog/                # 文章列表 + 详情
  admin/               # 后台
  api/admin/           # 编辑用的 API
lib/
  db.ts                # SQLite + 类型 + 查询
  auth.ts              # 密码登录 / cookie session
scripts/
  seed.ts              # 示例内容
```

## 改配色

`tailwind.config.ts` 里的 `rose` 和 `iris`。当前低饱和粉紫:
- `rose.soft: #e8c5d0` / `rose.deep: #d4a5b8`
- `iris.soft: #c5b5d4` / `iris.deep: #a896c2`
