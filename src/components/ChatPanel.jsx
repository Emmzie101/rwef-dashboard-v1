import React, { useEffect, useRef, useState } from "react";
import { subscribeChat, sendChatMessage } from "../lib/data.js";
import { Avatar, Button } from "./ui.jsx";
import { C, inputStyle } from "../theme.js";

export default function ChatPanel({ me }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    const unsub = subscribeChat(setMessages);
    return unsub;
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim() || !me) return;
    const t = text.trim();
    setText("");
    await sendChatMessage(me.id, me.name, t);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 100px)", maxWidth: 720 }}>
      <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 23, fontWeight: 700, margin: "0 0 4px", color: C.ink }}>
        Live chat
      </h1>
      <p style={{ fontSize: 12.5, color: C.inkSoft, margin: "0 0 16px" }}>
        Quick team-wide messages. For anything longer, you've got WhatsApp and Gmail.
      </p>
      <div
        style={{
          flex: 1,
          background: "#fff",
          border: `1px solid ${C.line}`,
          borderRadius: 12,
          padding: 16,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {messages.length === 0 && <div style={{ color: C.inkSoft, fontSize: 13 }}>No messages yet — say hello.</div>}
        {messages.map((m) => (
          <div key={m.id} style={{ display: "flex", gap: 9 }}>
            <Avatar name={m.authorName} size={26} />
            <div>
              <div style={{ fontSize: 12.5 }}>
                <span style={{ fontWeight: 700, color: C.ink }}>{m.authorName}</span>{" "}
                <span style={{ color: C.inkSoft, fontSize: 11 }}>
                  {m.ts?.toDate
                    ? m.ts.toDate().toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
                    : "sending…"}
                </span>
              </div>
              <div style={{ fontSize: 13.5, color: C.ink, marginTop: 1 }}>{m.text}</div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          style={inputStyle}
          placeholder="Message the team…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}
