import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE = "duet_admin";

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (s && s.length >= 16) return s;

  // Production: 不允许 fallback。代码公开后任何人都能拿到 fallback 字符串。
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SESSION_SECRET is missing or too short in production. " +
        "Set it in Railway → Variables tab (建议 32+ 字符随机串,用 " +
        "`node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"` 生成)。"
    );
  }

  // Dev only: 给个固定 fallback，方便本地开发不用配 env。
  return "dev-secret-not-for-production";
}

function sign(value: string) {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex");
}

function makeToken() {
  const issued = Date.now().toString();
  const sig = sign(issued);
  return `${issued}.${sig}`;
}

export function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const [issued, sig] = token.split(".");
  if (!issued || !sig) return false;
  if (sign(issued) !== sig) return false;
  const age = Date.now() - parseInt(issued, 10);
  return age >= 0 && age < 1000 * 60 * 60 * 24 * 7; // 7 days
}

export async function login(password: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  if (password !== expected) return false;
  cookies().set(COOKIE, makeToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return true;
}

export async function logout() {
  cookies().delete(COOKIE);
}

export function isAuthed(): boolean {
  const token = cookies().get(COOKIE)?.value;
  return verifyToken(token);
}
