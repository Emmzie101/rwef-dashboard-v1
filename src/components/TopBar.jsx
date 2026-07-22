import React from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { RWEFIcon, Avatar, Button, Pill } from "./ui.jsx";
import { C, inputStyle, ROLES } from "../theme.js";

const roleTint = {
  admin: { bg: C.forestTint, fg: C.forestDark },
  lead: { bg: C.tealTint, fg: C.teal },
  associate: { bg: C.bg, fg: C.inkSoft },
};

export default function TopBar({ me, search, setSearch, onNewTask, onToggleMobileNav }) {
  const { logout } = useAuth();
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "#fff",
        borderBottom: `1px solid ${C.line}`,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 18px",
      }}
    >
      <button
        className="rwef-mobile-toggle"
        onClick={onToggleMobileNav}
        style={{
          display: "none",
          background: "none",
          border: `1px solid ${C.line}`,
          borderRadius: 7,
          width: 32,
          height: 32,
          cursor: "pointer",
        }}
      >
        ☰
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <RWEFIcon size={24} />
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, color: C.ink }}>R-WEF</span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: C.inkSoft,
            background: C.bg,
            padding: "3px 8px",
            borderRadius: 6,
            border: `1px solid ${C.line}`,
          }}
        >
          team board
        </span>
      </div>

      <div style={{ flex: 1 }} />

      <input
        placeholder="Search tasks…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ ...inputStyle, width: 200, padding: "7px 11px" }}
      />

      <Button onClick={onNewTask}>+ New task</Button>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Avatar name={me?.name || "?"} size={26} />
        <span style={{ fontSize: 13, fontWeight: 600, color: C.ink, display: window.innerWidth > 600 ? "inline" : "none" }}>
          {me?.name}
        </span>
        {me?.role && (
          <Pill bg={(roleTint[me.role] || roleTint.associate).bg} fg={(roleTint[me.role] || roleTint.associate).fg}>
            {ROLES.find((r) => r.id === me.role)?.label || "Associate"}
          </Pill>
        )}
        <button
          onClick={logout}
          title="Log out"
          style={{ background: "none", border: `1px solid ${C.line}`, borderRadius: 7, padding: "5px 9px", cursor: "pointer", fontSize: 12, color: C.inkSoft }}
        >
          Log out
        </button>
      </div>
    </div>
  );
}
