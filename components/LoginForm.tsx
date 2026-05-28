"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirect = searchParams.get("redirect") || "/";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      if (res.ok) {
        router.push(redirect);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "登录失败");
      }
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100dvh",
        background: "var(--bg)",
        fontFamily: "var(--font-noto-mono), monospace",
      }}
    >
      <div
        style={{
          width: 360,
          padding: "40px 32px",
          background: "var(--bg-panel)",
          borderRadius: 16,
          border: "1px solid var(--border)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: 32,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "var(--text)",
              margin: 0,
            }}
          >
            科即糖
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)" }}>
            AI世界让你领先一步
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "#fef2f2",
              color: "#991b1b",
              border: "1px solid #fecaca",
              borderRadius: 8,
              padding: "10px 14px",
              fontSize: 13,
              marginBottom: 20,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 500,
                color: "var(--text)",
                marginBottom: 6,
              }}
            >
              用户名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              autoFocus
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 14,
                fontFamily: "inherit",
                background: "var(--bg)",
                color: "var(--text)",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--accent)";
                e.target.style.boxShadow = "0 0 0 2px rgba(245,158,11,0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--border)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 500,
                color: "var(--text)",
                marginBottom: 6,
              }}
            >
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 14,
                fontFamily: "inherit",
                background: "var(--bg)",
                color: "var(--text)",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--accent)";
                e.target.style.boxShadow = "0 0 0 2px rgba(245,158,11,0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--border)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px 0",
              border: "none",
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              fontFamily: "inherit",
              background: loading ? "var(--text-muted)" : "var(--text)",
              color: "var(--bg)",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "opacity 0.15s",
            }}
          >
            {loading ? "登录中…" : "登 录"}
          </button>
        </form>
      </div>
    </div>
  );
}
