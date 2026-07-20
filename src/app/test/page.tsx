"use client";

/* 임시 API 테스트 페이지 — 시연용, 이후 삭제 */
import { useState } from "react";

import { STORAGE_KEY } from "@constants/storage-key";

import axiosClient from "@services/axios.client";
import { useSignInMutation } from "@services/api/auth/auth.query";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Result = { label: string; data?: any; error?: any } | null;

export default function TestPage() {
  const [email, setEmail] = useState("fetest_1784096342@example.com");
  const [password, setPassword] = useState("Test1234!@");
  const [result, setResult] = useState<Result>(null);

  const { mutate: signIn, isPending } = useSignInMutation();

  const handleLogin = () => {
    signIn(
      { email, password },
      {
        onSuccess: (data) => {
          localStorage.setItem(STORAGE_KEY.LOCAL.TOKEN, data.accessToken);
          setResult({ label: "✅ 로그인 성공 (토큰 저장됨)", data });
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (e: any) => setResult({ label: "❌ 로그인 실패", error: e.response?.data }),
      },
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const call = async (label: string, fn: () => Promise<any>) => {
    try {
      const res = await fn();
      setResult({ label: `✅ ${label}`, data: res.data });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setResult({ label: `❌ ${label}`, error: e.response?.data });
    }
  };

  return (
    <div style={{ padding: 24, fontFamily: "monospace", maxWidth: 720 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>EATIQ API 테스트</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          style={{ border: "1px solid #ccc", padding: 8, flex: 1 }}
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          style={{ border: "1px solid #ccc", padding: 8, flex: 1 }}
        />
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        <button onClick={handleLogin} disabled={isPending} style={btn}>
          {isPending ? "로그인 중..." : "① 로그인"}
        </button>
        <button onClick={() => call("GET /api/auth/me", () => axiosClient.get("/api/auth/me"))} style={btn}>
          ② 내 정보
        </button>
        <button onClick={() => call("GET /api/brands", () => axiosClient.get("/api/brands"))} style={btn}>
          ③ 워크스페이스 목록
        </button>
        <button
          onClick={() => call("POST /api/brands", () => axiosClient.post("/api/brands", { nameKo: "테스트 워크스페이스" }))}
          style={btn}
        >
          ④ 워크스페이스 생성
        </button>
        <button
          onClick={() => call("GET /api/brands/current", () => axiosClient.get("/api/brands/current"))}
          style={btn}
        >
          ⑤ 현재 워크스페이스
        </button>
      </div>

      <pre style={{ background: "#f4f4f4", padding: 12, whiteSpace: "pre-wrap", wordBreak: "break-all", fontSize: 12 }}>
        {result ? JSON.stringify(result, null, 2) : "① 로그인 → ②③④⑤ 순서로 눌러보세요"}
      </pre>
    </div>
  );
}

const btn: React.CSSProperties = {
  border: "1px solid #333",
  borderRadius: 6,
  padding: "8px 12px",
  cursor: "pointer",
  background: "#fff",
};
