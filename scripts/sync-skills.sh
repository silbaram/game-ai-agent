#!/usr/bin/env bash
#
# sync-skills.sh
#
# skills/ 를 single source of truth로 두고,
# .claude/skills/ 와 .agents/skills/ 로 복사한다.
#
# Claude Code와 Codex CLI가 각자의 경로에서 스킬을 찾기 때문에,
# skills/ 만 수정하고 이 스크립트를 실행하면 양쪽이 동기화된다.
#
# 사용:
#   bash scripts/sync-skills.sh
#   bash scripts/sync-skills.sh --dry-run
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

SOURCE_DIR="$ROOT_DIR/skills"
TARGETS=(
  "$ROOT_DIR/.claude/skills"
  "$ROOT_DIR/.agents/skills"
)

DRY_RUN=false
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "== DRY RUN =="
fi

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "Error: source directory not found: $SOURCE_DIR" >&2
  exit 1
fi

# 각 skill 디렉토리를 타겟으로 복사
for target in "${TARGETS[@]}"; do
  echo "→ syncing to $target"
  if $DRY_RUN; then
    rsync -av --dry-run --delete "$SOURCE_DIR/" "$target/"
  else
    mkdir -p "$target"
    # rsync가 없으면 cp로 대체
    if command -v rsync >/dev/null 2>&1; then
      rsync -a --delete "$SOURCE_DIR/" "$target/"
    else
      rm -rf "$target"
      mkdir -p "$target"
      cp -R "$SOURCE_DIR/." "$target/"
    fi
  fi
done

if $DRY_RUN; then
  echo "(dry run complete — no files written)"
else
  echo "✓ sync complete"
  echo ""
  echo "Synced skills:"
  for dir in "$SOURCE_DIR"/*/; do
    skill_name="$(basename "$dir")"
    echo "  - $skill_name"
  done
fi
