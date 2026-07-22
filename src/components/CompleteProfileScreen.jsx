import React, { useState } from "react";
import { RWEFIcon, Button, Field } from "./ui.jsx";
import { C, inputStyle } from "../theme.js";
import { createMemberProfile } from "../lib/data.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function CompleteProfileScreen({ uid, suggestedName }) {
  const { logout } = useAuth();
  const [name, setName] = useState(suggestedName || "");
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    setError("");
    try {
      await createMemberProfile(uid, name.trim(), title.trim());
    } catch (err) {
      setError("Couldn't save your profile — please try again.");
    }
    setBusy(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg, padding: 20 }}>
      <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, padding: 32, width: "100%", maxWidth: 420 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <RWEFIcon size={28} />
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, color: C.ink }}>R-WEF</span>
        </div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, color: C.ink, margin: "14px 0 4px" }}>
          One more step
        </h2>
        <p style={{ fontSize: 13.5, color: C.inkSoft, margin: "0 0 18px", lineHeight: 1.5 }}>
          You're signed in, but your team profile didn't finish setting up last time. Just confirm your details
          below and you'll be straight in.
        </p>
        <form onSubmit={submit}>
          <Field label="Your name">
            <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Jessica" />
          </Field>
          <Field label="Role (optional)">
            <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Programs Manager" />
          </Field>
          {error && <div style={{ fontSize: 12.5, color: C.rust, marginBottom: 12 }}>{error}</div>}
          <Button type="submit" style={{ width: "100%", justifyContent: "center" }} disabled={busy}>
            {busy ? "Saving…" : "Continue"}
          </Button>
        </form>
        <div style={{ textAlign: "center", marginTop: 14 }}>
          <button onClick={logout} style={{ background: "none", border: "none", color: C.inkSoft, fontSize: 12.5, cursor: "pointer", textDecoration: "underline" }}>
            Not you? Log out
          </button>
        </div>
      </div>
    </div>
  );
}
