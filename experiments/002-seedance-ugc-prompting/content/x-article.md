# Can a 5-Beat Prompt Reduce Seedance UGC Regeneration?

For Experiment 002, I wanted to test a practical Seedance 2.0 production claim:

Structured UGC prompts should produce usable clips faster than loose, vague prompts.

The experiment is intentionally small.

Same base creator image.

Same Seedance model.

Same 15-second duration.

Three prompts:

1. a loose UGC prompt
2. a structured 5-beat UGC prompt
3. a structured prompt with brand-name pronunciation defense

The goal is not to prove one universal prompting formula.

The goal is to see whether prompt structure improves first-generation usefulness.

## Why This Experiment

Seedance 2.0 generations are capped at 15 seconds.

That means every prompt has to respect the window.

If the prompt asks for too many actions, too many scene changes, or too much dialogue, the output has to compress everything into one short clip. That usually creates rushed motion, unstable framing, or audio that feels detached from the visual.

So this experiment treats the clip as one continuous UGC scene.

One creator.

One room.

One primary action.

One visible-speaker dialogue moment.

## The 5-Beat Formula

The structured prompt uses five beats.

First, the subject:

```text
A 28-year-old beauty creator with shoulder-length warm brown hair,
natural makeup, small gold hoop earrings, a soft cream ribbed tank top,
and a light cardigan
```

Second, the setting:

```text
a bedroom vanity with soft morning window light, a sage green Stanley-style tumbler,
a Sephora-style shopping bag, minimalist skincare bottles, and a white AirPods-style case
```

Third, the action:

```text
She lifts a small frosted skincare bottle, taps one drop onto her fingertips,
blends it gently across one cheek, then looks back into the lens
```

Fourth, the camera:

```text
The camera is her phone's front-facing selfie camera;
we see her face filling the frame from the phone's perspective,
no phone visible in the shot
```

Fifth, lighting and mood:

```text
warm window light, realistic beauty UGC, casual bedroom vanity,
natural audio, authentic but polished
```

## Dialogue Rule

The dialogue is embedded inline.

Not as a separate script.

The structured prompt says:

```text
She lifts a small frosted skincare bottle near her cheek,
taps one drop onto her fingertips,
blends it gently across one cheek,
then looks back into the lens and says,
"I tried Lumora this week and my skin looks way more awake before makeup."
```

That matters because the spoken line is tied to a visible action and a visible speaker.

## Pronunciation Defense

The third clip tests a fictional brand name: `Lumora`.

The spoken version is written phonetically as `Loo Mora`.

The prompt uses three defenses:

```text
she slows down slightly to clearly enunciate the brand name
```

```text
"It's called Loo Mora, Loo Mora, and my skin actually looks awake."
```

```text
She keeps the brand-name line on camera with her mouth clearly visible
```

This is not about the brand itself.

It is about whether Seedance audio behaves better when pronunciation is written as a visible-speaker beat.

## Realism Props

The scene includes recognizable prop types:

- sage green Stanley-style tumbler
- Sephora-style shopping bag
- minimalist skincare bottles inspired by Glossier packaging
- white AirPods-style case

The prompt does not ask Seedance to render readable logos, captions, subtitles, URLs, or text overlays.

Those should be added in post if needed.

The point is realism from color, shape, and environment, not exact logo rendering.

## What I Am Comparing

The baseline prompt is intentionally loose:

```text
A beauty influencer makes a realistic UGC video about a skincare product in her room.
She smiles, holds the product, talks about how much she likes it,
and tells viewers to try Lumora.
```

The structured prompts are more constrained.

The comparison is:

- Does the subject stay more consistent?
- Does selfie POV work without showing a phone?
- Does the action fit the 15-second window?
- Does the dialogue sync to the visible speaker?
- Does the brand name sound cleaner?
- Does the clip feel like real UGC instead of generic AI video?

## Open Source Workflow

The experiment uses the existing TypeScript CLI in this repo.

Useful commands:

```bash
npm run generate:002 -- --dry-run
npm run generate:002
```

The config lives at:

```text
experiments/002-seedance-ugc-prompting/config.json
```

Outputs are written to:

```text
outputs/002-seedance-ugc-prompting/<run-id>/
```

Every run writes a manifest with prompts, model IDs, provider URLs, local paths, timestamps, and errors.

The whole workflow uses:

```bash
FAL_AI_API_KEY=...
```

## Closing Thought

The practical question is not whether one prompt formula solves UGC.

It does not.

The useful question is whether a disciplined prompt structure reduces waste.

If a loose prompt needs several regenerations but a structured prompt gets close on the first or second try, that changes the economics of making AI UGC.

That is what this experiment is testing.

Small test.

Reusable config.

Honest comparison.

One daily AI experiment at a time.
