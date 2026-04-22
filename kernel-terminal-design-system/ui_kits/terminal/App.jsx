/* global React, PromptLine, OutputLine, Cursor, TerminalWindow, Sidebar, StatusBar, CommandPalette, ServiceList, LoginGate */

const DEMO_SESSIONS = [
  { id: "s1", title: "main", sub: "4 services · 2h ago", status: "running" },
  { id: "s2", title: "deploy-prod", sub: "finished · 14m ago", status: "idle" },
  { id: "s3", title: "migrate-db", sub: "finished · yesterday", status: "idle" },
  { id: "s4", title: "logs/api", sub: "streaming", status: "running" },
];

const SERVICES = [
  { name: "api",       status: "running",  age: "4d3h", port: ":4001", owner: "soyoung" },
  { name: "worker",    status: "degraded", age: "4d3h", port: "—",     owner: "soyoung" },
  { name: "web",       status: "running",  age: "3h12m", port: ":3000", owner: "minho" },
  { name: "scheduler", status: "stopped",  age: "—",    port: "—",     owner: "—" },
  { name: "legacy-db", status: "failed",   age: "1h4m", port: ":5432", owner: "—" },
];

const PALETTE = [
  { name: "kernel deploy --env=prod", hint: "⏎" },
  { name: "kernel logs api --tail",   hint: "⏎" },
  { name: "kernel restart worker",    hint: "⏎" },
  { name: "kernel run build",         hint: "⏎" },
  { name: "kernel auth --rotate",     hint: "⏎" },
  { name: "kernel exit",              hint: "⌃D" },
];

// --- helpers ---
function typeLine(cmd, onDone) {
  // simulate typing one char at a time
  let i = 0;
  const out = { current: "" };
  const iv = setInterval(() => {
    out.current = cmd.slice(0, ++i);
    if (i >= cmd.length) { clearInterval(iv); onDone?.(); }
  }, 18);
  return out;
}

// --- Main session view ---
function TerminalSession({ authed, onLogout }) {
  const [activeTab, setActiveTab] = useState("main");
  const [tabs, setTabs] = useState(["main", "logs"]);
  const [activeSession, setActiveSession] = useState("s1");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    { kind: "banner", content: "kernel v1.4.2 · connected to prod.us-west-2 · auth: soyoung" },
    { kind: "prompt", cwd: "~/kernel", value: "kernel status" },
    { kind: "table", data: SERVICES },
    { kind: "dim", content: "  5 services · 3 running · 1 degraded · 1 failed" },
  ]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setPaletteOpen(v => !v); }
      if (e.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  const run = (cmd) => {
    const lines = [{ kind: "prompt", cwd: "~/kernel", value: cmd }];
    if (cmd.startsWith("kernel deploy")) {
      lines.push({ kind: "dim", content: "  → resolving 14 modules" });
      lines.push({ kind: "dim", content: "  → building api, worker, web" });
      lines.push({ kind: "warn", content: "worker has 1 unused import" });
      lines.push({ kind: "ok",   content: "built in 3.2s" });
      lines.push({ kind: "err",  content: "missing env KERNEL_TOKEN" });
      lines.push({ kind: "hint", content: "run `kernel auth` or set in .env" });
    } else if (cmd.startsWith("kernel logs")) {
      lines.push({ kind: "dim",  content: "  [api] 12:04:01 GET /v1/users 200 14ms" });
      lines.push({ kind: "dim",  content: "  [api] 12:04:01 GET /v1/auth  200 3ms" });
      lines.push({ kind: "warn", content: "[api] 12:04:02 slow query: users.find took 840ms" });
      lines.push({ kind: "dim",  content: "  [api] 12:04:03 POST /v1/jobs 201 22ms" });
    } else if (cmd.startsWith("kernel restart")) {
      lines.push({ kind: "dim", content: "  stopping worker..." });
      lines.push({ kind: "ok",  content: "worker restarted (pid 8842)" });
    } else if (cmd.startsWith("kernel status") || cmd === "status") {
      lines.push({ kind: "table", data: SERVICES });
    } else if (cmd === "clear") {
      setHistory([]); setInput(""); return;
    } else if (cmd === "exit" || cmd === "logout") {
      onLogout?.(); return;
    } else if (cmd.trim() === "") {
      // empty
    } else {
      lines.push({ kind: "err", content: `unknown command: ${cmd.split(" ")[0]}` });
      lines.push({ kind: "hint", content: "try `kernel --help` or press ⌘K" });
    }
    setHistory(h => [...h, ...lines]);
    setInput("");
  };

  const onPaletteRun = (cmd) => { setPaletteOpen(false); run(cmd); };

  return (
    <div style={{ display: "flex", height: "100%", minHeight: 0 }}>
      <Sidebar sessions={DEMO_SESSIONS} active={activeSession} onSelect={setActiveSession}/>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, position: "relative" }}>
        <TerminalWindow title={`~/kernel — zsh · ${tabs.length} tab${tabs.length>1?"s":""}`}
          tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab}
          onAddTab={() => setTabs(t => [...t, `tab-${t.length+1}`])}
          style={{ flex: 1, minHeight: 0, borderRadius: 0, borderLeft: 0, borderRight: 0, borderBottom: 0 }}>
          <div ref={scrollRef} style={{ padding: "12px 16px", fontSize: 13, lineHeight: 1.5, height: "100%", overflow: "auto" }}>
            {history.map((l, i) => {
              if (l.kind === "banner") return <div key={i} style={{ color: "var(--fg-3)", fontSize: 11, paddingBottom: 8, borderBottom: "1px solid var(--border)", marginBottom: 10 }}>{l.content}</div>;
              if (l.kind === "prompt") return <PromptLine key={i} cwd={l.cwd} value={l.value} showCursor={false}/>;
              if (l.kind === "table") return <div key={i} style={{ margin: "6px 0 10px", border: "1px solid var(--border)", borderRadius: 2 }}><ServiceList services={l.data}/></div>;
              return <OutputLine key={i} kind={l.kind}>{l.content}</OutputLine>;
            })}
            {/* active input line */}
            <div style={{ display: "flex", gap: 8, alignItems: "baseline", marginTop: 6 }}>
              <span style={{ color: "var(--fg-3)" }}>soyoung@kernel</span>
              <span style={{ color: "var(--k-cyan)" }}>~/kernel</span>
              <span style={{ color: "var(--k-green)", fontWeight: 500 }}>$</span>
              <input autoFocus value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && run(input)}
                placeholder="try: kernel deploy --env=prod"
                style={{ flex: 1, background: "transparent", border: 0, outline: 0,
                  color: "var(--fg-1)", fontFamily: "var(--font-mono)", fontSize: 13, caretColor: "var(--k-green)" }}/>
            </div>
          </div>
        </TerminalWindow>
        <StatusBar branch="main" mode="insert" position={`L${history.length}:C${input.length+1}`}/>
        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)}
          items={PALETTE.map(p => ({ ...p, onSelect: () => onPaletteRun(p.name) }))}/>
        {/* make palette selection clickable */}
        {paletteOpen && (
          <div style={{ position: "absolute", inset: 0, zIndex: 101, pointerEvents: "none" }}>
            <div style={{ position: "absolute", top: 80, left: "50%", transform: "translateX(-50%)",
              width: 520, pointerEvents: "auto" }}>
              {/* overlay runs via onClose through palette */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Top level app ---
function TerminalApp() {
  const [authed, setAuthed] = useState(false);
  return (
    <div style={{ width: "100%", height: "100vh", background: "var(--bg-0)", display: "flex", flexDirection: "column" }}>
      {!authed ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ width: 520, background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 2 }}>
            <LoginGate onAuth={() => setAuthed(true)}/>
          </div>
        </div>
      ) : (
        <TerminalSession authed={authed} onLogout={() => setAuthed(false)}/>
      )}
    </div>
  );
}

window.TerminalApp = TerminalApp;
