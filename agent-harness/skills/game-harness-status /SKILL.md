---
name: game-harness-status
description: "When the user asks about the current progress, state, or next step of a game-ai-agent harness project (silbaram/game-ai-agent), brief them on the 11-stage pipeline (game-director → game-concept-designer → game-rules-designer → production-scope-reviewer → spreadsheet-architect → balance-reviewer → systems → ui-planner → web-llm visuals → ui-implementer → browser-preview-reviewer). Trigger on Korean phrases like '지금 어디까지', '진도', '현재 상황', '뭐 빠졌어', '다음 뭐 해', '브리핑', '상태', '체크', '점검', and English equivalents (status, progress, where are we, what's missing, next step). Also trigger when game-design/, ai/specs/, or ai/reviews/ paths are referenced or when the project's CLAUDE.md / AGENTS.md / GEMINI.md indicates a game-ai-agent harness. Skill checks file existence against the pipeline manifest, parses frontmatter (produced_by / depends_on / next_step), validates gate rules, and outputs a structured briefing with stage status, missing files, blocked dependencies, and recommended next agent to invoke."
---

# Game Harness Status Briefer

이 스킬은 **silbaram/game-ai-agent** 하네스를 사용하는 게임 프로젝트의 **진행 상황을 점검하고 브리핑**한다. 사용자가 "지금 어디까지 됐어?", "다음 뭐 해야 해?", "빠진 거 뭐 있어?" 같은 질문을 하면 트리거된다.

이 스킬은 자체 의견을 만들지 않는다 — 하네스가 정의한 11단계 파이프라인과 산출물 매니페스트를 **사실 그대로 비교**해 보고한다. 의견(다음에 뭘 만들지, 어떤 방향으로 갈지)은 해당 단계의 agent (`game-director`, `game-rules-designer` 등)가 낼 일이다.

---

## 0. 언제 트리거되는가

다음 신호 중 하나라도 있으면 즉시 발동:

- **한국어 트리거**: "지금 어디", "진도", "현재 상황", "뭐 빠졌어", "다음 뭐 해", "브리핑", "상태", "체크", "점검", "어디까지 됐어", "뭐부터", "남은 게"
- **영어 트리거**: "status", "progress", "where are we", "what's missing", "next step", "what's left", "briefing"
- **경로 신호**: 사용자가 `game-design/`, `ai/specs/`, `ai/reviews/`, `concept-brief.md`, `core-loop.md`, `mvp-scope.md` 등을 언급
- **하네스 식별**: 프로젝트 루트에 `CLAUDE.md`, `AGENTS.md`, `GEMINI.md` 중 하나가 있고 그 안에 `game-design`, `agent-harness`, `production-scope-reviewer` 같은 키워드 등장
- **암시적 신호**: 사용자가 "내 게임 프로젝트", "기획", "MVP" 같은 단어를 쓰면서 작업 디렉토리에 `game-design/` 폴더가 있을 때

**트리거 안 됨**: 일반 코딩 질문, 새 게임 기획 시작 (그건 `game-director` 호출), 단일 파일 작성 (그건 해당 agent 호출).

---

## 1. 핵심 워크플로우

사용자 질문이 들어오면 정확히 이 순서로:

```
1. 프로젝트 루트 확인
   └─ CLAUDE.md / AGENTS.md / GEMINI.md 존재 여부
   └─ game-design/ 디렉토리 존재 여부
   └─ 아니면 → "여긴 game-ai-agent 하네스 프로젝트가 아닌 것 같아요" 안내 후 종료

2. 매니페스트와 실제 파일 시스템 대조
   └─ 11단계 각 expected files 존재 / 누락 판정
   └─ 존재하는 파일은 frontmatter 파싱 (produced_by, depends_on, next_step)
   └─ depends_on 체인을 따라 stale / orphan 검출

3. 단계별 상태 판정 (5가지 중 하나)
   └─ 🟢 done       — expected files 모두 존재 + frontmatter 정상
   └─ 🟡 partial    — 일부 파일만 존재 또는 frontmatter 누락
   └─ 🔴 blocked    — 의존하는 이전 단계가 done이 아닌데 이 단계 산출물 존재 (게이트 위반)
   └─ ⚪ not-started — 파일 없음, 이전 단계는 done
   └─ ⏳ next-up    — not-started 중 가장 빠른 단계 (사용자가 다음에 할 일)

4. 게이트 규칙 검증
   └─ 3단계(rules) → 4단계(mvp-scope) 게이트
   └─ 4단계 없이 5/7/10 진행 검출
   └─ 10단계(ui-implementer)가 7+8 없이 진행됐는지

5. 브리핑 출력
   └─ references/briefing-format.md 의 형식 따름
   └─ 단계 표 + 빠진 파일 + 게이트 위반 + 다음 액션
```

**상세 매니페스트 / 게이트 규칙은 `references/pipeline-manifest.md` 참조** — 이 SKILL.md를 짧게 유지하기 위해 거기에 모았다.
**브리핑 출력 포맷은 `references/briefing-format.md` 참조** — 일관된 형식으로 답해야 사용자가 매번 비교 가능하다.

---

## 2. 의사결정 원칙

충돌 시 우선순위:

1. **사실 보고가 우선, 권유는 그 다음.** "concept-brief.md가 없습니다"가 먼저, "그러니 game-director를 호출하세요"가 그 다음. 추측해서 사실인 것처럼 말하지 않는다.
2. **있는 그대로.** 파일이 있어도 내용이 빈 stub이면 stub이라고 말한다. 자동으로 "있다=완료"라고 판정하지 않는다.
3. **게이트 위반은 강조해서 알린다.** 단순 누락보다 위험. MVP 검토 없이 스프레드시트로 갔다면 빨간색.
4. **다음 액션은 한 개만 추천.** 11단계 다음에 뭘 해야 한다고 길게 늘어놓지 않는다 — 가장 빠른 미완료 단계 하나.
5. **의견은 agent에 위임.** "이 게임은 이 방향이 좋겠어요"는 status briefer가 할 말이 아니다. "다음 단계는 `production-scope-reviewer`를 호출하는 것"까지가 한계.

---

## 3. 트리거 후 첫 액션 — 무조건 디렉토리 스캔

이 스킬이 활성화됐다는 건 사용자가 **현재 상태**를 알고 싶다는 뜻이다. 추측 답변 금지. 즉시 파일 시스템 점검:

```bash
# 1. 하네스 식별
ls -la /path/to/project/{CLAUDE.md,AGENTS.md,GEMINI.md} 2>/dev/null
test -d /path/to/project/game-design && echo "harness detected"

# 2. 산출물 디렉토리 트리
find /path/to/project/game-design /path/to/project/ai -type f \
  \( -name "*.md" -o -name "*.csv" -o -name "*.xlsx" \) 2>/dev/null

# 3. 각 파일의 frontmatter (있으면)
head -10 /path/to/project/game-design/concept-brief.md
# ... 등 매니페스트의 모든 expected file
```

작업 디렉토리가 명시되지 않았으면 **물어본다**:

> "어느 게임 프로젝트 디렉토리를 점검할까요? (예: `~/projects/my-game`)"

**디렉토리 정보 없이 추측해서 답하지 않는다.** "보통은 이러이러한 상태일 겁니다"는 잘못된 답.

---

## 4. 브리핑 출력 — 항상 같은 형식

매번 다른 형식으로 답하면 사용자가 진행 추이를 비교할 수 없다. **이 형식을 고수**:

```
## 게임 하네스 진행 상황

**프로젝트**: <path>
**점검 일시**: <YYYY-MM-DD HH:MM>

### 단계별 상태

| # | 단계 | 상태 | 산출물 | 비고 |
|---|---|---|---|---|
| 1 | game-director | 🟢 done | 4/4 | concept-brief, pillars, core-loop, system-overview |
| 2 | game-concept-designer | 🟢 done | 3/N | art/world.md, art/characters.md, art/mood.md |
| 3 | game-rules-designer (rules) | 🟡 partial | 2/3 | rules/combat.md, rules/items.md ← rules/economy.md 누락 |
| 4 | production-scope-reviewer | ⚪ not-started | 0/2 | mvp-scope.md, ai/reviews/production/ |
| 5 | spreadsheet-architect | 🔴 blocked | 1/N | items.csv가 있지만 4단계 미완료 — 게이트 위반 |
| ... | ... | ... | ... | ... |

### 게이트 위반

- ⚠️ 5단계가 4단계(MVP 검토) 없이 진행됨. README 규칙 위반.
  - 권장: 5단계 산출물을 잠시 보류하고 `production-scope-reviewer` 먼저 호출.

### 빠진 파일

- `game-design/rules/economy.md` (3단계)
- `game-design/mvp-scope.md` (4단계)
- `ai/reviews/production/initial-review.md` (4단계)

### 다음 액션 (한 개만)

⏳ **`production-scope-reviewer`를 호출하세요.**

호출 예시 (Claude Code):
> Use production-scope-reviewer subagent to review the rules in game-design/rules/* and produce game-design/mvp-scope.md.

이 단계 통과 후 5단계(spreadsheet-architect)로 넘어갑니다.
```

상세는 `references/briefing-format.md` — 디테일 (frontmatter 검증 결과 표시, stub 파일 경고, 의존성 그래프 텍스트 표현 등) 포함.

---

## 5. 자주 묻는 변형 질문 — 핵심만 골라서 답

같은 status 데이터지만 사용자가 묻는 각도가 다를 수 있다. 모든 답은 §4 형식의 **부분집합** — 새 형식을 만들지 말 것:

| 사용자 질문 | 답에 포함할 것 |
|---|---|
| "지금 어디까지 됐어?" | 단계별 상태 표 + 다음 액션 |
| "다음 뭐 해야 해?" | 다음 액션 + 그 단계의 expected output |
| "빠진 거 뭐야?" | 빠진 파일 목록 + 그것이 어느 단계에 속하는지 |
| "괜찮게 가고 있어?" | 게이트 위반 (있으면) + 단계별 상태 요약 |
| "특정 단계 X 어때?" | X 단계만 상세 (해당 expected files 각각의 상태) |
| "짧게" / "한 줄로" | "현재 N단계 진행중, 다음은 M단계" + 게이트 위반 있으면 한 줄 |

**원칙**: 풀 브리핑이 디폴트. 사용자가 짧게 원하면 줄인다. 사용자가 풀 브리핑 안 부탁했다고 임의로 줄이지 않는다 — 정보 손실이 더 위험.

---

## 6. 점검 한계 — 할 수 없는 것

이 스킬은 **파일 존재 + frontmatter + 게이트 규칙**까지 본다. 다음은 **하지 않는다**:

- **내용 품질 평가** — concept-brief에 "한 줄 피치"가 의미 있는지, core-loop이 게임으로 성립하는지 등은 판단 안 함. 그건 각 agent의 reviewer 역할.
- **파일 간 일관성** — rules/combat.md의 데미지 공식이 spreadsheets/skills.csv와 일치하는지 등은 `balance-reviewer` 영역.
- **밸런스 / 디자인 의견** — "이 게임은 좀 더 단순해야 할 것 같아요"는 절대 안 함.
- **자동 진행** — "다음 agent를 자동으로 호출할게요" 안 함. 사용자가 직접 호출. 하네스 README 원칙: "Agent끼리는 자동으로 다음 agent를 호출하지 않습니다."

이 경계를 흐리면 status briefer가 또 다른 agent가 되어버린다. 본분은 **상태 보고**에 한정.

---

## 7. 새 산출물 / 단계 추가 시

하네스가 진화해 새 단계나 파일이 추가되면 (예: 12단계 추가, 새 reviewer agent), `references/pipeline-manifest.md`만 업데이트하면 이 스킬이 자동으로 새 단계를 점검한다. SKILL.md는 손대지 마라 — 워크플로우는 그대로 작동한다.

매니페스트 업데이트 시 검증할 것:
- 새 단계의 `produced_by`, `depends_on`, `next_step` 명시
- 게이트 규칙이 있으면 명시 (예: "9단계 visuals는 8단계 ui-planner 다음")
- 산출물 경로가 다른 단계와 충돌하지 않는지

---

## 8. 참조 파일

- **`references/pipeline-manifest.md`** — 11단계 expected files 전체 목록, frontmatter 규칙, depends_on 그래프, 게이트 규칙. 이 스킬이 점검할 모든 데이터의 source of truth.
- **`references/briefing-format.md`** — 출력 템플릿 풀 버전, 변형 (짧은 답, 단계 상세 등), edge case (하네스가 아닌 디렉토리, 빈 프로젝트, 미완료 frontmatter 등) 처리.

---

## 자매 스킬 / 외부 참조

- 하네스 본체: <https://github.com/silbaram/game-ai-agent>
- 이 스킬은 11단계 파이프라인의 **상태 보고자**. 각 단계 작업은 해당 agent가 한다.
- README의 "도구별 호출 차이" 절을 따라 사용자가 직접 다음 agent를 호출하도록 안내 — 자동 호출 금지.
- 이 스킬을 하네스 repo에 subagent로 통합하려면 별도 `INTEGRATION-GUIDE.md` 참조 (Claude Code / Codex / Gemini CLI 정의 + sync 가이드).