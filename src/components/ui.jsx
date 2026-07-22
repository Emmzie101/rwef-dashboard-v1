import React from "react";
import { C, ICON_PATH } from "../theme.js";

export function RWEFIcon({ size = 24, color = C.forest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 1567 1575" style={{ display: "block" }}>
      <path d={ICON_PATH} fill={color} fillRule="nonzero" />
    </svg>
  );
}

export function Pill({ children, bg, fg, border }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 12,
        fontWeight: 600,
        padding: "3px 9px",
        borderRadius: 999,
        background: bg,
        color: fg,
        border: border ? `1px solid ${border}` : "none",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

export function Avatar({ name, size = 26, ring, placeholder }) {
  const initials = (name || "?")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      title={name}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: placeholder ? "#F2F2EF" : C.forestTint,
        color: placeholder ? C.inkSoft : C.forestDark,
        border: `1.5px solid ${ring || (placeholder ? C.line : C.forest)}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 600,
        fontSize: size * 0.38,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

export function RingProgress({ pct, size = 34, stroke = 3.5, color = C.forest }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.line} strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.4s ease" }}
      />
    </svg>
  );
}

export function Button({ children, onClick, variant = "primary", small, style, type = "button", disabled }) {
  const base = {
    fontWeight: 600,
    fontSize: small ? 12.5 : 13.5,
    padding: small ? "6px 12px" : "9px 16px",
    borderRadius: 8,
    cursor: disabled ? "default" : "pointer",
    border: "1px solid transparent",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    transition: "opacity 0.15s ease",
    opacity: disabled ? 0.55 : 1,
  };
  const variants = {
    primary: { background: C.forest, color: "#fff" },
    secondary: { background: "#fff", color: C.forest, border: `1px solid ${C.forest}` },
    ghost: { background: "transparent", color: C.inkSoft, border: `1px solid ${C.line}` },
    subtle: { background: C.bg, color: C.ink, border: `1px solid ${C.line}` },
    danger: { background: C.rust, color: "#fff" },
  };
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={(e) => !disabled && (e.currentTarget.style.opacity = 0.82)}
      onMouseLeave={(e) => !disabled && (e.currentTarget.style.opacity = 1)}
    >
      {children}
    </button>
  );
}

export function Modal({ title, onClose, children, wide }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(21,32,24,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 12,
          border: `1px solid ${C.line}`,
          width: "100%",
          maxWidth: wide ? 640 : 460,
          maxHeight: "88vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 20px",
            borderBottom: `1px solid ${C.line}`,
            position: "sticky",
            top: 0,
            background: "#fff",
          }}
        >
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, color: C.ink, margin: 0 }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: C.inkSoft, lineHeight: 1 }}
          >
            ✕
          </button>
        </div>
        <div style={{ padding: 20 }}>{children}</div>
      </div>
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label
        style={{
          display: "block",
          fontSize: 12,
          fontWeight: 600,
          color: C.inkSoft,
          marginBottom: 5,
          textTransform: "uppercase",
          letterSpacing: 0.4,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
