---
name: game-browser-preview-review
description: UI 구현 후 브라우저 preview를 상태와 viewport별로 점검해 시각 회귀, layout overflow, interaction 상태, 긴 텍스트, empty/many item 사례, 명세 정합성을 확인할 때 사용한다.
---

# 게임 브라우저 Preview 리뷰 Skill

## 목적

브라우저에서 실제 구현 화면을 확인하고, 화면 명세와 디자인 시스템 기준으로 시각/상태/반응형 문제를 검토한다.

---

## 입력

- 실행 가능한 dev server 또는 static preview
- `ai/specs/ui/design-system.md`
- `ai/specs/ui/*-screen.md`
- 구현된 화면 URL 목록

---

## 절차

1. dev server를 실행하거나 기존 preview URL을 확인한다.
2. desktop viewport에서 각 MVP 화면을 확인한다.
3. mobile viewport에서 각 MVP 화면을 확인한다.
4. 상태별로 점검한다.
    - default
    - loading
    - empty
    - error
    - selected
    - disabled
    - hover/focused
5. 데이터 stress case를 확인한다.
    - long text
    - many items
    - no item
    - missing image
    - extreme number values
6. 화면 명세와 불일치한 부분을 기록한다.
7. 수정 필요 항목은 severity와 owner를 지정한다.

---

## 출력 형식

파일: `ai/reviews/visual/preview-review-N.md`

```markdown
---
produced_by: game-browser-preview-review
depends_on:
  - ai/specs/ui/design-system.md
  - ai/specs/ui/
next_step: game-ui-implementation
---

# 브라우저 Preview 리뷰 N

## 범위

## 뷰포트(Viewports)

## 발견 사항

## 명세 불일치

## 스크린샷 / 근거

## 필수 수정 사항
```

---

## 금지 사항

- 눈으로 본 인상만 쓰지 않는다. 화면, viewport, 상태, 재현 조건을 적는다.
- desktop만 확인하고 mobile을 생략하지 않는다.
- long text와 many items를 확인하지 않고 완료하지 않는다.
- 명세와 구현이 다르면 어느 쪽을 고쳐야 하는지 표시한다.

---

## 체크리스트

- [ ] desktop/mobile 둘 다 확인함
- [ ] 모든 MVP 화면을 확인함
- [ ] 상태별 검토가 있음
- [ ] overflow/overlap/long text 문제가 확인됨
- [ ] 수정 항목에 severity와 owner가 있음
