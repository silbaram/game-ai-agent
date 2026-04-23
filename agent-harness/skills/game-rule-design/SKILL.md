---
name: game-rule-design
description: 전투, 아이템, 스킬, 성장, 경제, 퀘스트 등 특정 시스템의 구체적 게임플레이 규칙을 설계할 때 사용한다. "강함", "드묾" 같은 모호한 표현을 금지하고 수치 구체성을 강제한다. 코드와 스프레드시트로 바로 옮길 수 있는 규칙 문서를 만든다.
---

# 게임 규칙 설계 Skill

## 목적

게임 규칙을 **코드와 스프레드시트로 옮길 수 있는 형태**로 정의한다.

이 skill의 핵심 원칙: **숫자와 공식이 없는 규칙은 규칙이 아니다.**

---

## 언제 쓰는가

- 특정 시스템의 규칙을 처음 정의할 때
- 기존 규칙을 구체화해야 할 때
- 밸런스 리뷰 피드백 이후 규칙을 재작성할 때

---

## 입력

- `game-design/concept-brief.md`
- `game-design/core-loop.md`
- `game-design/game-pillars.md`
- 대상 시스템 이름 (예: combat, item, skill, economy, quest)

---

## 절차

1. **시스템의 목적**을 정의한다.
    - 이 시스템이 어떤 Pillar를 지지하는가
    - 이 시스템이 없다면 플레이어가 무엇을 못 하는가
2. **플레이어 행동**을 나열한다.
    - 플레이어가 이 시스템과 상호작용하는 모든 행동
    - 행동마다 입력(input)과 결과(effect)를 쓴다
3. **입력값과 출력값**을 정의한다.
    - 각 행동의 인자, 반환값, 사이드 이펙트
4. **주요 규칙**을 공식과 표로 작성한다.
    - 모든 수치는 **구체적 숫자 또는 공식**으로
    - "강하게" ❌ / "기본 피해의 2.5배" ⭕
    - "드물게" ❌ / "드랍률 3%" ⭕
5. **필요한 데이터 테이블**을 나열한다.
    - 테이블 이름
    - 주요 컬럼 이름과 타입 (정확한 스키마는 `spreadsheet-architect`가 확정)
6. **예외 상황**을 정의한다.
    - 최소 5개 이상
    - 입력 범위 초과, 상태 충돌, 리소스 부족 등
7. **밸런스 위험**을 표시한다.
    - 어떤 값이 과하거나 부족하면 게임이 깨지는가
    - 한계값(breakpoint)이 있는가
8. **UI에 필요한 표시 정보**를 정리한다.
    - 플레이어가 보아야 할 숫자 / 피드백
    - 피드백 타이밍 (즉시 / 턴 종료 / 다음 화면)
9. **테스트 케이스**를 작성한다.
    - 최소 5개
    - 정상 케이스 3 + 경계 케이스 1 + 예외 케이스 1

---

## 출력 형식

파일: `game-design/rules/<system>-rules.md`

```markdown
---
produced_by: game-rules-designer
depends_on:
  - game-design/concept-brief.md
  - game-design/core-loop.md
next_step: production-scope-reviewer | spreadsheet-architect
---

# <System Name> 규칙

## 시스템 목적
- 지지하는 Pillar: <Pillar 이름>
- 없으면 플레이어가 못 하는 것: <...>

## 플레이어 행동
| 행동 | Input | Effect | 빈도 |
|---|---|---|---|
| 기본 공격 | target | damage 계산 및 적용 | 30초 루프당 3~5회 |
| ... | | | |

## 규칙

### 규칙 1: <이름>
**공식:**
```
damage = (attacker.atk - defender.def) * skill_multiplier * crit_factor
crit_factor = 1.5 if rand() < crit_rate else 1.0
```

**제약:**
- damage >= 1
- skill_multiplier ∈ [0.5, 3.0]

### 규칙 2: <이름>
...

## 공식
- HP = base_hp + level * hp_per_level
- base_hp = 50, hp_per_level = 15
- MaxLevel = 30

## 필요한 데이터 테이블

### item_master
| 컬럼 | 타입 | 단위 | 제약 |
|---|---|---|---|
| id | int | - | PK |
| name_ko | string | - | not null |
| rarity | enum | - | common/uncommon/rare/epic/legendary |
| atk | int | dmg | >= 0 |
| ... | | | |

### drop_table
...

## 엣지 케이스(Edge Cases)
1. 인벤토리가 가득 찬 상태에서 드랍 발생 — 필드에 남김 / 자동 판매 / 거부 중 택 1
2. 피해가 최대 HP보다 큼 — overkill 처리 방식
3. 동시에 여러 상태이상 — 우선순위 규칙
4. 플레이어가 사망 직후 아이템 획득 — 인벤토리 반영 시점
5. 레벨업과 피해가 동시 발생 — 순서

## 밸런스 리스크
- atk와 def의 스케일이 맞지 않으면 전투가 즉사 또는 영원 지속
- crit_rate가 20%를 넘으면 일반 공격의 의미가 옅어짐
- drop_rate 곱연산으로 기대값이 1을 넘으면 드랍 인플레이션

## UI 요구사항
- 실시간: HP 바, 피해 숫자 (즉시), 버프 아이콘 (지속시간)
- 전투 종료 후: 획득 경험치, 드랍 아이템 목록
- 인벤토리 화면: 아이템 상세, 비교

## 테스트 케이스(Test Cases)
1. 정상 공격: atk=100, def=20, skill_mult=1.0 → damage=80
2. 치명타: 위 상황 + crit_factor=1.5 → damage=120
3. 방어력 과잉: atk=10, def=100 → damage=1 (최소치 보정)
4. 경계: atk와 def가 동일 → damage=1
5. 예외: 대상이 이미 사망 상태 → 공격 무효, 에러 아님
```

---

## 체크리스트 (완료 조건)

- [ ] 시스템 목적(System Purpose)에 지지 Pillar 명시됨
- [ ] 플레이어 행동(Player Actions) 표가 채워짐
- [ ] Rules 섹션에 **실제 숫자가 있는 공식** 존재
- [ ] 필요한 데이터 테이블(Required Data Tables) 섹션에 테이블 이름과 주요 컬럼 있음
- [ ] 엣지 케이스(Edge Cases) 5개 이상
- [ ] 밸런스 리스크(Balance Risks) 최소 2개
- [ ] UI 요구사항(UI Requirements) 있음
- [ ] 테스트 케이스(Test Cases) 5개 이상

---

## 흔한 실수

- **"적절히", "충분히", "자주" 등의 모호한 표현**: 이 skill이 가장 많이 잡아내는 실수.
- **공식은 있는데 변수의 값이 없음**: `damage = atk * x`에서 `x`가 뭔지 써야 한다.
- **엣지 케이스를 "죽었을 때"로만 끝냄**: 그것도 중요하지만 더 있다 (인벤토리 풀, 상태이상 중첩, 네트워크 지연 등).
- **밸런스 위험을 "밸런스 잘 맞춰야 함"으로 씀**: 구체적 breakpoint와 영향을 써야 한다.
- **데이터 테이블에 타입 없음**: 타입 없이는 스프레드시트로 못 옮긴다.

---

## 중요: 이 skill은 밸런스를 확정하지 않는다

초안 숫자를 쓰되, "검토 필요"로 표시한다.
`balance-reviewer`가 검토한 후에야 숫자가 확정된다.
이 skill에서 나온 숫자는 **기능하는 초안**이지 **최종 밸런스**가 아니다.
