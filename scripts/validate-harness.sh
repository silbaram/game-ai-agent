#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$ROOT_DIR"

echo "== 1) Shell syntax check =="
bash -n scripts/sync-skills.sh

echo "== 2) TOML syntax check =="
python3 - <<'PY'
try:
    import tomllib
except ModuleNotFoundError:
    import tomli as tomllib
from pathlib import Path

paths = []
paths.extend(sorted(Path("agent-harness/codex-agents").glob("*.toml")))
paths.extend(sorted(Path("agent-harness/gemini-commands/agents").glob("*.toml")))
paths.append(Path("agent-harness/codex-config.toml"))

for p in paths:
    tomllib.loads(p.read_text(encoding="utf-8"))

print(f"TOML OK ({len(paths)} files)")
PY

echo "== 3) Frontmatter + required fields check =="
python3 - <<'PY'
from pathlib import Path


def parse_frontmatter(path: Path) -> str:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        raise SystemExit(f"missing frontmatter start: {path}")

    end = text.find("\n---\n", 4)
    if end == -1:
        raise SystemExit(f"missing frontmatter end: {path}")

    return text[4:end]


for p in sorted(Path("agent-harness/agents").glob("*.md")):
    fm = parse_frontmatter(p)
    for key in ("name:", "description:", "tools:"):
        if key not in fm:
            raise SystemExit(f"missing '{key}' in frontmatter: {p}")

for p in sorted(Path("agent-harness/skills").glob("*/SKILL.md")):
    fm = parse_frontmatter(p)
    for key in ("name:", "description:"):
        if key not in fm:
            raise SystemExit(f"missing '{key}' in frontmatter: {p}")

print("frontmatter OK")
PY

echo "== 4) sync-skills smoke test =="
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

bash scripts/sync-skills.sh --target "$tmp" --tool all

test -d "$tmp/.claude/agents"
test -d "$tmp/.claude/skills"
test -d "$tmp/.agents/skills"
test -d "$tmp/.codex/agents"
test -f "$tmp/.codex/config.toml"
test -d "$tmp/.gemini/agents"
test -d "$tmp/.gemini/commands"
test -d "$tmp/.gemini/skills"

echo "sync-skills smoke test OK"
echo "== validate-harness complete =="
