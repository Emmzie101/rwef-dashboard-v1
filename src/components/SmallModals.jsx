import React, { useState } from "react";
import { Modal, Field, Button } from "./ui.jsx";
import { C, inputStyle } from "../theme.js";

export function AddMemberModal({ onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  return (
    <Modal title="Add team member" onClose={onClose}>
      <p style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 0, lineHeight: 1.5 }}>
        Use this for occasional contributors who won't be creating their own login — you can still assign them
        tasks. Team members who'll log in themselves should use "Create an account" on the login screen instead.
      </p>
      <Field label="Name">
        <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. David" />
      </Field>
      <Field label="Role (optional)">
        <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Volunteer, Guest contributor" />
      </Field>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button disabled={!name.trim()} onClick={() => name.trim() && onSubmit(name.trim(), title.trim())}>
          Add member
        </Button>
      </div>
    </Modal>
  );
}

const PROGRAM_PALETTE = [C.forest, C.teal, C.brown, C.forestDark, C.rust];

export function AddProgramModal({ onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(PROGRAM_PALETTE[0]);
  return (
    <Modal title="Add program" onClose={onClose}>
      <Field label="Program / initiative name">
        <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Donor Report Q3" />
      </Field>
      <Field label="Color tag">
        <div style={{ display: "flex", gap: 8 }}>
          {PROGRAM_PALETTE.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: c,
                border: color === c ? `2px solid ${C.ink}` : "1px solid transparent",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </Field>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button disabled={!name.trim()} onClick={() => name.trim() && onSubmit(name.trim(), color)}>
          Add program
        </Button>
      </div>
    </Modal>
  );
}
