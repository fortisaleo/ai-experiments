# Generating Facial Performance Videos with FACS, GPT Image 2, and Seedance 2.0

I wanted to see if video models could respond to facial-expression prompts written as muscle-level controls instead of emotion labels.

So I built a small open-source experiment with fal.ai, GPT Image 2, and Seedance 2.0.

This is also the first entry in a new daily series: one AI experiment, shipped in public, every day.

The goal is to keep the experiments small enough to finish, concrete enough to learn from, and open enough for other builders to inspect or remix.

The idea was simple:

Generate one beautiful base portrait, then use that same image as the starting frame for a batch of short facial-performance videos.

Instead of prompting the model with words like "happy," "sad," "nervous," or "uncomfortable," I wrote the prompts with FACS-style Action Units.

The result is not scientifically precise FACS control.

But it is useful.

The model interpreted enough of the prompt language to produce subtle facial acting beats: a forced smile, a social mask slipping, suppressed concern, micro-disgust, and an uncanny polite expression.

## The Experiment

This first run generated:

- 1 base portrait with GPT Image 2
- 6 Seedance 2.0 image-to-video clips
- 1 manifest with prompts, model IDs, seeds, URLs, local paths, and provider responses

Everything runs through fal with a single environment variable:

```bash
FAL_AI_API_KEY=...
```

The repo is intentionally small: a TypeScript CLI, one experiment config, and generated outputs saved locally.

The default command is:

```bash
npm run generate
```

There is also a dry-run mode:

```bash
npm run generate -- --dry-run
```

That prints the resolved image and video requests without spending credits.

## Why FACS?

FACS stands for Facial Action Coding System.

Instead of describing facial expressions as broad emotions, FACS breaks visible facial movement into Action Units.

An Action Unit is a numbered facial movement.

The number is the important part.

`AU12` does not mean "happy." It means lip corner puller: the corners of the mouth move outward and upward.

`AU6` does not mean "smiling." It means cheek raiser: the cheeks lift and the skin around the eyes changes.

`AU4` does not mean "angry." It means brow lowerer: the brows pull down and together.

In this experiment's prompt list, I also use eye and head direction codes like `AU64` for eyes down.

These movements can combine into expressions, but the Action Unit itself is not an emotion label.

That distinction is the whole reason this is interesting.

FACS gives you a way to describe the mechanics of a face instead of naming the feeling you want the audience to read.

For example, a normal smile might use `AU12` with `AU6`.

A forced smile might use `AU12`, but with weak or delayed `AU6`, plus eyelid tension, lip pressing, or a downward pull fighting against the smile.

A worried smile might mix `AU12` with `AU1` inner brow raiser, `AU4` brow lowerer, or `AU15` lip corner depressor.

Same broad category.

Different facial mechanics.

That is much more useful for directing performance.

In the prompts, I also include intensity and timing words:

```text
AU12 light bilateral lip corner puller
AU6 very weak cheek raiser delayed by 1 second
AU24 slight lip press at the end
```

This reads less like a normal image prompt and more like a tiny performance score.

The model still has to interpret it, and it does not obey every instruction perfectly.

But the prompt is asking for component-level movement rather than a generic emotional state.

That makes it interesting for generative video prompting because performance is often not one clean emotion.

A forced smile is not just "happy."

It might include lip corner pull, weak cheek activation, eyelid tension, a suppressed downward mouth movement, and a small gaze shift.

Those pieces matter, especially in close-up dialogue shots.

## The Pipeline

The pipeline has three steps.

First, the CLI generates a cinematic portrait with fal-hosted GPT Image 2.

The base prompt asks for a clean close-up where the face is readable: visible brows, eyelids, cheeks, lips, jaw, and neck. No sunglasses. No hands covering the face. No heavy occlusion.

Second, the generated image URL becomes the start frame for Seedance 2.0 image-to-video.

Third, the CLI loops through a config file of FACS-style prompts and saves each generated MP4.

The current video defaults are:

```json
{
  "model": "bytedance/seedance-2.0/image-to-video",
  "resolution": "720p",
  "duration": "5",
  "aspectRatio": "9:16",
  "generateAudio": false
}
```

I kept audio off because I wanted to judge facial performance without another variable.

## One Prompt Example

Here is the first clip prompt, shortened for readability:

```text
AU12 light bilateral lip corner puller
AU6 very weak cheek raiser delayed by 1 second
AU7 mild lid tightener
AU15 very faint lip corner depressor under the smile
AU24 slight lip press at the end
AU64 eyes down briefly then return to camera
```

The intended performance was a forced smile forming and almost breaking.

That is the kind of expression where broad emotion labels are usually too blunt.

If I prompt "smile," I tend to get a clean social smile.

If I prompt "sad smile," I get a more obvious emotional blend.

The Action Unit approach lets me ask for a more mechanical performance: the mouth does one thing, the cheeks do another, the eyelids add tension, and the gaze shifts for a moment.

## What Worked

The strongest part of the workflow is consistency.

Using one generated base image as the start frame keeps the identity and framing stable across the batch.

That makes the clips easier to compare.

It also makes the experiment feel more like performance direction than normal text-to-video prompting. The prompt is not trying to reinvent the shot every time. It is trying to move the same face in different ways.

Seedance did not follow every Action Unit exactly, but it often respected the general region and intensity:

- lip corner movement
- eyelid tension
- brow tension
- gaze shifts
- small head movement
- restrained expression changes

The useful result is not perfect control.

The useful result is that FACS-style language gives the model a more granular target than emotion words alone.

## What Did Not Work Yet

This is not a validated FACS benchmark.

I am not claiming the model understands facial anatomy or follows Action Units with scientific accuracy.

Some movements get merged.

Some intensities are interpreted loosely.

Some prompts produce the right emotional read but not the exact requested muscle combination.

That is expected. The experiment is creative control, not measurement.

The next version should include side-by-side notes for each clip:

- requested AUs
- visible movements
- missing movements
- accidental movements
- whether the clip still works as a performance beat

## Why This Feels Useful

This technique seems especially useful for close-up acting.

Not big expressions.

Small ones.

Forced smiles.

Social masks.

Suppressed reactions.

Mixed emotions.

Uncanny politeness.

A character listening to someone and trying not to reveal what they think.

Those moments are hard to prompt with simple labels because the label collapses the performance into one obvious emotion.

FACS-style prompting gives you a way to describe the parts.

Even if the model only partially follows the instruction, partial control can still be useful.

## Open Source

I made the experiment open source because I want the workflow to be easy to inspect and remix.

The larger plan is to publish one AI experiment every day.

Some will be visual.

Some will be code.

Some will be workflow tests.

The constraint is that each one should leave behind something concrete: a repo, a config, a generated artifact, a manifest, or a writeup that another person can learn from.

The repo includes:

- a TypeScript CLI
- a config-driven experiment file
- fal-only authentication through `FAL_AI_API_KEY`
- dry-run mode
- local output folders
- a reproducible `manifest.json`

The default config lives in:

```text
experiments/001-seedance-facs/config.json
```

The CLI lives in:

```text
src/generate.ts
```

The generated media is not committed to the repo, but each run writes a manifest so the prompts and parameters are preserved.

## What I Want To Try Next

Next I want to run the same FACS prompt batch across different base faces.

That should make it easier to see which parts of the prompt are robust and which depend on the source image.

I also want to try:

- fewer AUs per prompt
- stronger intensity labels
- explicit timing language
- prompt pairs that differ by only one Action Unit
- a small evaluation sheet for every generated clip

The long-term question is whether this becomes a practical control language for subtle AI facial acting.

Not perfect facial anatomy.

Not emotion labels.

Something in between: a useful directing layer for micro-performance.

That is the part I find interesting.

## Media Checklist

Use this video as the article lead:

```text
outputs/001-seedance-facs/2026-05-07T18-21-56-185Z-facs-portrait/videos/01-forced-smile-fade.mp4
```

Then include:

```text
outputs/001-seedance-facs/2026-05-07T18-21-56-185Z-facs-portrait/base-image.png
```

Optional supporting clips:

```text
outputs/001-seedance-facs/2026-05-07T18-21-56-185Z-facs-portrait/videos/02-uncanny-politeness.mp4
outputs/001-seedance-facs/2026-05-07T18-21-56-185Z-facs-portrait/videos/03-suppressed-concern.mp4
outputs/001-seedance-facs/2026-05-07T18-21-56-185Z-facs-portrait/videos/04-micro-disgust.mp4
outputs/001-seedance-facs/2026-05-07T18-21-56-185Z-facs-portrait/videos/05-held-back-laugh.mp4
outputs/001-seedance-facs/2026-05-07T18-21-56-185Z-facs-portrait/videos/06-mask-slips.mp4
```

## Sources Used For Article Format

- X Help: Articles can include text, images, video, GIFs, posts, and links.
- Creators/X Articles guidance: use a clear purpose, specific title, strong first sentence, and skimmable structure.
- Current launch-post guidance: lead with demo media and state the concrete outcome quickly.
