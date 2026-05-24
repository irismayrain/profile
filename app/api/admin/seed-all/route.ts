/**
 * 一键灌种子数据 + 导入文章。
 * 用法：在 /admin 登录后点「灌种子数据」按钮。
 * 也可以 curl: curl -X POST https://your-domain/api/admin/seed-all -H "Cookie: ..."
 *
 * 内部通过 child_process 调起 scripts/*.ts —— 两个脚本本身都是 UPSERT，重复跑无副作用。
 */
import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SCRIPTS = [
  { name: "seed-iris", path: "scripts/seed-iris.ts" },
  { name: "import-woshipm", path: "scripts/import-woshipm.ts" },
];

export async function POST() {
  if (!isAuthed()) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const cwd = process.cwd();
  const results: Array<{
    name: string;
    ok: boolean;
    stdout: string;
    stderr: string;
    error?: string;
  }> = [];

  for (const s of SCRIPTS) {
    try {
      const r = await execAsync(`npx tsx ${s.path}`, {
        cwd,
        timeout: 120_000,
        env: process.env as NodeJS.ProcessEnv,
      });
      results.push({
        name: s.name,
        ok: true,
        stdout: r.stdout ?? "",
        stderr: r.stderr ?? "",
      });
    } catch (e: any) {
      results.push({
        name: s.name,
        ok: false,
        stdout: e.stdout ?? "",
        stderr: e.stderr ?? "",
        error: e.message ?? String(e),
      });
      return NextResponse.json(
        { ok: false, cwd, results },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ ok: true, cwd, results });
}
