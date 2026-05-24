import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { isAuthed } from "@/lib/auth";

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
      db.prepare("SELECT MAX(sort_order) AS m FROM experience").get() as {
        m: number | null;
      }
    ).m ?? -1;
  const info = db
    .prepare(
      `INSERT INTO experience (company, role, period, summary, highlights, sort_order)
       VALUES (@company, @role, @period, @summary, @highlights, @sort_order)`
    )
    .run({
      company: String(body.company ?? ""),
      role: String(body.role ?? ""),
      period: String(body.period ?? ""),
      summary: String(body.summary ?? ""),
      highlights: asJSON(body.highlights, "[]"),
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
      `UPDATE experience
       SET company=@company, role=@role, period=@period, summary=@summary,
           highlights=@highlights, sort_order=@sort_order
       WHERE id=@id`
    )
    .run({
      id: Number(body.id),
      company: String(body.company ?? ""),
      role: String(body.role ?? ""),
      period: String(body.period ?? ""),
      summary: String(body.summary ?? ""),
      highlights: asJSON(body.highlights, "[]"),
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
  getDb().prepare("DELETE FROM experience WHERE id = ?").run(id);
  return NextResponse.json({ ok: true });
}
