# Building LUMINA: AI UGC Is Becoming Synthetic Media Franchises

Most people are looking at AI UGC as a way to make cheaper creator videos.

That is true, but I think it misses the more important change.

The bigger shift is that AI UGC is turning into synthetic media franchises: reusable casts, songs, product worlds, visual systems, and repeatable campaign pipelines.

That is the picture this experiment points toward.

I built LUMINA to test it.

LUMINA is a fictional five-member K-pop beauty group created with fal.ai. The group sells a fictional product called Lumora glow serum through five 15-second solo ads.

This experiment does not prove income claims from the faceless UGC operator playbook.

It tests whether the production system is real enough to reproduce.

More specifically:

Can one operator create a fictional idol group, a product hook, a consistent visual world, and five short beauty ads using fal models?

The answer was yes, with caveats.

Here is the system.

## What LUMINA Is

LUMINA is not one AI influencer.

It is a small fictional media franchise:

- Rae
- Jia
- Sena
- Nari
- Yumi

Each member has her own ad lane.

Rae is the luxury beauty muse.
Jia is the girl-crush performer.
Sena is the elegant vocalist.
Nari is the dance ace.
Yumi is the fresh approachable idol.

The product is fictional: Lumora glow serum.

The campaign language is intentionally soft:

- camera-ready glow
- dewy finish
- pre-stage confidence

No medical skincare claims.
No before/after promise.
No real logos.
No celebrity likeness.

## What Came Out

The final batch produced five solo videos, one for each member.

Yumi is the cleanest lead asset because her reference-image stage went 5/5.

I am using her video as the lead clip, then linking the other four as proof that the batch completed.

The important part is not just that five videos exist.

The important part is that they came from one reusable system:

- one group name
- one product world
- one song
- five member portraits
- five member lanes
- one batch generation command
- one run log recording what worked and what failed

## Why Song First

Most UGC workflows start with a script.

This one starts with the song.

For a K-pop-inspired beauty ad, the song is not background decoration.

It defines the world:

- the product promise
- the visual tempo
- the emotional posture
- the transition rhythm
- the final brand memory

The LUMINA hook was generated with MiniMax Music 2.6.

Music prompt:

```text
Sparkly K-pop dance-pop beauty ad hook for fictional five-member idol group LUMINA, glossy pearl pink and chrome mood, bright synth stabs, tight pop drums, playful bass, polished female idol vocals, catchy 15-second chorus, TikTok beauty campaign energy, confident but warm, camera-ready glow, 124 BPM.
```

Lyrics:

```text
[Hook]
Lights on, glow up, LUMINA
Lumora shine before the stage
Dewy, dewy, banjjak hae
Camera loves us every day

[Post Chorus]
Glow with me, Lumora
Glow with LUMINA
```

That lyric became the creative center.

Every image and video prompt had to feel like it belonged to the same pearl pink and chrome beauty world.

## The Model Stack

The pipeline used:

- `fal-ai/minimax-music/v2.6` for the song hook.
- `openai/gpt-image-2` for fictional idol casting.
- `openai/gpt-image-2/edit` for member-specific reference frames.
- `bytedance/seedance-2.0/reference-to-video` for final videos.
- `ffmpeg` for final video export.

The key model choice was Seedance reference-to-video instead of plain image-to-video.

The final clips needed multiple inputs:

- the member portrait
- member reference frames
- generated song audio
- a time-coded storyboard

That is a reference-to-video problem, not a single-start-frame problem.

## Casting LUMINA

The first casting pass generated five fictional idol candidates.

This is where the system starts to become reusable.

If the cast is weak, every later generation inherits that weakness. If the cast is clear, each member can carry her own lane across future campaigns.

The prompts are intentionally archetypal, not celebrity-based.

No real idol names.
No real-person likeness.
No readable logos.
No clinical skincare claims.

One note: the original casting prompts used Mina Rae as the placeholder idol name. After the casting pass, the five strongest candidates became LUMINA members: Rae, Jia, Sena, Nari, and Yumi.

### Rae: Luxury Beauty Muse

```text
A fictional original K-pop solo idol concept portrait for Mina Rae, luxury beauty muse archetype, early 20s, polished warm aura, pearl pink and chrome backstage vanity, luminous dewy skin, glossy dark espresso hair with soft face-framing layers, refined stage makeup, small chrome earrings, holding a frosted Lumora glow serum bottle with no readable label. She feels premium, approachable, and original, not based on any real person. Photorealistic vertical beauty campaign still, direct eye contact, soft vanity bulbs, no logos, no readable text, no celebrity likeness, no watermark.
```

### Jia: Girl-Crush Performer

```text
A fictional original K-pop solo idol concept portrait for Mina Rae, girl-crush performer archetype, confident but warm expression, pearl pink and chrome backstage set, sleek dark hair in a high half-up style, chrome-accent stage jacket over a soft pink top, camera-ready dewy skin, holding a small frosted Lumora glow serum bottle near her cheek with no readable label. Original idol identity, not a real celebrity, not a lookalike. Photorealistic 9:16 beauty music-video still, no logos, no readable text, no watermark.
```

### Sena: Elegant Solo Vocalist

```text
A fictional original K-pop solo idol concept portrait for Mina Rae, elegant solo vocalist archetype, soft expressive eyes, polished warm backstage intimacy, pearl pink satin robe with chrome hair clips, luminous skin, natural glossy lips, vanity mirror lights behind her, one hand resting beside a frosted Lumora glow serum bottle with no readable label. Original face and styling, no real-person resemblance. Photorealistic vertical editorial beauty still, clean composition, no logos, no readable text, no watermark.
```

### Nari: Dance Ace

```text
A fictional original K-pop solo idol concept portrait for Mina Rae, dance ace archetype, athletic stage poise, warm confident smile, pearl pink and chrome rehearsal-backstage environment, cropped chrome bomber, soft pink performance top, dewy skin catching stage light, holding a frosted Lumora glow serum bottle as a pre-stage ritual prop with no readable label. Original fictional idol, no celebrity likeness, no exact real-star styling. Photorealistic 9:16 beauty ad still, no logos, no readable text, no watermark.
```

### Yumi: Fresh Approachable Idol

```text
A fictional original K-pop solo idol concept portrait for Mina Rae, fresh approachable idol archetype, bright warm expression, pearl pink and chrome backstage vanity, soft dark hair with airy bangs, clean dewy makeup, delicate pearl accents, holding a tiny frosted Lumora glow serum bottle with no readable label. She feels like a new fictional beauty ambassador, not based on any real person. Photorealistic vertical UGC-meets-music-video still, no logos, no readable text, no watermark.
```

These five images became the canonical LUMINA source portraits.

## Member Video Design

The batch system generates five solo videos, not one group video.

That is deliberate.

The goal of this pass was not to prove that a full synthetic group scene can hold perfectly.

The goal was to prove that each member can become a repeatable solo ad asset.

Multi-character consistency is harder. Solo videos let each member's identity become legible before attempting a full group scene.

Each member gets five GPT Image 2 edit reference frames:

1. intro
2. product moment
3. beauty close-up
4. performance pose
5. final frame

Then Seedance gets:

- the original member portrait
- the successful reference frames
- the LUMINA song
- a member-specific storyboard

## The Shared Reference Frame Templates

### Intro

```text
Using the provided reference image as exact identity reference for {{displayName}} from fictional K-pop group {{groupName}}, create a vertical 9:16 intro keyframe for a Lumora glow serum solo ad. Lane: {{lane}}. Preserve her face, hair, skin tone, and styling identity. Pearl pink and chrome beauty lighting, backstage music-video environment, no logos, no readable text, no celebrity likeness.
```

### Product Moment

```text
Using the provided reference image as exact identity reference for {{displayName}} from {{groupName}}, create a vertical 9:16 product moment. She holds a small frosted Lumora glow serum bottle with no readable label. Lane: {{lane}}. Preserve identity exactly, pearl pink and chrome reflections, beauty-ad polish, no logos, no readable text.
```

### Beauty Close-Up

```text
Using the provided reference image as exact identity reference for {{displayName}} from {{groupName}}, create a vertical 9:16 beauty close-up. Camera-ready dewy skin, soft glow, one cheek catching pearl pink light, chrome catchlights. Lane: {{lane}}. Preserve identity exactly, no clinical claim visuals, no logos, no text.
```

### Performance Pose

```text
Using the provided reference image as exact identity reference for {{displayName}} from {{groupName}}, create a vertical 9:16 K-pop solo performance pose. Lane: {{lane}}. Pearl pink and chrome stage lights, confident beauty campaign energy, Lumora serum visible as a foreground prop, no logos, no readable text.
```

### Final Frame

```text
Using the provided reference image as exact identity reference for {{displayName}} from {{groupName}}, create a vertical 9:16 final frame for a Lumora solo ad. Lane: {{lane}}. She looks into camera with a memorable glow-serum finish, pearl pink chrome stage-backstage hybrid, no logos, no readable text, no watermark.
```

## Member Lanes And Seedance Storyboards

### Rae

Lane:

```text
premium vanity glow, luxury beauty muse, polished center energy
```

Seedance storyboard:

```text
@Image1 is Rae from fictional K-pop group LUMINA. Use @Audio1 as the LUMINA Lumora soundtrack. 0.0-3.0s: premium backstage vanity intro, Rae turns toward camera in pearl pink chrome light. 3.0-6.0s: product moment, she lifts the frosted Lumora serum bottle near her cheek with no readable label. 6.0-10.5s: beauty close-up, dewy camera-ready glow catches the vanity lights, elegant calm expression. 10.5-13.0s: slow luxury performance pose under chrome stage light. 13.0-15.0s: final confident glance into camera. Preserve Rae's identity exactly. No real celebrity likeness, no logos, no readable text, no captions, no clinical skincare claims.
```

### Jia

Lane:

```text
chrome girl-crush stage hook, bold fashion-forward beauty edit
```

Seedance storyboard:

```text
@Image1 is Jia from fictional K-pop group LUMINA. Use @Audio1 as the LUMINA Lumora soundtrack. 0.0-3.0s: chrome backstage stage entrance, Jia gives a bold side glance. 3.0-6.0s: product moment, she snaps the frosted Lumora serum bottle into frame, no readable label. 6.0-10.5s: sharp solo hook pose with pearl pink lights and chrome reflections, confident but not frantic. 10.5-13.0s: beauty close-up, dewy skin and playful expression. 13.0-15.0s: final girl-crush camera hit. Preserve Jia's identity exactly. No real celebrity likeness, no logos, no readable text, no captions, no clinical skincare claims.
```

### Sena

Lane:

```text
soft vocalist backstage glow ritual, intimate velvet beauty mood
```

Seedance storyboard:

```text
@Image1 is Sena from fictional K-pop group LUMINA. Use @Audio1 as the LUMINA Lumora soundtrack. 0.0-3.0s: soft backstage vocalist intro, Sena sits near vanity bulbs in pearl pink light. 3.0-6.0s: product moment, she opens her hand around the frosted Lumora serum bottle, no readable label. 6.0-10.5s: intimate beauty close-up as she taps glow onto one cheek, warm sincere expression. 10.5-13.0s: gentle performance pose as if singing the hook. 13.0-15.0s: final soft smile into camera. Preserve Sena's identity exactly. No real celebrity likeness, no logos, no readable text, no captions, no clinical skincare claims.
```

### Nari

Lane:

```text
dance-performance pre-stage momentum, kinetic glow before lights up
```

Seedance storyboard:

```text
@Image1 is Nari from fictional K-pop group LUMINA. Use @Audio1 as the LUMINA Lumora soundtrack. 0.0-3.0s: dance rehearsal backstage intro, Nari rolls her shoulders under pearl pink chrome lights. 3.0-6.0s: product moment, she taps Lumora serum before stepping toward stage, bottle has no readable label. 6.0-10.5s: one clean dance-hook move synced to the music, athletic and controlled. 10.5-13.0s: close-up glow check with confident smile. 13.0-15.0s: final performance pose in chrome light. Preserve Nari's identity exactly. No real celebrity likeness, no logos, no readable text, no captions, no clinical skincare claims.
```

### Yumi

Lane:

```text
approachable UGC backstage bloom, friendly daily glow routine
```

Seedance storyboard:

```text
@Image1 is Yumi from fictional K-pop group LUMINA. Use @Audio1 as the LUMINA Lumora soundtrack. 0.0-3.0s: friendly backstage selfie-style intro, Yumi smiles near a pearl pink chrome vanity. 3.0-6.0s: product moment, she holds the frosted Lumora serum bottle close to camera, no readable label. 6.0-10.5s: beauty close-up, she taps one cheek and reacts with a bright natural smile. 10.5-13.0s: small playful performance pose to the hook. 13.0-15.0s: final approachable wave-glance into camera. Preserve Yumi's identity exactly. No real celebrity likeness, no logos, no readable text, no captions, no clinical skincare claims.
```

## What Worked

All five final videos succeeded.

That matters because the pipeline completed the thing it was designed to produce, not just a demo artifact:

- Rae solo video
- Jia solo video
- Sena solo video
- Nari solo video
- Yumi solo video

Yumi was the cleanest production run:

```text
Yumi: 5/5 reference frames succeeded
```

The song-first approach also helped.

The outputs were not five unrelated character clips. They shared a single campaign world:

- LUMINA
- Lumora
- pearl pink
- chrome
- backstage vanity
- pre-stage glow

## What Broke

The GPT Image 2 edit stage was inconsistent.

This is the part I would not bury in a launch post.

The finished videos succeeded, but the intermediate reference-frame layer was uneven.

Reference frame success:

```text
Rae: 3/5 succeeded, 2 failed
Jia: 1/5 succeeded, 4 failed
Sena: 3/5 succeeded, 2 failed
Nari: 1/5 succeeded, 4 failed
Yumi: 5/5 succeeded, 0 failed
```

The first implementation also sent `image_size: "portrait_16_9"` to the edit endpoint. Switching member reference generation to:

```json
"imageSize": "auto"
```

fixed the initial hard failure pattern and let the batch continue.

Even after that, some edit jobs completed provider-side and still returned `Unprocessable Entity`.

The important production lesson is that partial reference failure did not prevent final Seedance outputs.

For this kind of workflow, the system needs to degrade gracefully:

- preserve the source portrait
- use every successful reference frame
- record failures in the run log
- still attempt the final video

That is exactly what happened here.

## How The Run Worked

The public version should link the finished videos directly.

Behind the scenes, the run saved the generated music, member reference frames, raw Seedance clips, finished videos, and a run log.

That internal record matters for production, but the public artifact is the campaign itself:

- the Yumi lead video
- the four supporting member videos
- the prompts
- the failure notes
- the lessons for the next run

## Why This Matters

The interesting part is not that one AI video can look good.

That is becoming normal.

The interesting part is whether AI UGC can become a repeatable character and campaign system.

That is the part most "AI made this ad" posts skip.

The durable asset is not the exported video.

The durable asset is the world that can keep producing videos.

LUMINA has:

- a group name
- a lineup
- a product world
- a song hook
- member lanes
- reusable source portraits
- repeatable generation commands

That starts to feel less like making isolated clips and more like operating a small synthetic media franchise.

This is also why I would be careful with income claims.

The workflow is real. The production leverage is real. But revenue still depends on distribution, offer quality, client demand, proof, and sales.

This experiment only tested the production side.

## Next Experiments

The obvious next steps:

1. Rerun the weak-reference members, especially Jia and Nari.
2. Make a LUMINA group montage from the five solo videos.
3. Test member-specific hooks instead of one shared hook.
4. Compare solo Seedance consistency against a full group Seedance prompt.
5. Build a cleaner retry workflow for failed GPT Image 2 edit frames.

The most useful constraint remains the same:

Do not hide the messy parts.

The final videos matter, but the operator workflow matters more.
