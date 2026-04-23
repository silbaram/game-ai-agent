/* global React */

// ---------- Sidebar of past sessions ----------
function Sidebar({ sessions = [], active, onSelect }) {
  return (
    <div style={{ width: 220, background: "var(--bg-1)", borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column", fontSize: 12 }}>
      <div style={{ padding: "14px 14px 8px", fontSize: 10, textTransform: "uppercase",
        letterSpacing: "0.08em", color: "var(--fg-3)" }}>sessions</div>
      <div style={{ flex: 1, overflow: "auto" }}>
        {sessions.map(s => (
          <div key={s.id} onClick={() => onSelect?.(s.id)} style={{
            padding: "8px 14px", cursor: "pointer",
            background: s.id === active ? "var(--k-green-a)" : "transparent",
            color: s.id === active ? "var(--fg-1)" : "var(--fg-2)",
            borderLeft: s.id === active ? "2px solid var(--k-green)" : "2px solid transparent",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span>{s.title}</span>
              <span style={{ fontSize: 10, color: s.status === "running" ? "var(--k-green)" : "var(--fg-3)" }}>
                {s.status === "running" ? "●" : "○"}
              </span>
            </div>
            <div style={{ fontSize: 10, color: "var(--fg-3)", marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: 10, borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--fg-3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>soyoung@kernel</span><span>⌘K</span>
        </div>
      </div>
    </div>
  );
}

// ---------- Status bar (bottom) ----------
function StatusBar({ branch = "main", dirty = false, mode = "insert", position = "L4:C12" }) {
  return (
    <div style={{ height: 24, background: "var(--bg-2)", borderTop: "1px solid var(--border)",
      display: "flex", alignItems: "center", padding: "0 10px", fontSize: 11, color: "var(--fg-2)", gap: 14 }}>
      <span style={{ color: "var(--k-green)" }}>● online</span>
      <span>⎇ {branch}{dirty && <span style={{ color: "var(--k-amber)" }}> *</span>}</span>
      <span>mode: {mode}</span>
      <span style={{ marginLeft: "auto" }}>{position}</span>
      <span>utf-8</span>
      <span>LF</span>
    </div>
  );
}

// ---------- Command palette (⌘K overlay) ----------
function CommandPalette({ open, onClose, items = [] }) {
  const [q, setQ] = React.useState("");
  if (!open) return null;
  const filtered = items.filter(i => i.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)",
      display: "flex", justifyContent: "center", paddingTop: 80, zIndex: 100 }}>
      <div onClick={e => e.stopPropagation()} style={{ width: 520, background: "var(--bg-1)",
        border: "1px solid var(--k-green)", borderRadius: 2, boxShadow: "0 0 0 1px var(--k-green), 0 0 24px rgba(0,226,107,0.25)" }}>
        <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "var(--k-green)" }}>❯</span>
          <input autoFocus value={q} onChange={e => setQ(e.target.value)}
            placeholder="run a command..."
            style={{ flex: 1, background: "transparent", border: 0, outline: 0,
              color: "var(--fg-1)", fontFamily: "var(--font-mono)", fontSize: 14 }}/>
          <span style={{ fontSize: 10, color: "var(--fg-3)" }}>esc to close</span>
        </div>
        <div style={{ maxHeight: 320, overflow: "auto" }}>
          {filtered.map((it, i) => (
            <div key={it.name} style={{ padding: "8px 14px", display: "flex", alignItems: "center",
              justifyContent: "space-between", fontSize: 12,
              background: i === 0 ? "var(--k-green-a)" : "transparent",
              color: i === 0 ? "var(--fg-1)" : "var(--fg-2)" }}>
              <span>{it.name}</span>
              <span style={{ color: "var(--fg-3)", fontSize: 11 }}>{it.hint}</span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: "14px", color: "var(--fg-3)", fontSize: 12 }}>no matches</div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Sidebar, StatusBar, CommandPalette });
