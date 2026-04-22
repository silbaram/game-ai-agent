---
name: game-mvp-scope
description: Use to reduce a game design to an actually buildable MVP. Classifies every feature as Must / Later / Cut based on pillar contribution, complexity, and dependencies. Triggered after rules are drafted and before spreadsheets or implementation. This step is non-optional — designs that skip it balloon into unshipped projects.
---

# Game MVP Scope Skill

## 목적

기획 범위를 **실제로 만들 수 있는 수준**으로 축소한다.

이 단계를 건너뛰면 기획은 우주 규모가 된다. 사람도 AI도 작은 게임을 만들자고 해놓고 3분 뒤에 오픈월드 경제 시스템을 넣고 싶어 한다.

---

## 언제 쓰는가

- 규칙 초안이 나온 후, 스프레드시트 작성 전 (1순위)
- 개발 중 범위가 부풀어 오를 때 (2순위)
- 일정이 1.5배로 늘어났을 때 (강제 소환)

---

## 입력

- `game-design/concept-brief.md`
- `game-design/game-pillars.md`
- `game-design/core-loop.md`
- `game-design/system-overview.md`
- `game-design/rules/*.md` (있는 만큼)
- `game-design/systems/*.md` (있는 만큼)

---

## 절차

1. **모든 기능을 원자 단위로 분해**한다.
    - "전투 시스템"이 아니라:
      - 기본 공격
      - 스킬 사용
      - 버프 적용
      - 상태이상
      - 보스 페이즈 전환
      - 전리품 드랍
      - 사망 처리
      - 부활/재시도
    - 각 기능이 한 문장으로 서술될 수 있어야 한다
2. 각 기능에 **복잡도 1~5**를 부여한다.
    - 1 = 반나절 (하드코딩된 상수 변경 수준)
    - 2 = 1~2일 (단일 컴포넌트)
    - 3 = 1주 (여러 컴포넌트 통합)
    - 4 = 2~3주 (상태 관리 / 네트워크 / 애니메이션 얽힘)
    - 5 = 1개월+ (새 서브시스템)
3. 각 기능에 **지지 Pillar**를 표시한다.
    - 어떤 Pillar도 지지하지 않으면 **표시 없음**으로 둔다 (이후 Cut 후보)
4. **의존성**을 그린다.
    - 기능 A를 구현하려면 기능 B가 먼저 있어야 하는가
    - 순환 의존성이 있다면 재설계 필요
5. 분류한다:
    - **Must (MVP 포함)**:
      - 핵심 루프를 돌리는 데 필수
      - Pillar를 지지
      - 복잡도 ≤ 3 (예외: 핵심이면 4도 허용, 5는 금지)
    - **Later (v2)**:
      - Pillar를 지지하지만 MVP 없이도 핵심 루프가 돔
      - 복잡도 3~5
    - **Cut (제외)**:
      - Pillar 지지 없음
      - 또는 복잡도 5인데 Pillar 지지가 약함
      - 또는 온라인/계정/과금 (MVP 기본 제외)
6. **복잡도 합계**를 계산한다.
    - Must 합계가 **목표 이하**인지 확인 (기본 15)
    - 넘으면 Must 중 우선순위 낮은 것을 Later로 이동
7. **먼저 만들 화면 3~5개**를 지정한다.
    - 핵심 루프를 돌리기 위한 최소 화면
    - 나머지는 placeholder 허용
8. **구현 순서**를 결정한다.
    - 의존성 위상정렬
    - 병렬 가능한 작업 묶기
9. **리스크가 큰 기능**에 축소 안을 제안한다.
    - 복잡도 4~5 기능마다 "이렇게 줄이면 3이 됩니다" 대안

---

## 출력 형식

파일: `game-design/mvp-scope.md`

```markdown
---
produced_by: production-scope-reviewer
depends_on:
  - game-design/game-pillars.md
  - game-design/system-overview.md
  - game-design/rules/
next_step: spreadsheet-architect | game-rules-designer (for refactor)
---

# MVP Scope

## Goal
- Target MVP complexity sum: **15**
- Current Must sum: **14**
- First-playable target: <시점>

## Must (MVP 포함)

| 기능 | 복잡도 | Pillar 기여 | 의존 | 비고 |
|---|---|---|---|---|
| 기본 공격 | 1 | 전투 재미 | - | |
| 스킬 사용 (3종 고정) | 2 | 전투 재미, 덱 구성 | 기본 공격 | 스킬 풀 확장은 Later |
| 인벤토리 UI | 2 | 소유 쾌감 | - | 정렬/필터는 Later |
| 스테이지 선택 | 1 | - | - | 리스트 뷰로 충분 |
| 상점 | 2 | 성장 | 인벤토리 UI | |
| 경험치/레벨 | 2 | 성장 | - | |
| 드랍 처리 | 2 | 소유 쾌감 | 인벤토리 UI | |
| 세이브/로드 | 2 | - | (전체) | |
| **합계** | **14** | | | |

## Later (v2)

| 기능 | 복잡도 | 이유 | 예상 시점 |
|---|---|---|---|
| 스킬 풀 확장 (10종) | 3 | 덱 구성의 깊이, MVP 이후 |
| 보스 페이즈 전환 | 4 | 복잡도 높음, 핵심 루프 없이 가능 |
| 일일 퀘스트 | 3 | 리텐션 장치, MVP 이후 |

## Cut (제외)

| 기능 | 이유 |
|---|---|
| 길드 시스템 | 어떤 Pillar도 지지하지 않음 |
| 실시간 PvP | MVP 기본 제외 (온라인) |
| 과금 상점 | MVP 기본 제외 |
| 3D 전환 이펙트 | 복잡도 4, Pillar 기여 약함 |

## 구현 순서 (First-playable 기준)

```
Phase 1: 기초
  1. 기본 공격 + 드랍 처리 + 인벤토리 UI
Phase 2: 루프 완성
  2. 스테이지 선택 + 경험치/레벨
  3. 스킬 사용 (3종 고정)
Phase 3: 경제 + 지속성
  4. 상점
  5. 세이브/로드
```

## 먼저 만들 화면

1. 전투 화면 (핵심)
2. 스테이지 선택 화면
3. 인벤토리 화면
4. 상점 화면
5. 메인 메뉴 (제일 간단한 버전)

**Placeholder로 충분한 화면:** 설정, 크레딧, 튜토리얼

## 리스크 축소 안

### 스킬 풀 확장 (복잡도 3 → 현재 Must 아님)
- 초기에는 3종 하드코딩. 데이터 기반 확장은 v2.

### 보스 페이즈 전환 (Later로 이동)
- MVP 최종 보스는 "HP 많은 일반 몹" 형태로 대체. 페이즈 연출은 v2.

## 재검토 트리거

다음 조건 중 하나라도 만족하면 이 문서를 재검토:
- Must 합계가 17을 넘음
- Cut에 있던 기능이 "꼭 필요하다"로 논의됨
- 구현 중 복잡도가 2 이상 증가한 기능 발생
```

---

## 체크리스트 (완료 조건)

- [ ] Must / Later / Cut 3개 분류 모두 존재
- [ ] Must 합계 ≤ 목표치 (기본 15)
- [ ] 최소 1개 이상의 Cut 존재 (모두 Must가 되면 축소가 안 된 것)
- [ ] 모든 Must 기능이 Pillar와 연결됨
- [ ] 구현 순서가 의존성 기반으로 배열됨
- [ ] 먼저 만들 화면 3~5개 지정됨
- [ ] 재검토 트리거 조건 명시됨

---

## 흔한 실수

- **"전부 중요합니다"**: 이 결론이 나오면 축소가 안 된 것. 반드시 Cut이 있어야 한다.
- **복잡도를 낙관적으로 평가**: 본인이 1이라고 생각한 건 대부분 2~3이다. 올려 잡는다.
- **Pillar와 기능의 연결을 억지로 만듦**: "길드 시스템은 사교 Pillar를 지지합니다"처럼 Pillar를 새로 만들면서 기능을 살리지 않는다. 없는 Pillar를 만들어 구하지 말 것.
- **Later를 "다음 분기 중에"로 표시**: Later의 의미는 "MVP가 출시된 후"다. 막연한 날짜로 미루지 않는다.
- **축소 안 없이 복잡도 5를 Must에 넣음**: 복잡도 5는 축소 안이 반드시 필요하다. 없으면 그대로 Cut.

---

## 핵심 원칙 한 줄

> "이 기능이 없으면 플레이어가 핵심 Pillar를 경험할 수 없는가?"
> 이 질문에 "그렇다"가 아니면 MVP 포함이 아니다.
