"use client";

import { useSession, signOut } from "next-auth/react";

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated")
    return (
      <div>
        <h1>Welcome to Auth0 Next.js App</h1>
        <a href="/login">ログイン</a>
      </div>
    );

  return (
    <div>
      <h1>こんにちは、{session?.user?.name}さん！</h1>
      <button
        type="button"
        onClick={() => signOut()}
        style={{
          padding: "10px 20px",
          backgroundColor: "#d32f2f",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        ログアウト
      </button>
    </div>
  );
}
