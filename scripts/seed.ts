import { getDb } from "../lib/db";

const db = getDb();

const profileRow = db.prepare("SELECT id FROM profile WHERE id = 1").get();
if (!profileRow) {
  db.prepare(
    `INSERT INTO profile (id, name, tagline, bio, location, avatar_emoji, email, socials, manifesto, now_items)
     VALUES (1, @name, @tagline, @bio, @location, @avatar_emoji, @email, @socials, @manifesto, @now_items)`
  ).run({
    name: "林夕",
    tagline: "AI 产品经理 · 让模型更懂人，让人更敢用模型。",
    bio:
      "六年互联网产品经验，过去三年专注于 LLM 应用与 Agent 产品。\n" +
      "相信好的 AI 产品不是把模型塞进每一个角落，而是在合适的位置，用合适的方式，替用户解决他们真正在意的事。\n" +
      "工作之外，会写一点关于产品、AI 与生活的小文。",
    location: "上海",
    avatar_emoji: "🌷",
    email: "hello@example.com",
    socials: JSON.stringify([
      { label: "Twitter", url: "https://twitter.com/" },
      { label: "微信公众号", url: "#" },
      { label: "小红书", url: "#" },
    ]),
    manifesto:
      "Good AI products don't put models everywhere — they put them in the right place.",
    now_items: JSON.stringify([
      { label: "BUILDING", body: "面向创作者的 AI Agent · 在打磨长文记忆系统" },
      { label: "READING", body: "《设计的设计》— 原研哉" },
      { label: "OPEN TO", body: "远程合作 / 1:1 咨询 / 交个朋友" },
    ]),
  });
}

const expCount = (db.prepare("SELECT COUNT(*) AS n FROM experience").get() as { n: number }).n;
if (expCount === 0) {
  const insert = db.prepare(
    `INSERT INTO experience (company, role, period, summary, sort_order)
     VALUES (@company, @role, @period, @summary, @sort_order)`
  );
  [
    {
      company: "某 AI 创业公司",
      role: "Senior AI Product Manager",
      period: "2024 — 至今",
      summary:
        "负责面向创作者的 AI Agent 产品。从 0 到 1 设计了任务编排、记忆、工具调用三层架构，DAU 半年增长 12 倍。",
      sort_order: 0,
    },
    {
      company: "某大厂 AI Lab",
      role: "AI Product Manager",
      period: "2022 — 2024",
      summary:
        "主导对话式助手在 C 端业务的落地，覆盖 5 个产品线，牵头建立了 LLM 应用的产品评估体系。",
      sort_order: 1,
    },
    {
      company: "某互联网公司",
      role: "Product Manager",
      period: "2019 — 2022",
      summary:
        "内容社区产品方向。负责推荐 feed 与创作者增长，主导一次核心信息流的改版，留存提升 8%。",
      sort_order: 2,
    },
  ].forEach((e) => insert.run(e));
}

const projCount = (db.prepare("SELECT COUNT(*) AS n FROM projects").get() as { n: number }).n;
if (projCount === 0) {
  const insert = db.prepare(
    `INSERT INTO projects (title, subtitle, description, tags, link, sort_order)
     VALUES (@title, @subtitle, @description, @tags, @link, @sort_order)`
  );
  [
    {
      title: "Looma · AI 写作搭子",
      subtitle: "面向独立创作者的长文写作 Agent",
      description:
        "从大纲到成稿，把模型当作合写者而不是工具。重点解决长文写作中「上下文丢失」和「语气漂移」两个痛点。",
      tags: JSON.stringify(["Agent", "Writing", "0→1"]),
      link: "#",
      sort_order: 0,
    },
    {
      title: "Echo · 对话式 BI",
      subtitle: "面向运营同学的数据问答助手",
      description:
        "让不会写 SQL 的同学也能「用问的」看数据。重点在歧义澄清、可追溯的查询解释、以及业务术语词表的协作维护。",
      tags: JSON.stringify(["LLM", "B 端", "数据"]),
      link: "#",
      sort_order: 1,
    },
    {
      title: "Petal · 个人记忆助手",
      subtitle: "周末做的小工具，记录想法、自动归档",
      description:
        "一个长期的副业项目。用来探索「个人化记忆」在 LLM 产品中能走多远 —— 现在已经替我管着三千多条想法。",
      tags: JSON.stringify(["Side Project", "Memory"]),
      link: "#",
      sort_order: 2,
    },
  ].forEach((p) => insert.run(p));
}

const artCount = (db.prepare("SELECT COUNT(*) AS n FROM articles").get() as { n: number }).n;
if (artCount === 0) {
  const insert = db.prepare(
    `INSERT INTO articles (slug, title, excerpt, content, published_at, is_published)
     VALUES (@slug, @title, @excerpt, @content, @published_at, @is_published)`
  );
  [
    {
      slug: "ai-pm-is-not-prompt-pm",
      title: "AI PM 不是 Prompt PM",
      excerpt: "聊聊 AI 产品经理这一年最容易踩的三个误区。",
      content:
        "## 误区一：把「调 Prompt」当作产品工作\n\n" +
        "Prompt 是手段，不是产品。真正的产品工作发生在：用户什么时候被打断、模型出错时如何兜底、跨会话的记忆怎么组织。\n\n" +
        "## 误区二：用 demo 的 happy path 评估产品\n\n" +
        "Demo 跑通和产品好用之间，差着一整套评估体系。\n\n" +
        "## 误区三：相信「模型一升级就好了」\n\n" +
        "模型确实在变强，但用户的耐心没有变多。",
      published_at: "2026-04-12",
      is_published: 1,
    },
    {
      slug: "agent-memory-design-notes",
      title: "Agent 记忆系统的几个设计笔记",
      excerpt: "短期、长期、共享 —— 三种记忆要分开看待。",
      content:
        "做了一年 Agent 之后，我越来越相信：**记忆不是一个模块，是三个**。\n\n" +
        "- 短期记忆：本次会话的上下文\n" +
        "- 长期记忆：跨会话的用户偏好与事实\n" +
        "- 共享记忆：团队/组织级别的知识\n\n" +
        "三者的读写时机、衰减策略、用户控制权都不一样，放一起就乱。",
      published_at: "2026-03-02",
      is_published: 1,
    },
    {
      slug: "what-i-learned-shipping-llm-products",
      title: "上线 LLM 产品这两年学到的几件事",
      excerpt: "关于评估、回归、用户期望管理。",
      content:
        "## 1. 评估比开发难\n\n建一套能跑、能信、能用来 ship/no ship 的评估，是真正的门槛。\n\n## 2. 用户期望要主动管理\n\n用户对 AI 的期望是非线性的，要靠产品 UX 引导。\n\n## 3. 回归是新的稳定性\n\n模型升级不是 free lunch。",
      published_at: "2026-01-20",
      is_published: 1,
    },
  ].forEach((a) => insert.run(a));
}

console.log("Seed done.");
