import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE = "duet_admin";

function secret() {
  return process.env.SESSION_SECRET || "dev-secret-change-me";
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
