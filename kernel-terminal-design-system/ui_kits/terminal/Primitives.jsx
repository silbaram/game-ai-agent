/* global React */

// ---------- StatusPill ----------
function StatusPill({ kind = "ok", children }) {
  const map = {
    ok:    { c: "var(--k-green)",  g: "●" },
    warn:  { c: "var(--k-amber)",  g: "◐" },
    err:   { c: "var(--k-red)",    g: "✗" },
    info:  { c: "var(--k-cyan)",   g: "i" },
    idle:  { c: "var(--fg-3)",     g: "○" },
  };
  const s = map[kind] ?? map.ok;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "2px 8px",
        border: `1px solid ${s.c}`, color: s.c, borderRadius: 2, fontSize: 11, lineHeight: 1.4 }}>
      <span style={{ fontSize: 10 }}>{s.g}</span>
      {children}
    </span>
  );
}

// ---------- Cursor ----------
function Cursor({ width = 9, height = 16, color = "var(--fg-1)" }) {
  return <span style={{ display: "inline-block", width, height, background: color,
    verticalAlign: "-3px", animation: "k-blink 1s steps(1,end) infinite", marginLeft: 2 }}/>;
}

// ---------- Prompt line ----------
function PromptLine({ cwd = "~", user = "kernel", value = "", showCursor = true, variant = "$" }) {
  const color = variant === "#" ? "var(--k-red)" : "var(--k-green)";
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "baseline", fontSize: 13, lineHeight: 1.5 }}>
      <span style={{ color: "var(--fg-3)" }}>{user}@kernel</span>
      <span style={{ color: "var(--k-cyan)" }}>{cwd}</span>
      <span style={{ color, fontWeight: 500 }}>{variant}</span>
      <span style={{ color: "var(--fg-1)" }}>{value}</span>
      {showCursor && <Cursor />}
    </div>
  );
}

// ---------- Output line ----------
function OutputLine({ kind = "out", children }) {
  const map = {
    out:  { c: "var(--fg-1)", p: "" },
    dim:  { c: "var(--fg-2)", p: "  " },
    info: { c: "var(--k-cyan)", p: "  " },
    warn: { c: "var(--k-amber)", p: "  warn: " },
    err:  { c: "var(--k-red)", p: "  error: " },
    ok:   { c: "var(--k-green)", p: "  ok: " },
    hint: { c: "var(--fg-3)", p: "         hint: " },
  };
  const s = map[kind] ?? map.out;
  return <div style={{ color: s.c, fontSize: 13, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{s.p}{children}</div>;
}

Object.assign(window, { StatusPill, Cursor, PromptLine, OutputLine });
