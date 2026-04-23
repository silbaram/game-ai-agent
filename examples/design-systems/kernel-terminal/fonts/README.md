# Fonts

이 예시 디렉토리에는 라이선스 혼선을 피하기 위해 바이너리 폰트 파일(`.ttf`, `.woff2`)을 기본 포함하지 않습니다.
필요 시 라이선스를 확인한 뒤 프로젝트에서 직접 다운로드해 사용하세요.

현재는 Google Fonts CDN 을 통해 다음을 로드합니다 (`colors_and_type.css` 최상단의 @import):

- **JetBrains Mono** — 메인 모노스페이스 (400, 500, 700, 400-italic)
- **IBM Plex Sans** — 라틴 산세리프 (400, 500, 600, 700)
- **IBM Plex Sans KR** — 한글 페어링 (400, 500, 600, 700)

## 브랜드 전용 폰트로 교체하기

이 폴더에 ttf/woff2 파일을 떨어뜨린 뒤, `colors_and_type.css` 의 `@import` 한 줄을 `@font-face` 블록으로 교체하세요:

```css
@font-face {
  font-family: "Your Mono";
  src: url("./fonts/YourMono-Regular.woff2") format("woff2");
  font-weight: 400;
  font-display: swap;
}
/* ...repeat for each weight... */
```

그리고 `--font-mono` 변수의 첫 번째 값을 교체하세요.

## 왜 JetBrains Mono 인가?
- 프로그래밍용으로 설계된 모노스페이스 (L/1, O/0, {/} 구분 뚜렷)
- 오픈소스 (OFL-1.1)
- Ligatures 지원 (기본은 off 로 둠 — 터미널 정렬 유지 위해)
- 굵기 다양 (Thin → ExtraBold)
- 라틴 + 키릴 + 그리스 커버리지

## 한글 이슈
JetBrains Mono 는 한글 글리프가 없어 IBM Plex Sans KR 로 fall-back 합니다. 한/영 혼용시 **한글만 약간 작아 보일 수 있음** — 필요하다면 `.font-kr` 클래스에서 size 조정.
