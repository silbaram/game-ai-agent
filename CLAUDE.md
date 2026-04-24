# CLAUDE.md

Claude Code에서 이 프로젝트를 사용할 때 참조하는 파일이다.
공통 지침은 `AGENTS.md`를 먼저 읽고, 이 문서는 **Claude Code 전용 보완 사항**만 담는다.

---

## 1. Subagent 위치

Claude Code subagent는 대상 게임 프로젝트의 `.claude/agents/<agent-name>.md`에 있다.

사용 예:

```text
> Use game-director to create the initial concept for a roguelike deckbuilder
> Use game-rules-designer to design combat rules
> Use balance-reviewer to check the item drop table
```

subagent는 별도 context window에서 실행되며, 각자 독립된 tool 권한을 가진다.

---

## 2. Skill 위치

Claude Code skill은 대상 게임 프로젝트의 `.claude/skills/<skill-name>/SKILL.md`에 있다.

Skill은 progressive disclosure 방식으로 로드된다:
- Claude는 먼저 skill의 frontmatter(`name`, `description`)만 본다
- 요청에 맞을 때만 SKILL.md 전체를 읽는다

따라서 `description`이 정확해야 한다. 이 프로젝트의 skill description은 전부 이 기준을 지킨다.

---

## 3. 권장 실행 패턴

### 기획 초안
```text
> Use game-director subagent. 
  Input: 장르=roguelike, 플랫폼=web, 핵심 재미=덱 빌딩 + 영구 성장,
         분위기=다크 판타지, 참고=Slay the Spire, Inscryption.
  Call game-concept-brief and game-core-loop-design skills.
  Save outputs to game-design/.
```

### 규칙 설계
```text
> Use game-rules-designer subagent.
  Design: combat-rules.md, item-rules.md, skill-rules.md.
  Follow game-rule-design skill.
  Reference: game-design/concept-brief.md, game-design/core-loop.md.
```

### MVP 축소 (반드시 구현 전)
```text
> Use production-scope-reviewer subagent.
  Follow game-mvp-scope skill.
  Review all files in game-design/ and produce game-design/mvp-scope.md
  and ai/reviews/production/initial-scope-cut.md.
```

### 밸런스 검토
```text
> Use balance-reviewer subagent.
  Input: game-design/spreadsheets/game-master.xlsx
  Output: ai/reviews/balance/round-1.md
```

### UI 명세
```text
> Use ui-planner subagent.
  Reference: game-design/mvp-scope.md, game-design/systems/*.md,
             game-design/art/art-direction.md.
  Follow design-system-spec and game-screen-spec skills.
  Output: ai/specs/ui/.
```

---

## 4. Tool 권한 권장값

| Agent | 권장 tools |
|---|---|
| `game-director` | Read, Write, Edit |
| `game-concept-designer` | Read, Write, Edit |
| `game-rules-designer` | Read, Write, Edit |
| `spreadsheet-architect` | Read, Write, Edit, Bash (csv/xlsx 생성) |
| `balance-reviewer` | Read, Bash (시뮬레이션), Write (리뷰 문서만) |
| `production-scope-reviewer` | Read, Write |
| `ui-planner` | Read, Write, Edit |
| `ui-implementer` | Read, Write, Edit, Bash |
| `browser-preview-reviewer` | Read, Write, Bash |

각 agent 파일의 frontmatter에 이미 반영되어 있다.

- `ui-implementer`는 실제 production source code(`src/*`, `components/*`, `screens/*`, `tests/*`)를 수정할 수 있다.
- `browser-preview-reviewer`는 preview/test 명령과 리뷰 문서 작성에 집중하며, production source code를 직접 수정하지 않는다.

---

## 5. 동기화

하네스 루트의 `agent-harness/agents/`와 `agent-harness/skills/`가 원본이다. Claude Code용 복사본은 대상 게임 프로젝트를 지정해서 갱신한다.

```bash
bash scripts/sync-skills.sh --target /path/to/game-project --tool claude
```

이 명령은 대상 프로젝트의 `.claude/agents/`와 `.claude/skills/`를 함께 갱신한다.

---

## 6. 대화 종료 후 확인 사항

agent가 작업을 끝내면 반드시 아래 3가지를 확인한다:

1. **산출물이 파일로 저장되었는가** (`game-design/` 또는 `ai/reviews/`)
2. **frontmatter의 `produced_by`, `depends_on`, `next_step`이 적혀 있는가**
3. **다음 단계 agent가 명시되었는가**

이 셋 중 하나라도 빠지면 agent에게 보완을 요청한다.

---

## 7. 권한 모드

기획 단계에서는 `acceptEdits` 모드가 편하다. 규칙 설계와 스프레드시트 생성은 반복 수정이 잦기 때문이다.
구현 단계로 넘어갈 때는 기본 모드로 돌아가 각 수정에 대한 확인을 받는다.
