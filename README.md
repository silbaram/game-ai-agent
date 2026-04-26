# Game AI Harness

게임 기획에서 구현까지 이어지는 과정을 **Agent + Skill + 산출물 문서**로 고정하는 하네스입니다.

이 저장소의 목적은 Web LLM에 기획을 통째로 맡기는 것이 아닙니다. 아이디어를 검토 가능한 문서, 규칙, 데이터 테이블, 화면 명세로 단계별로 남기고, coding agent가 그 산출물을 기준으로 구현하게 만드는 것입니다.

```text
Agent + Skill           = 게임 기획과 개발 명세의 source of truth
Web LLM                 = 컨셉 이미지, 무드보드, 시각 레퍼런스 보조
Coding / QA Agent       = 실제 구현, 브라우저 검토, 테스트
game-design/ and ai/    = 모든 기획 산출물이 남는 위치
```

---

## 핵심 원칙

- 기획은 대화창에만 두지 않고 `game-design/` 또는 `ai/` 하위 파일로 남깁니다.
- 기획 agent는 리뷰 agent와 함께 사용합니다. 자기 산출물을 자기 혼자 승인하지 않습니다.
- 멋진 설정보다 구현 가능한 규칙을 우선합니다.
- `game-rules-designer` 이후에는 반드시 `production-scope-reviewer`를 거칩니다.
- MVP 범위 검토 없이 스프레드시트, 시스템 명세, 구현으로 넘어가지 않습니다.
- Web LLM 결과물은 바로 구현하지 않고 문서 명세로 변환한 뒤 사용합니다.

---

## 전체 흐름

| 단계 | 목적                  | Agent / Skill               | 주요 산출물                                                                                                                 | 게이트                                            |
| ---- | --------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| 0    | 최소 입력 확보        | 사람                        | 장르, 플랫폼, 핵심 재미, 타겟 플레이어                                                                                      | 4개 필수값이 모두 있어야 함                       |
| 1    | 게임 뼈대 확정        | `game-director`             | `game-design/concept-brief.md`, `game-design/game-pillars.md`, `game-design/core-loop.md`, `game-design/system-overview.md` | 게임 방향과 시스템 후보가 한 방향으로 정리됨      |
| 2    | 세계관/아트 방향 정리 | `game-concept-designer`     | `game-design/art/*.md`                                                                                                      | 아트 방향이 먼저 있어야 이미지 프롬프트 작성 가능 |
| 3    | 시스템 규칙 설계      | `game-rules-designer`       | `game-design/rules/*.md`                                                                                                    | 숫자, 입력, 결과, 실패 조건이 있어야 함           |
| 4    | MVP 범위 축소         | `production-scope-reviewer` | `game-design/mvp-scope.md`, `ai/reviews/production/*.md`                                                                    | Must / Later / Cut이 분리됨                       |
| 5    | 데이터 테이블화       | `spreadsheet-architect`     | `game-design/spreadsheets/*.csv`, `game-master.xlsx`                                                                        | MVP에 남은 규칙만 데이터화                        |
| 6    | 숫자 검토             | `balance-reviewer`          | `ai/reviews/balance/*.md`                                                                                                   | 성장, 보상, 가격, 드랍률 이상치 기록              |
| 7    | 개발 명세 확정        | `game-rules-designer`       | `game-design/systems/*.md`                                                                                                  | 구현자가 추측 없이 읽을 수 있어야 함              |
| 8    | UI 명세 작성          | `ui-planner`                | `ai/specs/ui/*.md`                                                                                                          | 화면별 상태, 데이터, 인터랙션 정리                |
| 9    | 시각 자료 생성        | Web LLM                     | 컨셉 이미지, UI mockup, 아이콘 시안                                                                                         | 결과물을 문서 명세에 반영                         |
| 10   | 구현                  | `ui-implementer`            | `src/*`, `components/*`, `screens/*`, `tests/*`                                                                             | 시스템/UI 명세가 존재해야 함                      |
| 11   | 브라우저 검토         | `browser-preview-reviewer`  | `ai/reviews/visual/*.md`                                                                                                    | preview, 반응형, 빌드/테스트 결과 기록            |

Agent끼리는 자동으로 다음 agent를 호출하지 않습니다. 사람이 현재 산출물을 확인한 뒤 다음 agent를 명시적으로 호출합니다.

---

## 핵심 뼈대 문서

`game-director`가 만드는 첫 산출물입니다. 이후 모든 기획, 규칙, UI, 구현의 기준점이 됩니다.

| 파일                             | 역할                   | 주요 내용                                                                     | 다음 단계에서 쓰는 방식                                  |
| -------------------------------- | ---------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------- |
| `game-design/concept-brief.md`   | 게임의 한 줄 정체성    | 한 줄 피치, 장르, 플랫폼, 타겟, 핵심 판타지, 핵심 재미, 초기 MVP 범위, 리스크 | 모든 후속 agent가 “무슨 게임인가”를 판단하는 기준        |
| `game-design/game-pillars.md`    | 게임의 3~5개 핵심 기둥 | 플레이어가 느껴야 할 감정/경험, 디자인 판단 기준, 우선순위                    | 기능 추가/삭제, MVP 축소, UI 방향 판단 기준              |
| `game-design/core-loop.md`       | 플레이 반복 구조       | 30초 루프, 5분 루프, 1일 루프, 장기 성장, 보상 구조, 실패 조건                | 전투, 보상, 성장, 세션 길이를 설계하는 기준              |
| `game-design/system-overview.md` | 시스템 전체 지도       | Core / Supporting / Optional 시스템 목록, 시스템 간 연결, MVP 우선순위        | `rules/`, `systems/`, `spreadsheets/`로 내려갈 작업 범위 |

### 각 문서가 답해야 하는 질문

`concept-brief.md`

- 이 게임은 한 문장으로 무엇인가?
- 어떤 장르와 플랫폼인가?
- 누가, 얼마나 긴 세션으로 플레이하는가?
- 플레이어가 느껴야 할 핵심 판타지는 무엇인가?

`game-pillars.md`

- 이 게임에서 절대 흔들리면 안 되는 재미는 무엇인가?
- 기능을 넣거나 뺄 때 어떤 기준으로 판단하는가?
- 시스템 이름이 아니라 플레이어 경험으로 설명되어 있는가?

`core-loop.md`

- 플레이어는 30초마다 무엇을 하고 무엇을 얻는가?
- 5분 안에 어떤 성취와 선택이 있는가?
- 하루 또는 장기적으로 다시 돌아올 이유가 있는가?
- 실패했을 때 무엇을 잃고 무엇을 배우는가?

`system-overview.md`

- MVP에 반드시 필요한 Core 시스템은 무엇인가?
- Supporting 시스템은 어떤 Core 시스템을 보조하는가?
- Optional 시스템 중 MVP에서 제외 가능한 것은 무엇인가?
- 다음에 상세 규칙으로 내려갈 시스템은 무엇인가?

---

## 산출물 위치와 역할

| 경로                                        | 만드는 주체                              | 역할                                                                             |
| ------------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------- |
| `game-design/concept-brief.md`              | `game-director`, `game-concept-designer` | 게임의 정체성, 타겟, 핵심 판타지 정의                                            |
| `game-design/game-pillars.md`               | `game-director`                          | 전체 의사결정 기준이 되는 핵심 경험 정의                                         |
| `game-design/core-loop.md`                  | `game-director`                          | 시간 단위별 플레이 반복, 보상, 실패 조건 정의                                    |
| `game-design/system-overview.md`            | `game-director`                          | 시스템 목록, 우선순위, MVP 제외 가능 범위 정의                                   |
| `game-design/mvp-scope.md`                  | `production-scope-reviewer`              | Must / Later / Cut 기준으로 구현 범위 축소                                       |
| `game-design/rules/*.md`                    | `game-rules-designer`                    | 전투, 아이템, 스킬, 경제, 퀘스트 등 수치 기반 규칙                               |
| `game-design/systems/*.md`                  | `game-rules-designer`                    | 구현자가 읽는 시스템 개발 명세                                                   |
| `game-design/spreadsheets/*.csv`            | `spreadsheet-architect`                  | 아이템, 스킬, 드랍, 가격 등 데이터 테이블                                        |
| `game-design/spreadsheets/game-master.xlsx` | `spreadsheet-architect`                  | 주요 마스터 데이터를 묶은 스프레드시트                                           |
| `game-design/art/*.md`                      | `game-concept-designer`, `ui-planner`    | 아트 방향, 이미지 프롬프트, asset key map                                        |
| `ai/specs/ui/*.md`                          | `ui-planner`                             | 디자인 시스템, 화면 흐름, 상태, 데이터 요구사항                                  |
| `ai/specs/ui/user-flow-chart.md`            | `ui-planner`                             | 플레이어 목표별 화면 이동과 상태 전환을 Mermaid 등으로 정리한 사용자 플로우 차트 |
| `ai/specs/systems/*.md`                     | 필요 시 rules/system agent               | 시스템별 보조 개발 명세                                                          |
| `ai/reviews/balance/*.md`                   | `balance-reviewer`                       | 성장곡선, 보상량, 가격, 드랍률 검토                                              |
| `ai/reviews/production/*.md`                | `production-scope-reviewer`              | MVP 축소, 복잡도, 구현 순서 검토                                                 |
| `ai/reviews/visual/*.md`                    | `browser-preview-reviewer`               | 브라우저 preview, 반응형, 화면 상태 검토                                         |

모든 agent 산출물은 가능한 한 아래 frontmatter를 포함합니다.

```yaml
---
produced_by: game-director
depends_on:
  - game-design/concept-brief.md
next_step: game-rules-designer
---
```

---

## Agent 구성

| Agent                       | 역할                                                                         | 대표 출력                                                                               |
| --------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `game-director`             | 전체 방향, pillars, core loop, 시스템 목록                                   | `game-design/concept-brief.md`, `game-pillars.md`, `core-loop.md`, `system-overview.md` |
| `game-concept-designer`     | 세계관, 분위기, 플레이어 판타지, 아트 방향                                   | `game-design/art/*.md`                                                                  |
| `game-rules-designer`       | 전투/아이템/스킬/성장/보상/드랍/상점/퀘스트 규칙                             | `game-design/rules/*.md`, `game-design/systems/*.md`                                    |
| `production-scope-reviewer` | MVP 축소, 복잡도 평가, 구현 순서                                             | `game-design/mvp-scope.md`, `ai/reviews/production/*.md`                                |
| `spreadsheet-architect`     | 규칙을 데이터 테이블로 변환                                                  | `game-design/spreadsheets/*`                                                            |
| `balance-reviewer`          | 성장곡선, 보상량, 드랍률, 가격 검토                                          | `ai/reviews/balance/*.md`                                                               |
| `ui-planner`                | UI 디자인 시스템, 화면 흐름, 사용자 플로우 차트, 화면별 상태/데이터 요구사항 | `ai/specs/ui/*.md`                                                                      |
| `ui-implementer`            | Screen Spec/Design System 기반 실제 UI 구현                                  | `src/*`, `components/*`, `screens/*`, `tests/*`                                         |
| `browser-preview-reviewer`  | 브라우저 preview 상태와 반응형 검토                                          | `ai/reviews/visual/*.md`                                                                |

Agent 원본은 `agent-harness/agents/*.md`에 있습니다. Codex용 agent 원본은 `agent-harness/codex-agents/*.toml`에 있습니다.

---

## Skill 구성

| Skill                         | 호출 주체                                | 목적                                                        |
| ----------------------------- | ---------------------------------------- | ----------------------------------------------------------- |
| `game-concept-brief`          | `game-director`, `game-concept-designer` | 초기 컨셉을 정형 문서로 정리                                |
| `game-core-loop-design`       | `game-director`                          | 30초 / 5분 / 1일 / 장기 루프 정의                           |
| `game-rule-design`            | `game-rules-designer`                    | 시스템 규칙을 코드/시트화 가능한 형태로 설계                |
| `game-system-spec`            | `game-rules-designer`                    | 시스템을 개발 명세로 변환                                   |
| `game-mvp-scope`              | `production-scope-reviewer`              | 기획 범위를 실구현 가능한 MVP로 축소                        |
| `game-spreadsheet-authoring`  | `spreadsheet-architect`                  | 규칙과 MVP 범위를 데이터 테이블로 변환                      |
| `game-balance-review`         | `balance-reviewer`                       | 성장, 보상, 가격, 드랍률, 전투 시간 검토                    |
| `design-system-spec`          | `ui-planner`                             | UI 디자인 시스템 토큰과 컴포넌트 규칙 정의                  |
| `game-screen-spec`            | `ui-planner`                             | 화면별 상태, 데이터 요구사항, 인터랙션 명세                 |
| `game-image-prompt-pack`      | `game-concept-designer`, `ui-planner`    | Web LLM용 컨셉 이미지, UI mockup, 아이콘 시안 프롬프트 작성 |
| `game-ui-implementation`      | `ui-implementer`                         | 화면 명세와 디자인 시스템 기준으로 실제 UI 구현             |
| `game-browser-preview-review` | `browser-preview-reviewer`               | 브라우저 preview에서 상태와 반응형 검토                     |

Skill 원본은 `agent-harness/skills/<skill-name>/SKILL.md`에 있습니다.

---

## 저장소 구조

이 저장소는 하네스 원본입니다. 실제 게임 프로젝트가 다른 경로에 있다면 `scripts/sync-skills.sh`로 대상 프로젝트에 설치합니다.

```text
game-ai-agent/
  AGENTS.md
  CLAUDE.md
  GEMINI.md
  README.md
  agent-harness/
    agents/
    codex-agents/
    gemini-commands/
    skills/
  examples/
  prompts/
  scripts/
```

대상 게임 프로젝트에는 다음 구조가 생기거나 사용됩니다.

```text
game-project/
  AGENTS.md
  CLAUDE.md
  GEMINI.md
  game-design/
    concept-brief.md
    game-pillars.md
    core-loop.md
    system-overview.md
    mvp-scope.md
    rules/
    systems/
    spreadsheets/
    art/
  ai/
    specs/
      ui/
      systems/
    reviews/
      balance/
      production/
      visual/
  .claude/
  .agents/
  .codex/
  .gemini/
```

숨김 디렉토리의 `.claude/`, `.agents/`, `.codex/`, `.gemini/`는 대상 프로젝트용 생성물입니다. 원본을 고칠 때는 `agent-harness/` 아래 파일을 수정합니다.

---

## 설치와 동기화

하네스 저장소 루트에서 실행합니다.

```bash
bash scripts/sync-skills.sh --target /path/to/game-project --tool all
```

특정 도구만 설치할 수도 있습니다.

```bash
bash scripts/sync-skills.sh --target /path/to/game-project --tool claude
bash scripts/sync-skills.sh --target /path/to/game-project --tool codex
bash scripts/sync-skills.sh --target /path/to/game-project --tool gemini
```

동기화 결과:

| 도구                    | 생성 위치                                      |
| ----------------------- | ---------------------------------------------- |
| Claude Code agents      | `<target>/.claude/agents/*.md`                 |
| Claude Code skills      | `<target>/.claude/skills/<skill>/SKILL.md`     |
| Codex agents            | `<target>/.codex/agents/*.toml`                |
| Codex skills            | `<target>/.agents/skills/<skill>/SKILL.md`     |
| Gemini role definitions | `<target>/.gemini/agents/*.md`                 |
| Gemini commands         | `<target>/.gemini/commands/agents/*.toml`      |
| Gemini skills           | `<target>/.gemini/skills/<skill>/SKILL.md`     |
| 공통 지침               | `<target>/AGENTS.md`, `CLAUDE.md`, `GEMINI.md` |

하네스 변경 후 검증:

```bash
bash scripts/validate-harness.sh
```

---

## 시작 방법

첫 요청은 `game-director`로 시작합니다. 필수 입력 4개가 없으면 agent는 파일을 만들지 않고 질문해야 합니다.

필수 입력:

| 항목          | 예시                                                         |
| ------------- | ------------------------------------------------------------ |
| 장르          | 로그라이크 덱빌더, 방치형 RPG, 퍼즐 어드벤처                 |
| 플랫폼        | web, mobile, PC                                              |
| 핵심 재미     | 매 런마다 다른 덱을 짜는 재미, 클릭할수록 보상이 쌓이는 재미 |
| 타겟 플레이어 | 코어 게이머 30~60분 세션, 출퇴근 중 5분 캐주얼 유저          |

선택 입력:

| 항목             | 예시                                           |
| ---------------- | ---------------------------------------------- |
| 분위기/톤        | 밝고 귀여움, 축축한 지하세계, 고요한 SF        |
| 참고 게임        | Vampire Survivors, Slay the Spire, Inscryption |
| 피하고 싶은 요소 | PvP, 과금 상점, 복잡한 조작                    |

시작 프롬프트 예시:

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

더 자세한 시작 프롬프트는 [prompts/start-game-director.md](prompts/start-game-director.md)에 있습니다.

---

## 첫 산출물 확인 기준

`game-director`가 끝나면 아래를 확인합니다.

| 파일                             | 확인 기준                                                     |
| -------------------------------- | ------------------------------------------------------------- |
| `game-design/concept-brief.md`   | 한 줄 피치, 장르, 플랫폼, 타겟 플레이어, 핵심 판타지가 있는가 |
| `game-design/game-pillars.md`    | 3~5개 핵심 기둥이 시스템명이 아니라 경험으로 적혔는가         |
| `game-design/core-loop.md`       | 30초 / 5분 / 1일 또는 장기 루프와 실패 조건이 있는가          |
| `game-design/system-overview.md` | Core / Supporting / Optional 시스템 분류가 있는가             |

부족하면 다음 단계로 가지 말고 `game-director`에게 보완을 요청합니다.

---

## 도구별 호출 차이

| 구분            | Claude Code                       | Codex                               | Gemini CLI                             |
| --------------- | --------------------------------- | ----------------------------------- | -------------------------------------- |
| 역할 정의       | `.claude/agents/*.md` subagent    | `.codex/agents/*.toml` custom agent | `.gemini/agents/*.md` + custom command |
| Skill 위치      | `.claude/skills/<skill>/SKILL.md` | `.agents/skills/<skill>/SKILL.md`   | `.gemini/skills/<skill>/SKILL.md`      |
| 호출 방식       | `Use game-director subagent...`   | `game-director를 사용해서...`       | `/agents:game-director ...`            |
| 다음 agent 호출 | 사람이 직접 호출                  | 사람이 직접 호출                    | 사람이 직접 호출                       |

Gemini CLI에서 custom command를 쓰는 예:

```text
/agents:game-director 장르=로그라이크 덱빌더, 플랫폼=web, 핵심 재미=덱 빌딩 + 영구 성장, 타겟 플레이어=코어 게이머 30~60분 세션
```

---

## 하네스 구현 순서와 단계별 프롬프트

상세 프롬프트는 [prompts/start-game-director.md](prompts/start-game-director.md)의 `하네스 전체 실행 프롬프트` 섹션에 모았습니다.
README에는 실행 순서, 사용할 agent/skill, 산출물만 요약합니다.

| 순서 | 목적 | Agent | 사용하는 Skill | 핵심 산출물 |
|---|---|---|---|---|
| 1 | 게임 뼈대 생성 | `game-director` | `game-concept-brief`, `game-core-loop-design` | `game-design/concept-brief.md`, `game-pillars.md`, `core-loop.md`, `system-overview.md` |
| 2 | 세계관/아트 방향 | `game-concept-designer` | `game-concept-brief`, `game-image-prompt-pack` | `game-design/art/*.md` |
| 3 | 규칙 설계 | `game-rules-designer` | `game-rule-design` | `game-design/rules/*.md` |
| 4 | MVP 범위 축소 | `production-scope-reviewer` | `game-mvp-scope` | `game-design/mvp-scope.md`, `ai/reviews/production/*.md` |
| 5 | 데이터 테이블화 | `spreadsheet-architect` | `game-spreadsheet-authoring` | `game-design/spreadsheets/*` |
| 6 | 밸런스 검토 | `balance-reviewer` | `game-balance-review` | `ai/reviews/balance/*.md` |
| 7 | 시스템 개발 명세 | `game-rules-designer` | `game-system-spec` | `game-design/systems/*.md` |
| 8 | UI 명세와 사용자 플로우 차트 | `ui-planner` | `design-system-spec`, `game-screen-spec`, `game-image-prompt-pack` | `ai/specs/ui/*.md`, `ai/specs/ui/user-flow-chart.md` |
| 9 | 시각 자료 생성 | Web LLM | 없음 | 이미지, mockup, 레퍼런스 |
| 10 | UI 구현 | `ui-implementer` | `game-ui-implementation` | `src/*`, `components/*`, `screens/*`, `tests/*` |
| 11 | 브라우저 검토 | `browser-preview-reviewer` | `game-browser-preview-review` | `ai/reviews/visual/*.md` |

사용자 플로우 차트는 8단계에서 `ui-planner`가 작성합니다. `game-screen-spec`의 화면별 인터랙션/전환 조건을 바탕으로 `ai/specs/ui/user-flow-chart.md`에 Mermaid flowchart와 목표별 이동 경로를 남깁니다.

중요한 순서 제약:

- 3번 규칙 설계 이후에는 반드시 4번 MVP 범위 축소를 거칩니다.
- 4번 없이 5번 스프레드시트, 7번 시스템 명세, 10번 구현으로 넘어가지 않습니다.
- 10번 UI 구현은 7번 시스템 명세와 8번 UI 명세가 생긴 뒤에 시작합니다.

---

## 참고 링크

- Claude Code subagents: https://docs.anthropic.com/en/docs/claude-code/sub-agents
- Claude Code skills: https://docs.anthropic.com/en/docs/claude-code/skills
- Codex AGENTS.md: https://developers.openai.com/codex/guides/agents-md
- Codex skills: https://developers.openai.com/codex/skills
- Codex subagents: https://developers.openai.com/codex/subagents
- Gemini CLI skills: https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/skills.md
- Gemini CLI custom commands: https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/custom-commands.md
