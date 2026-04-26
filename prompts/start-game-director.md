# game-director 시작 프롬프트

아래 프롬프트를 AI tool에 그대로 붙여 넣고, `<>` 부분만 바꾼다.

`game-director를 사용해서 게임 뼈대 문서를 만들어줘.`처럼 필수 입력 없이 요청하면, agent는 파일을 만들지 않고 먼저 입력 질문을 해야 한다.

## 최소 버전

```text
game-director를 사용해서 게임 뼈대 문서를 만들어줘.

입력:
- 장르: <예: 로그라이크 덱빌더>
- 플랫폼: <예: web>
- 핵심 재미: <예: 매 런마다 다른 덱을 짜고, 실패해도 다음 런이 기대되는 성장감>
- 타겟 플레이어: <예: 코어 게이머, 1회 30~60분>
- 분위기/톤: <예: 어두운 판타지, 불길하지만 귀여운 몬스터>
- 참고 게임: <예: Slay the Spire, Inscryption>
- 피하고 싶은 요소: <예: 실시간 전투, 과금 유도, 복잡한 3D 조작>

반드시 아래 파일로 저장해줘:
- game-design/concept-brief.md
- game-design/game-pillars.md
- game-design/core-loop.md
- game-design/system-overview.md

각 파일에는 produced_by, depends_on, next_step frontmatter를 넣어줘.

부족한 입력이 있으면 추측하지 말고 먼저 질문해줘.
```

## 더 쉬운 입력표

무엇을 적어야 할지 모르겠으면 아래 질문에만 답한다.

```text
game-director를 사용해서 게임 뼈대 문서를 만들어줘.

1. 어떤 장르인가?
   - <예: 방치형 RPG, 퍼즐 어드벤처, 로그라이크 덱빌더>

2. 어디에서 플레이하는가?
   - <예: web, mobile, PC>

3. 플레이어가 10초 안에 느껴야 하는 재미는?
   - <예: 클릭할수록 몬스터가 터지고 보상이 쌓이는 재미>

4. 누가 플레이하는가?
   - <예: 출퇴근 중 5분씩 하는 캐주얼 유저>

5. 어떤 분위기인가?
   - <예: 밝고 귀여움 / 축축한 지하세계 / 고요한 SF>

6. 참고 게임은?
   - <예: Vampire Survivors, Slay the Spire>

7. 넣기 싫은 요소는?
   - <예: PvP, 과금 상점, 복잡한 조작>

출력 파일:
- game-design/concept-brief.md
- game-design/game-pillars.md
- game-design/core-loop.md
- game-design/system-overview.md
```

## 이미 아이디어가 문서에 있을 때

`game-design/initial-input.md`를 먼저 만들었다면 이렇게 요청한다.

```text
game-director를 사용해줘.

먼저 game-design/initial-input.md를 읽고,
game-concept-brief와 game-core-loop-design skill을 사용해서
아래 게임 뼈대 문서를 작성해줘.

- game-design/concept-brief.md
- game-design/game-pillars.md
- game-design/core-loop.md
- game-design/system-overview.md

부족한 입력이 있으면 추측하지 말고 먼저 질문해줘.
```

## 다음 단계

`game-director`가 끝나면 보통 다음 중 하나로 진행한다.

- 세계관과 아트 방향을 잡고 싶으면 `game-concept-designer`
- 전투, 아이템, 성장 같은 규칙을 만들고 싶으면 `game-rules-designer`
