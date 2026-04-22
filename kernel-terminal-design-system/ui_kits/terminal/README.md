# Terminal UI Kit (Kernel)

가상의 CLI/TUI 도구 **Kernel** 의 인터페이스 키트. `index.html` 은 클릭 가능한 터미널 세션을 모방 — 로그인, 명령 실행, 서비스 상태 확인, 로그 스트림을 체험할 수 있습니다.

## Components
- `Window.jsx` — 상단 traffic light + 탭 + 타이틀바
- `Prompt.jsx` — `$` 프롬프트 + 입력 + 커서
- `OutputLine.jsx` — stdout/stderr/info 컬러 구분 출력
- `ServiceList.jsx` — 서비스 상태 리스트 (table mode)
- `StatusPill.jsx` — 상태 배지
- `Sidebar.jsx` — 세션 목록
- `CommandPalette.jsx` — ⌘K 팔레트
- `LoginGate.jsx` — 초기 로그인 화면
- `Toolbar.jsx` — 하단 status bar
