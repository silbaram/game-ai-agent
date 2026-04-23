---
name: kernel-design
description: Use this skill to generate well-branded interfaces and assets for Kernel, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick reference

- **Tokens**: `colors_and_type.css` — import for every artifact
- **Fonts**: JetBrains Mono + IBM Plex Sans / Plex Sans KR (loaded via Google Fonts CDN inside the stylesheet)
- **Palette**: dark-first. `#0B0D0E` base. Accent `#00E26B` phosphor green. Amber/red/cyan semantic
- **Shape**: 1px borders, 0 or 2px radius only. **No pill, no drop shadow.** Glow only for focus.
- **Type**: mono-first. 12/13/14/16/20/28/40 px. line-height 1.5 for mono.
- **Motion**: ≤140ms, `steps(1)` or linear. No bounce, no scale.
- **Icons**: unicode symbols first (`● ○ ◆ ✓ ✗ → ↑`), then Lucide (stroke 1.5). **No emoji.**

## UI kits available
- `ui_kits/terminal/` — CLI/TUI app with login, session, command palette
- `ui_kits/web/` — marketing landing + docs site

## Tone
Terse, technical, lowercase. man-page style. Specific numbers. No emoji. In Korean, "~합니다" style only.
