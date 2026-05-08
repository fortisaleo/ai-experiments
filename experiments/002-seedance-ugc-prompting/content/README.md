# Day 002: Seedance UGC 5-Beat Prompting

Date: 2026-05-07

## Angle

Experiment #2 tests whether a production-style 5-beat Seedance prompt creates more usable UGC output than a loose UGC prompt.

The source insight is that Seedance 2.0 performs better when a 15-second generation is treated as one continuous scene with a clear subject, concrete environment, limited action density, explicit camera direction, and lighting/mood tags at the end.

## Comparison

This experiment generates one reusable beauty creator base image, then three Seedance 2.0 clips from the same image:

- `baseline-loose-ugc`: intentionally vague control prompt.
- `five-beat-structured-ugc`: subject, setting, action, selfie POV camera, and lighting/mood.
- `five-beat-pronunciation-defense`: same structure with explicit `Lumora` pronunciation as `Loo Mora`.

All clips use:

- `bytedance/seedance-2.0/image-to-video`
- `duration: "15"`
- `aspectRatio: "9:16"`
- `resolution: "720p"`
- `generateAudio: true`

## Prompting Rules Tested

- Keep one 15-second generation to one continuous scene.
- Use one primary action plus one or two secondary beats.
- Embed dialogue inline with `says, "..."`.
- Put brand names on visible-speaker beats.
- Use phonetic spelling and repetition for the fictional brand: `Loo Mora, Loo Mora`.
- Define selfie POV as the phone's front-facing camera, with no phone visible.
- Use real-world props for realism cues, but do not ask Seedance to render readable logos or text.

## Commands

Dry-run the resolved requests:

```bash
npm run generate:002 -- --dry-run
```

Generate the base image and all three videos:

```bash
npm run generate:002
```

Outputs are written to:

```text
outputs/002-seedance-ugc-prompting/<run-id>/
```

## Evaluation

Score each clip on:

- subject consistency
- selfie POV correctness
- whether a phone appears by mistake
- audio sync
- brand pronunciation
- prop realism
- whether the clip feels like real UGC
- whether the structured prompt reduces regeneration risk

## Content

- Main launch post: `launch-post.md`
- X Article draft: `x-article.md`

## Publishing Checklist

- Watch all three clips before posting.
- Lead with the best structured clip, likely `five-beat-pronunciation-defense`.
- Use the baseline clip as comparison context only if it clearly shows the value of structure.
- Link the X Article after publishing.
- Link the GitHub repo after code/docs are pushed.
