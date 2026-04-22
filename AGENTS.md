# AGENTS.md

이 파일은 Claude Code, Codex CLI, Gemini CLI 등 여러 coding agent가 공통으로 참조하는 프로젝트 지침이다.
각 도구별 전용 파일(`CLAUDE.md`, `GEMINI.md`)은 이 문서를 **확장**하지, 대체하지 않는다.

---

## 1. 이 프로젝트의 정체성

이 프로젝트는 **게임 기획 → 개발 연결**을 Agent + Skill 하네스로 구현한 저장소다.

```text
Agent + Skill  = 게임 기획의 source of truth (뼈대)
Web LLM        = 컨셉 이미지 / 무드보드 / 시각 레퍼런스 (살)
Coding Agent   = 실제 개발 (Claude Code / Codex / Gemini)
```

**원칙 1.** 기획은 대화창에 휘발되지 않고, 반드시 `game-design/` 하위 파일로 남는다.
**원칙 2.** 기획 agent는 항상 리뷰 agent와 쌍으로 쓴다. 자기 아이디어를 자기가 승인하지 않는다.
**원칙 3.** 멋진 설정보다 **구현 가능한 규칙**이 우선이다. 설정집은 게임이 아니다.

---

## 2. 디렉토리 규약

```text
game-design/
  game-pillars.md              # 게임의 3~5개 핵심 기둥
  concept-brief.md             # 한 줄 피치 + 장르 + 타겟
  core-loop.md                 # 30초 / 5분 / 1일 루프
  mvp-scope.md                 # 포함 / 제외 / v2 연기

  rules/
    combat-rules.md
    item-rules.md
    skill-rules.md
    economy-rules.md
    quest-rules.md

  systems/
    inventory-system.md
    shop-system.md
    quest-system.md
    character-growth-system.md

  spreadsheets/
    game-master.xlsx
    item-master.csv
    skill-master.csv
    drop-table.csv

  art/
    art-direction.md
    image-prompts.md
    ui-mockup-prompts.md

ai/
  specs/                       # agent가 생성한 명세
    ui/
    systems/
  reviews/                     # agent가 생성한 검토 문서
    balance/
    production/
    visual/
```

agent가 새 기획 산출물을 만들 때는 **반드시 위 경로 규약을 따른다**.
경로를 임의로 바꾸지 않는다. 경로가 source of truth다.

---

## 3. 에이전트 구성 (7종)

| Agent | 역할 | 출력 위치 |
|---|---|---|
| `game-director` | 전체 방향, pillars, core loop, 시스템 목록 | `game-design/game-pillars.md`, `game-design/core-loop.md`, `game-design/system-overview.md` |
| `game-concept-designer` | 세계관, 분위기, 아트 방향, 플레이어 판타지 | `game-design/concept-brief.md`, `game-design/art/art-direction.md` |
| `game-rules-designer` | 전투/아이템/스킬/성장/보상/드랍/상점/퀘스트 규칙 | `game-design/rules/*.md` |
| `spreadsheet-architect` | 규칙을 데이터 테이블로 변환 | `game-design/spreadsheets/*.xlsx`, `*.csv` |
| `balance-reviewer` | 성장곡선, 보상량, 드랍률, 가격, 이상치 검토 | `ai/reviews/balance/*.md` |
| `production-scope-reviewer` | MVP 축소, 복잡도 평가, 구현 순서 | `ai/reviews/production/*.md`, `game-design/mvp-scope.md` |
| `ui-planner` | UI 디자인 시스템, 화면 흐름, 화면별 상태/데이터 요구사항 | `ai/specs/ui/*.md` |

각 에이전트는 특정 skill을 호출할 수 있다. 아래 섹션 4 참조.

플랫폼별 실행 형식은 `scripts/sync-skills.sh`가 대상 게임 프로젝트에 생성한다:
- Claude Code subagent: `<target>/.claude/agents/*.md`
- Codex custom agent: `<target>/.codex/agents/*.toml`
- Gemini CLI role command: `<target>/.gemini/commands/agents/*.toml`

Gemini CLI는 Claude/Codex와 같은 subagent manifest를 쓰지 않는다. 이 프로젝트에서는 공식 custom command로 `agents/*.md` 역할 정의를 주입한다.

---

## 4. 스킬 구성 (11종)

| Skill | 호출 주체 | 목적 |
|---|---|---|
| `game-concept-brief` | `game-director`, `game-concept-designer` | 초기 컨셉을 정형 문서로 정리 |
| `game-core-loop-design` | `game-director` | 30초 / 5분 / 1일 루프 정의 |
| `game-rule-design` | `game-rules-designer` | 시스템 규칙을 코드/시트화 가능한 형태로 설계 |
| `game-system-spec` | `game-rules-designer`, `game-director` | 시스템을 개발 명세로 변환 |
| `game-mvp-scope` | `production-scope-reviewer` | 기획 범위를 실구현 가능한 수준으로 축소 |
| `game-spreadsheet-authoring` | `spreadsheet-architect` | 규칙과 MVP 범위를 데이터 테이블로 변환 |
| `game-balance-review` | `balance-reviewer` | 성장, 보상, 가격, 드랍률, 전투 시간 검토 |
| `design-system-spec` | `ui-planner` | UI 디자인 시스템 토큰과 컴포넌트 규칙 정의 |
| `game-screen-spec` | `ui-planner` | 화면별 상태, 데이터 요구사항, 인터랙션 명세 |
| `game-ui-implementation` | Coding Agent | 화면 명세와 디자인 시스템을 실제 UI로 구현 |
| `game-browser-preview-review` | Coding Agent / Reviewer | 브라우저 preview에서 화면 상태와 반응형 검토 |

스킬의 실제 내용은 `skills/<skill-name>/SKILL.md`에 있다.
플랫폼별 복사본은 대상 프로젝트의 `.claude/skills/`, `.agents/skills/`, `.gemini/skills/`에 자동 동기화된다.
Claude Code용 agent 복사본은 대상 프로젝트의 `.claude/agents/`에, Codex용 TOML agent 복사본은 `.codex/agents/`에, Gemini용 role command 복사본은 `.gemini/commands/`에 자동 동기화된다.

```bash
bash scripts/sync-skills.sh --target /path/to/game-project --tool all
```

이 하네스 저장소의 `.claude/`, `.agents/`, `.codex/`, `.gemini/`는 생성물이므로 원본으로 편집하지 않는다.

---

## 5. 실행 순서 (권장 워크플로우)

사람이 최소 입력을 제공한다: 장르 / 플랫폼 / 핵심 재미 / 원하는 분위기 / 참고 게임.

1. `game-director` → `game-concept-brief` skill 실행 → 컨셉 초안
2. `game-director` → `game-core-loop-design` skill 실행 → 루프 정의
3. `game-concept-designer` → 세계관 + 아트 방향 정리
4. `game-rules-designer` → `game-rule-design` skill 실행 (시스템별 반복)
5. `production-scope-reviewer` → `game-mvp-scope` skill 실행 → 범위 축소
6. `spreadsheet-architect` → `game-spreadsheet-authoring` skill 실행 → 데이터 테이블 생성
7. `balance-reviewer` → `game-balance-review` skill 실행 → 숫자 검토 → 5~6단계 피드백
8. `game-rules-designer` → `game-system-spec` skill 실행 → MVP 시스템 개발 명세 확정
9. `ui-planner` → `design-system-spec`, `game-screen-spec` skill 실행 → UI 명세 작성
10. (외부) Web LLM으로 컨셉 이미지 / UI mockup 생성
11. Claude Code / Codex / Gemini → `game-ui-implementation` skill 기준으로 실제 구현
12. Claude Code / Codex / Gemini → `game-browser-preview-review` skill 기준으로 Preview / QA

**절대 어기지 않는 규칙**: 4번 이후 반드시 5번을 거친다. MVP 축소 없이 스프레드시트, 시스템 명세, 구현에 들어가면 기획이 우주 규모로 부풀어 오른다.

---

## 6. Agent 간 호출 규약

에이전트끼리 직접 호출하지 않는다. 사람이 순서를 조율한다.
단, 각 에이전트는 **자신이 어떤 에이전트의 다음 단계를 만드는지** 출력물 맨 앞에 명시한다:

```yaml
---
produced_by: game-rules-designer
depends_on:
  - game-design/concept-brief.md
  - game-design/core-loop.md
next_step: production-scope-reviewer
---
```

---

## 7. 금지 사항

- 규칙을 정의할 때 구체적 숫자를 생략하지 않는다. "적당히", "충분히" 금지.
- 한 시스템을 설계할 때 그 시스템의 **실패 조건**을 빠뜨리지 않는다.
- 아트 디렉션 없이 이미지 프롬프트를 생성하지 않는다.
- MVP 범위 검토 없이 스프레드시트를 만들지 않는다.
- UI 디자인 시스템과 Screen Spec 없이 화면 구현에 들어가지 않는다.
- Web LLM 결과물은 바로 구현하지 않고 `game-design/art/` 또는 `ai/specs/ui/` 명세로 변환한다.
- 기획 agent가 자기 산출물을 스스로 "승인 완료"로 표시하지 않는다. 반드시 리뷰 agent를 거친다.

---

## 8. 참고

- 스킬 포맷은 `SKILL.md` 표준 (Claude Code, Codex CLI, Gemini CLI 공통)
- Agent 정의는 Claude Code subagent 스펙 기준 (frontmatter: `name`, `description`, `tools`)
- Codex는 `.codex/agents/*.toml` custom agent를 사용한다.
- Gemini는 `.gemini/commands/*.toml` custom command로 agent 역할을 프롬프트 주입한다.
