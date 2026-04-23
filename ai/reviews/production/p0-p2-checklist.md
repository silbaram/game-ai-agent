---
produced_by: production-scope-reviewer
depends_on:
  - README.md
  - AGENTS.md
  - GEMINI.md
  - scripts/sync-skills.sh
  - gemini-commands/agents/
  - agents/
  - codex-agents/
  - skills/game-image-prompt-pack/SKILL.md
  - examples/
next_step: none
---

# 요구사항 체크리스트 (P0/P1/P1/P2)

검토 기준: "Agent + Skill이 source of truth, Web LLM은 시각 보조" 원칙 하에서, 요청된 4개 항목의 구현 여부를 파일 단위로 점검.

## P0 — Gemini command 경로 문제 수정

| 항목 | 파일 | 기대 상태 | 결과 | 근거 |
|---|---|---|---|---|
| Gemini 동기화 시 agent 정의 복사 | `scripts/sync-skills.sh` | `agents/ -> <target>/.gemini/agents/` 동기화 | PASS | `install_gemini()`에 `.gemini/agents` sync 단계 존재 |
| Gemini command 참조 경로 | `gemini-commands/agents/*.toml` | `@{.gemini/agents/<agent>.md}` 사용 | PASS | 기존 `@{agents/...}` 참조 제거됨 |
| 문서 동기화 경로 안내 | `README.md`, `AGENTS.md`, `GEMINI.md` | `.gemini/agents` 경로 명시 | PASS | 3개 문서 모두 반영됨 |

## P1 — `game-image-prompt-pack` skill 추가

| 항목 | 파일 | 기대 상태 | 결과 | 근거 |
|---|---|---|---|---|
| 신규 skill 정의 추가 | `skills/game-image-prompt-pack/SKILL.md` | skill 파일 존재 및 설명 포함 | PASS | 신규 SKILL 문서 존재 |
| Agent 연결 (컨셉) | `agents/game-concept-designer.md` | skills에 `game-image-prompt-pack` 포함 | PASS | frontmatter skills 목록 반영 |
| Agent 연결 (UI) | `agents/ui-planner.md` | skills에 `game-image-prompt-pack` 포함 | PASS | frontmatter skills 목록 반영 |
| 문서 반영 | `README.md`, `AGENTS.md` | 스킬 표에 추가 및 호출 주체 반영 | PASS | 12종 스킬 구성으로 업데이트 |

## P1 — `ui-implementer` / `browser-preview-reviewer` agent 추가

| 항목 | 파일 | 기대 상태 | 결과 | 근거 |
|---|---|---|---|---|
| Claude agent 추가 | `agents/ui-implementer.md`, `agents/browser-preview-reviewer.md` | 역할/입력/출력/금지사항 정의 | PASS | 두 agent 파일 신규 존재 |
| Codex agent 추가 | `codex-agents/ui-implementer.toml`, `codex-agents/browser-preview-reviewer.toml` | custom agent 정의 존재 | PASS | 두 TOML 파일 신규 존재 |
| Gemini command 추가 | `gemini-commands/agents/ui-implementer.toml`, `gemini-commands/agents/browser-preview-reviewer.toml` | custom command 정의 존재 | PASS | 두 TOML 파일 신규 존재 |
| 문서의 에이전트/스킬 호출 주체 정합성 | `README.md`, `AGENTS.md` | 에이전트 9종, 스킬 12종 반영 | PASS | 수치/표/워크플로우 반영됨 |

## P2 — `kernel-terminal-design-system`을 examples로 이동

| 항목 | 파일 | 기대 상태 | 결과 | 근거 |
|---|---|---|---|---|
| 예시 폴더 이동 | `examples/design-systems/kernel-terminal/` | 루트 대신 examples 하위로 정리 | PASS | 경로 이동 완료 |
| examples 안내 문서 | `examples/README.md` | 예시 산출물/비런타임 명시 | PASS | 목적/주의사항 명시 |
| 저장소 구조 문서 반영 | `README.md` | examples 구조 포함 | PASS | 권장 구조 섹션 업데이트 |
| 폰트 라이선스 리스크 완화 | `examples/design-systems/kernel-terminal/fonts/README.md` | 바이너리 폰트 비포함 원칙 명시 | PASS | 문서에 비포함/직접 준비 안내 포함 |

---

## 최종 판정

- P0: **PASS**
- P1 (image prompt skill): **PASS**
- P1 (implementation/review agents): **PASS**
- P2 (examples 이동): **PASS**

총평: 요구한 4개 우선순위 항목은 파일 단위 기준으로 모두 충족.
