# X Launch Post

Attach this clip first:

```text
outputs/001-seedance-facs/2026-05-07T18-21-56-185Z-facs-portrait/videos/01-forced-smile-fade.mp4
```

Post:

```text
I built a small open-source experiment for generating facial-performance videos with fal.ai, GPT Image 2, and Seedance 2.0.

This is experiment #1 in a new daily series: one AI experiment, shipped in public, every day.

The pipeline:
1. Generate one cinematic base portrait
2. Reuse it as the start frame
3. Generate multiple Seedance clips from FACS-style Action Unit prompts

No "happy," "sad," or "nervous" prompts.

Just muscle-level facial instructions like AU6, AU12, AU24, AU64.

An Action Unit is a numbered facial movement.

AU12 = lip corner puller
AU6 = cheek raiser
AU24 = lip pressor
AU64 = eyes down in this prompt list

So instead of asking for "a forced smile," I can describe the moving parts of one.

It does not follow every Action Unit perfectly, but the results are surprisingly useful for subtle facial acting: forced smiles, social masks, micro-disgust, suppressed concern, and uncanny close-up dialogue beats.

Code + full writeup below.
```

## Shorter Variant

```text
I built an open-source fal.ai experiment for facial-performance video generation.

Experiment #1 in a new daily series: one AI experiment, shipped in public, every day.

One GPT Image 2 portrait.
Six Seedance 2.0 clips.
Prompts written as FACS-style Action Units instead of emotion labels.

No "happy" or "sad."
Just AU6, AU12, AU24, AU64, etc.

The model does not follow every AU perfectly, but it is already useful for subtle facial acting: forced smiles, social masks, micro-disgust, and close-up dialogue beats.

Full writeup + code below.
```

## Reply Copy For FACS Explainer

```text
Quick FACS explainer:

An Action Unit is a numbered facial movement, not an emotion.

AU12 means lip corner puller.
AU6 means cheek raiser.
AU24 means lip pressor.
AU64 means eyes down in this prompt list.

Different combinations create different expressions.

That is why FACS is useful here: it lets the prompt describe the mechanics of a performance instead of just saying "happy," "sad," or "nervous."
```

## Reply Copy For Prompt Example

```text
Example prompt for the first clip:

AU12 light bilateral lip corner puller
AU6 very weak cheek raiser delayed by 1 second
AU7 mild lid tightener
AU15 very faint lip corner depressor under the smile
AU24 slight lip press at the end
AU64 eyes down briefly then return to camera

The goal was a forced smile forming and almost breaking.
```

## Media Notes

- Lead with `01-forced-smile-fade.mp4` unless another clip is visually stronger after review.
- Use `base-image.png` inside the article after the first video, not as the tweet lead.
- If posting a follow-up thread, use one reply per clip with the clip name and the AUs used.
