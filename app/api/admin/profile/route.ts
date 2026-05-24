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

export async function PUT(req: Request) {
  if (!isAuthed())
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  const db = getDb();
  db.prepare(
    `UPDATE profile
     SET name=@name, tagline=@tagline, bio=@bio, location=@location,
         avatar_emoji=@avatar_emoji, email=@email, socials=@socials,
         manifesto=@manifesto, now_items=@now_items,
         strengths=@strengths, skills=@skills, education=@education
     WHERE id=1`
  ).run({
    name: String(body.name ?? ""),
    tagline: String(body.tagline ?? ""),
    bio: String(body.bio ?? ""),
    location: String(body.location ?? ""),
    avatar_emoji: String(body.avatar_emoji ?? "🌸"),
    email: String(body.email ?? ""),
    socials: asJSON(body.socials, "[]"),
    manifesto: String(body.manifesto ?? ""),
    now_items: asJSON(body.now_items, "[]"),
    strengths: asJSON(body.strengths, "[]"),
    skills: asJSON(body.skills, "[]"),
    education: String(body.education ?? ""),
  });
  return NextResponse.json({ ok: true });
}
