# Day 003: LUMINA K-Pop Beauty UGC Pipeline

Date: 2026-05-08

## Angle

Experiment #3 adapts the faceless UGC operator stack into a fal.ai-only K-pop beauty ad workflow.

The test is whether one fictional idol group identity can carry a 15-second Beauty TikTok-style product hook when the pipeline is staged song-first:

1. Write a short K-pop hook for Lumora glow serum.
2. Generate the song with MiniMax Music 2.6.
3. Cast five fictional K-pop idols through archetype-based GPT Image 2 prompts.
4. Save all five strong candidates as LUMINA members.
5. Generate future image packs from whichever member best fits the ad.
6. Use Seedance 2.0 reference-to-video with idol images and music as references.
7. Preserve or assemble the final MP4.

## Why Song First

The song is the creative anchor. If the hook, product promise, and sonic palette are decided first, the idol persona, image pack, and Seedance storyboard can all point at the same commercial idea.

The hook is short on purpose. Seedance generations are capped at 15 seconds, so this experiment optimizes for one memorable chorus/ad beat rather than a full song.

## Personality Registry

The first real casting pass produced five strong fictional idol directions. Instead of discarding four, this experiment now treats them as LUMINA, a five-member Lumora idol group:

- Rae: premium beauty muse for high-end serum moments.
- Jia: bolder girl-crush performer for sharper hooks.
- Sena: soft solo vocalist for intimate glow rituals.
- Nari: dance ace for performance-led music-video cuts.
- Yumi: approachable idol for UGC-style daily glow content.

The registry lives at:

```text
experiments/003-kpop-idol-beauty-ugc/personalities.json
```

## Five-Member Solo Batch

The next campaign pass generates five solo LUMINA videos, one per member:

- Rae: premium vanity glow.
- Jia: chrome girl-crush stage hook.
- Sena: soft vocalist backstage glow ritual.
- Nari: dance-performance pre-stage momentum.
- Yumi: approachable UGC backstage bloom.

Each member gets five GPT Image 2 edit references:

- intro
- product moment
- beauty close-up
- performance pose
- final frame

Then each member gets one 15-second Seedance reference-to-video clip.

## Safety Boundaries

- LUMINA is a fictional idol group.
- K-pop star influence is archetypal only.
- Prompts avoid real idol names, real-person likeness, logos, and exact celebrity styling.
- Lumora is fictional.
- Beauty claims stay in vibe territory: glow, dewy, camera-ready, pre-stage confidence.
- The writeup references the faceless UGC business stack as inspiration, not as proof of income.

## Commands

Dry-run the full staged workflow:

```bash
npm run generate:003 -- --dry-run
```

Generate the first real pass. This creates the song and five idol candidates in one manifest, then stops for manual selection:

```bash
npm run generate:003
```

The individual stage commands are useful when continuing from an existing manifest:

```bash
npm run generate:003:music -- --manifest outputs/003-kpop-idol-beauty-ugc/<run-id>/manifest.json
npm run generate:003:candidates -- --manifest outputs/003-kpop-idol-beauty-ugc/<run-id>/manifest.json
```

After choosing which member to continue with, add that member image URL to `selectedIdol` in `config.json`, then generate the 15-image pack:

```bash
npm run generate:003:image-pack -- --manifest outputs/003-kpop-idol-beauty-ugc/<run-id>/manifest.json
```

Generate the Seedance reference video:

```bash
npm run generate:003:video -- --manifest outputs/003-kpop-idol-beauty-ugc/<run-id>/manifest.json
```

Assemble or preserve the final MP4:

```bash
npm run generate:003:assemble -- --manifest outputs/003-kpop-idol-beauty-ugc/<run-id>/manifest.json
```

Generate all five LUMINA solo member videos:

```bash
npm run generate:003:members
```

Dry-run the member batch:

```bash
npm run generate:003:members -- --dry-run
```

## Evaluation

Score the output on:

- whether the selected LUMINA member reads consistently across images
- whether the image pack gives Seedance useful visual anchors
- whether the song sounds like a short-form K-pop beauty hook
- whether the Seedance video follows the backstage vanity to performance storyboard
- whether Lumora feels visible without relying on readable labels
- whether the ad feels consumer-facing rather than just a tech demo
- whether the final result suggests a reusable beauty UGC account format

## Publishing Checklist

- Lead with the final 15-second MP4.
- Show the selected LUMINA member base image.
- Include the five archetype casting prompts as the method.
- Explain why reference-to-video was used instead of plain image-to-video.
- Make clear that revenue claims from the original thread were not tested.
