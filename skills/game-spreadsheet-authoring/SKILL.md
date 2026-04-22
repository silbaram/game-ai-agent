---
name: game-spreadsheet-authoring
description: Use after MVP scope is fixed to convert rule documents into CSV/XLSX game data tables, schema docs, draft records, and validation rules. Triggered by spreadsheet-architect.
---

# Game Spreadsheet Authoring Skill

## 목적

게임 규칙을 **기획자가 수정 가능하고 개발자가 import 가능한 데이터 테이블**로 변환한다.

규칙 문서의 `Required Data Tables`를 기준으로 삼고, MVP 범위 밖의 데이터는 만들지 않는다.

---

## 입력

- `game-design/rules/*.md`
- `game-design/mvp-scope.md`
- `game-design/core-loop.md`
- (있다면) `game-design/systems/*.md`

---

## 절차

1. 모든 규칙 파일의 `Required Data Tables` 섹션을 수집한다.
2. `mvp-scope.md`의 Must 기능만 MVP 데이터로 분리한다.
3. 각 테이블의 컬럼을 확정한다.
    - `snake_case`
    - 첫 컬럼은 `id`
    - 타입, 단위, nullable, min/max, enum 값을 명시
4. 테이블 간 참조 관계를 정의한다.
5. `game-design/spreadsheets/SCHEMA.md`를 먼저 작성한다.
6. 각 CSV를 작성한다.
    - 한 행은 하나의 record만 표현
    - 샘플 데이터는 테이블당 5-20행
    - 수치 값은 문자열이 아닌 숫자 타입으로 표현
7. `game-master.xlsx`를 만들 수 있으면 각 CSV를 별도 시트로 묶는다.
8. 검증 규칙을 `SCHEMA.md`에 적는다.

---

## 출력 형식

기본 출력:

```text
game-design/spreadsheets/SCHEMA.md
game-design/spreadsheets/item-master.csv
game-design/spreadsheets/skill-master.csv
game-design/spreadsheets/enemy-master.csv
game-design/spreadsheets/stage-master.csv
game-design/spreadsheets/drop-table.csv
game-design/spreadsheets/economy-balance.csv
game-design/spreadsheets/quest-master.csv
game-design/spreadsheets/game-master.xlsx
```

`SCHEMA.md` frontmatter:

```yaml
---
produced_by: spreadsheet-architect
depends_on:
  - game-design/rules/
  - game-design/mvp-scope.md
next_step: balance-reviewer
---
```

---

## CSV 원칙

- ID와 표시 이름을 분리한다.
- 로컬라이징 텍스트는 가능하면 `localization` 테이블로 분리한다.
- 이미지 파일 자체가 아니라 `icon_key`, `asset_path`를 사용한다.
- 확률은 0-1 float 또는 0-100 pct 중 하나로 통일하고 `SCHEMA.md`에 단위를 명시한다.
- 한 시트에 여러 독립 테이블을 섞지 않는다.
- `TBD`, `적당히`, 빈 값으로 밸런스 숫자를 남기지 않는다.

---

## 체크리스트

- [ ] `SCHEMA.md`에 모든 테이블, 컬럼, 타입, 단위가 있음
- [ ] 모든 CSV 첫 줄이 header임
- [ ] FK 참조가 깨지지 않음
- [ ] drop 확률 합계와 enum 값이 검증 가능함
- [ ] MVP 범위 밖 데이터는 Later 또는 주석으로 분리됨
