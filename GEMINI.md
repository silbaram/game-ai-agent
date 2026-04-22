# GEMINI.md

Gemini CLI에서 이 프로젝트를 사용할 때 참조하는 파일이다.
공통 지침은 `AGENTS.md`를 먼저 읽는다.

---

## 1. Skill 위치

Gemini CLI는 `.agents/skills/<skill-name>/SKILL.md` 또는 프로젝트 루트의 `skills/` 디렉토리를 통해 skill을 로드한다.

이 프로젝트는 두 경로 모두에 동일한 SKILL.md 복사본을 유지한다 (`scripts/sync-skills.sh` 참조).

---

## 2. Agent는 어떻게?

Gemini CLI는 Claude Code의 subagent와 정확히 1:1로 대응되는 개념이 없다.
대신 **프롬프트 주입** 방식으로 역할을 부여한다.

예:

```text
아래 역할을 맡아서 작업해줘.
역할 정의는 agents/game-director.md 를 그대로 따른다.
이후 game-concept-brief skill 을 호출해서 결과를 game-design/concept-brief.md 로 저장해.
```

즉, `.claude/agents/*.md`가 아니라 **`agents/*.md`** (플랫폼 중립 버전)를 읽도록 지시한다.

---

## 3. 권장 실행 순서

`AGENTS.md`의 섹션 5와 동일하다. Gemini는 파일 읽기/쓰기 권한이 허용된 상태에서 작업한다.

---

## 4. 제약 사항

- Gemini CLI는 현재 Claude Code 수준의 세분화된 tool 권한 제어가 약할 수 있다. 민감한 파일(예: `.env`, 결제 관련)은 디렉토리 수준에서 분리해 둔다.
- 긴 세션에서 컨텍스트가 밀려날 수 있으니, 각 agent의 역할 정의는 매 요청마다 명시적으로 재전달한다.
