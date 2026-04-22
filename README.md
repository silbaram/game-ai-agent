# Game Design Harness

게임 기획부터 개발 연결까지를 **Agent + Skill 하네스**로 구현한 저장소.

Claude Code / Codex CLI / Gemini CLI 크로스 플랫폼 호환.

---

## 핵심 아이디어

```text
Agent + Skill  = 게임 기획의 source of truth (뼈대)
Web LLM        = 컨셉 이미지 / 무드보드 / 시각 레퍼런스 (살)
Coding Agent   = 실제 개발
```

기획도 Skill + Agent로 한다. 대화창에 휘발되지 않고 프로젝트 파일로 남는다.
리뷰 agent를 반드시 쌍으로 써서 "멋진데 못 만드는 게임"을 방지한다.

---

## 폴더 구조

```text
game-harness/
├── AGENTS.md                     # 공통 지침 (모든 플랫폼 공통)
├── CLAUDE.md                     # Claude Code 전용 보완
├── GEMINI.md                     # Gemini CLI 전용 보완
├── README.md                     # (이 문서)
│
├── agents/                       # 플랫폼 중립 agent 정의 (소스)
│   ├── game-director.md
│   ├── game-concept-designer.md
│   ├── game-rules-designer.md
│   ├── spreadsheet-architect.md
│   ├── balance-reviewer.md
│   └── production-scope-reviewer.md
│
├── skills/                       # 플랫폼 중립 skill 정의 (소스)
│   ├── game-concept-brief/SKILL.md
│   ├── game-core-loop-design/SKILL.md
│   ├── game-rule-design/SKILL.md
│   ├── game-system-spec/SKILL.md
│   └── game-mvp-scope/SKILL.md
│
├── .claude/
│   ├── agents/                   # Claude Code용 (frontmatter 포함 복사본)
│   └── skills/                   # skills/ 동기화 복사본
│
├── .agents/
│   └── skills/                   # Codex CLI / agents.md 표준 복사본
│
└── scripts/
    └── sync-skills.sh            # skills/ → 각 플랫폼 경로 동기화
```

---

## 빠른 시작

### 1) 설치 (기존 게임 프로젝트에 얹기)

```bash
# 게임 프로젝트 루트로 이동한 뒤
cp -r /path/to/game-harness/* ./
cp -r /path/to/game-harness/.claude ./
cp -r /path/to/game-harness/.agents ./
```

### 2) 스킬 동기화

```bash
bash scripts/sync-skills.sh
```

`skills/`가 single source of truth이고, 이 스크립트가 `.claude/skills/`와 `.agents/skills/`로 복사해준다.

### 3) 첫 기획

**Claude Code:**
```text
> Use game-director. 입력: 장르=roguelike deckbuilder, 플랫폼=web,
  핵심 재미=덱 빌딩 + 영구 성장, 분위기=다크 판타지,
  참고=Slay the Spire, Inscryption.
  game-concept-brief와 game-core-loop-design skill을 호출해서
  결과를 game-design/ 하위에 저장해.
```

**Codex CLI:**
```bash
codex run "agents/game-director.md 역할을 맡아서 \
  game-concept-brief skill을 호출. \
  입력은 프롬프트에서 받고 결과는 game-design/concept-brief.md에 저장."
```

**Gemini CLI:**
```bash
gemini "agents/game-director.md를 읽고 그 역할을 맡아. \
  skills/game-concept-brief/SKILL.md에 따라 작업. \
  출력은 game-design/concept-brief.md."
```

---

## 권장 워크플로우

```text
1. game-director           → concept-brief + core-loop
2. game-concept-designer   → 세계관 / 아트 방향
3. game-rules-designer     → rules/*.md
4. production-scope-reviewer → mvp-scope.md  ← 반드시 거친다
5. spreadsheet-architect   → game-master.xlsx
6. balance-reviewer        → 숫자 검토 → 3~5단계 피드백
7. game-rules-designer     → game-system-spec으로 개발 명세 확정
8. (외부) Web LLM          → 컨셉 이미지 / UI mockup
9. Claude Code / Codex     → 실제 구현
```

---

## 한 문장으로

> 기획도 Agent + Skill로 하고, 리뷰 Agent를 반드시 쌍으로 써라.
> 그렇지 않으면 AI가 "멋진 쓰레기"를 자신감 있게 만든다.
