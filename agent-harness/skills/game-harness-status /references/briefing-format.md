# Briefing Output Format

이 스킬이 사용자에게 답할 때 따르는 **출력 템플릿**. 매번 다른 형식으로 답하면 사용자가 진행 추이를 비교할 수 없으므로, 정해진 구조를 고수한다.

## 목차

1. 풀 브리핑 템플릿
2. 변형 — 짧은 답
3. 변형 — 단계 상세
4. 변형 — 빠진 파일 only
5. Edge case 처리
6. 톤과 표기법

---

## 1. 풀 브리핑 템플릿

기본 (특별한 요청 없을 때):

```markdown
## 게임 하네스 진행 상황

**프로젝트**: `<absolute path>`
**점검 일시**: YYYY-MM-DD HH:MM (작업 디렉토리 기준)

### 단계별 상태

| #   | 단계                          | 상태          | 산출물  | 비고                                         |
| --- | ----------------------------- | ------------- | ------- | -------------------------------------------- |
| 1   | game-director                 | 🟢 done        | 4/4     | 모든 뼈대 문서 OK                            |
| 2   | game-concept-designer         | 🟢 done        | 3 files | art/world.md, art/mood.md, art/characters.md |
| 3   | game-rules-designer (rules)   | 🟡 partial     | 2/3+    | combat.md, items.md ← economy.md 누락        |
| 4   | production-scope-reviewer     | ⚪ not-started | 0/2     | mvp-scope.md 없음                            |
| 5   | spreadsheet-architect         | 🔴 blocked     | 1 file  | items.csv 있지만 4단계 미완료 (게이트 위반)  |
| 6   | balance-reviewer              | ⚪ not-started | —       | 5단계 의존                                   |
| 7   | game-rules-designer (systems) | ⚪ not-started | —       | 4 + 6 의존                                   |
| 8   | ui-planner                    | ⚪ not-started | —       | 7 의존                                       |
| 9   | Web LLM visuals               | ⚪ not-started | —       | 사람이 직접 (자동 점검 불가)                 |
| 10  | ui-implementer                | ⚪ not-started | —       | 7 + 8 의존                                   |
| 11  | browser-preview-reviewer      | ⚪ not-started | —       | 10 의존                                      |

### ⚠️ 게이트 위반

- **G2 위반**: 5단계(spreadsheet-architect)가 4단계(MVP 검토) 없이 진행됨.
  - 영향: README "MVP 범위 검토 없이 스프레드시트, 시스템 명세, 구현으로 넘어가지 않습니다" 원칙 위반.
  - 권장: 5단계 산출물(`game-design/spreadsheets/items.csv`)을 잠시 보류하고 4단계 먼저 완료.

### 빠진 파일

3단계 — `game-rules-designer (rules)`:
- ❌ `game-design/rules/economy.md` (또는 다른 경제 관련 규칙 문서)

4단계 — `production-scope-reviewer`:
- ❌ `game-design/mvp-scope.md`
- ❌ `ai/reviews/production/*.md` (최소 1개)

### Frontmatter 검증

- ✅ `game-design/concept-brief.md` — produced_by, depends_on, next_step OK
- ✅ `game-design/game-pillars.md` — OK
- ⚠️ `game-design/rules/combat.md` — `next_step` 누락
- ⚠️ `game-design/rules/items.md` — frontmatter 자체 누락

### 다음 액션 (한 개만)

⏳ **3단계를 마저 완료한 다음 `production-scope-reviewer`를 호출하세요.**

호출 예시 (Claude Code):
> Use game-rules-designer subagent to add the missing economy rule file.

3단계 완료 후:
> Use production-scope-reviewer subagent to review game-design/rules/* and produce mvp-scope.md.

이 단계 통과 후 5단계 산출물의 게이트 위반이 해소됩니다.

### [자동 점검 한계]

- 9단계(Web LLM visuals)는 file-presence로 판단 불가 — 진행하셨다면 알려주세요.
- 파일 존재만 확인 — 내용 품질 / 일관성은 각 reviewer agent의 영역.
```

### 1.1 표 컬럼 의미

- **#**: 단계 번호 (1-11).
- **단계**: agent 이름 (또는 "Web LLM" for 9단계).
- **상태**: 5종 이모지 + 텍스트.
  - 🟢 done — 모든 필수 expected files 존재 + frontmatter OK
  - 🟡 partial — 일부 누락 또는 frontmatter 불완전
  - 🔴 blocked — 게이트 위반 또는 의존성 미충족
  - ⚪ not-started — 시작 안 됨
  - ⏳ next-up — not-started 중 다음 차례 (다음 액션 표시)
- **산출물**: `done/total` 또는 파일 수.
- **비고**: 구체 파일명 또는 위반 / 누락 사유.

### 1.2 항상 포함

- 단계별 상태 표
- 다음 액션 (한 개)

### 1.3 조건부 포함

- **게이트 위반 절**: 위반 있을 때만. 없으면 절 자체를 빼고 "✅ 게이트 위반 없음" 한 줄로.
- **빠진 파일 절**: not-started/partial 단계가 있을 때만.
- **Frontmatter 검증 절**: frontmatter 이슈가 있을 때만.
- **자동 점검 한계 절**: 9단계 영향을 받거나 매니페스트 한계가 의미 있을 때.

---

## 2. 변형 — 짧은 답

사용자가 "한 줄로", "짧게", "간단히"라고 명시한 경우만:

```markdown
**현재**: 3단계 진행 중 (rules/economy.md 누락) · **다음**: 누락 파일 채운 뒤 production-scope-reviewer · **⚠️ 게이트 위반 1개** (5단계가 4단계 없이 진행)
```

원칙: **게이트 위반은 짧은 답에서도 절대 빼지 않는다**. 정보 손실의 우선순위 — 디테일은 줄여도 위반은 항상 노출.

---

## 3. 변형 — 단계 상세

사용자가 특정 단계를 묻는 경우 ("4단계 어때?", "MVP 검토 상태"):

```markdown
## 4단계 — production-scope-reviewer

**상태**: ⚪ not-started
**의존 단계**: 3단계 (game-rules-designer rules) — 🟡 partial
**다음 단계**: 5단계 (spreadsheet-architect)

### 필요 산출물

- ❌ `game-design/mvp-scope.md` (필수, single)
  - 기대 내용: Must / Later / Cut 분류
- ❌ `ai/reviews/production/*.md` (필수, 최소 1개)
  - 일반 파일명: initial-review.md, scope-review.md
  - 기대 frontmatter: produced_by: production-scope-reviewer

### 시작 가능?

3단계가 partial 상태라 권장하지 않음. 먼저 3단계 누락 파일 채우기:
- `game-design/rules/economy.md`

### 호출 방법

3단계 정리 후:
> Use production-scope-reviewer subagent to review game-design/rules/ and game-design/system-overview.md, then produce game-design/mvp-scope.md following the Must/Later/Cut framework. Use the game-mvp-scope skill.
```

---

## 4. 변형 — 빠진 파일 only

사용자가 "뭐 빠졌어?", "what's missing"이라고 단순 질문하면 빠진 파일에 집중:

```markdown
## 빠진 파일

총 3개의 필수 파일과 선택 파일 일부가 누락됨.

### 3단계 — 규칙 설계
- ❌ `game-design/rules/economy.md`

### 4단계 — MVP 범위
- ❌ `game-design/mvp-scope.md`
- ❌ `ai/reviews/production/*.md` (최소 1개)

### 다음 차례

가장 빠른 누락은 **3단계의 economy.md**. 이걸 채운 뒤 4단계 진입.

⚠️ 5단계 산출물(items.csv)이 이미 존재하지만 4단계 미완료 — 게이트 위반 상태입니다.
```

---

## 5. Edge case 처리

### 5.1 하네스가 아닌 디렉토리

`game-design/` 폴더가 없거나 `CLAUDE.md`/`AGENTS.md`/`GEMINI.md`에 하네스 흔적이 없으면:

```markdown
이 디렉토리에서 game-ai-agent 하네스 프로젝트를 찾지 못했습니다.

확인 사항:
- 작업 디렉토리: `<path>`
- `game-design/` 폴더 없음
- `CLAUDE.md` / `AGENTS.md` / `GEMINI.md` 중 하나도 하네스 안내 없음

다른 디렉토리를 점검하시겠습니까? (예: 게임 프로젝트 루트 경로)

또는 새 프로젝트를 시작하려면 하네스 동기화 먼저:
```
bash /path/to/game-ai-agent/scripts/sync-skills.sh --target /your/project --tool all
```
이후 game-director 호출로 1단계 시작.
```

### 5.2 디렉토리는 있지만 텅 빈 경우

`game-design/` 존재하지만 안에 파일 없음:

```markdown
## 게임 하네스 진행 상황

**프로젝트**: `<path>`
**상태**: 하네스는 설치됐지만 산출물 0개

모든 단계가 ⚪ not-started 상태입니다.

### 다음 액션

⏳ **1단계 — `game-director`로 시작하세요.**

필수 입력 4종이 준비됐는지 확인:
- 장르
- 플랫폼 (web / mobile / PC)
- 핵심 재미
- 타겟 플레이어

호출 예시:
> Use game-director subagent to create the foundational game design documents (concept-brief, game-pillars, core-loop, system-overview). Inputs: ...

상세는 `prompts/start-game-director.md` 참조.
```

### 5.3 frontmatter 누락

파일은 있는데 frontmatter가 없거나 불완전한 경우 — `partial` 처리하고 어느 필드가 빠졌는지 명시:

```markdown
| 3 | game-rules-designer (rules) | 🟡 partial | 3 files | combat.md (frontmatter OK), items.md (frontmatter 누락), skills.md (next_step 누락) |
```

### 5.4 의도치 않은 파일 (orphan)

매니페스트에 없는데 `game-design/` / `ai/`에 있는 파일은:

```markdown
### 매니페스트 외 파일 (참고)

- `game-design/notes.md` — 매니페스트에 정의되지 않음. 임시 메모로 추측. 무시 가능.
- `ai/specs/ui/old-design.md` — `produced_by: ui-planner`이지만 `user-flow-chart.md`와 별개. 점검 안 함.
```

비판하지 말 것 — 사용자가 임시 메모를 두는 건 자유. **단, "이게 매니페스트엔 없다"만 알린다.**

### 5.5 Stub 파일 (빈 파일 / 거의 빈 파일)

파일은 있는데 내용이 거의 없는 경우. 점검 휴리스틱:
- 50바이트 미만 → "stub 또는 빈 파일"
- frontmatter만 있고 본문이 없으면 → "frontmatter only stub"

```markdown
| 1 | game-director | 🟡 partial | 4 files | concept-brief.md (stub - 50 bytes), 나머지는 OK |
```

### 5.6 매니페스트 충돌

frontmatter의 `produced_by`가 매니페스트와 다른 경우 (예: `produced_by: game-director`인데 `rules/combat.md`에 있음):

```markdown
### Frontmatter 충돌

- ⚠️ `game-design/rules/combat.md` — frontmatter `produced_by: game-director`, 매니페스트 기대값은 `game-rules-designer`. 잘못된 agent가 생성했을 가능성. 검토 권장.
```

### 5.7 9단계 — 사용자에게 묻기

8단계 done + 10단계 시작 사이라면:

```markdown
| 9 | Web LLM visuals | ⚠️ 사용자 확인 필요 | — | file-presence로 판단 불가 |
```

브리핑 끝에:

```markdown
### 사용자 확인 요청

9단계 (Web LLM 시각 자료 생성)는 자동 점검할 수 없습니다. 진행하셨나요?
- 진행했다면 → "9단계 완료" 라고 알려주시면 다음 점검부터 done으로 표시
- 안 했다면 → 8단계 명세를 바탕으로 Web LLM에서 컨셉 이미지 / mockup / 아이콘 생성 후 진행
```

### 5.8 매우 큰 프로젝트 (파일 수십 개+)

산출물이 많아 표가 너무 길어지면 단계별로 접거나 요약:

```markdown
| 5 | spreadsheet-architect | 🟢 done | 12 files | items, skills, drops, shop, growth, enemies, levels, recipes, dialogue, quests, vendors, daily-rewards 모두 존재 |
```

12개 파일을 한 줄에 요약. 사용자가 더 자세히 원하면 5단계 상세 (§3) 호출.

---

## 6. 톤과 표기법

### 6.1 톤

- **사실 보고 우선**, 평가 / 의견 최소화.
- "잘 가고 있어요!" / "이대로 가면 위험합니다" 같은 감정적 평가 X.
- 게이트 위반은 **사실로** 알린다 — "G2 위반: 4단계 미완료인데 5단계 진행됨." 비난 X.
- 다음 액션은 **명령형이 아닌 안내형** — "호출하세요" / "진행하실 차례입니다".

### 6.2 표기

- **체크박스 이모지**: 🟢🟡🔴⚪⏳ — 컬러 의미 일관 유지 (다른 곳에서 다르게 쓰지 말 것).
- **경고 이모지**: ⚠️ — 게이트 위반, frontmatter 충돌 등.
- **차단 이모지**: ❌ — 누락된 파일.
- **확인 이모지**: ✅ — 정상 / 검증 통과.
- **백틱**: 파일 경로, 명령, agent 이름은 모두 백틱.
- **굵은 글씨**: 다음 액션의 핵심 동사, 게이트 위반 헤딩.

### 6.3 길이

- 풀 브리핑은 1-2 화면 분량 (스크롤 1회 이내).
- 30개 이상 파일이면 단계별 접기 / 요약 (5.8 참조).
- 짧은 답은 1-2줄.
- 단계 상세는 화면 절반 이내.

### 6.4 한국어 / 영어 혼용

- 본문: 한국어 (사용자가 한국어로 물었을 때).
- 식별자: 영어 그대로 (`game-director`, `production-scope-reviewer`, `concept-brief.md`) — 번역하지 마.
- 사용자가 영어로 물으면 영어로 답.

---

## 7. 출력 후 — 끝낸다

브리핑 끝에 "더 도와드릴까요?" 같은 follow-up 질문 안 한다. 사용자가 다음 행동을 결정. 이 스킬은 **상태 보고**까지가 책임.

예외: 9단계 사용자 확인 (5.7) 같이 사용자 입력이 필요한 자리.