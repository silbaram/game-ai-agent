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

Agent 역할 정의 원본은 `agents/*.md`에 있습니다. 플랫폼별 실행 형식은 `scripts/sync-skills.sh`가 대상 게임 프로젝트에 생성합니다.

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

Skill 정의는 `skills/<skill-name>/SKILL.md`에 있습니다.

---

## 플랫폼별 공식 대응

| 플랫폼 | 공식 기능 | 대상 프로젝트 설치 위치 |
|---|---|---|
| Claude Code | Project subagents | `.claude/agents/*.md` |
| Claude Code | Project skills | `.claude/skills/<skill>/SKILL.md` |
| Codex | AGENTS.md project instructions | `AGENTS.md` |
| Codex | Repository skills | `.agents/skills/<skill>/SKILL.md` |
| Codex | Project custom agents | `.codex/agents/*.toml` |
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

  examples/
    README.md
    design-systems/
      kernel-terminal/

  codex-config.toml

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

`skills/`, `agents/`, `codex-agents/`, `codex-config.toml`, `gemini-commands/`가 source입니다. 이 스크립트는 대상 프로젝트에 다음 공식 런타임 경로를 생성합니다.

```text
AGENTS.md         -> <target>/AGENTS.md
CLAUDE.md         -> <target>/CLAUDE.md
GEMINI.md         -> <target>/GEMINI.md
skills/           -> <target>/.claude/skills/
skills/           -> <target>/.agents/skills/
skills/           -> <target>/.gemini/skills/
agents/           -> <target>/.claude/agents/
agents/           -> <target>/.gemini/agents/
codex-agents/     -> <target>/.codex/agents/
codex-config.toml -> <target>/.codex/config.toml
gemini-commands/  -> <target>/.gemini/commands/
```

하네스 저장소 안의 `.claude/`, `.agents/`, `.codex/`, `.gemini/`는 생성물입니다. 원본을 고칠 때는 숨김 디렉토리가 아니라 위 source 디렉토리를 수정합니다.

---

## 사용자 사용 흐름

이 섹션은 사용자가 실제 게임 프로젝트에서 어떤 순서로 AI tool에 요청하는지 설명합니다.

핵심 규칙:

- 최소 입력만 적으면 agent가 자동으로 실행되지 않습니다.
- 첫 요청에는 반드시 `game-director`를 호출한다고 명시합니다.
- `game-design/initial-input.md`는 선택 파일입니다. 만들었다면 첫 요청에서 이 파일을 읽으라고 지시해야 합니다.

### 1. 하네스 저장소에서 대상 프로젝트로 설치

하네스 저장소에서 실제 게임 프로젝트 경로를 대상으로 동기화합니다.

```bash
bash scripts/sync-skills.sh --target /path/to/game-project --tool all
```

결과적으로 대상 프로젝트에 AI tool별 실행 파일이 생성됩니다.

```text
/path/to/game-project/
  AGENTS.md
  CLAUDE.md
  GEMINI.md
  .claude/
  .agents/
  .codex/
  .gemini/
```

### 2. 대상 게임 프로젝트에서 AI tool 실행

AI tool은 **대상 게임 프로젝트 루트**에서 실행합니다.

```bash
cd /path/to/game-project
```

이후 사용하는 도구를 엽니다.

```text
Claude Code / Codex / Gemini CLI
```

### 3. 첫 프롬프트에서 `game-director` 호출

사용자는 AI tool에 최소 입력을 그냥 던지는 것이 아니라, `game-director`에게 이 입력으로 시작하라고 요청합니다.

Claude Code 예:

```text
Use game-director.

입력:
장르: roguelike deckbuilder
플랫폼: web
핵심 재미: 덱 빌딩 + 영구 성장
원하는 분위기: 다크 판타지
참고 게임: Slay the Spire, Inscryption
피하고 싶은 요소: 과도한 실시간 조작, 복잡한 3D 전투
개발 제약: 2주 안에 MVP, 브라우저 플레이 가능

game-concept-brief와 game-core-loop-design skill을 사용해서
아래 파일을 작성해.

- game-design/concept-brief.md
- game-design/game-pillars.md
- game-design/core-loop.md
- game-design/system-overview.md
```

Codex 예:

```text
Spawn the game-director custom agent.

입력:
장르: roguelike deckbuilder
플랫폼: web
핵심 재미: 덱 빌딩 + 영구 성장
원하는 분위기: 다크 판타지
참고 게임: Slay the Spire, Inscryption
피하고 싶은 요소: 과도한 실시간 조작, 복잡한 3D 전투
개발 제약: 2주 안에 MVP, 브라우저 플레이 가능

game-concept-brief와 game-core-loop-design skill을 사용해서
game-design/ 하위 기획 초안 파일을 작성해.
```

Gemini CLI 예:

```text
/agents:game-director 장르=roguelike deckbuilder, 플랫폼=web, 핵심 재미=덱 빌딩 + 영구 성장, 분위기=다크 판타지, 참고=Slay the Spire/Inscryption, 피하고 싶은 요소=과도한 실시간 조작/복잡한 3D 전투, 개발 제약=2주 안에 MVP/브라우저 플레이 가능
```

### 4. 선택 사항: `initial-input.md`로 시작 입력 저장

반복 작업을 할 프로젝트라면 최소 입력을 파일로 남겨도 됩니다.

```text
game-design/initial-input.md
```

이 파일은 자동으로 읽히지 않습니다. 첫 프롬프트에서 agent에게 읽으라고 지시해야 합니다.

```text
Use game-director.

game-design/initial-input.md를 읽고,
game-concept-brief와 game-core-loop-design skill을 사용해서
game-design/ 하위 기획 초안 파일을 작성해.
```

`initial-input.md`는 시작용 seed입니다. 이후 기준 문서는 `concept-brief.md`, `core-loop.md`, `mvp-scope.md`, `rules/*.md`로 넘어갑니다.

### 5. 생성된 기획 초안 확인

첫 요청이 끝나면 사용자는 아래 파일이 생겼는지 확인합니다.

```text
game-design/concept-brief.md
game-design/game-pillars.md
game-design/core-loop.md
game-design/system-overview.md
```

부족하면 같은 `game-director`에게 보완을 요청합니다. 다음 단계로 넘어가기 전에 핵심 재미, 타겟 플레이어, core loop, 주요 시스템이 문서에 있어야 합니다.

### 6. 다음 agent를 순서대로 호출

이후부터는 사용자가 다음 agent를 명시적으로 호출합니다. agent끼리 자동으로 이어서 실행된다고 가정하지 않습니다.

| 사용자 요청 | 동작 agent | 주요 skill | 결과 |
|---|---|---|---|
| 세계관과 아트 방향을 정리해 | `game-concept-designer` | `game-concept-brief` 참조 | `game-design/art/*.md` |
| 전투/아이템/성장 규칙을 설계해 | `game-rules-designer` | `game-rule-design` | `game-design/rules/*.md` |
| MVP 범위를 줄여 | `production-scope-reviewer` | `game-mvp-scope` | `game-design/mvp-scope.md`, `ai/reviews/production/*.md` |
| 규칙을 데이터 테이블로 바꿔 | `spreadsheet-architect` | `game-spreadsheet-authoring` | `game-design/spreadsheets/*` |
| 숫자와 보상을 검토해 | `balance-reviewer` | `game-balance-review` | `ai/reviews/balance/*.md` |
| 시스템 개발 명세로 바꿔 | `game-rules-designer` | `game-system-spec` | `game-design/systems/*.md` |
| 화면 구조와 디자인 시스템을 작성해 | `ui-planner` | `design-system-spec`, `game-screen-spec`, `game-image-prompt-pack` | `ai/specs/ui/*.md`, `game-design/art/*-prompts.md` |
| UI를 실제로 구현해 | `ui-implementer` | `game-ui-implementation` | `src/*`, `components/*`, `screens/*`, `tests/*` |
| 브라우저 preview를 검토해 | `browser-preview-reviewer` | `game-browser-preview-review` | `ai/reviews/visual/*.md` |

예:

```text
Use production-scope-reviewer.

game-design/concept-brief.md, game-design/core-loop.md,
game-design/rules/*.md를 읽고 game-mvp-scope skill을 사용해.

MVP 범위를 Must / Later / Cut / Risk로 나누고,
결과를 game-design/mvp-scope.md와
ai/reviews/production/initial-scope-review.md에 저장해.
```

### 7. Web LLM은 기획 이후 시각 보조로 사용

Web LLM은 기획의 source of truth가 아닙니다. Agent + Skill이 만든 문서를 기준으로 아래 작업에만 사용합니다.

```text
- 컨셉 이미지
- UI mockup
- 아이콘 시안
- 무드보드
- 외부 레퍼런스 탐색
```

Web LLM 결과물은 바로 구현하지 않고 `game-design/art/` 또는 `ai/specs/ui/` 문서로 변환한 뒤 반영합니다.

### 8. 구현과 Preview 검증 요청

기획, 규칙, 데이터, UI 명세가 생긴 뒤 `ui-implementer`에게 구현을 요청합니다.

```text
game-design/mvp-scope.md,
game-design/rules/*.md,
game-design/systems/*.md,
game-design/spreadsheets/*,
ai/specs/ui/*.md를 기준으로
game-ui-implementation skill을 사용해서 MVP 화면을 구현해.
```

구현 뒤에는 Preview 검증을 요청합니다.

```text
game-browser-preview-review skill을 사용해서
default, loading, empty, error, selected, disabled,
hover/focus, mobile, desktop, long text, many items 상태를 검토해.

결과는 ai/reviews/visual/round-1.md에 저장해.
```

### 9. 전체 플로우 요약

```text
사용자
  ↓
대상 프로젝트에서 AI tool 실행
  ↓
game-director 호출 + 최소 입력 제공
  ↓
concept-brief / pillars / core-loop 생성
  ↓
사용자가 다음 agent를 명시적으로 호출
  ↓
rules → MVP scope → spreadsheet → balance → system spec → UI spec
  ↓
Web LLM은 이미지와 mockup 보조
  ↓
ui-implementer가 구현
  ↓
Preview / QA 검증
```

---

## 빠른 시작

### Claude Code

```text
Use game-director.
입력: 장르=roguelike deckbuilder, 플랫폼=web,
핵심 재미=덱 빌딩 + 영구 성장, 분위기=다크 판타지,
참고=Slay the Spire, Inscryption.
game-concept-brief와 game-core-loop-design skill을 호출해서
결과를 game-design/ 하위에 저장해.
```

### Codex CLI

```bash
codex run "Spawn the game-director custom agent. \
  입력: 장르=roguelike deckbuilder, 플랫폼=web, \
  핵심 재미=덱 빌딩 + 영구 성장. \
  game-design/ 하위에 concept brief와 core loop를 저장해."
```

### Gemini CLI

```bash
gemini
> /agents:game-director 장르=roguelike deckbuilder, 플랫폼=web, 핵심 재미=덱 빌딩 + 영구 성장
```

---

## 운영 원칙

- 기획 Agent는 반드시 Review Agent와 함께 사용합니다.
- Web LLM 결과물은 바로 구현하지 않고 명세로 변환합니다.
- 게임 규칙은 코드에 직접 박지 않고 데이터 테이블로 관리합니다.
- 화면 구현은 Screen Spec과 Design System을 기준으로 합니다.
- 모든 새 기획 산출물은 `game-design/` 또는 `ai/` 하위에 남깁니다.
