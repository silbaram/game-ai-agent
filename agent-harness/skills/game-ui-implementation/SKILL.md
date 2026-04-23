---
name: game-ui-implementation
description: 화면 명세와 디자인 시스템 명세를 바탕으로 UI를 구현할 때 사용한다. 컴포넌트, 화면, 상태 모델, mock data, story 또는 visual test hook을 만들고 구현이 원본 명세와 일치하도록 유지한다.
---

# 게임 UI 구현 Skill

## 목적

`ai/specs/ui/`의 화면 명세와 디자인 시스템을 기준으로 실제 UI를 구현한다.

구현 중 임의 디자인 결정을 만들지 않고, 필요한 변경은 명세로 되돌려 기록한다.

---

## 입력

- `ai/specs/ui/design-system.md`
- `ai/specs/ui/screen-map.md`
- `ai/specs/ui/*-screen.md`
- `game-design/spreadsheets/*.csv` 또는 mock data
- 프로젝트의 실제 frontend 코드 구조

---

## 절차

1. 기존 frontend stack과 컴포넌트 패턴을 먼저 확인한다.
2. design-system token을 코드의 theme/token 구조로 옮긴다.
3. 화면별 상태 모델을 만든다.
4. mock data를 spreadsheet schema와 맞춘다.
5. 공통 컴포넌트를 작성한다.
6. MVP 화면을 구현한다.
7. loading/empty/error/disabled/selected/hover/focus 상태를 구현한다.
8. Storybook 또는 테스트 가능한 preview route를 만든다. 프로젝트에 없으면 가벼운 mock route로 대체한다.
9. 구현 중 명세와 충돌한 점은 `구현 메모(Implementation Notes)`에 기록한다.

---

## 출력 대상

프로젝트 구조에 맞춰 아래 중 해당되는 위치에 작성한다.

```text
src/components/
src/screens/
src/app/
src/data/mock/
src/stories/
tests/
```

---

## 금지 사항

- 화면 명세에 없는 핵심 기능을 임의로 추가하지 않는다.
- spreadsheet schema와 다른 mock data shape를 만들지 않는다.
- default 상태만 구현하고 empty/error/loading을 남겨두지 않는다.
- 디자인 시스템을 무시하고 화면별 inline style로 해결하지 않는다.

---

## 체크리스트

- [ ] 구현 화면이 screen spec의 목적과 액션을 충족함
- [ ] 주요 상태가 구현됨
- [ ] mock data가 schema와 맞음
- [ ] 모바일/데스크톱 레이아웃이 깨지지 않음
- [ ] 실행/빌드/테스트 또는 preview 검증 결과가 기록됨
