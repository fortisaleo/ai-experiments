# X Launch Post

## Main Tweet

Attach this 15-second multi-AU clip:

```text
outputs/001-seedance-facs/2026-05-07T20-40-40-959Z-facs-portrait-multi-au/videos/01-multi-au-hypnotic-sequence.mp4
```

Post:

```text
I tested whether Seedance 2.0 could follow a 15-second facial-performance prompt made only from FACS-style Action Unit beats.

Same Topaz-upscaled portrait.
One continuous close-up.
14 facial beats:
AU10, AU20, AU22, AU23, AU27, AU28, AU45, AU53, AU61, AU62, AU64, AU85, AU84, AU46.

The goal was not to prompt "happy" or "sad."

The goal was to see if the model could move through muscle-level facial instructions: upper lip raiser, lip stretcher, blink, head up, eye turns, tongue actions, wink.

Some beats are cleaner than others. The tongue actions are obvious stress tests.

But as a creative-control experiment, this feels useful: unsettling close-ups, micro-performance studies, uncanny expressions, and facial acting direction without broad emotion labels.

Built with fal.ai, GPT Image 2, Topaz upscale, and Seedance 2.0.

Experiment 001 in a daily open-source AI experiment series.
```

## Reply Tweet With Prompt

```text
The actual Seedance prompt:

Use the provided character image as the fixed identity reference.

15s, 1:1, 14 beats, beat-synced, cinematic tight close-up, subtle neutral background, high facial clarity, slow micro push-in, shallow depth of field.

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

## Follow-Up Reply: FACS Explainer

```text
Quick FACS explainer:

FACS = Facial Action Coding System.

An Action Unit is a numbered visible facial movement, not an emotion.

AU10 = upper lip raiser
AU20 = lip stretcher
AU45 = blink
AU61/AU62 = eyes left/right
AU46 = wink

So instead of prompting "make her look uneasy," this prompt asks for a sequence of specific facial movements.

That is the interesting control layer.
```

## Optional Context Reply

```text
This started as a smaller comparison:

1. Direct FACS prompts: one expression per clip
2. Storyboard FACS prompts: same AUs, but with timing/camera/continuity
3. Multi-AU sequence: 14 facial beats in one continuous 15-second clip

The multi-AU version is the stress test.
Can a video model hold identity while following many small facial directions in sequence?
```

## Optional Repo Reply

```text
The repo is structured so each experiment has its own config, prompts, generated manifest, and content draft.

This one uses only FAL_AI_API_KEY.

Generated media stays local, but the code/config/docs are open so others can reproduce the same workflow with their own fal key.
```

## Media Notes

- Lead with `01-multi-au-hypnotic-sequence.mp4`.
- First reply should be the exact 14-beat prompt.
- Use the FACS explainer if the main post needs context.
- Use the optional context reply to connect the direct and storyboard passes.
