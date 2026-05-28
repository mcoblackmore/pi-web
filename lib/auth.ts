import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import bcrypt from "bcryptjs";

export interface SessionData {
  username?: string;
  isLoggedIn: boolean;
}

const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  "pi-web-default-session-secret-change-me-in-production-32chars-min";

export const sessionOptions: SessionOptions = {
  password: SESSION_SECRET,
  cookieName: "pi-web-session",
  cookieOptions: {
    secure: false,
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}

function getUsersPath(): string {
  const pkgRoot = process.env.PKG_ROOT || process.cwd();
  return join(pkgRoot, "data", "users.json");
}

export function getUsers(): Record<string, string> {
  const usersPath = getUsersPath();
  if (!existsSync(usersPath)) return {};
  return JSON.parse(readFileSync(usersPath, "utf8"));
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function addUser(username: string, passwordHash: string): void {
  const users = getUsers();
  users[username] = passwordHash;
  const { writeFileSync } = require("fs");
  writeFileSync(getUsersPath(), JSON.stringify(users, null, 2) + "\n", "utf8");
}
