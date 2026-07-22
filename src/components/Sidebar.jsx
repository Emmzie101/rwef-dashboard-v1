import React, { useState } from "react";
import { RingProgress, Pill } from "./ui.jsx";
import { C } from "../theme.js";

function NavItem({ label, active, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        background: active ? C.forestTint : "transparent",
        border: "none",
        borderRadius: 8,
        padding: "9px 10px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 2,
      }}
    >
      <span style={{ fontWeight: 600, fontSize: 13.5, color: active ? C.forestDark : C.ink }}>{label}</span>
      {badge !== undefined && (
        <Pill bg={active ? "#fff" : C.bg} fg={C.inkSoft}>
          {badge}
        </Pill>
      )}
    </button>
  );
}

export default function Sidebar({
  className,
  view,
  setView,
  members,
  programs,
  personStats,
  personProgramIds,
  onAddMember,
  onAddProgram,
  onManageTeam,
  canManageMembers,
  canManagePrograms,
}) {
  const [expandedPerson, setExpandedPerson] = useState(null);

  return (
    <div
      className={className}
      style={{
        width: 256,
        flexShrink: 0,
        background: "#fff",
        borderRight: `1px solid ${C.line}`,
        minHeight: "calc(100vh - 57px)",
        padding: "16px 12px",
        overflowY: "auto",
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: C.inkSoft, margin: "2px 8px 8px" }}>
        Views
      </div>
      <NavItem label="All tasks" active={view === "all"} onClick={() => setView("all")} />
      <NavItem label="My tasks" active={view === "mine"} onClick={() => setView("mine")} />
      <NavItem label="Team overview" active={view === "team"} onClick={() => setView("team")} />
      <NavItem label="Live chat" active={view === "chat"} onClick={() => setView("chat")} />

      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: C.inkSoft, margin: "18px 8px 8px" }}>
        People
      </div>
      {members.map((m) => {
        const stats = personStats(m.id);
        const progIds = personProgramIds(m.id);
        const isOpen = expandedPerson === m.id;
        const isActive = view === `person:${m.id}`;
        return (
          <div key={m.id} style={{ marginBottom: 2 }}>
            <div style={{ display: "flex", alignItems: "center", borderRadius: 8, background: isActive ? C.forestTint : "transparent" }}>
              <button
                onClick={() => setView(`person:${m.id}`)}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "none",
                  border: "none",
                  padding: "7px 6px 7px 10px",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <RingProgress pct={stats.pct} size={24} stroke={3} color={stats.overdue ? C.rust : C.forest} />
                <span style={{ fontSize: 13.5, fontWeight: 600, color: C.ink, flex: 1 }}>
                  {m.name}
                  {m.placeholder ? <span style={{ color: C.inkSoft, fontWeight: 400 }}> · guest</span> : ""}
                </span>
                {stats.overdue > 0 && <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.rust }} />}
              </button>
              {progIds.length > 0 && (
                <button
                  onClick={() => setExpandedPerson(isOpen ? null : m.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: C.inkSoft, padding: "6px 8px", fontSize: 11 }}
                >
                  {isOpen ? "▾" : "▸"}
                </button>
              )}
            </div>
            {isOpen && (
              <div style={{ paddingLeft: 30, marginTop: 2, marginBottom: 4 }}>
                {progIds.map((pid) => (
                  <button
                    key={pid}
                    onClick={() => setView(`program:${pid}`)}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "4px 6px",
                      fontSize: 12.5,
                      color: C.inkSoft,
                    }}
                  >
                    · {programs.find((p) => p.id === pid)?.name || "Program"}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
      {canManageMembers && (
        <>
          <button
            onClick={onAddMember}
            style={{
              width: "100%",
              textAlign: "left",
              background: "none",
              border: `1px dashed ${C.line}`,
              borderRadius: 8,
              padding: "8px 10px",
              marginTop: 8,
              cursor: "pointer",
              fontSize: 12.5,
              fontWeight: 600,
              color: C.inkSoft,
            }}
          >
            + Add team member
          </button>
          <button
            onClick={onManageTeam}
            style={{
              width: "100%",
              textAlign: "left",
              background: "none",
              border: "none",
              borderRadius: 8,
              padding: "8px 10px 4px",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              color: C.teal,
            }}
          >
            ⚙ Manage team & roles
          </button>
        </>
      )}

      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: C.inkSoft, margin: "18px 8px 8px" }}>
        Programs
      </div>
      {programs.map((p) => (
        <button
          key={p.id}
          onClick={() => setView(`program:${p.id}`)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            width: "100%",
            background: view === `program:${p.id}` ? C.forestTint : "transparent",
            border: "none",
            borderRadius: 8,
            padding: "7px 10px",
            cursor: "pointer",
            textAlign: "left",
            marginBottom: 1,
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
          <span style={{ fontSize: 12.5, color: C.ink, fontWeight: 500 }}>{p.name}</span>
        </button>
      ))}
      {canManagePrograms && (
        <button
          onClick={onAddProgram}
          style={{
            width: "100%",
            textAlign: "left",
            background: "none",
            border: `1px dashed ${C.line}`,
            borderRadius: 8,
            padding: "8px 10px",
            marginTop: 8,
            cursor: "pointer",
            fontSize: 12.5,
            fontWeight: 600,
            color: C.inkSoft,
          }}
        >
          + Add program
        </button>
      )}
    </div>
  );
}
