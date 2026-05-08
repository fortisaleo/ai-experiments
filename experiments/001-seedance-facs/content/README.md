# Day 001: Seedance FACS Facial Performance

Date: 2026-05-07

## Angle

Experiment #1 in the daily AI experiment series: generate facial-performance videos from one GPT Image 2 base portrait using Seedance 2.0 and FACS-style Action Unit prompts.

## Base Image Selection Workflow

The base image matters because every Seedance clip uses it as the starting frame.

Generate five portrait candidates first:

```bash
npm run generate:001:candidates
```

The command writes candidates to:

```text
outputs/001-seedance-facs/<run-id>/base-candidates/
```

The current candidate set asks for five synthetic original portraits with different subject descriptors:

- East Asian features
- Black African features
- South Asian features
- Latina features
- Middle Eastern features

Pick the strongest candidate for facial-performance animation: readable eyes, brows, cheeks, lips, jaw, natural lighting, and a neutral expression with enough beauty/editorial polish to lead the post.

After selecting a candidate, save its generated image URL in `selectedBaseImage` inside `experiments/001-seedance-facs/config.json`.

Experiment 001 currently uses `04-latina` as the selected base image.

Upscale the selected image with fal Topaz before Seedance generation:

```bash
npm run generate:001:upscale
```

The command writes the upscaled image and manifest to:

```text
outputs/001-seedance-facs/<run-id>/selected-base-upscaled.png
```

After the upscale completes, copy the upscaled image URL from the manifest into `selectedBaseImage.upscaledImageUrl` in `experiments/001-seedance-facs/config.json`.

Experiment 001 currently uses this upscaled selected image:

```text
outputs/001-seedance-facs/upscaled/selected-base-04-latina-topaz.png
```

Run the full Seedance batch with the selected image:

```bash
npm run generate:001
```

## Current Seedance Pass

The current direct FACS four-clip batch uses the Topaz-upscaled selected image and generates:

- `beautiful-smile`
- `flirtatious-look`
- `deep-sadness`
- `laughing`

All four clips use `bytedance/seedance-2.0/image-to-video`, `720p`, `9:16`, `5s`, and `generateAudio: false`.

## Direct FACS vs Storyboard Prompting

This experiment now has two comparable Seedance passes.

Direct FACS prompting uses compact Action Unit lists as the main prompt. It tests whether raw AU-style controls are enough for Seedance to produce the intended facial performance.

Storyboard prompting uses the same Action Units, but wraps them in a timed 5-second shot plan: starting pose, expression onset, peak, resolution, one camera instruction, and continuity rules. It tests whether temporal and cinematic structure improves Seedance's interpretation.

Run the storyboard pass:

```bash
npm run generate:001:storyboard
```

The storyboard config lives at:

```text
experiments/001-seedance-facs/storyboard-config.json
```

## Multi-AU 15s Sequence

This experiment also includes a third comparison pass: one 15-second square Seedance clip that cycles through 14 FACS-style beats in a single continuous close-up.

Run the multi-AU pass:

```bash
npm run generate:001:multi-au
```

The multi-AU config lives at:

```text
experiments/001-seedance-facs/multi-au-sequence-config.json
```

This pass uses:

- the same Topaz-upscaled selected base image
- `duration: "15"`
- `aspectRatio: "1:1"`
- one clip: `multi-au-hypnotic-sequence`

The FACS grid is a human reference for Action Unit labels:

```text
experiments/001-seedance-facs/facs units.jpeg
```

It is not passed to Seedance as a second identity reference. Current fal Seedance image-to-video uses one start image URL. The FACS grid should not be copied for identity, layout, clothing, or background.

`AU84` and `AU85` are likely stress-test beats because tongue actions may be harder for Seedance to express cleanly from a tight portrait.

## Content

- Main launch post: `launch-post.md`
- X Article draft: `x-article.md`

## Media

Lead multi-AU clip:

```text
outputs/001-seedance-facs/2026-05-07T20-40-40-959Z-facs-portrait-multi-au/videos/01-multi-au-hypnotic-sequence.mp4
```

Selected Topaz-upscaled base image:

```text
outputs/001-seedance-facs/upscaled/selected-base-04-latina-topaz.png
```

Direct FACS comparison clip:

```text
outputs/001-seedance-facs/2026-05-07T19-45-57-994Z-facs-portrait/videos/01-beautiful-smile.mp4
```

Storyboard comparison clip:

```text
outputs/001-seedance-facs/2026-05-07T20-04-25-358Z-facs-portrait-storyboard/videos/01-storyboard-beautiful-smile.mp4
```

Storyboard clips:

```text
outputs/001-seedance-facs/2026-05-07T20-04-25-358Z-facs-portrait-storyboard/videos/01-storyboard-beautiful-smile.mp4
outputs/001-seedance-facs/2026-05-07T20-04-25-358Z-facs-portrait-storyboard/videos/02-storyboard-flirtatious-look.mp4
outputs/001-seedance-facs/2026-05-07T20-04-25-358Z-facs-portrait-storyboard/videos/03-storyboard-deep-sadness.mp4
outputs/001-seedance-facs/2026-05-07T20-04-25-358Z-facs-portrait-storyboard/videos/04-storyboard-laughing.mp4
```

Storyboard manifest:

```text
outputs/001-seedance-facs/2026-05-07T20-04-25-358Z-facs-portrait-storyboard/manifest.json
```

Future runs for this experiment are written to:

```text
outputs/001-seedance-facs/<run-id>/
```

## Publishing Checklist

- Lead with the 15-second multi-AU sequence in the main post.
- Use the first reply for the exact 14-beat Seedance prompt.
- Use the FACS explainer reply if the main post feels too dense.
- Paste the X Article first so the launch post can link to it.
- Attach the lead multi-AU clip to the launch post.
- Link the GitHub repo after code changes are committed and pushed.
