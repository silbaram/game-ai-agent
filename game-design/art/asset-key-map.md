---
produced_by: codex
depends_on:
  - prompts/start-game-director.md
  - agent-harness/skills/game-image-prompt-pack/SKILL.md
next_step: ui-implementer
---

# Asset Key Map

Web LLM으로 생성한 이미지는 최종 게임 에셋이 아니라 구현 전 참고용 시각 레퍼런스다.
생성 이미지는 `game-design/art/reference-images/` 아래에 저장하고, 실제 구현에는 이 표의 `implementation_note`를 명세에 반영한 뒤 사용한다.

## 저장 경로 규칙

| Type | Directory |
|---|---|
| Concept reference | `game-design/art/reference-images/concept/` |
| UI mockup reference | `game-design/art/reference-images/ui-mockups/` |
| Item icon reference | `game-design/art/reference-images/item-icons/` |
| Character reference | `game-design/art/reference-images/characters/` |
| Background reference | `game-design/art/reference-images/backgrounds/` |

## 이미지 매핑

| asset_key | file_path | type | purpose | used_in | implementation_note | final_asset |
|---|---|---|---|---|---|---|
| `concept-main-v01` | `game-design/art/reference-images/concept/concept-main-v01.png` | concept | 게임 전체 분위기와 색감 참고 | `game-design/art/art-direction.md` | 색상, 조명, 실루엣 방향만 반영 | no |
| `ui-main-screen-v01` | `game-design/art/reference-images/ui-mockups/ui-main-screen-v01.png` | ui_mockup | 메인 화면 레이아웃 참고 | `ai/specs/ui/main-screen.md` | 정보 밀도, 버튼 배치, 시각 계층만 반영 | no |
| `item-icon-style-v01` | `game-design/art/reference-images/item-icons/item-icon-style-v01.png` | item_icon | 아이템 아이콘 스타일 후보 | `game-design/art/item-icon-prompts.md` | 외곽선 두께, 배경 단순화, 등급 색상 규칙만 반영 | no |

## 작성 규칙

- `asset_key`는 프롬프트 문서의 에셋 키와 동일하게 쓴다.
- `file_path`는 생성 이미지의 실제 저장 경로를 쓴다.
- `final_asset`은 참고용이면 `no`, 게임에 직접 포함할 최종 에셋으로 확정된 경우에만 `yes`로 바꾼다.
- Web LLM 이미지가 기획 문서와 충돌하면 이미지를 수정하거나 폐기하고 기획 문서를 우선한다.
