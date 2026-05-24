/**
 * 把 Iris 的简历内容灌进 SQLite。
 * 可重复执行：会清空 experience / projects / articles，再 upsert profile。
 */
import { getDb } from "../lib/db";

const db = getDb();

/* ============================== profile ============================== */

const profilePayload = {
  name: "Iris",
  tagline:
    "AI 产品经理 · 6 年互联网 + 3 年 AI 实战 · 5 个独立 AI 作品",
  bio:
    "AI 产品经理 · 3 年实战 + 5 个独立交付。\n" +
    "做产品的方法是「用尽一切方法了解用户」—— 先成为他们，再做给他们。",
  location: "上海",
  avatar_emoji: "🪻",
  email: "944797659@qq.com",
  socials: JSON.stringify([
    { label: "人人都是产品经理（主编推荐作者）", url: "https://www.woshipm.com/u/1678595" },
    { label: "GitHub · @irismayrain", url: "https://github.com/irismayrain" },
  ]),
  manifesto: "技术可以很酷，但它得对人是温柔的、是诚实的。",
  now_items: JSON.stringify([
    {
      label: "BUILDING",
      body: "镜中 + Suki · 一对共享 Memory 的 AI 陪伴 Agent",
    },
    { label: "WRITING", body: "「人人都是产品经理」主编推荐作者 · 持续输出" },
    { label: "OPEN TO", body: "AI 产品岗 / 远程合作 / 1:1 咨询" },
  ]),
  strengths: JSON.stringify([
    {
      kicker: "01",
      title: "6 年互联网经验 + 3 年 AI 产品实战",
      tagline: "具备 0 → 1 项目主导经验 + 规模化业务交付经验",
      body:
        "6 年互联网工作经验，其中 3 年 AI 产品经验，3 年教培业务规模化经验。" +
        "主导 2 个 0 → 1 AI 产品从立项到内测交付，" +
        "独立完成 5 个 AI 产品交付 + 2 个 AI 陪伴 Agent 内测中，验证技术深度。" +
        "善于通过用户调研、数据分析、行业田野调研定义产品方向。",
    },
    {
      kicker: "02",
      title: "AI 产品全链路能力",
      tagline: "精通 RAG / Prompt / 多模型路由 / AI 安全护栏 / 商业化设计",
      body:
        "深度掌握 RAG（Qwen3-Embedding-0.6B + pgvector + rerank）、Prompt 多模板架构、" +
        "多模型路由（DeepSeek / Kimi / Image 2）、Agent vs Workflow 选型、" +
        "AI 安全护栏（红线 / 漂移检测 / Pre-commit / 危机识别）。" +
        "具备从需求定义、技术选型、架构设计到商业化的全链路能力，" +
        "能在成本 / 质量 / 时延三角约束下做有效取舍。",
    },
    {
      kicker: "03",
      title: "内容输出 + IP 运营",
      tagline: "主编推荐作者 + 付费社群运营 + 开源贡献",
      body:
        "「人人都是产品经理」主编推荐作者。" +
        "独立运营付费咨询社群，140 位高粘性付费用户，年收入 15w+，" +
        "覆盖金融、跨境电商、学术等多元用户样本，作为产品判断的反馈源。" +
        "GitHub 开源 2 个 AI 工具（Daily Tarot · Duet），1 个开源中（Linger），" +
        "持续输出 AI 实战经验。",
    },
  ]),
  skills: JSON.stringify([
    {
      label: "AI 产品方法论",
      items:
        "人设系统设计 · 长短期记忆机制 · Prompt Engineering 多模板架构 · " +
        "AI 安全护栏（红线 / 漂移检测 / Pre-commit / 危机检测）· " +
        "Agent vs Workflow 选型 · 商业化模式设计",
    },
    {
      label: "AI 技术栈",
      items:
        "RAG（BGE-M3 + pgvector + rerank）· 多模型路由（DeepSeek / Kimi / Claude）· " +
        "文生图 / 图生图选型 · ASR 双轨 · LoRA · Claude Code · Cursor",
    },
    {
      label: "工程（vibe coding 自驱）",
      items: "React · Next.js · Vite · Tailwind · FastAPI · Supabase · PostgreSQL",
    },
    {
      label: "数据",
      items: "北极星指标设计 · 留存 / 漏斗 / 转化 / 分群 · A/B 测试 · 埋点方案",
    },
    {
      label: "产品运营",
      items: "SOP 沉淀 · 客诉 / 合规处理 · 团队管理 · 行业田野调研",
    },
  ]),
  education:
    "深圳大学（本科）· 金融学专业 · 2014.09 — 2018.06 · 校级一等奖学金（前 5%）· CET4 · CET6",
};

const profileExists = db.prepare("SELECT id FROM profile WHERE id = 1").get();
if (profileExists) {
  db.prepare(
    `UPDATE profile SET
       name = @name,
       tagline = @tagline,
       bio = @bio,
       location = @location,
       avatar_emoji = @avatar_emoji,
       email = @email,
       socials = @socials,
       manifesto = @manifesto,
       now_items = @now_items,
       strengths = @strengths,
       skills = @skills,
       education = @education
     WHERE id = 1`
  ).run(profilePayload);
} else {
  db.prepare(
    `INSERT INTO profile (id, name, tagline, bio, location, avatar_emoji, email, socials, manifesto, now_items, strengths, skills, education)
     VALUES (1, @name, @tagline, @bio, @location, @avatar_emoji, @email, @socials, @manifesto, @now_items, @strengths, @skills, @education)`
  ).run(profilePayload);
}

/* ============================== experience ============================== */

db.exec("DELETE FROM experience");

const insertExp = db.prepare(
  `INSERT INTO experience (company, role, period, summary, highlights, sort_order)
   VALUES (@company, @role, @period, @summary, @highlights, @sort_order)`
);

[
  {
    company: "上海算术初子网络科技",
    role: "AI 产品经理",
    period: "2023.06 — 至今",
    summary:
      "签约 VTuber 创作者上千名 · 开播 600+ · B 站垂直区营收常年前三。",
    highlights: JSON.stringify([
      {
        tag: "项目简介",
        body:
          "主导公司 0 → 1 的两个直播场景 AI 产品，并进行小范围灰度验证" +
          "（规避在真实主播社群铺开的抗拒与品牌风险），" +
          "核心判断与技术细节见「项目经历」。",
      },
      {
        tag: "AI 实时 Copilot 提词器",
        body:
          "产品形态从 Autopilot 转向 Copilot、小样本内测主播采纳率 30%，" +
          "核心指标「应急可用度」获一线认可。",
      },
      {
        tag: "AI 直播切片",
        body:
          "将切片从「主播积分兑换 + 自费成本」重构为「差异化签约竞争力」，" +
          "约 20 名腰部主播小范围试点验证。",
      },
      {
        tag: "方法论沉淀",
        body:
          "人设档案体系（含版本管理 + 主播本人审签）、AI 安全护栏框架、" +
          "高能识别评分体系，成为公司后续 AI 项目可复用模板。",
      },
    ]),
    sort_order: 0,
  },
  {
    company: "AI 产品方向自主探索期",
    role: "独立产品负责人",
    period: "2022.12 — 至今",
    summary: "",
    highlights: JSON.stringify([
      {
        tag: "独立产品交付",
        body:
          "独立完成 7 个 AI 产品的 0 → 1 设计与开发 —— " +
          "5 个已交付（Linger / 北极星知识库 / GlowNote / Duet / Daily Tarot）+ " +
          "2 个内测中（镜中 + Suki · 共享 Memory 的 AI 陪伴双生子）。" +
          "核心判断与技术细节见「个人作品集」。" +
          "涵盖 RAG 工程化、Prompt 多模板架构、多模型路由、AI 安全机制、" +
          "跨 Agent Memory、跨模态创作等核心 AI 能力验证。",
      },
    ]),
    sort_order: 1,
  },
  {
    company: "上海厚薄教育科技",
    role: "课程运营主管",
    period: "2019.12 — 2022.12",
    summary:
      "公司核心项目：负责 B 站头部画师 Krenz（120 万+ 主号，全网 200 万+ 粉丝矩阵）" +
      "全流程课程项目，项目占公司营收 60%。",
    highlights: JSON.stringify([
      {
        tag: "团队搭建与管理",
        body:
          "从 0 搭建 7 人核心团队，协同台湾行政团队 20 人，" +
          "对 70 人助教团队拥有招聘一票否决权及交付兜底，" +
          "设计 200 人志愿者机制，总协作规模 ~300 人。",
      },
      {
        tag: "SOP 与方法论沉淀",
        body:
          "建立课前-课中-课后全流程标准化 SOP，" +
          "沉淀 353 份公关 / 客诉处理文档作为团队培训手册。",
      },
      {
        tag: "数据驱动运营",
        body:
          "基于公司后台和第三方平台数据完成留存、漏斗、转化、复购、分群分析，" +
          "识别关键流失节点并优化课程交付节奏。",
      },
      {
        tag: "业务成果",
        body:
          "实现年营收 1600 万+（公司端，已扣除画师分成），" +
          "年均交付 2.5–3 万学员，培养接班人体系完成后离职。",
      },
    ]),
    sort_order: 2,
  },
  {
    company: "—",
    role: "早期工作经历",
    period: "2015.09 — 2018.11",
    summary: "",
    highlights: JSON.stringify([
      {
        tag: "少儿英语 App · 欣欣相融教育（好未来 · ABCTime）· 2018.04 — 2018.11",
        body: "单人覆盖内容、运营、教学三个职能模块的高密度交付。",
      },
      {
        tag: "创始团队第一员工 · 深圳战吼网络 BattleCry · 2015.09 — 2017.03（在校期间）",
        body:
          "腾讯系创业公司（CEO 前腾讯即通业务部总监），" +
          "主打海外 FPS 玩家社交 App Modchat。" +
          "参与多个 0 → 1 功能：摄像头扫描游戏战绩 + OCR 结构化玩家主页 / " +
          "LFG 找队友社交 / Overwatch 英雄战绩 profile 雷达图设计。",
        link: {
          url: "https://www.youtube.com/watch?v=j70TwznXIcw",
          label: "展示视频",
        },
      },
    ]),
    sort_order: 3,
  },
].forEach((e) => insertExp.run(e));

/* ============================== projects ============================== */

db.exec("DELETE FROM projects");

const insertProj = db.prepare(
  `INSERT INTO projects (title, subtitle, description, highlights, tags, link, sort_order)
   VALUES (@title, @subtitle, @description, @highlights, @tags, @link, @sort_order)`
);

[
  {
    title: "镜中 · AI 塔罗陪伴 Agent",
    subtitle: "v1 内测中",
    description:
      "不是占卜工具，是「跟过去的自己对话」的工具。" +
      "AI 不替你解读塔罗，而是基于你的长期抽牌历史 + 情绪记录 + 历史会话，" +
      "引导你自己看见自己的模式。",
    highlights: JSON.stringify([
      {
        tag: "Memory 4 层架构",
        body:
          "Permanent（用户档案 + 个人塔罗语言）/ Long-term（月度压缩）/ " +
          "Short-term（最近 30 天）/ Working（本次会话）—— " +
          "搭配自动压缩 chain 与升降级机制。",
      },
      {
        tag: "Harness · 4 + 1 多 Agent",
        body:
          "Listener（路由）/ Cardspeaker（牌的声音）/ Reflector（引导反思）/ " +
          "Patternfinder（模式识别）+ Guardian（常驻 crisis detection 移植自 Linger）。",
      },
      {
        tag: "Workflow vs Autonomous 选型",
        body:
          "基于时延（< 3s vs 5–15s）/ 成本（1x vs 5–10x token）/ 可控性三角，" +
          "选 Workflow 编排而非 Autonomous Agent —— 是「AI 不替你想」哲学的工程落地。",
      },
      {
        tag: "Context Engineering",
        body:
          "JIT Retrieval + Token Budget 8k 上限 + 5 轮 / 30 天 / 季度三档压缩链，" +
          "单次会话成本 < ¥0.05。",
      },
      {
        tag: "跨 Agent Memory",
        body:
          "与 Suki 共享 Memory Pool —— 镜中观察 + Suki 投递，" +
          "形成「一个 Agent 听你，一个 Agent 给你」的完整闭环。",
      },
      {
        tag: "技术栈",
        body:
          "Next.js + Supabase（pgvector）+ Cloudflare Workers AI（Qwen3-Embedding-0.6B 1024 维）+ DeepSeek + Claude。",
      },
    ]),
    tags: JSON.stringify(["Memory · Harness · Context", "AI 陪伴 Agent", "v1 内测中"]),
    link: "#",
    sort_order: 0,
  },
  {
    title: "Suki · 每天带一点会让你喜欢的东西",
    subtitle: "v1 内测中",
    description:
      "高自由度策展型 Agent。每天 1–2 次主动给你叼一片今天的世界 —— " +
      "一首没听过的小诗、一张某人 2017 拍的照片、Wikipedia 角落的奇怪词条。" +
      "反 AI 助手范式，名字即承诺（Suki / 好き / 喜欢）。",
    highlights: JSON.stringify([
      {
        tag: "Real Agent 完整循环",
        body:
          "Sense → Goal → Plan → Act → Curate → Compose → Deliver → Reflect 八步闭环，" +
          "5 个自由度全开（路由 / 工具调用 / 任务规划 / 反思迭代 / 目标解析）。",
      },
      {
        tag: "多工具 ReAct 调度",
        body:
          "4 个工具协同 —— Tavily（web search）/ fetch_url / Unsplash（image）/ " +
          "DeepSeek（text gen），每步独立 LLM call 不污染上下文。",
      },
      {
        tag: "70 / 30 配方",
        body:
          "70% 在已知偏好内 + 30% 故意越界探索（主题 / 文体 / 时间维度），" +
          "避免 echo chamber —— Spotify Discovery Weekly 的核心配方。",
      },
      {
        tag: "跨 Agent Memory",
        body:
          "与镜中共享 Memory Pool —— 镜中里说「工作焦虑」，" +
          "次日 Suki 投递「放下」主题的诗与图。",
      },
      {
        tag: "成本控制",
        body:
          "自用阶段约 ¥7–8 / 月（含 LLM + 搜索 + embedding），" +
          "vs 一般 Agent ¥200+ / 月 —— 靠 Cloudflare 免费 tier embedding + Prompt 优化 + 工具选型实现。",
      },
      {
        tag: "技术栈",
        body:
          "Next.js + Supabase + Cloudflare Workers AI + DeepSeek + Tavily + Unsplash + Vercel Cron。",
      },
    ]),
    tags: JSON.stringify(["Real Agent", "多工具调度", "v1 内测中"]),
    link: "#",
    sort_order: 1,
  },
  {
    title: "Linger · AI 阅读反思工具",
    subtitle: "准备开源",
    description:
      "阅读陪伴产品。在 AI 时代，守住自己的思考能力。" +
      "让 AI 和用户一起阅读，但不替用户思考。",
    highlights: JSON.stringify([
      {
        tag: "Prompt 多模板架构",
        body:
          "设计 6 个独立 Prompt 模板（main / reflect / boundary_judge / " +
          "intent_detector / crisis_detector / share_view），" +
          "实现复杂对话场景的模块化管理。",
      },
      {
        tag: "AI 安全机制",
        body:
          "内置 crisis_detector 危机识别模块，识别用户情绪危机并触发兜底响应，" +
          "体现 AI 安全在产品形态层的实现。",
      },
      {
        tag: "技术实现",
        body: "Vite + 多模板 Prompt Engineering + 前端工程化；项目准备开源。",
      },
    ]),
    tags: JSON.stringify(["Prompt Engineering", "AI 安全", "准备开源"]),
    link: "#",
    sort_order: 2,
  },
  {
    title: "北极星知识库 · 个人 AI 第二大脑",
    subtitle: "私有",
    description:
      "为个人用户独立设计的 AI 知识管理产品，将 4 万字工作文档转化为可对话的第二大脑，" +
      "解决当时 Notion 无 AI、ChatGPT 无持久记忆两大痛点。",
    highlights: JSON.stringify([
      {
        tag: "多视图渲染",
        body: "章节 / 概念 / 词典 / Q&A / 笔记 5 种视图，从不同维度呈现同一知识体系。",
      },
      {
        tag: "长短期记忆",
        body:
          "当前会话上下文 + 用户偏好持久化为个性化知识图谱，" +
          "结合艾宾浩斯遗忘曲线与知识关联可视化。",
      },
      {
        tag: "Pre-commit AI 审批",
        body:
          "AI 修改任何内容前必须用户批准，" +
          "从产品形态层守住「AI 永远不是黑箱」的原则。",
      },
      {
        tag: "RAG 工程化",
        body:
          "BGE-M3 向量化 + pgvector 检索 + rerank 重排，准确率持续优化" +
          "（现已替换到 Qwen3-Embedding-0.6B，Cloudflare）。",
      },
      {
        tag: "双轨编译",
        body:
          "Claude 手工保底 + DeepSeek 自动迭代，" +
          "新加入的文档按照规定进行编译。",
      },
      {
        tag: "技术栈",
        body: "Next.js + Supabase + DeepSeek + BGE-M3 + pgvector。",
      },
    ]),
    tags: JSON.stringify(["RAG", "BGE-M3 + pgvector", "可现场演示"]),
    link: "#",
    sort_order: 3,
  },
  {
    title: "GlowNote · 美妆品牌内容生成 iOS 工具",
    subtitle: "",
    description:
      "为早期平价美妆品牌产出小红书风格内容，调性真实、合规、接地气。",
    highlights: JSON.stringify([
      {
        tag: "技术栈",
        body: "文生图 + 图生图多模型路由 + iOS + 服务端 Prompt 管理。",
      },
      {
        tag: "模型微调探索",
        body:
          "尝试了火山引擎的模型微调，跑通「收集数据并处理 → 设置超参并配置 → 评估模型」初步流程。",
      },
    ]),
    tags: JSON.stringify(["iOS", "多模型路由", "合规设计"]),
    link: "#",
    sort_order: 4,
  },
  {
    title: "Duet · Markdown 批注与 Vibe Coding 反馈工具",
    subtitle: "已开源",
    description:
      "Vibe coding 场景下 AI 给的 markdown 文档难批改的痛点解决方案。",
    highlights: JSON.stringify([
      { tag: "4 种批注类型", body: "支持不同维度的反馈结构化记录。" },
      {
        tag: "章节路径汇总",
        body: "自动锚定批注在文档结构中的位置，一键复制粘回 AI。",
      },
      {
        tag: "技术栈",
        body: "Vite + React + TS + Tailwind + unified / remark / rehype。",
      },
    ]),
    tags: JSON.stringify(["Open Source", "Vite + React", "Markdown"]),
    link: "https://github.com/irismayrain",
    sort_order: 5,
  },
  {
    title: "Daily Tarot · HTML 塔罗抽签应用",
    subtitle: "已开源",
    description:
      "基于本人 2021 年起的塔罗研究 + 占卜实践 + 画画专业背景的跨界作品。",
    highlights: JSON.stringify([
      {
        tag: "设计目标",
        body: "保留韦特塔罗意象，换人物 + 换画风重绘 22 张大阿卡纳。",
      },
      {
        tag: "技术追踪",
        body:
          "持续追踪 AI 图像工具演进 2.5+ 年（2022 SD / Midjourney → " +
          "2024–2025 image2 时代），等到工具控制力到位后完成。",
      },
    ]),
    tags: JSON.stringify(["AI 图像", "原创插画", "Open Source"]),
    link: "https://github.com/irismayrain",
    sort_order: 6,
  },
].forEach((p) => insertProj.run(p));

/* ============================== articles ============================== */

// 注意：文章不在这里维护，由 scripts/import-woshipm.ts 单独管理。
// 这里**故意不动 articles 表**，避免每次 reseed 把博客内容 wipe 掉。

const articleCount = (
  db.prepare("SELECT COUNT(*) AS n FROM articles").get() as { n: number }
).n;

console.log("✅ Seed (Iris) done.");
console.log("   profile · upserted (strengths 3 · skills 5 · education)");
console.log("   experience · 4 rows (with highlights)");
console.log("   projects · 7 rows (with highlights)");
console.log(`   articles · ${articleCount} rows (untouched · 由 import:articles 维护)`);
