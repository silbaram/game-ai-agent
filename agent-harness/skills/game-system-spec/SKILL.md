---
name: game-system-spec
description: MVP 승인된 게임 시스템 규칙을 user flow, data model, UI screen, edge case, test case를 포함한 정식 개발 명세로 변환할 때 사용한다. MVP 범위와 밸런스 리뷰 후, UI 기획이나 구현 전에 호출한다.
---

# 게임 시스템 명세 Skill

## 목적

`game-rule-design`에서 나온 규칙을 **실제 개발 명세**로 변환한다.

규칙은 "무엇이 맞는가"를 정한다. 명세는 "어떻게 구현하는가"를 정한다.

---

## 언제 쓰는가

- 특정 시스템이 MVP Must로 확정된 후
- 개발자가 구현에 들어가기 직전
- 기존 시스템을 큰 폭으로 리팩토링할 때

---

## 입력

- `game-design/rules/<s>-rules.md`
- `game-design/spreadsheets/SCHEMA.md` (있으면)
- `game-design/core-loop.md`
- `game-design/mvp-scope.md` (있으면 범위 제한)

---

## 절차

1. 대상 시스템의 **목적(Purpose)**을 한 문단으로 재정리한다.
    - 규칙 문서의 목적(Purpose)을 참조하되, 개발 관점으로 재서술 (어떤 코드 컴포넌트가 필요한지)
2. **User Flow**를 그린다.
    - 플레이어가 이 시스템과 상호작용하는 흐름
    - 화살표와 단계로 표현
    - 최소 2개: 정상 흐름 + 실패 흐름
3. **Data Model**을 정의한다.
    - 엔티티 / 필드 / 관계
    - 스프레드시트의 테이블 구조와 런타임 객체 구조를 모두 기재
    - `target_stack`을 먼저 확인하고, 스택에 맞는 런타임 타입 정의를 포함한다.
      - web: TypeScript 타입
      - Unity: C# class / ScriptableObject 구조
      - Unreal: C++ struct / DataTable row 구조
      - Godot: GDScript Resource 또는 C# 타입
      - 명시되지 않으면 TypeScript를 기본값으로 사용하고 문서에 assumption으로 남긴다.
4. **규칙(Rules) 요약**을 붙인다.
    - 규칙 문서의 공식을 필요한 것만 발췌
    - 전체 규칙은 링크로 참조
5. **UI Screens**를 나열한다.
    - 이 시스템이 필요로 하는 화면
    - 각 화면의 핵심 요소 5~10개
    - 화면 간 전환 규칙
6. **엣지 케이스(Edge Cases)**를 개발 관점에서 재정리한다.
    - 각 케이스별 기대 동작을 명시
    - 예외가 발생하는 시점과 처리 방식
7. **테스트 케이스(Test Cases)**를 작성한다.
    - 단위 테스트용 케이스
    - 통합 테스트용 케이스
    - 각 케이스에 `Given / When / Then` 형식
8. **비기능 요구사항(Non-functional requirements)**을 표시한다.
    - 성능 기준 (예: "턴 처리 <100ms")
    - 저장 주기
    - 동시성 고려사항 (있다면)

---

## 출력 형식

파일: `game-design/systems/<s>-system.md`

```markdown
---
produced_by: game-rules-designer
depends_on:
  - game-design/rules/<s>-rules.md
next_step: ui-planner | game-ui-implementation
---

# <System Name> 시스템 명세

## 목적
<개발 관점 1문단>

## 사용자 흐름(User Flow)

### 정상 흐름
```
[플레이어] → 행동 선택 → 시스템 검증 → 적용 → 피드백
```

### 실패 흐름
```
[플레이어] → 행동 선택 → 검증 실패 → 에러 표시 → 복귀
```

## 데이터 모델(Data Model)

### target_stack 확인
- `target_stack`: web
- 타입 언어 선택: TypeScript

### 런타임 타입 (TypeScript)
```ts
export interface Item {
  id: number;
  name: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  atk: number;
  def: number;
  stackable: boolean;
  maxStack: number;
}

export interface InventorySlot {
  itemId: number;
  quantity: number;
}

export interface Inventory {
  slots: InventorySlot[];
  capacity: number;
}
```

### 스토리지 스키마
- `item_master` (CSV): 정적 데이터
- `player_inventory` (런타임 상태): 저장 주기 = 세이브 이벤트마다

## 규칙 (발췌)
- 아이템 획득 시 `stackable=true`이면 기존 슬롯에 합산, 아니면 새 슬롯
- 인벤토리 가득 찼을 때: 필드에 남김 (설정 `drop_on_full = field`)

전체 규칙: `game-design/rules/item-rules.md`

## UI 화면(UI Screens)

### 인벤토리 화면(Inventory Screen)
- 요소: 아이템 그리드, 아이템 상세 패널, 필터, 정렬, 판매 버튼, 장착 버튼
- 진입: 게임 HUD의 '가방' 버튼
- 이탈: ESC, 뒤로가기
- 반응형: 모바일 2열, 데스크톱 6열

### 아이템 획득 Toast(Item Pickup Toast)
- 요소: 아이콘, 이름, 수량, 희귀도 색상
- 표시 시간: 2초

## 엣지 케이스(Edge Cases)

| 케이스 | 기대 동작 | 처리 시점 |
|---|---|---|
| 인벤토리 가득 + 스택 가능 | 기존 슬롯에 합산 | 획득 시 |
| 인벤토리 가득 + 스택 불가 | 필드에 남김 (TTL 5분) | 획득 시 |
| 동시에 2개 획득 | 순차 처리, 각각 이벤트 발생 | 이벤트 큐 |
| 세이브 중 획득 | 세이브 완료 후 반영 | 저장 이벤트 경계 |
| 존재하지 않는 item_id | 에러 로그 + 무시 | 획득 시점 검증 |

## 테스트 케이스(Test Cases)

### 단위
1. **Given** 빈 인벤토리, **When** 아이템 추가, **Then** 슬롯[0]에 아이템
2. **Given** 스택 가능 아이템 1개 슬롯에 존재, **When** 같은 아이템 추가, **Then** quantity +1
3. **Given** 인벤토리 가득, **When** 스택 불가 아이템 추가, **Then** 필드 드랍 이벤트 발생

### 통합
1. **Given** 전투 종료 + 드랍 아이템 3개, **When** 보상 수령, **Then** 인벤토리에 3개 반영 + 토스트 3회

## 비기능 요구사항
- 인벤토리 UI 렌더링: 100개 아이템 기준 16ms 이내
- 저장 주기: 스테이지 종료 시마다
- 직렬화 포맷: JSON (압축 선택)
- 동시성: 단일 플레이어 가정, 락 불필요
```

---

## 체크리스트 (완료 조건)

- [ ] 목적(Purpose)이 개발 관점으로 재서술됨
- [ ] 사용자 흐름(User Flow)에 정상 + 실패 두 경로 있음
- [ ] 데이터 모델(Data Model)에 런타임 타입이 코드로 표현됨
- [ ] UI 화면(UI Screens)에 각 화면의 요소 나열됨
- [ ] 엣지 케이스(Edge Cases)가 개발 관점에서 정리됨
- [ ] 테스트 케이스(Test Cases)에 Given/When/Then 형식 사용
- [ ] 비기능 요구사항이 있음
- [ ] `target_stack` 확인 결과와 타입 언어 선택 근거(또는 기본값 assumption)가 문서에 남아 있음

---

## 흔한 실수

- **규칙 문서를 그대로 복사**: 규칙은 "무엇이 맞는가", 명세는 "어떻게 구현하는가". 다르다.
- **데이터 모델(Data Model)에 타입 없음**: 런타임 타입 정의 없으면 개발자가 매번 추측해야 한다.
- **엣지 케이스와 테스트 케이스 중복**: 엣지 케이스는 **동작 정의**, 테스트 케이스는 **검증 시나리오**. 역할이 다르다.
- **UI를 "알아서"로 처리**: 화면 요소를 나열해야 디자이너와 협업 가능.
- **비기능 요구사항 누락**: 성능 기준 없으면 최적화 논쟁이 끝없이 반복된다.
