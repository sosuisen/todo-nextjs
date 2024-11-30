"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>ログイン</h1>
            <button
                type="button"
                onClick={() => signIn("auth0")}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#0070f3",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                Auth0でログイン
            </button>
        </div>
    );
}
