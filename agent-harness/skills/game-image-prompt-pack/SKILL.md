---
name: game-image-prompt-pack
description: concept brief, art direction, design system, screen spec이 준비된 뒤, 컨셉 아트, UI mockup, 아이템 아이콘, 캐릭터 컨셉, 배경, 무드보드, asset reference sheet용 Web LLM 이미지 프롬프트를 만들 때 사용한다.
---

# 게임 이미지 프롬프트 팩 Skill

## 목적

Agent + Skill로 정리된 게임 기획, 아트 방향, 디자인 시스템, 화면 명세를 Web LLM 이미지 생성용 프롬프트로 변환한다.

Web LLM은 기획의 source of truth가 아니다. 이 skill은 Web LLM을 컨셉 이미지, UI mockup, 아이콘 시안, 무드보드 생성 보조로 사용하기 위한 프롬프트를 만든다.

## 입력

가능하면 아래 문서를 먼저 읽는다.

- `game-design/concept-brief.md`
- `game-design/game-pillars.md`
- `game-design/art/art-direction.md`
- `ai/specs/ui/design-system.md`
- `ai/specs/ui/screen-map.md`
- `ai/specs/ui/*-screen.md`
- `game-design/spreadsheets/SCHEMA.md`

## 출력 위치

요청에 따라 아래 파일을 작성한다.

- `game-design/art/image-prompts.md`
- `game-design/art/ui-mockup-prompts.md`
- `game-design/art/item-icon-prompts.md`
- `game-design/art/character-concept-prompts.md`
- `game-design/art/background-prompts.md`
- `game-design/art/asset-key-map.md`

Web LLM으로 생성한 참고 이미지는 아래 하위 디렉토리에 저장하도록 안내한다.

- `game-design/art/reference-images/concept/`
- `game-design/art/reference-images/ui-mockups/`
- `game-design/art/reference-images/item-icons/`
- `game-design/art/reference-images/characters/`
- `game-design/art/reference-images/backgrounds/`

## 기본 원칙

1. Web LLM 결과물은 최종 게임 에셋이 아니라 concept reference다.
2. 이미지 안에 UI 텍스트나 아이템 이름을 직접 넣지 않는다.
3. 모든 이미지 요청은 `asset_key`와 연결한다.
4. 화면 mockup은 반드시 기존 `design-system.md`와 `screen-spec.md`를 기준으로 작성한다.
5. 컨셉 이미지가 기존 기획과 충돌하면 이미지가 아니라 기획 문서를 우선한다.
6. 프롬프트에는 장르, 분위기, 색상, 구도, 비율, 사용 목적을 명시한다.
7. 아이콘은 배경보다 오브젝트 식별성을 우선한다.
8. UI mockup은 실제 구현 가능한 레이아웃이어야 한다.
9. 생성 결과를 바로 구현하지 말고 design system 또는 screen spec에 반영한 뒤 구현한다.
10. 생성 이미지의 저장 경로, 사용 목적, 사용 화면, 반영 여부는 `asset-key-map.md`에 기록한다.

## Asset Key Map 형식

`game-design/art/asset-key-map.md`에는 최소한 아래 컬럼을 둔다.

| Column | Meaning |
|---|---|
| `asset_key` | 프롬프트와 생성 이미지를 연결하는 고유 키 |
| `file_path` | `game-design/art/reference-images/` 기준 저장 경로 |
| `type` | `concept`, `ui_mockup`, `item_icon`, `character`, `background` |
| `purpose` | 왜 생성했는지 |
| `used_in` | 반영할 화면 또는 문서 |
| `implementation_note` | 구현에 반영할 디자인 변경점 |
| `final_asset` | 최종 게임 에셋이면 `yes`, 참고용이면 `no` |

## 출력 형식

각 프롬프트는 다음 형식을 사용한다.

```md
## 프롬프트: <name>

### 목적
이 이미지가 필요한 이유.

### 원본 문서
- 참조한 문서 목록

### 에셋 키(Asset Key)
- `asset_key`

### 프롬프트
Web LLM에 입력할 프롬프트.

### 피해야 할 요소(Negative Guidance)
피해야 할 요소.

### 예상 출력
- 비율
- 스타일
- 필요한 변형 수
- 후속 사용 위치

### 구현 메모
생성 결과를 어디에 반영할지.
```

## UI Mockup 프롬프트 규칙

UI mockup 프롬프트에는 반드시 다음을 포함한다.

- 게임 장르
- 화면 이름
- 플랫폼
- 레이아웃 영역
- 핵심 컴포넌트
- 상태
- 색상/톤
- 피해야 할 요소
- 텍스트 삽입 금지 여부
- 실제 구현 시 참고할 asset_key

## 아이템 아이콘 프롬프트 규칙

아이템 아이콘 프롬프트에는 반드시 다음을 포함한다.

- 아이템 타입
- 등급
- 실루엣
- 재질
- 색상 포인트
- 배경 단순화
- 1:1 비율
- 텍스트 금지
- 동일 세트 스타일 유지
