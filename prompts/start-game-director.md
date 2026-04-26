# game-director 시작 프롬프트

아래 프롬프트를 AI tool에 그대로 붙여 넣고, `<>` 부분만 바꾼다.

`game-director를 사용해서 게임 뼈대 문서를 만들어줘.`처럼 필수 입력 없이 요청하면, agent는 파일을 만들지 않고 먼저 입력 질문을 해야 한다.

## 최소 버전

```text
game-director를 사용해서 게임 뼈대 문서를 만들어줘.

입력:
- 장르: <예: 로그라이크 덱빌더>
- 플랫폼: <예: web>
- 핵심 재미: <예: 매 런마다 다른 덱을 짜고, 실패해도 다음 런이 기대되는 성장감>
- 타겟 플레이어: <예: 코어 게이머, 1회 30~60분>
- 분위기/톤: <예: 어두운 판타지, 불길하지만 귀여운 몬스터>
- 참고 게임: <예: Slay the Spire, Inscryption>
- 피하고 싶은 요소: <예: 실시간 전투, 과금 유도, 복잡한 3D 조작>

반드시 아래 파일로 저장해줘:
- game-design/concept-brief.md
- game-design/game-pillars.md
- game-design/core-loop.md
- game-design/system-overview.md

각 파일에는 produced_by, depends_on, next_step frontmatter를 넣어줘.

부족한 입력이 있으면 추측하지 말고 먼저 질문해줘.
```

## 더 쉬운 입력표

무엇을 적어야 할지 모르겠으면 아래 질문에만 답한다.

```text
game-director를 사용해서 게임 뼈대 문서를 만들어줘.

1. 어떤 장르인가?
   - <예: 방치형 RPG, 퍼즐 어드벤처, 로그라이크 덱빌더>

2. 어디에서 플레이하는가?
   - <예: web, mobile, PC>

3. 플레이어가 10초 안에 느껴야 하는 재미는?
   - <예: 클릭할수록 몬스터가 터지고 보상이 쌓이는 재미>

4. 누가 플레이하는가?
   - <예: 출퇴근 중 5분씩 하는 캐주얼 유저>

5. 어떤 분위기인가?
   - <예: 밝고 귀여움 / 축축한 지하세계 / 고요한 SF>

6. 참고 게임은?
   - <예: Vampire Survivors, Slay the Spire>

7. 넣기 싫은 요소는?
   - <예: PvP, 과금 상점, 복잡한 조작>

출력 파일:
- game-design/concept-brief.md
- game-design/game-pillars.md
- game-design/core-loop.md
- game-design/system-overview.md
```

## 이미 아이디어가 문서에 있을 때

`game-design/initial-input.md`를 먼저 만들었다면 이렇게 요청한다.

```text
game-director를 사용해줘.

먼저 game-design/initial-input.md를 읽고,
game-concept-brief와 game-core-loop-design skill을 사용해서
아래 게임 뼈대 문서를 작성해줘.

- game-design/concept-brief.md
- game-design/game-pillars.md
- game-design/core-loop.md
- game-design/system-overview.md

부족한 입력이 있으면 추측하지 말고 먼저 질문해줘.
```

## 다음 단계

`game-director`가 끝나면 보통 다음 중 하나로 진행한다.

- 세계관과 아트 방향을 잡고 싶으면 `game-concept-designer`
- 전투, 아이템, 성장 같은 규칙을 만들고 싶으면 `game-rules-designer`

---

## 하네스 전체 실행 프롬프트

아래 순서는 대상 게임 프로젝트 루트에서 AI tool을 실행한다는 전제입니다.
각 단계는 이전 단계 산출물을 읽고 다음 단계 산출물을 만듭니다.

| 순서 | 목적                         | Agent                       | 사용하는 Skill                                                     | 핵심 산출물                                                                 |
| ---- | ---------------------------- | --------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| 1    | 게임 뼈대 생성               | `game-director`             | `game-concept-brief`, `game-core-loop-design`                      | `concept-brief.md`, `game-pillars.md`, `core-loop.md`, `system-overview.md` |
| 2    | 세계관/아트 방향             | `game-concept-designer`     | `game-concept-brief`, `game-image-prompt-pack`                     | `game-design/art/*.md`                                                      |
| 3    | 규칙 설계                    | `game-rules-designer`       | `game-rule-design`                                                 | `game-design/rules/*.md`                                                    |
| 4    | MVP 범위 축소                | `production-scope-reviewer` | `game-mvp-scope`                                                   | `game-design/mvp-scope.md`                                                  |
| 5    | 데이터 테이블화              | `spreadsheet-architect`     | `game-spreadsheet-authoring`                                       | `game-design/spreadsheets/*`                                                |
| 6    | 밸런스 검토                  | `balance-reviewer`          | `game-balance-review`                                              | `ai/reviews/balance/*.md`                                                   |
| 7    | 시스템 개발 명세             | `game-rules-designer`       | `game-system-spec`                                                 | `game-design/systems/*.md`                                                  |
| 8    | UI 명세와 사용자 플로우 차트 | `ui-planner`                | `design-system-spec`, `game-screen-spec`, `game-image-prompt-pack` | `ai/specs/ui/*.md`, `ai/specs/ui/user-flow-chart.md`                        |
| 9    | 시각 자료 생성               | Web LLM                     | 없음                                                               | 이미지, mockup, 레퍼런스                                                    |
| 10   | UI 구현                      | `ui-implementer`            | `game-ui-implementation`                                           | `src/*`, `components/*`, `screens/*`, `tests/*`                             |
| 11   | 브라우저 검토                | `browser-preview-reviewer`  | `game-browser-preview-review`                                      | `ai/reviews/visual/*.md`                                                    |

중요한 순서 제약:

- 3번 규칙 설계 이후에는 반드시 4번 MVP 범위 축소를 거칩니다.
- 4번 없이 5번 스프레드시트, 7번 시스템 명세, 10번 구현으로 넘어가지 않습니다.
- 10번 UI 구현은 7번 시스템 명세와 8번 UI 명세가 생긴 뒤에 시작합니다.

### 1. 게임 뼈대 생성

사용:

- Agent: `game-director`
- Skill: `game-concept-brief`, `game-core-loop-design`

프롬프트:

```text
game-director를 사용해서 게임 뼈대 문서를 만들어줘.

입력:
- 장르: <예: 로그라이크 덱빌더>
- 플랫폼: <예: web>
- 핵심 재미: <예: 매 런마다 다른 덱을 짜고, 실패해도 다음 런이 기대되는 성장감>
- 타겟 플레이어: <예: 코어 게이머, 1회 30~60분>
- 분위기/톤: <예: 어두운 판타지>
- 참고 게임: <예: Slay the Spire, Inscryption>
- 피하고 싶은 요소: <예: 실시간 전투, 과금 유도, 복잡한 3D 조작>

반드시 아래 파일로 저장해줘:
- game-design/concept-brief.md
- game-design/game-pillars.md
- game-design/core-loop.md
- game-design/system-overview.md

각 파일에는 produced_by, depends_on, next_step frontmatter를 넣어줘.
부족한 필수 입력이 있으면 추측하지 말고 먼저 질문해줘.
```

### 2. 세계관/아트 방향 정리

사용:

- Agent: `game-concept-designer`
- Skill: `game-concept-brief`, `game-image-prompt-pack`

프롬프트:

```text
game-concept-designer를 사용해줘.

아래 문서를 읽고 세계관, 분위기, 아트 방향, 이미지 프롬프트 팩을 정리해줘:
- game-design/concept-brief.md
- game-design/game-pillars.md

결과는 아래 경로에 저장해줘:
- game-design/art/art-direction.md
- game-design/art/image-prompts.md
- game-design/art/ui-mockup-prompts.md
- game-design/art/item-icon-prompts.md
- game-design/art/character-concept-prompts.md
- game-design/art/background-prompts.md
- game-design/art/asset-key-map.md

아트 디렉션 없이 이미지 프롬프트만 만들지 말고,
모든 파일에는 produced_by, depends_on, next_step frontmatter를 넣어줘.
```

### 3. 시스템 규칙 설계

사용:

- Agent: `game-rules-designer`
- Skill: `game-rule-design`

프롬프트:

```text
game-rules-designer를 사용해줘.

아래 문서를 읽고 system-overview.md의 Core 시스템부터 규칙을 설계해줘:
- game-design/concept-brief.md
- game-design/game-pillars.md
- game-design/core-loop.md
- game-design/system-overview.md

각 시스템에는 game-rule-design skill을 적용해줘.
규칙은 숫자, 공식, 표, 실패 조건, 엣지 케이스, 테스트 케이스를 포함해야 해.

결과는 필요한 만큼 아래 경로에 저장해줘:
- game-design/rules/combat-rules.md
- game-design/rules/item-rules.md
- game-design/rules/skill-rules.md
- game-design/rules/economy-rules.md
- game-design/rules/quest-rules.md

MVP 범위는 아직 확정하지 말고,
다음 단계가 production-scope-reviewer임을 frontmatter에 적어줘.
```

### 4. MVP 범위 축소

사용:

- Agent: `production-scope-reviewer`
- Skill: `game-mvp-scope`

프롬프트:

```text
production-scope-reviewer를 사용해줘.

아래 문서를 읽고 MVP 범위를 Must / Later / Cut으로 나눠줘:
- game-design/concept-brief.md
- game-design/game-pillars.md
- game-design/core-loop.md
- game-design/system-overview.md
- game-design/rules/*.md

각 기능의 구현 복잡도, 의존성, 리스크를 평가해줘.
MVP에 남길 것은 실제 구현 가능한 최소 단위로 줄여줘.

결과는 아래 파일로 저장해줘:
- game-design/mvp-scope.md
- ai/reviews/production/scope-cut-1.md
- ai/reviews/production/complexity-map.md

다음 단계는 spreadsheet-architect로 명시해줘.
```

### 5. 데이터 테이블화

사용:

- Agent: `spreadsheet-architect`
- Skill: `game-spreadsheet-authoring`

프롬프트:

```text
spreadsheet-architect를 사용해줘.

아래 문서를 읽고 MVP에 남은 규칙만 데이터 테이블로 변환해줘:
- game-design/mvp-scope.md
- game-design/rules/*.md

각 테이블은 컬럼명, 타입, 설명, 예시값을 포함해야 해.
규칙 파일의 Required Data Tables 섹션을 우선 기준으로 삼아줘.

결과는 아래 경로에 저장해줘:
- game-design/spreadsheets/SCHEMA.md
- game-design/spreadsheets/item-master.csv
- game-design/spreadsheets/skill-master.csv
- game-design/spreadsheets/drop-table.csv
- game-design/spreadsheets/game-master.xlsx

CSV와 xlsx를 만들 수 없는 환경이면,
동일한 내용을 markdown schema와 csv 초안으로 먼저 저장해줘.
```

### 6. 밸런스 검토

사용:

- Agent: `balance-reviewer`
- Skill: `game-balance-review`

프롬프트:

```text
balance-reviewer를 사용해줘.

아래 문서를 읽고 성장곡선, 보상량, 가격, 드랍률, 전투 시간을 검토해줘:
- game-design/core-loop.md
- game-design/mvp-scope.md
- game-design/rules/*.md
- game-design/spreadsheets/*

이상치, 악용 가능성, 초반 30분 밸런스 리스크를 찾아줘.
수정 제안은 구체적인 숫자로 적어줘.

결과는 아래 경로에 저장해줘:
- ai/reviews/balance/balance-pass-1.md

수정이 필요한 규칙/시트 파일과 수정 우선순위를 함께 적어줘.
```

### 7. 시스템 개발 명세 확정

사용:

- Agent: `game-rules-designer`
- Skill: `game-system-spec`

프롬프트:

```text
game-rules-designer를 다시 사용해줘.

이번에는 game-system-spec skill을 사용해서
MVP Must 시스템을 구현 가능한 개발 명세로 변환해줘.

참조 문서:
- game-design/concept-brief.md
- game-design/core-loop.md
- game-design/mvp-scope.md
- game-design/rules/*.md
- game-design/spreadsheets/*
- ai/reviews/balance/*.md

각 시스템 명세에는 데이터 모델, 상태, 주요 함수/유스케이스,
입력/출력, 실패 조건, 테스트 케이스를 포함해줘.

결과는 아래 경로에 저장해줘:
- game-design/systems/<system-name>-system.md

다음 단계는 ui-planner로 명시해줘.
```

### 8. UI 명세와 사용자 플로우 차트 작성

사용:

- Agent: `ui-planner`
- Skill: `design-system-spec`, `game-screen-spec`, `game-image-prompt-pack`
- 사용자 플로우 차트 담당 Skill: `game-screen-spec`

산출물:

- `ai/specs/ui/design-system.md`: 디자인 토큰과 컴포넌트 규칙
- `ai/specs/ui/screen-map.md`: MVP 화면 목록과 화면 간 연결
- `ai/specs/ui/user-flow-chart.md`: 플레이어 목표별 사용자 플로우 차트
- `ai/specs/ui/<screen-name>-screen.md`: 화면별 상태, 데이터, 인터랙션 명세
- `game-design/art/ui-mockup-prompts.md`: UI mockup 생성용 프롬프트

프롬프트:

```text
ui-planner를 사용해줘.

아래 문서를 기준으로 MVP UI 명세와 사용자 플로우 차트를 작성해줘:
- game-design/concept-brief.md
- game-design/game-pillars.md
- game-design/core-loop.md
- game-design/mvp-scope.md
- game-design/systems/*.md
- game-design/spreadsheets/SCHEMA.md
- game-design/art/art-direction.md

작업:
1. design-system-spec skill로 디자인 시스템을 작성
2. MVP 화면 목록과 흐름을 screen-map.md로 작성
3. game-screen-spec skill의 인터랙션/전환 조건을 바탕으로 사용자 플로우 차트를 작성
4. 각 MVP 화면에 game-screen-spec skill 적용
5. 필요한 UI mockup prompt는 game-image-prompt-pack skill로 작성

결과는 아래 경로에 저장해줘:
- ai/specs/ui/design-system.md
- ai/specs/ui/screen-map.md
- ai/specs/ui/user-flow-chart.md
- ai/specs/ui/<screen-name>-screen.md
- game-design/art/ui-mockup-prompts.md

user-flow-chart.md에는 아래 내용을 포함해줘:
- 주요 플레이어 목표별 플로우
- 화면 진입 조건과 이탈 조건
- 실패/empty/error 상태로 빠지는 경로
- MVP 밖 기능으로 이어지는 Placeholder 경로
- Mermaid flowchart 코드 블록

각 화면에는 default, loading, empty, error, disabled 상태를 포함해줘.
```

### 9. Web LLM 시각 자료 생성

사용:

- Agent: 없음
- Skill: 없음
- 입력: `game-design/art/*.md`, `ai/specs/ui/*.md`

프롬프트:

```text
아래 문서의 아트 디렉션과 프롬프트를 기준으로
게임 컨셉 이미지, UI mockup, 아이콘 시안을 생성해줘.

참조:
- game-design/art/art-direction.md
- game-design/art/image-prompts.md
- game-design/art/ui-mockup-prompts.md
- game-design/art/item-icon-prompts.md
- ai/specs/ui/design-system.md
- ai/specs/ui/screen-map.md

결과물은 바로 구현하지 않고,
파일명, 용도, 사용 화면, 반영할 디자인 변경점을 정리해줘.
```

Web LLM 결과를 받은 뒤에는 `game-design/art/asset-key-map.md`나
`ai/specs/ui/*.md`에 반영한 다음 구현으로 넘어갑니다.

### 10. UI 구현

사용:

- Agent: `ui-implementer`
- Skill: `game-ui-implementation`

프롬프트:

```text
ui-implementer를 사용해줘.

아래 문서를 기준으로 MVP 화면을 구현해줘:
- game-design/mvp-scope.md
- game-design/systems/*.md
- game-design/spreadsheets/*
- game-design/art/asset-key-map.md
- ai/specs/ui/design-system.md
- ai/specs/ui/*-screen.md

구현 범위는 MVP Must 화면으로 제한해줘.
기존 프로젝트의 프레임워크와 스타일 규칙을 우선 따라줘.

구현 후 실행한 검증 명령과 남은 TODO를 정리해줘.
```

### 11. 브라우저 preview 검토

사용:

- Agent: `browser-preview-reviewer`
- Skill: `game-browser-preview-review`

프롬프트:

```text
browser-preview-reviewer를 사용해줘.

현재 구현된 MVP 화면을 브라우저 preview 기준으로 검토해줘.

참조:
- ai/specs/ui/design-system.md
- ai/specs/ui/*-screen.md
- game-design/mvp-scope.md

검토 항목:
- 화면별 default/loading/empty/error/disabled 상태
- desktop/mobile 반응형
- 텍스트 넘침과 UI 겹침
- 주요 플로우 클릭 가능 여부
- 빌드/테스트 결과

결과는 아래 경로에 저장해줘:
- ai/reviews/visual/preview-pass-1.md

수정이 필요한 항목은 파일 경로와 우선순위를 함께 적어줘.
```
