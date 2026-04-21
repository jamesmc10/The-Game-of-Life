import { useState } from "react";
import { login, register } from "./auth";

export default function AuthScreen() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit() {
    setError("");

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#07070a",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "Arial, sans-serif"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          background: "#111",
          border: "1px solid #222",
          borderRadius: 10,
          padding: 24
        }}
      >
        <h2 style={{ marginBottom: 16 }}>
          {mode === "login" ? "Login" : "Create account"}
        </h2>

        <input
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 12,
            background: "#1a1a1a",
            border: "1px solid #333",
            color: "#fff",
            borderRadius: 8
          }}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 12,
            background: "#1a1a1a",
            border: "1px solid #333",
            color: "#fff",
            borderRadius: 8
          }}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: 12,
            background: "#f59e0b",
            border: "none",
            color: "#000",
            borderRadius: 8,
            fontWeight: 700,
            cursor: "pointer",
            marginBottom: 10
          }}
        >
          {mode === "login" ? "Login" : "Create account"}
        </button>

        <button
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          style={{
            width: "100%",
            padding: 12,
            background: "transparent",
            border: "1px solid #333",
            color: "#fff",
            borderRadius: 8,
            cursor: "pointer"
          }}
        >
          Switch to {mode === "login" ? "register" : "login"}
        </button>

        {error && <p style={{ marginTop: 12, color: "tomato" }}>{error}</p>}
      </div>
    </div>
  );
}
