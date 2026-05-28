import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUsers, verifyPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "请输入用户名和密码" }, { status: 400 });
    }

    const users = getUsers();
    const hash = users[username];

    if (!hash || !verifyPassword(password, hash)) {
      return NextResponse.json({ error: "用户名或密码错误" }, { status: 401 });
    }

    const session = await getSession();
    session.username = username;
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json({ success: true, username });
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
