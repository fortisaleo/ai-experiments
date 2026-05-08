# Testing 14 FACS Action Units in One Seedance 2.0 Clip

I wanted to see if Seedance 2.0 could follow a facial-performance prompt written as a sequence of Action Unit beats instead of broad emotion labels.

Not "happy."

Not "sad."

Not "make her look uncanny."

The test was more mechanical: keep one generated face fixed, then move through 14 FACS-style facial actions in one continuous 15-second close-up.

This is Experiment 001 in a daily open-source AI experiment series. The broader goal is simple: ship one small AI experiment every day, publish the workflow, and leave behind code/config/prompts that other builders can inspect or remix.

## The Experiment

The setup:

1. Generate a cinematic base portrait with GPT Image 2 through fal.ai.
2. Pick the strongest portrait candidate.
3. Upscale it with fal Topaz.
4. Use the upscaled portrait as the Seedance 2.0 start frame.
5. Ask Seedance to animate 14 facial Action Unit beats in one 15-second square video.

The result is a stress test for facial control.

Instead of generating one smile, one sad expression, or one laugh, this prompt asks the model to move through a sequence:

```text
1: AU10 upper lip raiser
2: AU20 lip stretcher
3: AU22 lip funneler
4: AU23 lip tightener
5: AU27 mouth stretch
6: AU28 lip suck
7: AU45 blink
8: AU53 head up
9: AU61 eyes turn left
10: AU62 eyes turn right
11: AU64 eyes down
12: AU85 tongue out
13: AU84 tongue up
14: AU46 wink
```

The mood direction was intentionally narrow:

```text
Uneasy, hypnotic, controlled mood.
No monster transformation, no gore, no comedy, no text overlay, no watermark.
Preserve identity, face shape, skin texture, hair, lighting, framing, and background.
```

## What Is An Action Unit?

FACS stands for Facial Action Coding System.

It is a way to describe visible facial movement using individual components called Action Units.

An Action Unit is not an emotion. It is a specific facial movement.

For example:

- `AU10` = upper lip raiser
- `AU20` = lip stretcher
- `AU22` = lip funneler
- `AU23` = lip tightener
- `AU45` = blink
- `AU61` / `AU62` = eyes turn left / right
- `AU64` = eyes down
- `AU46` = wink

That distinction matters.

If I prompt a model with "she looks nervous," the model has to invent the facial mechanics.

If I prompt with Action Units, I am giving it a lower-level performance target: what should move, in what order, and with what kind of restraint.

The model may still interpret the prompt loosely. This is not a scientific FACS validation. But it is a useful creative-control test.

## The Full Seedance Prompt

This was the actual 15-second prompt:

```text
Use the provided character image as the fixed identity reference.

15s, 1:1, 14 beats, beat-synced, cinematic tight close-up, subtle neutral background, high facial clarity, slow micro push-in, shallow depth of field.

The FACS reference grid is only for interpreting Action Unit labels. Do not copy the grid character, layout, clothing, or background.

1: AU10 upper lip raiser
2: AU20 lip stretcher
3: AU22 lip funneler
4: AU23 lip tightener
5: AU27 mouth stretch
6: AU28 lip suck
7: AU45 blink
8: AU53 head up
9: AU61 eyes turn left
10: AU62 eyes turn right
11: AU64 eyes down
12: AU85 tongue out
13: AU84 tongue up
14: AU46 wink

Uneasy, hypnotic, controlled mood.
No monster transformation, no gore, no comedy, no text overlay, no watermark.
Preserve identity, face shape, skin texture, hair, lighting, framing, and background.
```

The FACS grid was used as human reference material for the labels. It was not passed to Seedance as a second identity image.

The only image input to Seedance was the selected Topaz-upscaled portrait.

## Why This Is Harder Than A Single Expression

A single-expression prompt gives the model one target.

For example:

```text
AU6 cheek raiser
AU12 lip corner puller
AU25 lips part slightly
```

That can produce a smile-like performance.

The 15-second sequence is different. It asks for many changes in one shot while preserving:

- the same identity
- the same face shape
- the same hair and wardrobe
- the same background
- the same close-up framing
- the same cinematic mood

That is much harder.

The model has to balance identity continuity with motion variety. It also has to separate adjacent mouth actions that can visually collapse into each other.

The tongue beats, `AU84` and `AU85`, are especially aggressive stress tests because they are harder to express cleanly from a tight portrait start frame.

## Earlier Passes

Before this 15-second sequence, I ran two smaller comparison passes.

### Phase 1: Direct FACS Prompting

The first pass generated four separate clips:

- beautiful smile
- flirtatious look
- deep sadness
- laughing

Each clip used a compact AU list.

This tested whether direct Action Unit language was enough to steer Seedance at all.

### Phase 2: Storyboard-Guided FACS Prompting

The second pass used the same four expression targets, but wrapped each prompt in a one-shot storyboard:

```text
0.0-1.0s: starting pose
1.0-2.5s: facial action begins
2.5-4.0s: expression reaches peak
4.0-5.0s: expression settles
```

That tested whether timing, camera direction, and continuity rules improve the performance.

### Phase 3: Multi-AU Sequence

The current pass is the stress test.

Instead of one expression per clip, it asks for 14 facial beats inside one continuous 15-second close-up.

This is the version I want to lead with because it makes the experiment obvious immediately: can a video model follow a dense facial-performance score?

## What To Look For

When watching the clip, I am not looking for perfect FACS compliance.

I am looking for practical usefulness:

- Does the identity hold?
- Do the eyes, mouth, and head move in the requested order?
- Are the beats separable, or do they blend together?
- Does the face stay cinematic instead of becoming cartoonish?
- Does the motion feel controlled, uneasy, and intentional?
- Which Action Units seem easiest or hardest for Seedance?

That last question is probably the most useful one.

If some AUs are reliable and others are unstable, the next step is to build better prompt templates and evaluation notes around each one.

## Open Source Workflow

The repo is organized so each experiment has its own config, prompts, content, and generated manifest.

Important files:

```text
experiments/001-seedance-facs/config.json
experiments/001-seedance-facs/storyboard-config.json
experiments/001-seedance-facs/multi-au-sequence-config.json
experiments/001-seedance-facs/facs units.jpeg
src/generate.ts
```

Useful commands:

```bash
npm run generate:001
npm run generate:001:storyboard
npm run generate:001:multi-au
npm run generate:001:multi-au -- --dry-run
```

The whole workflow uses one fal key:

```bash
FAL_AI_API_KEY=...
```

Generated media is not committed to Git, but every run writes a local manifest with prompts, model IDs, provider URLs, timestamps, local paths, and errors.

For this multi-AU pass, the generated video is:

```text
outputs/001-seedance-facs/2026-05-07T20-40-40-959Z-facs-portrait-multi-au/videos/01-multi-au-hypnotic-sequence.mp4
```

## Closing Thought

The most interesting result is not that every Action Unit works.

They do not.

Some beats are clear. Some blur together. Some are probably asking too much from a single start-frame video model right now.

But the experiment still points somewhere useful.

For close-up AI video, the future control layer may not be a single emotion word. It may be closer to a performance score: a stable character image, a timed sequence, a few facial mechanics, camera restraint, and continuity rules.

That is what I want to keep testing.

The next step is evaluation. I want to watch the direct clips, storyboard clips, and the multi-AU sequence side by side and score them on:

- identity consistency
- Action Unit readability
- timing
- camera stability
- expression separation
- overall facial acting quality

If the multi-AU sequence works even partially, the interesting direction is a small prompt generator: plain-language acting direction in, storyboard-plus-FACS prompt out.

That could become a useful workflow for close-up AI acting: not replacing performance direction, but giving directors and builders a more precise language for it.

Not just prompting emotions.

Directing micro-performances.

That is the thread I want this daily experiment series to follow: small tests, honest notes, reusable configs, and one concrete artifact at a time.

## Media Checklist

Lead video:

```text
outputs/001-seedance-facs/2026-05-07T20-40-40-959Z-facs-portrait-multi-au/videos/01-multi-au-hypnotic-sequence.mp4
```

Supporting media:

```text
outputs/001-seedance-facs/upscaled/selected-base-04-latina-topaz.png
outputs/001-seedance-facs/2026-05-07T19-45-57-994Z-facs-portrait/videos/01-beautiful-smile.mp4
outputs/001-seedance-facs/2026-05-07T20-04-25-358Z-facs-portrait-storyboard/videos/01-storyboard-beautiful-smile.mp4
```
