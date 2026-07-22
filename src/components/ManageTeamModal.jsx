import React from "react";
import { Modal, Avatar, Pill } from "./ui.jsx";
import { C, inputStyle, ROLES } from "../theme.js";
import { updateMemberRole } from "../lib/data.js";

const roleTint = { admin: { bg: C.forestTint, fg: C.forestDark }, lead: { bg: C.tealTint, fg: C.teal }, associate: { bg: C.bg, fg: C.inkSoft } };

export default function ManageTeamModal({ members, onClose }) {
  return (
    <Modal title="Manage team & roles" onClose={onClose} wide>
      <p style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 0, lineHeight: 1.5 }}>
        Admins have full access. Leads can manage tasks and programs across the whole team. Associates can see
        everything but only edit tasks where they're the owner or shadow.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {members.map((m) => {
          const rt = roleTint[m.role] || roleTint.associate;
          return (
            <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", border: `1px solid ${C.line}`, borderRadius: 9 }}>
              <Avatar name={m.name} size={30} placeholder={m.placeholder} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>
                  {m.name} {m.placeholder && <span style={{ fontWeight: 400, color: C.inkSoft }}>· guest</span>}
                </div>
                <div style={{ fontSize: 11.5, color: C.inkSoft }}>{m.title}</div>
              </div>
              <Pill bg={rt.bg} fg={rt.fg}>{ROLES.find((r) => r.id === m.role)?.label || "Associate"}</Pill>
              <select
                style={{ ...inputStyle, width: 120 }}
                value={m.role || "associate"}
                onChange={(e) => updateMemberRole(m.id, e.target.value)}
              >
                {ROLES.map((r) => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
