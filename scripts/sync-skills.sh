#!/usr/bin/env bash
#
# sync-skills.sh
#
# Game AI Harness 원본을 실제 게임 프로젝트의 AI tool 경로로 설치/동기화한다.
#
# 사용:
#   bash scripts/sync-skills.sh --target /path/to/game-project --tool all
#   bash scripts/sync-skills.sh --target /path/to/game-project --tool claude
#   bash scripts/sync-skills.sh --target /path/to/game-project --tool codex
#   bash scripts/sync-skills.sh --target /path/to/game-project --tool gemini --dry-run
#
# 지원 tool:
#   all      Claude Code + Codex + Gemini CLI
#   claude   AGENTS.md, .claude/agents, .claude/skills
#   codex    AGENTS.md, .agents/skills, .codex/agents, .codex/config.toml
#   gemini   AGENTS.md, GEMINI.md, .gemini/skills, .agents/skills, .gemini/agents, .gemini/commands
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

HARNESS_DIR="$ROOT_DIR/agent-harness"
SOURCE_SKILLS_DIR="$HARNESS_DIR/skills"
SOURCE_AGENTS_DIR="$HARNESS_DIR/agents"
SOURCE_CODEX_AGENTS_DIR="$HARNESS_DIR/codex-agents"
SOURCE_GEMINI_COMMANDS_DIR="$HARNESS_DIR/gemini-commands"
SOURCE_CODEX_CONFIG="$HARNESS_DIR/codex-config.toml"

TARGET_DIR=""
TOOL="all"
DRY_RUN=false
FORCE=false

usage() {
  sed -n '2,18p' "$0" | sed 's/^# \{0,1\}//'
}

die() {
  echo "Error: $*" >&2
  echo "" >&2
  usage >&2
  exit 1
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --target|-t)
      [[ $# -ge 2 ]] || die "--target requires a path"
      TARGET_DIR="$2"
      shift 2
      ;;
    --tool)
      [[ $# -ge 2 ]] || die "--tool requires one of: all, claude, codex, gemini"
      TOOL="$2"
      shift 2
      ;;
    --dry-run|-n)
      DRY_RUN=true
      shift
      ;;
    --force)
      FORCE=true
      shift
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      die "unknown argument: $1"
      ;;
  esac
done

case "$TOOL" in
  all|claude|codex|gemini) ;;
  *) die "--tool must be one of: all, claude, codex, gemini" ;;
esac

[[ -n "$TARGET_DIR" ]] || die "--target is required"

if [[ "$TARGET_DIR" != /* ]]; then
  TARGET_DIR="$(cd "$(dirname "$TARGET_DIR")" && pwd)/$(basename "$TARGET_DIR")"
fi

[[ -d "$TARGET_DIR" ]] || die "target directory not found: $TARGET_DIR"

if [[ "$TARGET_DIR" == "$ROOT_DIR" && "$FORCE" != true ]]; then
  die "target is this harness repository. Pass --force if you intentionally want generated tool directories here."
fi

for required_dir in "$SOURCE_SKILLS_DIR" "$SOURCE_AGENTS_DIR" "$SOURCE_CODEX_AGENTS_DIR" "$SOURCE_GEMINI_COMMANDS_DIR"; do
  [[ -d "$required_dir" ]] || die "source directory not found: $required_dir"
done

if $DRY_RUN; then
  echo "== DRY RUN =="
fi

echo "Source: $ROOT_DIR"
echo "Target: $TARGET_DIR"
echo "Tool:   $TOOL"
echo ""

sync_dir() {
  local source="$1"
  local target="$2"
  echo "-> syncing $source to $target"
  if $DRY_RUN; then
    if command -v rsync >/dev/null 2>&1; then
      rsync -av --dry-run --delete "$source/" "$target/"
    else
      echo "   dry-run requires rsync for detailed file listing"
    fi
    return
  fi

  mkdir -p "$target"
  if command -v rsync >/dev/null 2>&1; then
    rsync -a --delete "$source/" "$target/"
  else
    rm -rf "$target"
    mkdir -p "$target"
    cp -R "$source/." "$target/"
  fi
}

copy_file() {
  local source="$1"
  local target="$2"
  echo "-> copying $source to $target"
  if $DRY_RUN; then
    return
  fi

  if [[ "$source" == "$target" ]]; then
    echo "   source and target are identical; skipping"
    return
  fi

  mkdir -p "$(dirname "$target")"
  cp "$source" "$target"
}

install_claude() {
  copy_file "$ROOT_DIR/AGENTS.md" "$TARGET_DIR/AGENTS.md"
  sync_dir "$SOURCE_AGENTS_DIR" "$TARGET_DIR/.claude/agents"
  sync_dir "$SOURCE_SKILLS_DIR" "$TARGET_DIR/.claude/skills"
  copy_file "$ROOT_DIR/CLAUDE.md" "$TARGET_DIR/CLAUDE.md"
}

install_codex() {
  copy_file "$ROOT_DIR/AGENTS.md" "$TARGET_DIR/AGENTS.md"
  sync_dir "$SOURCE_SKILLS_DIR" "$TARGET_DIR/.agents/skills"
  sync_dir "$SOURCE_CODEX_AGENTS_DIR" "$TARGET_DIR/.codex/agents"
  if [[ -f "$SOURCE_CODEX_CONFIG" ]]; then
    copy_file "$SOURCE_CODEX_CONFIG" "$TARGET_DIR/.codex/config.toml"
  else
    echo "-> writing default Codex agent config to $TARGET_DIR/.codex/config.toml"
    if ! $DRY_RUN; then
      mkdir -p "$TARGET_DIR/.codex"
      printf '[agents]\nmax_threads = 6\nmax_depth = 1\n' > "$TARGET_DIR/.codex/config.toml"
    fi
  fi
}

install_gemini() {
  copy_file "$ROOT_DIR/AGENTS.md" "$TARGET_DIR/AGENTS.md"
  copy_file "$ROOT_DIR/GEMINI.md" "$TARGET_DIR/GEMINI.md"

  # Gemini CLI workspace skills
  sync_dir "$SOURCE_SKILLS_DIR" "$TARGET_DIR/.gemini/skills"

  # Shared Agent Skills path used by Codex and Gemini
  sync_dir "$SOURCE_SKILLS_DIR" "$TARGET_DIR/.agents/skills"

  # Gemini role definitions used by custom commands via @{...}
  sync_dir "$SOURCE_AGENTS_DIR" "$TARGET_DIR/.gemini/agents"

  # Gemini CLI custom commands
  sync_dir "$SOURCE_GEMINI_COMMANDS_DIR" "$TARGET_DIR/.gemini/commands"
}

case "$TOOL" in
  all)
    install_claude
    install_codex
    install_gemini
    ;;
  claude)
    install_claude
    ;;
  codex)
    install_codex
    ;;
  gemini)
    install_gemini
    ;;
esac

if $DRY_RUN; then
  echo ""
  echo "(dry run complete - no files written)"
else
  echo ""
  echo "sync complete"
fi
