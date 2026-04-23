# GEMINI.md

Gemini CLI에서 이 프로젝트를 사용할 때 참조하는 파일이다.
공통 지침은 `AGENTS.md`를 먼저 읽는다.

---

## 1. Skill 위치

Gemini CLI는 대상 게임 프로젝트의 `.gemini/skills/<skill-name>/SKILL.md` 또는 `.agents/skills/<skill-name>/SKILL.md`에서 workspace skill을 로드한다.

동기화 스크립트는 두 경로에 동일한 SKILL.md 복사본을 생성한다 (`scripts/sync-skills.sh` 참조).
같은 이름의 skill이 양쪽에 있으면 Gemini CLI 공식 규칙상 `.agents/skills/`가 `.gemini/skills/`보다 우선한다.

---

## 2. Agent는 어떻게?

Gemini CLI는 Claude Code의 subagent와 정확히 1:1로 대응되는 개념이 없다.
대신 공식 custom command를 사용해 **프롬프트 주입** 방식으로 역할을 부여한다.

예:

```text
> /agents:game-director 장르=roguelike deckbuilder, 플랫폼=web, 핵심 재미=덱 빌딩 + 영구 성장
```

custom command 원본은 하네스의 `agent-harness/gemini-commands/agents/*.toml`이고, 동기화 후 대상 프로젝트의 `.gemini/commands/agents/*.toml`에 생성된다.
각 command는 `.gemini/agents/*.md` 역할 정의를 `@{...}` 파일 주입으로 읽는다.

---

## 3. 권장 실행 순서

`AGENTS.md`의 섹션 5와 동일하다. Gemini는 파일 읽기/쓰기 권한이 허용된 상태에서 작업한다.

---

## 4. 동기화

하네스 루트의 `agent-harness/skills/`, `agent-harness/agents/`, `agent-harness/gemini-commands/`가 원본이다. Gemini용 skill, agent, command 복사본은 대상 게임 프로젝트를 지정해서 갱신한다.

```bash
bash scripts/sync-skills.sh --target /path/to/game-project --tool gemini
```

동기화 대상:

```text
agent-harness/skills/           -> <target>/.gemini/skills/
agent-harness/skills/           -> <target>/.agents/skills/
agent-harness/agents/           -> <target>/.gemini/agents/
agent-harness/gemini-commands/  -> <target>/.gemini/commands/
```

---

## 5. 제약 사항

- Gemini CLI는 현재 Claude Code 수준의 subagent manifest를 쓰지 않는다. 역할 분리는 `/agents:<name>` custom command로 수행한다.
- 긴 세션에서 컨텍스트가 밀려날 수 있으니, 필요한 경우 `/memory reload` 또는 `/skills reload` 후 다시 command를 실행한다.
