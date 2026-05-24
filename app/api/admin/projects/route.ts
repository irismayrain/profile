import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { isAuthed } from "@/lib/auth";

function normalizeTags(t: unknown): string {
  if (Array.isArray(t)) return JSON.stringify(t.map(String));
  if (typeof t === "string") {
    try {
      const parsed = JSON.parse(t);
      if (Array.isArray(parsed)) return JSON.stringify(parsed.map(String));
    } catch {}
    return JSON.stringify(
      t
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    );
  }
  return "[]";
}

function asJSON(v: unknown, fallback = "[]"): string {
  if (typeof v === "string") return v;
  try {
    return JSON.stringify(v ?? JSON.parse(fallback));
  } catch {
    return fallback;
  }
}

export async function POST(req: Request) {
  if (!isAuthed())
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  const db = getDb();
  const maxOrder =
    (
      db.prepare("SELECT MAX(sort_order) AS m FROM projects").get() as {
        m: number | null;
      }
    ).m ?? -1;
  const info = db
    .prepare(
      `INSERT INTO projects (title, subtitle, description, highlights, tags, link, sort_order)
       VALUES (@title, @subtitle, @description, @highlights, @tags, @link, @sort_order)`
    )
    .run({
      title: String(body.title ?? ""),
      subtitle: String(body.subtitle ?? ""),
      description: String(body.description ?? ""),
      highlights: asJSON(body.highlights, "[]"),
      tags: normalizeTags(body.tags),
      link: String(body.link ?? ""),
      sort_order: maxOrder + 1,
    });
  return NextResponse.json({ id: info.lastInsertRowid });
}

export async function PUT(req: Request) {
  if (!isAuthed())
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body.id)
    return NextResponse.json({ error: "id required" }, { status: 400 });
  getDb()
    .prepare(
      `UPDATE projects
       SET title=@title, subtitle=@subtitle, description=@description,
           highlights=@highlights, tags=@tags, link=@link, sort_order=@sort_order
       WHERE id=@id`
    )
    .run({
      id: Number(body.id),
      title: String(body.title ?? ""),
      subtitle: String(body.subtitle ?? ""),
      description: String(body.description ?? ""),
      highlights: asJSON(body.highlights, "[]"),
      tags: normalizeTags(body.tags),
      link: String(body.link ?? ""),
      sort_order: Number(body.sort_order ?? 0),
    });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!isAuthed())
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  getDb().prepare("DELETE FROM projects WHERE id = ?").run(id);
  return NextResponse.json({ ok: true });
}
