---
name: game-screen-spec
description: 각 게임 화면의 목적, 플레이어 행동, 정보 우선순위, layout, 상태, interaction, edge case, 데이터 요구사항, asset, 구현 메모를 정의할 때 사용한다.
---

# 게임 화면 명세 Skill

## 목적

각 화면을 구현 가능한 단위로 명세한다.

화면은 예쁜 그림이 아니라 플레이어 행동, 상태, 데이터, 실패 조건을 담는 인터페이스다.

---

## 입력

- `ai/specs/ui/design-system.md`
- `game-design/mvp-scope.md`
- `game-design/core-loop.md`
- `game-design/systems/*.md`
- `game-design/spreadsheets/SCHEMA.md` (있는 경우)
- 대상 화면 이름

---

## 절차

1. 화면 목적을 한 문단으로 정의한다.
2. 플레이어 행동을 나열한다.
3. 정보 우선순위를 정한다.
4. 레이아웃을 영역 단위로 쓴다.
5. 상태를 정의한다.
    - default
    - loading
    - empty
    - error
    - selected
    - disabled
    - hover/focused
6. 인터랙션과 전환 조건을 적는다.
7. 엣지 케이스와 실패 조건을 적는다.
8. 데이터 요구사항을 표로 작성한다.
9. 필요한 asset key를 적는다.
10. 구현 메모와 테스트 포인트를 정리한다.

---

## 출력 형식

파일: `ai/specs/ui/<screen>-screen.md`

```markdown
---
produced_by: ui-planner
depends_on:
  - ai/specs/ui/design-system.md
  - game-design/mvp-scope.md
next_step: game-ui-implementation
---

# <Screen Name> 화면 명세

## 목적

## 플레이어 행동

## 정보 우선순위

## 레이아웃(Layout)

## 상태

## 인터랙션(Interactions)

## 엣지 케이스(Edge Cases)

## 데이터 요구사항

## 스프레드시트 참조

## 에셋 요구사항(Asset Requirements)

## 구현 메모

## 테스트 케이스(Test Cases)
```

---

## 금지 사항

- 데이터 요구사항 없이 레이아웃만 작성하지 않는다.
- empty/error/loading 상태를 생략하지 않는다.
- MVP 범위 밖 기능을 주요 액션으로 넣지 않는다.
- asset 파일명을 확정할 수 없으면 `asset_key`로 기록한다.

---

## 체크리스트

- [ ] 화면 목적이 core loop 또는 MVP 기능과 연결됨
- [ ] 주요 상태가 모두 있음
- [ ] 데이터 요구사항이 표로 있음
- [ ] edge case가 최소 3개 있음
- [ ] 구현자가 테스트할 수 있는 test case가 있음
