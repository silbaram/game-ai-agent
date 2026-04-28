# Pipeline Manifest

이 파일은 `game-ai-agent` 하네스의 **11단계 파이프라인을 정형 데이터로** 담는다. SKILL.md의 점검 워크플로우는 이 매니페스트를 읽고 실제 파일 시스템과 대조한다.

하네스가 변경되면 이 파일만 업데이트하면 됨. SKILL.md는 손대지 않는다.

source: <https://github.com/silbaram/game-ai-agent> (README.md, 2026-04 시점).

---

## 매니페스트 구조

각 단계는 다음 항목을 가진다:

- **stage**: 1-11 정수
- **agent**: 호출되는 subagent 이름
- **skills_used**: 그 agent가 사용하는 skill 이름들
- **expected_files**: 생성되어야 할 파일 경로들
  - `glob` 표시는 패턴, `count_at_least` 명시
  - `single` 표시는 정확히 그 한 파일
- **frontmatter_required**: 산출물에 들어가야 할 frontmatter 필드들
- **depends_on**: 시작 전 완료되어야 할 이전 단계
- **gates**: 이 단계 통과 전후로 강제되는 규칙 (있으면)
- **next**: 정상 흐름의 다음 단계

---

## 1단계 — 게임 뼈대 생성

```yaml
stage: 1
agent: game-director
skills_used:
  - game-concept-brief
  - game-core-loop-design
expected_files:
  - path: game-design/concept-brief.md
    kind: single
  - path: game-design/game-pillars.md
    kind: single
  - path: game-design/core-loop.md
    kind: single
  - path: game-design/system-overview.md
    kind: single
frontmatter_required:
  - produced_by: game-director
  - depends_on: []                 # 1단계는 초기 단계
  - next_step: game-concept-designer
depends_on: []
gates:
  - prerequisite: 사용자 필수입력 4종 (장르, 플랫폼, 핵심 재미, 타겟 플레이어)
next: 2
```

**확인 기준** (README "첫 산출물 확인 기준"에서):

- `concept-brief.md`: 한 줄 피치 / 장르 / 플랫폼 / 타겟 / 핵심 판타지 포함
- `game-pillars.md`: 3-5개 핵심 기둥, 시스템명이 아닌 경험으로 작성
- `core-loop.md`: 30초 / 5분 / 1일(또는 장기) 루프, 실패 조건 포함
- `system-overview.md`: Core / Supporting / Optional 시스템 분류

---

## 2단계 — 세계관 / 아트 방향

```yaml
stage: 2
agent: game-concept-designer
skills_used:
  - game-concept-brief
  - game-image-prompt-pack
expected_files:
  - path: game-design/art/*.md
    kind: glob
    count_at_least: 1
    common_filenames:
      - world.md
      - mood.md
      - characters.md
      - art-direction.md
frontmatter_required:
  - produced_by: game-concept-designer
  - depends_on: [game-design/concept-brief.md, game-design/game-pillars.md]
  - next_step: game-rules-designer
depends_on: [1]
gates: []
next: 3
```

---

## 3단계 — 시스템 규칙 설계

```yaml
stage: 3
agent: game-rules-designer
skills_used:
  - game-rule-design
expected_files:
  - path: game-design/rules/*.md
    kind: glob
    count_at_least: 1
    common_filenames:
      - combat.md
      - items.md
      - skills.md
      - economy.md
      - quests.md
      - growth.md
      - drops.md
      - shop.md
frontmatter_required:
  - produced_by: game-rules-designer
  - depends_on: [game-design/system-overview.md, game-design/core-loop.md]
  - next_step: production-scope-reviewer
depends_on: [1]
gates:
  - post: 4단계(production-scope-reviewer) 없이 5/7/10 진행 금지
content_signals:
  - 숫자 (수치 / 공식)
  - 입력
  - 결과
  - 실패 조건
next: 4
```

**중요한 게이트**: 이 단계 통과 후 반드시 4단계로. 5/7/10단계가 4단계보다 먼저 산출물을 갖고 있으면 **게이트 위반**.

---

## 4단계 — MVP 범위 축소

```yaml
stage: 4
agent: production-scope-reviewer
skills_used:
  - game-mvp-scope
expected_files:
  - path: game-design/mvp-scope.md
    kind: single
  - path: ai/reviews/production/*.md
    kind: glob
    count_at_least: 1
    common_filenames:
      - initial-review.md
      - scope-review.md
frontmatter_required:
  - produced_by: production-scope-reviewer
  - depends_on: [game-design/rules/, game-design/system-overview.md]
  - next_step: spreadsheet-architect
depends_on: [3]
gates:
  - post: 5/7/10단계 진입을 위한 필수 게이트
content_signals:
  - Must / Later / Cut 분류
next: 5
```

---

## 5단계 — 데이터 테이블화

```yaml
stage: 5
agent: spreadsheet-architect
skills_used:
  - game-spreadsheet-authoring
expected_files:
  - path: game-design/spreadsheets/*.csv
    kind: glob
    count_at_least: 1
    common_filenames:
      - items.csv
      - skills.csv
      - drops.csv
      - shop.csv
      - growth.csv
      - enemies.csv
  - path: game-design/spreadsheets/game-master.xlsx
    kind: single
    optional: true
frontmatter_required: []          # CSV는 frontmatter 없음, xlsx도 없음
depends_on: [4]
gates:
  - prerequisite: 4단계 mvp-scope.md 존재 + done
content_signals:
  - MVP에 남은 규칙만 테이블화 (Cut된 규칙은 제외)
next: 6
```

---

## 6단계 — 숫자 검토

```yaml
stage: 6
agent: balance-reviewer
skills_used:
  - game-balance-review
expected_files:
  - path: ai/reviews/balance/*.md
    kind: glob
    count_at_least: 1
    common_filenames:
      - growth-curve.md
      - reward-curve.md
      - economy.md
      - drop-rate.md
      - combat-time.md
frontmatter_required:
  - produced_by: balance-reviewer
  - depends_on: [game-design/spreadsheets/]
  - next_step: game-rules-designer       # 7단계는 같은 agent로 돌아감
depends_on: [5]
gates: []
content_signals:
  - 성장 / 보상 / 가격 / 드랍률 이상치 기록
next: 7
```

---

## 7단계 — 시스템 개발 명세

```yaml
stage: 7
agent: game-rules-designer
skills_used:
  - game-system-spec
expected_files:
  - path: game-design/systems/*.md
    kind: glob
    count_at_least: 1
    common_filenames:
      - combat-system.md
      - inventory-system.md
      - quest-system.md
      - economy-system.md
      - save-system.md
  - path: ai/specs/systems/*.md
    kind: glob
    optional: true                 # 보조 명세, 필수 아님
frontmatter_required:
  - produced_by: game-rules-designer
  - depends_on: [game-design/rules/, game-design/spreadsheets/, ai/reviews/balance/]
  - next_step: ui-planner
depends_on: [4, 6]
gates:
  - prerequisite: 4단계 + 6단계 모두 done
content_signals:
  - 구현자가 추측 없이 읽을 수 있는 수준
next: 8
```

---

## 8단계 — UI 명세 + 사용자 플로우 차트

```yaml
stage: 8
agent: ui-planner
skills_used:
  - design-system-spec
  - game-screen-spec
  - game-image-prompt-pack
expected_files:
  - path: ai/specs/ui/*.md
    kind: glob
    count_at_least: 2              # design system + 최소 화면 1개
    common_filenames:
      - design-system.md
      - screen-title.md
      - screen-game.md
      - screen-game-over.md
      - screen-shop.md
      - screen-inventory.md
  - path: ai/specs/ui/user-flow-chart.md
    kind: single                   # 명시적 필수 — README에서 강조됨
frontmatter_required:
  - produced_by: ui-planner
  - depends_on: [game-design/systems/, game-design/concept-brief.md]
  - next_step: web-llm-visuals     # 9단계는 사람이 진행 (Web LLM)
depends_on: [7]
gates: []
content_signals:
  - 화면별 상태, 데이터 요구사항, 인터랙션
  - Mermaid 등으로 사용자 플로우 차트 작성
next: 9
```

---

## 9단계 — 시각 자료 생성 (Web LLM, 사람이 진행)

```yaml
stage: 9
agent: null                        # 사람이 직접 Web LLM 사용
skills_used: []
expected_files:
  - path: game-design/art/visuals/*
    kind: glob
    optional: true                 # 위치는 프로젝트마다 다를 수 있음
    common_filenames:
      - concept-images/
      - ui-mockups/
      - icon-drafts/
frontmatter_required: []
depends_on: [8]
gates:
  - note: 결과물을 문서 명세로 변환한 뒤 사용 (README 원칙)
next: 10
note: |
  이 단계는 자동 점검이 어렵다. 사용자에게 "9단계 visuals는 진행하셨습니까?"
  라고 묻고, "예" 응답 시 done으로 간주. 파일 시스템에 명확한 매니페스트 없음.
```

**점검 시 처리**: 9단계는 file-presence로 판단 못함. 8단계 완료 + 10단계 시작 사이라면 "9단계는 사용자 확인 필요"로 표시.

---

## 10단계 — UI 구현

```yaml
stage: 10
agent: ui-implementer
skills_used:
  - game-ui-implementation
expected_files:
  - path: src/**/*
    kind: glob
    count_at_least: 1
  - path: components/**/*
    kind: glob
    optional: true                 # 프레임워크에 따라
  - path: screens/**/*
    kind: glob
    optional: true
  - path: tests/**/*
    kind: glob
    optional: true
frontmatter_required: []           # 코드 파일에는 frontmatter 없음
depends_on: [7, 8]
gates:
  - prerequisite: 7단계 systems + 8단계 ui specs 모두 done
content_signals:
  - 시스템 명세 + UI 명세대로 구현
next: 11
note: |
  src/ / components/ / screens/ 등의 경로는 프로젝트 구조에 따라 다름.
  프로젝트 루트에 package.json / Cargo.toml / pyproject.toml 등이 있고
  관련 소스 디렉토리에 파일이 있으면 partial 이상으로 간주.
```

---

## 11단계 — 브라우저 검토

```yaml
stage: 11
agent: browser-preview-reviewer
skills_used:
  - game-browser-preview-review
expected_files:
  - path: ai/reviews/visual/*.md
    kind: glob
    count_at_least: 1
    common_filenames:
      - preview-review.md
      - responsive-review.md
      - state-review.md
frontmatter_required:
  - produced_by: browser-preview-reviewer
  - depends_on: [src/]
  - next_step: null                # 종료 단계
depends_on: [10]
gates: []
content_signals:
  - preview / 반응형 / 빌드 / 테스트 결과
next: null
```

---

## 게이트 규칙 요약 (강제 검증할 것)

README "중요한 순서 제약"에서:

```yaml
gates:
  G1:
    rule: "3번 규칙 설계 이후에는 반드시 4번 MVP 범위 축소를 거친다"
    violation_check: |
      stages[5..=7,10] 중 done/partial이 있는데 stage[4]가 not-started/partial이면 위반
    severity: critical

  G2:
    rule: "4번 없이 5번 스프레드시트, 7번 시스템 명세, 10번 구현으로 넘어가지 않는다"
    violation_check: |
      stage[4]가 not-done인데 stages[5,7,10] 중 시작된 것이 있으면 위반
    severity: critical

  G3:
    rule: "10번 UI 구현은 7번 시스템 명세와 8번 UI 명세가 생긴 뒤에 시작한다"
    violation_check: |
      stage[10]에 산출물 있는데 stage[7] 또는 stage[8]이 not-done이면 위반
    severity: critical

  G4:
    rule: "기획 agent는 리뷰 agent와 함께 사용 — 자기 산출물을 자기 혼자 승인하지 않는다"
    violation_check: |
      이건 정적 점검 어려움 — 워닝만, 자동 검출 안 함
    severity: warning

  G5:
    rule: "MVP 범위 검토 없이 스프레드시트, 시스템 명세, 구현으로 넘어가지 않는다"
    violation_check: G2와 동일
    severity: critical

  G6:
    rule: "Agent끼리 자동 호출 안 함, 사람이 명시적으로 호출"
    violation_check: |
      이건 점검 대상 아님 — 이 스킬도 자동 호출 안 한다는 원칙
    severity: principle
```

게이트 위반은 단순 누락보다 **빨간색**으로 강조. 사용자가 무시하고 진행하면 빌드 후 깨짐.

---

## 단계 상태 판정 알고리즘

```
function judge_stage(stage):
    expected = stage.expected_files
    present = filter(expected, exists)
    optional_only = filter(present, lambda f: f.optional)
    required = filter(expected, lambda f: not f.optional)
    required_present = filter(required, exists)

    if len(required_present) == 0 and len(optional_only) == 0:
        if all(prev_stage.status == "done" for prev_stage in stage.depends_on):
            return "not-started"
        else:
            return "blocked-by-prereq"  # 이전 단계 미완료라 시작 못함

    if len(required_present) == len(required):
        # 모든 필수 파일 존재
        if validate_frontmatter(required_present, stage.frontmatter_required):
            return "done"
        else:
            return "partial"  # 파일은 있지만 frontmatter 불완전

    if 0 < len(required_present) < len(required):
        return "partial"

    return "unknown"  # 도달 안 됨

function judge_gates(all_stages):
    violations = []
    if any(stages[i].status in ["partial", "done"] for i in [5, 7, 10]) and \
       stages[4].status != "done":
        violations.append("G1/G2: 4단계 미완료인데 5/7/10 진행됨")
    if stages[10].status != "not-started" and \
       (stages[7].status != "done" or stages[8].status != "done"):
        violations.append("G3: 10단계가 7+8 미완료 상태에서 진행됨")
    return violations
```

---

## 매니페스트 한계 / 알려진 미해결

- **9단계 (Web LLM visuals)**: 자동 점검 불가. 사용자에게 직접 묻는다.
- **`art/*.md`, `rules/*.md` 등 glob expected files**: 정확한 파일 수가 게임마다 다름. `count_at_least: 1`이 최소 보장. 게임 규모에 따라 더 많은 파일이 정상.
- **`xlsx` 파일**: 점검 시 존재 여부만 확인. 내용은 안 봄.
- **frontmatter 형식 변형**: 일부 프로젝트가 README와 약간 다른 frontmatter를 쓸 수 있음 (예: `dependencies` vs `depends_on`). 표준 형식이 source of truth — 변형은 partial로 표시하고 사용자에게 문의.
- **`ai/specs/systems/*.md`**: README에 "필요 시"라고 적힘 → optional 처리.

이 한계는 사용자에게도 알린다 (브리핑에서 "[자동 점검 한계]" 절). 잘못된 자신감 금지.