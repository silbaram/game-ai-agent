---
name: design-system-spec
description: Use after art direction and MVP scope exist to define a game UI design system with color tokens, typography, spacing, component states, HUD rules, rarity styles, and animation direction.
---

# Design System Spec Skill

## 목적

게임 UI 구현 전에 **반복 가능한 시각 규칙**을 정한다.

아트 디렉션을 화면 컴포넌트로 옮기는 단계이며, 화면별 명세와 UI 구현의 기준이 된다.

---

## 입력

- `game-design/art/art-direction.md`
- `game-design/concept-brief.md`
- `game-design/game-pillars.md`
- `game-design/mvp-scope.md`

---

## 절차

1. UI 톤을 한 문단으로 정의한다.
2. Color token을 작성한다.
    - background
    - surface
    - text
    - accent
    - danger/warning/success/info
    - item rarity
3. Typography token을 작성한다.
    - display
    - heading
    - body
    - label
    - number/stat
4. Spacing, radius, border, shadow 규칙을 정한다.
5. 버튼, 패널, 모달, 탭, 리스트, HUD의 기본/hover/focus/disabled 상태를 정의한다.
6. 아이템 rarity 표시 규칙을 정한다.
7. 애니메이션 방향을 정한다.
8. 접근성 기준을 적는다.

---

## 출력 형식

파일: `ai/specs/ui/design-system.md`

```markdown
---
produced_by: ui-planner
depends_on:
  - game-design/art/art-direction.md
  - game-design/mvp-scope.md
next_step: game-screen-spec
---

# UI Design System

## UI Tone

## Color Tokens

## Typography

## Spacing

## Radius / Border / Shadow

## Component Rules

## Item Rarity Styles

## HUD Rules

## Motion

## Accessibility
```

---

## 금지 사항

- 아트 디렉션 없이 독립적으로 팔레트를 만들지 않는다.
- 색상 이름만 쓰고 hex/token 값을 생략하지 않는다.
- 상태(default/hover/focus/disabled/error)를 빠뜨리지 않는다.
- 화면별 임의 스타일을 허용하지 않는다. 예외는 이 문서에 기록한다.

---

## 체크리스트

- [ ] 색상 token에 실제 값이 있음
- [ ] typography scale이 있음
- [ ] 컴포넌트 상태별 규칙이 있음
- [ ] rarity 스타일이 있음
- [ ] HUD 정보 우선순위가 있음
