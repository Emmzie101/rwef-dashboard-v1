import React, { useState } from "react";
import { Modal, Field, Button } from "./ui.jsx";
import { inputStyle, STATUSES } from "../theme.js";

export default function TaskFormModal({ title, members, programs, onClose, onSubmit }) {
  const [form, setForm] = useState({
    title: "",
    programId: programs[0]?.id || "",
    ownerId: members[0]?.id || "",
    shadowId: "",
    status: "not-started",
    deadline: "",
    notes: "",
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Modal title={title} onClose={onClose}>
      <Field label="Task title">
        <input style={inputStyle} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Draft impact report intro" />
      </Field>
      <Field label="Program">
        {programs.length === 0 ? (
          <div style={{ fontSize: 12.5, color: "#4B564E" }}>Add a program first from the sidebar.</div>
        ) : (
          <select style={inputStyle} value={form.programId} onChange={(e) => set("programId", e.target.value)}>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        )}
      </Field>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <Field label="Owner">
            <select style={inputStyle} value={form.ownerId} onChange={(e) => set("ownerId", e.target.value)}>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="Shadow (optional)">
            <select style={inputStyle} value={form.shadowId} onChange={(e) => set("shadowId", e.target.value)}>
              <option value="">None</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <Field label="Deadline">
            <input type="date" style={inputStyle} value={form.deadline} onChange={(e) => set("deadline", e.target.value)} />
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="Status">
            <select style={inputStyle} value={form.status} onChange={(e) => set("status", e.target.value)}>
              {STATUSES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </div>
      <Field label="Notes (optional)">
        <textarea style={{ ...inputStyle, minHeight: 70, resize: "vertical" }} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
      </Field>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 6 }}>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={!form.title.trim() || !form.programId}
          onClick={() => form.title.trim() && form.programId && onSubmit(form)}
        >
          Save task
        </Button>
      </div>
    </Modal>
  );
}
