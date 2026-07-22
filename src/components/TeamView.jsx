import React from "react";
import { Avatar, RingProgress, Pill } from "./ui.jsx";
import { C } from "../theme.js";

export default function TeamView({ members, personStats, setView }) {
  return (
    <div>
      <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 23, fontWeight: 700, margin: "0 0 18px", color: C.ink }}>
        Team overview
      </h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 14 }}>
        {members.map((m) => {
          const stats = personStats(m.id);
          return (
            <button
              key={m.id}
              onClick={() => setView(`person:${m.id}`)}
              style={{
                textAlign: "left",
                background: "#fff",
                border: `1px solid ${stats.overdue ? C.rust : C.line}`,
                borderRadius: 12,
                padding: 16,
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <Avatar name={m.name} size={34} placeholder={m.placeholder} />
                <div>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: C.ink }}>{m.name}</div>
                  <div style={{ fontSize: 11.5, color: C.inkSoft }}>{m.title}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <RingProgress pct={stats.pct} size={42} stroke={4} color={stats.overdue ? C.rust : C.forest} />
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 12, color: C.inkSoft }}>{stats.done}/{stats.total} tasks done</span>
                  {stats.overdue > 0 && (
                    <Pill bg={C.rustTint} fg={C.rust}>
                      {stats.overdue} overdue
                    </Pill>
                  )}
                </div>
              </div>
            </button>
          );
        })}
        {members.length === 0 && (
          <div style={{ color: C.inkSoft, fontSize: 13.5 }}>No team members yet — add one from the sidebar.</div>
        )}
      </div>
    </div>
  );
}
