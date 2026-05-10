# LUMINA

LUMINA is the canonical project folder for the fictional five-member K-pop group that started as experiment `003-kpop-idol-beauty-ugc`.

The experiment folder remains the working generator config. This folder is the creative source of truth: research, brand rules, song slates, lyrics, and Seedance-ready music video plans.

## Project Shape

```text
lumina/
  README.md
  brand/
    lumina-brand-bible.md
  research/
    2026-girl-group-hit-patterns.md
  songs/
    five-song-slate.md
  storyboards/
    selected-song-storyboard-template.md
```

## Current Workflow

1. Research recent girl-group K-pop hits and adjacent global girl-group signals.
2. Write five original LUMINA song ideas with complete lyrics.
3. Pick one song.
4. Generate the selected song with `fal-ai/minimax-music/v2.6`.
5. Build a strict 9-panel, 9:16 Seedance storyboard around the selected song.

## Generation Defaults

- Song target: 60-75 seconds.
- Video target: strict 9-panel Seedance storyboard with image-pack references reviewed before video generation.
- Keep every member fictional and original.
- Do not prompt for real idol likenesses, exact choreography cloning, readable logos, or clinical skincare claims.
- Lumora can appear as brand-world texture, but LUMINA songs should work as pop singles first.

## Existing Generator

Use the current experiment commands until the CLI is refactored around top-level projects:

```bash
npm run generate:003:music -- --manifest outputs/003-kpop-idol-beauty-ugc/<run-id>/manifest.json
npm run generate:003:video -- --manifest outputs/003-kpop-idol-beauty-ugc/<run-id>/manifest.json
```
