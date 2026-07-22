import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { RWEFIcon, Button, Field } from "./ui.jsx";
import { C, inputStyle } from "../theme.js";

export default function AuthScreen() {
  const { register, login, authError, setAuthError } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    if (mode === "register") {
      await register(name.trim(), title.trim(), email.trim(), password);
    } else {
      await login(email.trim(), password);
    }
    setBusy(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: C.bg,
        padding: 20,
      }}
    >
      <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, padding: 32, width: "100%", maxWidth: 420 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <RWEFIcon size={28} />
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, color: C.ink }}>R-WEF</span>
        </div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, color: C.ink, margin: "14px 0 4px" }}>
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h2>
        <p style={{ fontSize: 13.5, color: C.inkSoft, margin: "0 0 18px", lineHeight: 1.5 }}>
          {mode === "login"
            ? "Log in to see your work and the team's progress."
            : "Set up your account so the team can see your work."}
        </p>

        <form onSubmit={submit}>
          {mode === "register" && (
            <>
              <Field label="Your name">
                <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Jessica" />
              </Field>
              <Field label="Role (optional)">
                <input
                  style={inputStyle}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Programs Manager"
                />
              </Field>
            </>
          )}
          <Field label="Email">
            <input
              type="email"
              style={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </Field>
          <Field label="Password">
            <input
              type="password"
              style={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="At least 6 characters"
            />
          </Field>

          {authError && (
            <div style={{ fontSize: 12.5, color: C.rust, marginBottom: 12, lineHeight: 1.4 }}>{authError}</div>
          )}

          <Button type="submit" style={{ width: "100%", justifyContent: "center" }} disabled={busy}>
            {busy ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
          </Button>
        </form>

        <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: C.inkSoft }}>
          {mode === "login" ? (
            <>
              New to R-WEF?{" "}
              <button
                onClick={() => {
                  setMode("register");
                  setAuthError("");
                }}
                style={{ background: "none", border: "none", color: C.teal, fontWeight: 600, cursor: "pointer" }}
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already registered?{" "}
              <button
                onClick={() => {
                  setMode("login");
                  setAuthError("");
                }}
                style={{ background: "none", border: "none", color: C.teal, fontWeight: 600, cursor: "pointer" }}
              >
                Log in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
