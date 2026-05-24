import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { isAuthed } from "@/lib/auth";

function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/[\s_/]+/g, "-")
    .replace(/[^a-z0-9一-龥-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return base || `post-${Date.now()}`;
}

function ensureUniqueSlug(slug: string, excludeId?: number): string {
  const db = getDb();
  let candidate = slug;
  let i = 1;
  while (true) {
    const row = db
      .prepare("SELECT id FROM articles WHERE slug = ? AND id != ?")
      .get(candidate, excludeId ?? -1) as { id: number } | undefined;
    if (!row) return candidate;
    i += 1;
    candidate = `${slug}-${i}`;
  }
}

export async function POST(req: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  const slug = ensureUniqueSlug(slugify(body.slug || body.title || ""));
  const info = getDb()
    .prepare(
      `INSERT INTO articles (slug, title, excerpt, content, published_at, is_published)
       VALUES (@slug, @title, @excerpt, @content, @published_at, @is_published)`
    )
    .run({
      slug,
      title: String(body.title ?? ""),
      excerpt: String(body.excerpt ?? ""),
      content: String(body.content ?? ""),
      published_at:
        String(body.published_at ?? "") || new Date().toISOString().slice(0, 10),
      is_published: body.is_published ? 1 : 0,
    });
  return NextResponse.json({ id: info.lastInsertRowid, slug });
}

export async function PUT(req: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const id = Number(body.id);
  const slug = ensureUniqueSlug(slugify(body.slug || body.title || ""), id);
  getDb()
    .prepare(
      `UPDATE articles
       SET slug=@slug, title=@title, excerpt=@excerpt, content=@content,
           published_at=@published_at, is_published=@is_published
       WHERE id=@id`
    )
    .run({
      id,
      slug,
      title: String(body.title ?? ""),
      excerpt: String(body.excerpt ?? ""),
      content: String(body.content ?? ""),
      published_at:
        String(body.published_at ?? "") || new Date().toISOString().slice(0, 10),
      is_published: body.is_published ? 1 : 0,
    });
  return NextResponse.json({ ok: true, slug });
}

export async function DELETE(req: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  getDb().prepare("DELETE FROM articles WHERE id = ?").run(id);
  return NextResponse.json({ ok: true });
}
