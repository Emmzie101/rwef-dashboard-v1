import React, { useEffect, useState } from "react";
import { Modal, Field, Button, Avatar, Pill } from "./ui.jsx";
import { C, inputStyle, deadlineInfo, STATUSES } from "../theme.js";
import { subscribeComments, addComment } from "../lib/data.js";
import { canEditTask, canDeleteTask } from "../lib/permissions.js";

export default function TaskDetailModal({ task, members, programs, me, onClose, onPatch, onDelete }) {
  const editable = canEditTask(me, task);
  const deletable = canDeleteTask(me, task);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const dl = deadlineInfo(task.deadline, task.status);
  const memberById = {};
  members.forEach((m) => (memberById[m.id] = m));

  useEffect(() => {
    const unsub = subscribeComments(task.id, setComments);
    return unsub;
  }, [task.id]);

  const postComment = async () => {
    if (!comment.trim() || !me) return;
    await addComment(task.id, me.id, me.name, comment.trim());
    setComment("");
  };

  return (
    <Modal title="Task details" onClose={onClose} wide>
      {!editable && (
        <div style={{ background: "#FDF3D3", color: "#8a6a10", fontSize: 12, borderRadius: 8, padding: "8px 12px", marginBottom: 14 }}>
          You can view this task and comment, but only its owner, shadow, or a Lead/Admin can edit it.
        </div>
      )}
      <input
        style={{ ...inputStyle, fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, marginBottom: 14, border: "none", padding: "4px 0" }}
        value={task.title}
        onChange={(e) => onPatch({ title: e.target.value })}
        disabled={!editable}
      />

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.inkSoft, textTransform: "uppercase", marginBottom: 5 }}>Status</div>
          <select style={inputStyle} value={task.status} onChange={(e) => onPatch({ status: e.target.value })} disabled={!editable}>
            {STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.inkSoft, textTransform: "uppercase", marginBottom: 5 }}>Program</div>
          <select style={inputStyle} value={task.programId} onChange={(e) => onPatch({ programId: e.target.value })} disabled={!editable}>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.inkSoft, textTransform: "uppercase", marginBottom: 5 }}>Deadline</div>
          <input type="date" style={inputStyle} value={task.deadline || ""} onChange={(e) => onPatch({ deadline: e.target.value })} disabled={!editable} />
        </div>
      </div>

      {dl && (
        <div style={{ marginBottom: 16 }}>
          <Pill bg={dl.bg} fg={dl.fg}>
            {dl.label}
          </Pill>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.inkSoft, textTransform: "uppercase", marginBottom: 5 }}>Owner</div>
          <select style={inputStyle} value={task.ownerId} onChange={(e) => onPatch({ ownerId: e.target.value })} disabled={!editable}>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.inkSoft, textTransform: "uppercase", marginBottom: 5 }}>Shadow</div>
          <select style={inputStyle} value={task.shadowId || ""} onChange={(e) => onPatch({ shadowId: e.target.value })} disabled={!editable}>
            <option value="">None</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p style={{ fontSize: 11.5, color: C.inkSoft, marginTop: -8, marginBottom: 16 }}>
        This task shows up on both the owner's and the shadow's task lists automatically.
      </p>

      <Field label="Notes">
        <textarea
          style={{ ...inputStyle, minHeight: 70, resize: "vertical" }}
          value={task.notes || ""}
          onChange={(e) => onPatch({ notes: e.target.value })}
          disabled={!editable}
        />
      </Field>

      <div style={{ borderTop: `1px solid ${C.line}`, marginTop: 18, paddingTop: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.inkSoft, textTransform: "uppercase", marginBottom: 10 }}>Comments</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 12, maxHeight: 180, overflowY: "auto" }}>
          {comments.length === 0 && <div style={{ fontSize: 12.5, color: C.inkSoft }}>No comments yet.</div>}
          {comments.map((c) => (
            <div key={c.id} style={{ display: "flex", gap: 8 }}>
              <Avatar name={c.authorName || memberById[c.authorId]?.name || "?"} size={22} />
              <div>
                <div style={{ fontSize: 12.5 }}>
                  <span style={{ fontWeight: 700, color: C.ink }}>{c.authorName}</span>{" "}
                  <span style={{ color: C.inkSoft, fontSize: 11 }}>
                    {c.ts?.toDate ? c.ts.toDate().toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: C.ink, marginTop: 1 }}>{c.text}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            style={inputStyle}
            placeholder="Add a comment…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && postComment()}
          />
          <Button small onClick={postComment}>
            Post
          </Button>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
        {deletable ? (
          confirmDelete ? (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 12.5, color: C.rust }}>Delete this task?</span>
              <Button small variant="ghost" onClick={() => setConfirmDelete(false)}>
                Cancel
              </Button>
              <Button small variant="danger" onClick={onDelete}>
                Confirm delete
              </Button>
            </div>
          ) : (
            <Button small variant="ghost" onClick={() => setConfirmDelete(true)}>
              Delete task
            </Button>
          )
        ) : (
          <span />
        )}
        <Button variant="secondary" onClick={onClose}>
          Done
        </Button>
      </div>
    </Modal>
  );
}
