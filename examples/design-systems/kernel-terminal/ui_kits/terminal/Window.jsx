/* global React */

// ---------- Window chrome ----------
function TerminalWindow({ title = "~/kernel — zsh — 100×32", tabs = ["main"], activeTab = "main", onTabClick, onAddTab, children, style }) {
  return (
    <div style={{ background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 2,
      overflow: "hidden", display: "flex", flexDirection: "column", ...style }}>
      {/* title bar */}
      <div style={{ height: 36, background: "var(--bg-2)", borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", padding: "0 12px", gap: 12, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{ width: 12, height: 12, borderRadius: 2, background: "var(--k-red)" }}/>
          <span style={{ width: 12, height: 12, borderRadius: 2, background: "var(--k-amber)" }}/>
          <span style={{ width: 12, height: 12, borderRadius: 2, background: "var(--k-green)" }}/>
        </div>
        <div style={{ color: "var(--fg-2)", fontSize: 12, marginLeft: 8 }}>{title}</div>
        <div style={{ marginLeft: "auto", color: "var(--fg-3)", fontSize: 11 }}>
          <span style={{ color: "var(--k-green)" }}>●</span> kernel v1.4.2
        </div>
      </div>
      {/* tab bar */}
      <div style={{ height: 32, background: "var(--bg-1)", borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "stretch", fontSize: 12, flexShrink: 0 }}>
        {tabs.map(t => (
          <div key={t} onClick={() => onTabClick?.(t)} style={{
            padding: "0 14px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
            borderRight: "1px solid var(--border)",
            background: t === activeTab ? "var(--bg-2)" : "transparent",
            color: t === activeTab ? "var(--fg-1)" : "var(--fg-3)",
            borderTop: t === activeTab ? "1px solid var(--k-green)" : "1px solid transparent",
          }}>
            <span style={{ fontSize: 10, color: "var(--k-green)" }}>●</span>
            {t}
          </div>
        ))}
        <div onClick={onAddTab} style={{ padding: "0 12px", display: "flex", alignItems: "center",
          color: "var(--fg-3)", cursor: "pointer" }}>+</div>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
        {children}
      </div>
    </div>
  );
}

Object.assign(window, { TerminalWindow });
