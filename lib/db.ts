import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = path.join(process.cwd(), "data", "site.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  migrate(db);
  _db = db;
  return db;
}

function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      name TEXT NOT NULL,
      tagline TEXT NOT NULL,
      bio TEXT NOT NULL,
      location TEXT NOT NULL DEFAULT '',
      avatar_emoji TEXT NOT NULL DEFAULT '🌸',
      email TEXT NOT NULL DEFAULT '',
      socials TEXT NOT NULL DEFAULT '[]',
      manifesto TEXT NOT NULL DEFAULT '',
      now_items TEXT NOT NULL DEFAULT '[]',
      strengths TEXT NOT NULL DEFAULT '[]',
      skills TEXT NOT NULL DEFAULT '[]',
      education TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS experience (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT NOT NULL,
      role TEXT NOT NULL,
      period TEXT NOT NULL,
      summary TEXT NOT NULL DEFAULT '',
      highlights TEXT NOT NULL DEFAULT '[]',
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      highlights TEXT NOT NULL DEFAULT '[]',
      tags TEXT NOT NULL DEFAULT '[]',
      link TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      published_at TEXT NOT NULL,
      is_published INTEGER NOT NULL DEFAULT 1
    );
  `);

  // Idempotent column additions for existing DBs.
  const profileCols = db.prepare("PRAGMA table_info(profile)").all() as {
    name: string;
  }[];
  const colNames = new Set(profileCols.map((c) => c.name));
  if (!colNames.has("manifesto")) {
    db.exec("ALTER TABLE profile ADD COLUMN manifesto TEXT NOT NULL DEFAULT ''");
  }
  if (!colNames.has("now_items")) {
    db.exec("ALTER TABLE profile ADD COLUMN now_items TEXT NOT NULL DEFAULT '[]'");
  }
  if (!colNames.has("strengths")) {
    db.exec("ALTER TABLE profile ADD COLUMN strengths TEXT NOT NULL DEFAULT '[]'");
  }
  if (!colNames.has("skills")) {
    db.exec("ALTER TABLE profile ADD COLUMN skills TEXT NOT NULL DEFAULT '[]'");
  }
  if (!colNames.has("education")) {
    db.exec("ALTER TABLE profile ADD COLUMN education TEXT NOT NULL DEFAULT ''");
  }

  const expCols = db.prepare("PRAGMA table_info(experience)").all() as {
    name: string;
  }[];
  const expColNames = new Set(expCols.map((c) => c.name));
  if (!expColNames.has("highlights")) {
    db.exec("ALTER TABLE experience ADD COLUMN highlights TEXT NOT NULL DEFAULT '[]'");
  }

  const projCols = db.prepare("PRAGMA table_info(projects)").all() as {
    name: string;
  }[];
  const projColNames = new Set(projCols.map((c) => c.name));
  if (!projColNames.has("highlights")) {
    db.exec("ALTER TABLE projects ADD COLUMN highlights TEXT NOT NULL DEFAULT '[]'");
  }

  // 保证 profile 永远有一行（id=1）。空字段，但行在 —— 这样 /admin 不会崩。
  // 主页 / 各 section 页通过判断 name 是否为空来决定显示「请灌数据」fallback。
  const profileRow = db.prepare("SELECT id FROM profile WHERE id = 1").get();
  if (!profileRow) {
    db.prepare(
      `INSERT INTO profile (
         id, name, tagline, bio, location, avatar_emoji, email,
         socials, manifesto, now_items, strengths, skills, education
       ) VALUES (1, '', '', '', '', '🌸', '', '[]', '', '[]', '[]', '[]', '')`
    ).run();
  }
}

export type Profile = {
  id: number;
  name: string;
  tagline: string;
  bio: string;
  location: string;
  avatar_emoji: string;
  email: string;
  socials: string;
  manifesto: string;
  now_items: string;
  strengths: string;
  skills: string;
  education: string;
};

export type Experience = {
  id: number;
  company: string;
  role: string;
  period: string;
  summary: string;
  highlights: string;
  sort_order: number;
};

export type Project = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  highlights: string;
  tags: string;
  link: string;
  sort_order: number;
};

export type Article = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  published_at: string;
  is_published: number;
};

export type Social = { label: string; url: string };
export type NowItem = { label: string; body: string };
export type Highlight = {
  tag?: string;
  body: string;
  link?: { url: string; label: string };
};
export type Strength = { kicker: string; title: string; tagline: string; body: string };
export type SkillCategory = { label: string; items: string };

export function getProfile(): Profile | null {
  return (getDb().prepare("SELECT * FROM profile WHERE id = 1").get() as Profile) ?? null;
}

export function getExperience(): Experience[] {
  return getDb()
    .prepare("SELECT * FROM experience ORDER BY sort_order ASC, id ASC")
    .all() as Experience[];
}

export function getProjects(): Project[] {
  return getDb()
    .prepare("SELECT * FROM projects ORDER BY sort_order ASC, id ASC")
    .all() as Project[];
}

export function getArticles(opts: { onlyPublished?: boolean } = {}): Article[] {
  const where = opts.onlyPublished ? "WHERE is_published = 1" : "";
  return getDb()
    .prepare(`SELECT * FROM articles ${where} ORDER BY published_at DESC, id DESC`)
    .all() as Article[];
}

export function getArticleBySlug(slug: string): Article | null {
  return (
    (getDb().prepare("SELECT * FROM articles WHERE slug = ?").get(slug) as Article) ?? null
  );
}

export function parseSocials(json: string): Social[] {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function parseTags(json: string): string[] {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function parseNowItems(json: string): NowItem[] {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function parseHighlights(json: string): Highlight[] {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function parseStrengths(json: string): Strength[] {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function parseSkills(json: string): SkillCategory[] {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
