import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function POST() {
  const session = await getSession();
  session.destroy();

  const res = NextResponse.json({ success: true });
  // Clear the session cookie
  res.cookies.set("pi-web-session", "", { maxAge: 0, path: "/" });
  return res;
}
