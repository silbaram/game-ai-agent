---
name: game-balance-review
description: Use after spreadsheet data exists to review progression, rewards, drop rates, prices, combat pacing, formulas, and numeric outliers with concrete evidence. Triggered by balance-reviewer.
---

# Game Balance Review Skill

## 목적

게임 데이터와 규칙의 숫자가 **핵심 루프와 플레이 시간에 맞는지** 검토한다.

리뷰는 감상이 아니라 계산이어야 한다. 모든 지적은 수치 근거와 구체적 수정 제안을 포함한다.

---

## 입력

- `game-design/spreadsheets/*.csv` 또는 `game-design/spreadsheets/game-master.xlsx`
- `game-design/spreadsheets/SCHEMA.md`
- `game-design/core-loop.md`
- `game-design/rules/*.md`
- `game-design/mvp-scope.md`

---

## 절차

1. 기준 루프 시간을 확인한다.
    - 30초 루프 목표
    - 5분 루프 목표
    - 1일/장기 루프가 있는지
2. 전투 시간 추정치를 계산한다.
    - `expected_time_to_kill = enemy_hp / player_dps`
    - 일반 전투가 목표 30초 루프의 1.2배를 넘으면 경고
3. 성장 곡선을 검토한다.
    - XP 요구량 증가율
    - 스테이지 보상 누적치
    - 레벨업 예상 루프 횟수
4. 보상과 가격을 검토한다.
    - `purchase_time = item_price / expected_currency_per_loop`
    - 구매 목표 시간이 세션 길이를 넘는지 확인
5. 드랍률을 검토한다.
    - `expected_runs = 1 / drop_rate`
    - 희귀 아이템 획득 기대 시간이 과도한지 확인
6. 이상치를 탐지한다.
    - 같은 rarity 내 주요 스탯 편차
    - 가격/성능 역전
    - 음수, 0, null, enum 위반
7. 리뷰 문서를 작성한다.

---

## 출력 형식

```text
ai/reviews/balance/round-N.md
ai/reviews/balance/formulas-sanity-check.md
ai/reviews/balance/outliers.md
```

리뷰 frontmatter:

```yaml
---
produced_by: balance-reviewer
depends_on:
  - game-design/spreadsheets/
  - game-design/rules/
  - game-design/core-loop.md
next_step: spreadsheet-architect | game-rules-designer
---
```

각 finding 형식:

```markdown
## Finding: <문제 요약>

- Severity: High | Medium | Low
- Evidence: <계산 근거>
- Impact: <플레이어 경험/루프 영향>
- Recommendation: <구체적 수정값>
- Owner: spreadsheet-architect | game-rules-designer
```

---

## 금지 사항

- "느낌상", "대체로", "좀" 같은 표현으로 결론 내지 않는다.
- 수정 제안 없이 문제만 말하지 않는다.
- 리뷰어가 직접 밸런스 값을 수정하지 않는다. 다음 담당 agent를 지정한다.
- 이상치가 있는데 "문제 없음"으로 끝내지 않는다.

---

## 체크리스트

- [ ] 모든 주요 finding에 수치 근거가 있음
- [ ] 수정 제안이 실제 값으로 제시됨
- [ ] 루프 시간과 보상/전투 시간이 연결됨
- [ ] 이상치가 있으면 `outliers.md`에 별도 정리됨
- [ ] 다음 단계 담당 agent가 지정됨
