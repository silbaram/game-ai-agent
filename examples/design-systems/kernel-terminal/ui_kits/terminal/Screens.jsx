/* global React */

// ---------- Service list table ----------
function ServiceList({ services = [], onAction }) {
  return (
    <div style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 40px",
        padding: "6px 14px", color: "var(--fg-3)", fontSize: 10, textTransform: "uppercase",
        letterSpacing: "0.08em", borderBottom: "1px solid var(--border)" }}>
        <span>name</span><span>status</span><span>age</span><span>port</span><span>owner</span><span></span>
      </div>
      {services.map((s, i) => (
        <div key={s.name} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 40px",
          padding: "8px 14px", borderBottom: "1px solid var(--border)",
          background: i % 2 ? "transparent" : "rgba(255,255,255,0.01)", color: "var(--fg-1)" }}>
          <span style={{ fontWeight: 500 }}>{s.name}</span>
          <span style={{ color: s.status === "running" ? "var(--k-green)" :
            s.status === "degraded" ? "var(--k-amber)" :
            s.status === "failed" ? "var(--k-red)" : "var(--fg-3)" }}>
            {s.status === "running" ? "● running" : s.status === "degraded" ? "◐ degraded" :
             s.status === "failed" ? "✗ failed" : "○ stopped"}
          </span>
          <span style={{ color: "var(--fg-2)" }}>{s.age || "—"}</span>
          <span style={{ color: "var(--fg-2)" }}>{s.port || "—"}</span>
          <span style={{ color: "var(--fg-2)" }}>{s.owner || "—"}</span>
          <span onClick={() => onAction?.(s)} style={{ color: "var(--fg-3)", cursor: "pointer", textAlign: "right" }}>…</span>
        </div>
      ))}
    </div>
  );
}

// ---------- Login gate ----------
function LoginGate({ onAuth }) {
  const [token, setToken] = React.useState("");
  const [err, setErr] = React.useState("");
  const submit = () => {
    if (!token) { setErr("token required"); return; }
    if (token.length < 4) { setErr("invalid token format"); return; }
    onAuth?.(token);
  };
  return (
    <div style={{ padding: 24, fontSize: 13, lineHeight: 1.6 }}>
      <pre style={{ margin: 0, color: "var(--k-green)", fontSize: 11, lineHeight: 1.2 }}>{`   _                        _
  | | _____ _ __ _ __   ___| |
  | |/ / _ \\ '__| '_ \\ / _ \\ |
  |   <  __/ |  | | | |  __/ |
  |_|\\_\\___|_|  |_| |_|\\___|_|   v1.4.2`}</pre>
      <div style={{ color: "var(--fg-2)", marginTop: 16 }}>welcome back. paste your access token to continue.</div>
      <div style={{ color: "var(--fg-3)", fontSize: 11, marginTop: 4 }}>create one at <span style={{ color: "var(--k-cyan)" }}>kernel.dev/tokens</span></div>

      <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 8,
        background: "var(--bg-1)", border: `1px solid ${err ? "var(--k-red)" : "var(--k-green)"}`,
        padding: "10px 12px", borderRadius: 2,
        boxShadow: err ? "0 0 0 1px var(--k-red), 0 0 12px rgba(255,77,77,0.25)" :
          "0 0 0 1px var(--k-green), 0 0 12px rgba(0,226,107,0.25)" }}>
        <span style={{ color: "var(--k-green)" }}>$</span>
        <span style={{ color: "var(--fg-3)" }}>kernel auth --token</span>
        <input autoFocus value={token} onChange={e => { setToken(e.target.value); setErr(""); }}
          onKeyDown={e => e.key === "Enter" && submit()}
          placeholder="knl_..."
          style={{ flex: 1, background: "transparent", border: 0, outline: 0,
            color: "var(--fg-1)", fontFamily: "var(--font-mono)", fontSize: 13 }}/>
      </div>
      {err && <div style={{ color: "var(--k-red)", fontSize: 11, marginTop: 8 }}>error: {err}</div>}

      <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
        <button onClick={submit} style={{
          fontFamily: "inherit", fontSize: 13, fontWeight: 500,
          background: "var(--k-green)", color: "#071a0e", border: "1px solid var(--k-green)",
          padding: "8px 16px", borderRadius: 2, cursor: "pointer" }}>authenticate</button>
        <button onClick={() => onAuth?.("demo-token")} style={{
          fontFamily: "inherit", fontSize: 13,
          background: "transparent", color: "var(--fg-2)", border: "1px solid var(--border-hover)",
          padding: "8px 16px", borderRadius: 2, cursor: "pointer" }}>use demo</button>
      </div>
      <div style={{ marginTop: 20, color: "var(--fg-3)", fontSize: 11 }}>
        ─ or run in trial mode with <span style={{ color: "var(--k-cyan)" }}>kernel run --offline</span>
      </div>
    </div>
  );
}

Object.assign(window, { ServiceList, LoginGate });
