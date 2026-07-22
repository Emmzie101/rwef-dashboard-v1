import React, { useMemo } from "react";
import { Avatar, Pill, Button } from "./ui.jsx";
import { C, deadlineInfo, STATUSES } from "../theme.js";

function StatCard({ label, value, bg, fg, border }) {
  return (
    <div style={{ background: bg, color: fg, border: border ? `1px solid ${border}` : "none", borderRadius: 10, padding: "12px 16px", minWidth: 128 }}>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11.5, fontWeight: 600, marginTop: 4 }}>{label}</div>
    </div>
  );
}

const statusColors = {
  "not-started": { bg: C.bg, fg: C.inkSoft },
  "in-progress": { bg: C.tealTint, fg: C.teal },
  review: { bg: C.yellowTint, fg: "#8a6a10" },
  done: { bg: C.forestTint, fg: C.forestDark },
};

export default function AllTasksTable({ heading, tasks, programs, memberById, programById, onOpenTask, onAddTask }) {
  const stats = useMemo(() => {
    const overdue = tasks.filter((t) => deadlineInfo(t.deadline, t.status)?.alert === "overdue").length;
    const soon = tasks.filter((t) => deadlineInfo(t.deadline, t.status)?.alert === "soon").length;
    const done = tasks.filter((t) => t.status === "done").length;
    return { overdue, soon, done, total: tasks.length };
  }, [tasks]);

  const sections = useMemo(() => {
    const byProgram = {};
    tasks.forEach((t) => {
      const key = t.programId || "_none";
      byProgram[key] = byProgram[key] || [];
      byProgram[key].push(t);
    });
    return Object.entries(byProgram).map(([pid, list]) => ({
      program: programById[pid] || { name: "No program", color: C.inkSoft },
      list,
    }));
  }, [tasks, programById]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4, flexWrap: "wrap", gap: 10 }}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 23, fontWeight: 700, margin: 0, color: C.ink }}>{heading}</h1>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "14px 0 22px" }}>
        <StatCard label="Overdue" value={stats.overdue} bg={C.rustTint} fg={C.rust} />
        <StatCard label="Due within 3 days" value={stats.soon} bg={C.yellowTint} fg="#8a6a10" />
        <StatCard label="Completed" value={stats.done} bg={C.forestTint} fg={C.forestDark} />
        <StatCard label="Total tasks" value={stats.total} bg={C.bg} fg={C.inkSoft} border={C.line} />
      </div>

      {tasks.length === 0 ? (
        <div style={{ border: `1px dashed ${C.line}`, borderRadius: 12, padding: 40, textAlign: "center", color: C.inkSoft }}>
          <p style={{ margin: "0 0 12px", fontSize: 14 }}>Nothing here yet.</p>
          <Button onClick={onAddTask} small>
            + Add the first task
          </Button>
        </div>
      ) : (
        <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 12, overflow: "hidden" }}>
          <div
            className="rwef-table-header"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 160px 160px 130px 120px",
              padding: "10px 16px",
              borderBottom: `1px solid ${C.line}`,
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 0.4,
              color: C.inkSoft,
              background: C.bg,
            }}
          >
            <span>Task</span>
            <span className="rwef-table-assignee-col">Assignee</span>
            <span className="rwef-table-program-col">Program</span>
            <span>Due date</span>
            <span>Status</span>
          </div>
          {sections.map(({ program, list }) => (
            <div key={program.name}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "9px 16px",
                  background: "#FCFCFB",
                  borderBottom: `1px solid ${C.line}`,
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: program.color }} />
                <span style={{ fontSize: 12.5, fontWeight: 700, color: C.ink }}>{program.name}</span>
                <span style={{ fontSize: 11.5, color: C.inkSoft }}>{list.length}</span>
              </div>
              {list.map((t) => {
                const dl = deadlineInfo(t.deadline, t.status);
                const owner = memberById[t.ownerId];
                const shadow = t.shadowId ? memberById[t.shadowId] : null;
                const sc = statusColors[t.status] || statusColors["not-started"];
                return (
                  <div
                    key={t.id}
                    onClick={() => onOpenTask(t.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && onOpenTask(t.id)}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 160px 160px 130px 120px",
                      alignItems: "center",
                      padding: "10px 16px",
                      borderBottom: `1px solid ${C.line}`,
                      cursor: "pointer",
                      background: dl?.alert === "overdue" ? C.rustTint + "40" : "#fff",
                    }}
                  >
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: C.ink, paddingRight: 10 }}>{t.title}</span>
                    <span className="rwef-table-assignee-col" style={{ display: "flex", alignItems: "center" }}>
                      {owner && <Avatar name={owner.name} size={22} placeholder={owner.placeholder} />}
                      {shadow && (
                        <div style={{ marginLeft: -6 }}>
                          <Avatar name={shadow.name} size={22} ring={C.teal} placeholder={shadow.placeholder} />
                        </div>
                      )}
                    </span>
                    <span className="rwef-table-program-col" style={{ fontSize: 12.5, color: C.inkSoft }}>
                      {programById[t.programId]?.name || "—"}
                    </span>
                    <span>{dl && <Pill bg={dl.bg} fg={dl.fg}>{dl.label}</Pill>}</span>
                    <span>
                      <Pill bg={sc.bg} fg={sc.fg}>
                        {STATUSES.find((s) => s.id === t.status)?.label || t.status}
                      </Pill>
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
