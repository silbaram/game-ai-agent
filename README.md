# Game AI Harness

이 프로젝트는 게임 개발 과정에서 AI 도구를 효과적으로 활용하기 위한 **Agent + Skill 기반 게임 개발 하네스**입니다.

핵심 목표는 Web LLM에 모든 기획을 맡기는 것이 아니라, 게임 기획부터 규칙 설계, 데이터화, 화면 명세, 구현, 검증까지를 **전문 Agent와 Skill로 구조화**하는 것입니다.

---

## 핵심 방향

```text
Agent + Skill = 게임 기획과 개발 명세의 Source of Truth
Web LLM       = 시각화, 아이디어 확장, 이미지 생성 보조
Implementation/QA Agents = 실제 구현과 브라우저 검증
```

Agent + Skill 방식은 다음 장점이 있습니다.

- 반복 가능한 구조로 기획을 생성할 수 있음
- 개발 가능한 명세로 바로 연결할 수 있음
- 게임 규칙을 데이터 테이블과 코드 구조로 변환하기 쉬움
- 프로젝트 내부 문서와 직접 연결 가능
- 기획, 밸런스, 화면 설계, 구현, 리뷰를 역할별로 분리 가능

---

## 전체 개발 흐름

```text
1. 사람이 최소 입력을 제공한다.
   - 장르
   - 플랫폼
   - 핵심 재미
   - 원하는 분위기
   - 피하고 싶은 요소

2. game-director
   - game-concept-brief
   - game-core-loop-design

3. game-concept-designer
   - 세계관
   - 아트 방향
   - Web LLM 이미지 프롬프트

4. game-rules-designer
   - game-rule-design
   - 전투, 아이템, 성장, 보상 규칙 설계

5. production-scope-reviewer
   - game-mvp-scope
   - MVP 범위 축소

6. spreadsheet-architect
   - game-spreadsheet-authoring
   - 게임 데이터 테이블 생성

7. balance-reviewer
   - game-balance-review
   - 성장, 보상, 가격, 드랍률 검토

8. game-rules-designer
   - game-system-spec
   - MVP 시스템 개발 명세 확정

9. ui-planner
   - design-system-spec
   - game-screen-spec
   - UI 디자인 시스템과 화면 명세 작성

10. Web LLM 사용
    - 컨셉 이미지
    - UI mockup
    - 아이콘 시안
    - 무드보드 생성

11. ui-implementer
    - game-ui-implementation
    - 실제 화면 / 로직 / 데이터 구현

12. browser-preview-reviewer
    - game-browser-preview-review
    - 브라우저 확인
    - Visual Review
    - 빌드 / 테스트
```

**절대 규칙:** `game-rule-design` 이후에는 반드시 `game-mvp-scope`를 거칩니다. MVP 축소 없이 스프레드시트, 시스템 명세, 구현에 들어가지 않습니다.

---

## Agent 구성

| Agent | 역할 | 출력 위치 |
|---|---|---|
| `game-director` | 전체 방향, pillars, core loop, 시스템 목록 | `game-design/game-pillars.md`, `game-design/core-loop.md`, `game-design/system-overview.md` |
| `game-concept-designer` | 세계관, 분위기, 플레이어 판타지, 아트 방향 | `game-design/concept-brief.md`, `game-design/art/*.md` |
| `game-rules-designer` | 전투/아이템/스킬/성장/보상/드랍/상점/퀘스트 규칙 | `game-design/rules/*.md`, `game-design/systems/*.md` |
| `production-scope-reviewer` | MVP 축소, 복잡도 평가, 구현 순서 | `game-design/mvp-scope.md`, `ai/reviews/production/*.md` |
| `spreadsheet-architect` | 규칙을 데이터 테이블로 변환 | `game-design/spreadsheets/*.csv`, `game-design/spreadsheets/game-master.xlsx` |
| `balance-reviewer` | 성장곡선, 보상량, 드랍률, 가격, 이상치 검토 | `ai/reviews/balance/*.md` |
| `ui-planner` | UI 디자인 시스템, 화면 흐름, 화면별 상태/데이터 요구사항 | `ai/specs/ui/*.md` |
| `ui-implementer` | Screen Spec/Design System 기반 실제 UI 구현 | `src/*`, `components/*`, `screens/*`, `tests/*` |
| `browser-preview-reviewer` | 브라우저 preview 상태/반응형 검토 | `ai/reviews/visual/*.md` |

Agent 역할 정의 원본은 `agent-harness/agents/*.md`에 있습니다. 플랫폼별 실행 형식은 `scripts/sync-skills.sh`가 대상 게임 프로젝트에 생성합니다.

- Claude Code: `<target>/.claude/agents/*.md`
- Codex: `<target>/.codex/agents/*.toml`
- Gemini CLI: `<target>/.gemini/commands/agents/*.toml` 명령으로 역할 호출

Gemini CLI에는 Claude/Codex와 같은 1:1 subagent 파일 형식이 없으므로, 공식 custom command 형식으로 `.gemini/agents/*.md` 역할 정의를 주입합니다.

---

## Skill 구성

| Skill | 호출 주체 | 목적 |
|---|---|---|
| `game-concept-brief` | `game-director`, `game-concept-designer` | 초기 컨셉을 정형 문서로 정리 |
| `game-core-loop-design` | `game-director` | 30초 / 5분 / 1일 / 장기 루프 정의 |
| `game-rule-design` | `game-rules-designer` | 시스템 규칙을 코드/시트화 가능한 형태로 설계 |
| `game-mvp-scope` | `production-scope-reviewer` | 기획 범위를 실구현 가능한 MVP로 축소 |
| `game-spreadsheet-authoring` | `spreadsheet-architect` | 규칙과 MVP 범위를 데이터 테이블로 변환 |
| `game-balance-review` | `balance-reviewer` | 성장, 보상, 가격, 드랍률, 전투 시간 검토 |
| `game-system-spec` | `game-rules-designer` | 시스템을 개발 명세로 변환 |
| `design-system-spec` | `ui-planner` | UI 디자인 시스템 토큰과 컴포넌트 규칙 정의 |
| `game-screen-spec` | `ui-planner` | 화면별 상태, 데이터 요구사항, 인터랙션 명세 |
| `game-image-prompt-pack` | `game-concept-designer`, `ui-planner` | Web LLM용 컨셉 이미지, UI mockup, 아이콘 시안 프롬프트 작성 |
| `game-ui-implementation` | `ui-implementer` | 화면 명세와 디자인 시스템 기준으로 실제 UI 구현 |
| `game-browser-preview-review` | `browser-preview-reviewer` | 브라우저 preview에서 상태와 반응형 검토 |

Skill 정의는 `agent-harness/skills/<skill-name>/SKILL.md`에 있습니다.

---

## 플랫폼별 공식 대응

| 플랫폼 | 공식 기능 | 대상 프로젝트 설치 위치 |
|---|---|---|
| Claude Code | Project subagents | `.claude/agents/*.md` |
| Claude Code | Project skills | `.claude/skills/<skill>/SKILL.md` |
| Codex | AGENTS.md project instructions | `AGENTS.md` |
| Codex | Repository skills | `.agents/skills/<skill>/SKILL.md` |
| Codex | Project custom agents | `.codex/agents/*.toml` (`[[skills.config]]`로 관련 skill 활성화) |
| Gemini CLI | Context file | `GEMINI.md` |
| Gemini CLI | Workspace skills | `.gemini/skills/<skill>/SKILL.md`, `.agents/skills/<skill>/SKILL.md` |
| Gemini CLI | Project role definitions | `.gemini/agents/*.md` |
| Gemini CLI | Project custom commands | `.gemini/commands/agents/*.toml` |

참고:
- Claude Code subagents: https://docs.anthropic.com/en/docs/claude-code/sub-agents
- Claude Code skills: https://docs.anthropic.com/en/docs/claude-code/skills
- Codex AGENTS.md: https://developers.openai.com/codex/guides/agents-md
- Codex skills: https://developers.openai.com/codex/skills
- Codex subagents: https://developers.openai.com/codex/subagents
- Gemini CLI skills: https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/skills.md
- Gemini CLI custom commands: https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/custom-commands.md

---

## 권장 프로젝트 구조

이 저장소는 하네스 원본입니다. 실제 게임 개발 프로젝트가 다른 경로에 있다면, 아래 원본을 `scripts/sync-skills.sh`로 대상 프로젝트에 설치합니다.

### 하네스 저장소

```text
game-ai-agent/
  AGENTS.md
  CLAUDE.md
  GEMINI.md
  README.md

  agent-harness/
    agents/
      game-director.md
      game-concept-designer.md
      game-rules-designer.md
      production-scope-reviewer.md
      spreadsheet-architect.md
      balance-reviewer.md
      ui-planner.md
      ui-implementer.md
      browser-preview-reviewer.md

    codex-agents/
      game-director.toml
      game-concept-designer.toml
      game-rules-designer.toml
      production-scope-reviewer.toml
      spreadsheet-architect.toml
      balance-reviewer.toml
      ui-planner.toml
      ui-implementer.toml
      browser-preview-reviewer.toml

    gemini-commands/
      agents/
        game-director.toml
        game-concept-designer.toml
        game-rules-designer.toml
        production-scope-reviewer.toml
        spreadsheet-architect.toml
        balance-reviewer.toml
        ui-planner.toml
        ui-implementer.toml
        browser-preview-reviewer.toml

    skills/
      game-concept-brief/
      game-core-loop-design/
      game-rule-design/
      game-mvp-scope/
      game-spreadsheet-authoring/
      game-balance-review/
      game-system-spec/
      design-system-spec/
      game-screen-spec/
      game-image-prompt-pack/
      game-ui-implementation/
      game-browser-preview-review/

    codex-config.toml

  examples/
    README.md
    design-systems/
      kernel-terminal/

  prompts/
    start-game-director.md

  scripts/
    sync-skills.sh
```

### 대상 게임 프로젝트

```text
game-project/
  AGENTS.md
  CLAUDE.md
  GEMINI.md

  game-design/
    game-pillars.md
    concept-brief.md
    core-loop.md
    system-overview.md
    mvp-scope.md

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
      SCHEMA.md
      game-master.xlsx
      item-master.csv
      skill-master.csv
      drop-table.csv

    art/
      art-direction.md
      image-prompts.md
      ui-mockup-prompts.md

  ai/
    specs/
      ui/
        design-system.md
        screen-map.md
        inventory-screen.md
        shop-screen.md
      systems/
    reviews/
      balance/
      production/
      visual/

  .claude/
    agents/
    skills/

  .agents/
    skills/

  .codex/
    config.toml
    agents/

  .gemini/
    agents/
    commands/
    skills/
```

---

## 스킬 동기화

```bash
bash scripts/sync-skills.sh --target /path/to/game-project --tool all
```

특정 도구만 설치할 수도 있습니다.

```bash
bash scripts/sync-skills.sh --target /path/to/game-project --tool claude
bash scripts/sync-skills.sh --target /path/to/game-project --tool codex
bash scripts/sync-skills.sh --target /path/to/game-project --tool gemini
```

`agent-harness/skills/`, `agent-harness/agents/`, `agent-harness/codex-agents/`, `agent-harness/codex-config.toml`, `agent-harness/gemini-commands/`가 source입니다. Codex agent TOML은 관련 skill을 `[[skills.config]]`로 가리키며, 이 스크립트는 대상 프로젝트에 다음 공식 런타임 경로를 생성합니다.

```text
AGENTS.md         -> <target>/AGENTS.md
CLAUDE.md         -> <target>/CLAUDE.md
GEMINI.md         -> <target>/GEMINI.md
agent-harness/skills/           -> <target>/.claude/skills/
agent-harness/skills/           -> <target>/.agents/skills/
agent-harness/skills/           -> <target>/.gemini/skills/
agent-harness/agents/           -> <target>/.claude/agents/
agent-harness/agents/           -> <target>/.gemini/agents/
agent-harness/codex-agents/     -> <target>/.codex/agents/
agent-harness/codex-config.toml -> <target>/.codex/config.toml
agent-harness/gemini-commands/  -> <target>/.gemini/commands/
```

하네스 저장소 안의 `.claude/`, `.agents/`, `.codex/`, `.gemini/`는 생성물입니다. 원본을 고칠 때는 숨김 디렉토리가 아니라 `agent-harness/` 아래 source 디렉토리를 수정합니다.

---

## Game AI 하네스로 개발 시작하기

이 절차는 “새 게임 프로젝트에서 AI agent로 기획 뼈대를 만들고, 구현까지 이어가는 방법”을 처음부터 설명합니다.

### 0. 먼저 결정할 것

시작 전에 아래 4가지만 정하면 됩니다. 나머지는 `game-director`가 문서화하면서 정리합니다.

| 항목 | 예시 |
|---|---|
| 장르 | 로그라이크 덱빌더, 방치형 RPG, 퍼즐 어드벤처 |
| 플랫폼 | web, mobile, PC |
| 핵심 재미 | 매 런마다 다른 덱을 짜는 재미, 클릭할수록 보상이 쌓이는 재미 |
| 타겟 플레이어 | 코어 게이머 30~60분 세션, 출퇴근 중 5분 캐주얼 유저 |

바로 복사해서 쓸 프롬프트는 [prompts/start-game-director.md](prompts/start-game-director.md)에 있습니다.

### 1. 대상 게임 프로젝트 준비

하네스 저장소와 실제 게임 프로젝트는 분리해서 쓰는 것을 권장합니다.

```text
/path/to/game-ai-agent     # 이 하네스 저장소
/path/to/game-project      # 실제 게임 개발 프로젝트
```

대상 게임 프로젝트가 없다면 먼저 만듭니다.

```bash
mkdir -p /path/to/game-project
```

### 2. 하네스를 대상 프로젝트에 설치

하네스 저장소 루트에서 실행합니다.

```bash
cd /path/to/game-ai-agent
bash scripts/sync-skills.sh --target /path/to/game-project --tool all
```

설치 후 대상 프로젝트에는 AI tool별 실행 파일이 생깁니다.

```text
game-project/
  AGENTS.md
  CLAUDE.md
  GEMINI.md
  .claude/
  .agents/
  .codex/
  .gemini/
```

특정 도구만 쓴다면 `--tool claude`, `--tool codex`, `--tool gemini` 중 하나를 사용합니다.

### 3. 대상 프로젝트 루트에서 AI tool 실행

AI tool은 반드시 대상 게임 프로젝트 루트에서 실행합니다.

```bash
cd /path/to/game-project
```

그 다음 사용하는 도구를 엽니다.

```text
Claude Code / Codex CLI / Gemini CLI
```

### 4. 첫 요청은 반드시 `game-director`

최소 입력만 던지면 agent가 자동으로 이어지지 않습니다. 첫 요청에는 `game-director`를 사용한다고 명시합니다.

가장 쉬운 시작 프롬프트:

```text
game-director를 사용해서 게임 뼈대 문서를 만들어줘.

입력:
- 장르: 로그라이크 덱빌더
- 플랫폼: web
- 핵심 재미: 매 런마다 다른 덱을 짜고, 실패해도 다음 런이 기대되는 성장감
- 타겟 플레이어: 코어 게이머, 1회 30~60분
- 분위기/톤: 어두운 판타지
- 참고 게임: Slay the Spire, Inscryption
- 피하고 싶은 요소: 실시간 전투, 과금 유도, 복잡한 3D 조작

반드시 아래 파일로 저장해줘:
- game-design/concept-brief.md
- game-design/game-pillars.md
- game-design/core-loop.md
- game-design/system-overview.md

각 파일에는 produced_by, depends_on, next_step frontmatter를 넣어줘.
```

도구별로 굳이 다르게 외울 필요는 없습니다. 다만 Gemini CLI에서는 custom command를 쓰고 싶으면 아래처럼 시작할 수 있습니다.

```text
/agents:game-director 장르=로그라이크 덱빌더, 플랫폼=web, 핵심 재미=덱 빌딩 + 영구 성장
```

### 5. 첫 산출물 확인

`game-director`가 끝나면 아래 파일이 생겼는지 확인합니다.

```text
game-design/concept-brief.md
game-design/game-pillars.md
game-design/core-loop.md
game-design/system-overview.md
```

확인 기준:

- `concept-brief.md`에 한 줄 피치, 장르, 플랫폼, 타겟 플레이어가 있는가
- `game-pillars.md`에 3~5개 핵심 기둥이 있는가
- `core-loop.md`에 30초 / 5분 / 1일 또는 장기 루프가 있는가
- `system-overview.md`에 Core / Supporting / Optional 시스템 분류가 있는가

부족하면 다음 단계로 가지 말고 같은 `game-director`에게 보완을 요청합니다.

### 6. 이후 agent를 순서대로 호출

agent끼리 자동으로 다음 agent를 호출하지 않습니다. 사람이 다음 단계를 명시합니다.

| 순서 | 요청 | Agent | 주요 결과 |
|---|---|---|---|
| 1 | 게임 뼈대 문서 생성 | `game-director` | `game-design/concept-brief.md`, `game-design/core-loop.md` |
| 2 | 세계관과 아트 방향 정리 | `game-concept-designer` | `game-design/art/*.md` |
| 3 | 전투/아이템/성장 규칙 설계 | `game-rules-designer` | `game-design/rules/*.md` |
| 4 | MVP 범위 축소 | `production-scope-reviewer` | `game-design/mvp-scope.md` |
| 5 | 규칙을 데이터 테이블로 변환 | `spreadsheet-architect` | `game-design/spreadsheets/*` |
| 6 | 숫자와 보상 검토 | `balance-reviewer` | `ai/reviews/balance/*.md` |
| 7 | MVP 시스템 개발 명세 확정 | `game-rules-designer` | `game-design/systems/*.md` |
| 8 | UI 디자인 시스템과 화면 명세 작성 | `ui-planner` | `ai/specs/ui/*.md` |
| 9 | 실제 UI 구현 | `ui-implementer` | `src/*`, `components/*`, `screens/*`, `tests/*` |
| 10 | 브라우저 preview 검토 | `browser-preview-reviewer` | `ai/reviews/visual/*.md` |

가장 중요한 규칙:

- `game-rules-designer` 이후에는 반드시 `production-scope-reviewer`를 거칩니다.
- MVP 범위 검토 없이 스프레드시트, 시스템 명세, 구현에 들어가지 않습니다.
- UI 구현은 `ai/specs/ui/design-system.md`와 화면별 `*-screen.md`가 생긴 뒤에만 합니다.

### 7. 다음 단계 요청 예시

MVP 범위를 줄일 때:

```text
production-scope-reviewer를 사용해줘.

game-design/concept-brief.md,
game-design/game-pillars.md,
game-design/core-loop.md,
game-design/system-overview.md,
game-design/rules/*.md를 읽고
MVP 범위를 Must / Later / Cut으로 나눠줘.

결과는 아래 파일로 저장해줘:
- game-design/mvp-scope.md
- ai/reviews/production/scope-cut-1.md
- ai/reviews/production/complexity-map.md
```

UI 구현을 시작할 때:

```text
ui-implementer를 사용해줘.

아래 문서를 기준으로 MVP 화면을 구현해줘:
- game-design/mvp-scope.md
- game-design/systems/*.md
- game-design/spreadsheets/*
- ai/specs/ui/design-system.md
- ai/specs/ui/*-screen.md

구현 후 실행한 검증 명령과 남은 TODO를 정리해줘.
```

### 8. Web LLM 사용 위치

Web LLM은 source of truth가 아닙니다. 아래처럼 시각 보조로만 사용합니다.

- 컨셉 이미지
- UI mockup
- 아이콘 시안
- 무드보드
- 외부 레퍼런스 탐색

Web LLM 결과물은 바로 구현하지 않습니다. 먼저 `game-design/art/` 또는 `ai/specs/ui/` 문서로 정리한 뒤 구현에 반영합니다.

### 9. 전체 절차 요약

```text
하네스 설치
  ↓
대상 프로젝트 루트에서 AI tool 실행
  ↓
game-director 호출
  ↓
concept brief / pillars / core loop / system overview 생성
  ↓
concept → rules → MVP scope → spreadsheet → balance
  ↓
system spec → UI spec
  ↓
ui-implementer 구현
  ↓
browser-preview-reviewer 검토
```

---

## 운영 원칙

- 기획 Agent는 반드시 Review Agent와 함께 사용합니다.
- Web LLM 결과물은 바로 구현하지 않고 명세로 변환합니다.
- 게임 규칙은 코드에 직접 박지 않고 데이터 테이블로 관리합니다.
- 화면 구현은 Screen Spec과 Design System을 기준으로 합니다.
- 모든 새 기획 산출물은 `game-design/` 또는 `ai/` 하위에 남깁니다.
