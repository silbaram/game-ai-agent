#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$ROOT_DIR"

echo "== 1) Shell syntax check =="
bash -n scripts/sync-skills.sh

echo "== 2) Newline/line-length guardrail check =="
python3 - <<'PY'
from pathlib import Path


def assert_ok(path: Path, *, min_lines: int, max_line_length: int) -> None:
    text = path.read_text(encoding="utf-8")
    line_count = text.count("\n") + 1
    if line_count < min_lines:
        raise SystemExit(
            f"line count too small (likely collapsed newlines): {path} "
            f"(lines={line_count}, min={min_lines})"
        )

    lines = text.splitlines()
    longest = max((len(line) for line in lines), default=0)
    if longest > max_line_length:
        raise SystemExit(
            f"line too long (likely collapsed newlines): {path} "
            f"(max={longest}, limit={max_line_length})"
        )


for p in sorted(Path("scripts").glob("*.sh")):
    assert_ok(p, min_lines=10, max_line_length=240)
for p in sorted(Path("agent-harness/agents").glob("*.md")):
    assert_ok(p, min_lines=10, max_line_length=280)
for p in sorted(Path("agent-harness/skills").glob("*/SKILL.md")):
    assert_ok(p, min_lines=10, max_line_length=320)
for p in sorted(Path("agent-harness").rglob("*.toml")):
    assert_ok(p, min_lines=3, max_line_length=280)
for p in [Path("AGENTS.md"), Path("CLAUDE.md"), Path("GEMINI.md"), Path("README.md")]:
    assert_ok(p, min_lines=5, max_line_length=320)

print("newline/line-length guardrail OK")
PY

echo "== 3) TOML syntax check =="
python3 - <<'PY'
try:
    import tomllib
except ModuleNotFoundError:
    import tomli as tomllib
from pathlib import Path

codex_agent_paths = sorted(Path("agent-harness/codex-agents").glob("*.toml"))
gemini_command_paths = sorted(Path("agent-harness/gemini-commands/agents").glob("*.toml"))
all_paths = [*codex_agent_paths, *gemini_command_paths, Path("agent-harness/codex-config.toml")]

for p in all_paths:
    data = tomllib.loads(p.read_text(encoding="utf-8"))
    if p in codex_agent_paths:
        for key in ("name", "description", "developer_instructions"):
            if key not in data:
                raise SystemExit(f"missing '{key}' in codex agent TOML: {p}")
        skills = data.get("skills")
        if not isinstance(skills, dict) or "config" not in skills:
            raise SystemExit(f"missing [[skills.config]] in codex agent TOML: {p}")
        config_entries = skills["config"]
        if not isinstance(config_entries, list) or len(config_entries) == 0:
            raise SystemExit(f"[[skills.config]] must have at least one entry: {p}")
        for i, entry in enumerate(config_entries, start=1):
            if not isinstance(entry, dict):
                raise SystemExit(f"skills.config entry #{i} is not a table: {p}")
            for key in ("path", "enabled"):
                if key not in entry:
                    raise SystemExit(f"skills.config entry #{i} missing '{key}': {p}")
            if not isinstance(entry["path"], str) or not entry["path"]:
                raise SystemExit(f"skills.config entry #{i} has invalid path: {p}")
            if not isinstance(entry["enabled"], bool):
                raise SystemExit(f"skills.config entry #{i} has non-bool enabled: {p}")
            if "developer_instructions" in entry:
                raise SystemExit(
                    f"developer_instructions must be top-level, not inside skills.config: {p}"
                )
    elif p in gemini_command_paths:
        for key in ("description", "prompt"):
            if key not in data:
                raise SystemExit(f"missing '{key}' in gemini command TOML: {p}")
        prompt = data["prompt"]
        if "@{.gemini/agents/" not in prompt:
            raise SystemExit(f"missing role reference in gemini prompt TOML: {p}")
        if "{{args}}" not in prompt:
            raise SystemExit(f"missing {{args}} placeholder in gemini prompt TOML: {p}")

print(f"TOML OK ({len(all_paths)} files)")
PY

echo "== 4) Frontmatter + required fields check =="
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
    first_line = p.read_text(encoding="utf-8").splitlines()[0]
    if first_line != "---":
        raise SystemExit(f"frontmatter opener must be standalone '---': {p}")

for p in sorted(Path("agent-harness/skills").glob("*/SKILL.md")):
    fm = parse_frontmatter(p)
    for key in ("name:", "description:"):
        if key not in fm:
            raise SystemExit(f"missing '{key}' in frontmatter: {p}")
    first_line = p.read_text(encoding="utf-8").splitlines()[0]
    if first_line != "---":
        raise SystemExit(f"frontmatter opener must be standalone '---': {p}")

print("frontmatter OK")
PY

echo "== 5) sync-skills smoke test =="
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

if [[ "${VALIDATE_NEGATIVE_TEST:-0}" != "1" ]]; then
  echo "== 6) Negative test (validator must fail on broken frontmatter) =="
  neg_tmp="$(mktemp -d)"
  trap 'rm -rf "$tmp" "$neg_tmp"' EXIT

  git -C "$ROOT_DIR" archive --format=tar HEAD | tar -xf - -C "$neg_tmp"
  printf 'broken\n' > "$neg_tmp/agent-harness/agents/game-director.md"

  if (
    cd "$neg_tmp"
    VALIDATE_NEGATIVE_TEST=1 bash scripts/validate-harness.sh >/dev/null 2>&1
  ); then
    echo "negative test failed: validator unexpectedly succeeded on broken input" >&2
    exit 1
  fi

  echo "negative test OK (broken input correctly rejected)"
fi

echo "== validate-harness complete =="
