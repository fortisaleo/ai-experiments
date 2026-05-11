# Seedance Prompt Patterns

Reference source: [YouMind-OpenLab/awesome-seedance-2-prompts](https://github.com/YouMind-OpenLab/awesome-seedance-2-prompts), cloned locally at `references/awesome-seedance-2-prompts/` for study only. The repository is licensed CC BY 4.0; keep attribution when adapting examples publicly. Do not vendor or paste large third-party prompt blocks into experiment outputs.

## What To Copy

The useful pattern is structure, not wording:

1. Put format, duration, and style first.
2. Declare the scene and character continuity before the timeline.
3. Split the video into timed shot blocks.
4. Give each shot a camera grammar, action, micro-motion, and lighting cue.
5. Use sound direction only when the model is generating audio or when external audio needs behavior synced to it.
6. Keep negative rules short and specific.

Preferred prompt skeleton:

```text
[FORMAT / DURATION / STYLE]
15-second 16:9 cinematic video, [visual style], [lens/texture/lighting quality].

[SCENE]
[One coherent location and atmosphere.]

[CHARACTER]
[Stable subject identity, wardrobe, posture, face/hair/body continuity.]

[TIMELINE]
[00:00-00:04] Shot 1: [name]
Camera: [movement + lens/framing].
Action: [visible physical action].
Details: [breathing, eye movement, fabric, reflections, particles, body weight].

[00:04-00:09] Shot 2: [name]
Camera: ...
Action: ...
Details: ...

[00:09-00:15] Shot 3: [name]
Camera: ...
Action: ...
Details: ...
Final hold: [last 0.5-1.0 seconds if needed].

[SOUND]
[Optional: ambience, music cue, voice, impacts, silence.]

[CONTINUITY]
Maintain identical subject identity, wardrobe, environment physics, lighting direction, and final-frame readability.

[NEGATIVE RULES]
No text, subtitles, logos, watermark, random drifting, body warping, floating feet, duplicate subjects.
```

## Archetypes

### 1. Strict Storyboard Reference

Use when a drawn board or contact sheet should control the video.

Required fields:
- reference role: shot order only, or shot order plus visual style
- panel reading order
- timed compression plan
- what must persist from the reference
- what must be converted into final video language

Mini-template:

```text
Use @Image1 as the complete storyboard source for a 15-second 16:9 video. Follow the panels left to right, top to bottom. The board controls shot order, camera grammar, movement logic, emotional progression, and final pose. Convert the drawings into [photoreal / cinematic / stylized] video; do not keep visible annotations.

[00:00-00:04] Panels 1-3: ...
[00:04-00:09] Panels 4-8: ...
[00:09-00:15] Panels 9-12: ...

Maintain [identity / wardrobe / location / motif]. No skipped panels, reordered beats, text, annotations, watermark, duplicated characters, or broken body motion.
```

Failure risks:
- too many panel beats inside 15 seconds
- annotations appearing as real scene objects
- reference board treated as visual style when only shot order was intended

### 2. Three-Shot 15s Arc

Use when Seedance is losing story coherence. This is the safest pattern for music hooks, short narrative jokes, and social clips.

Required fields:
- one protagonist or fixed ensemble
- three timed shots
- one camera transition between each shot
- one final hold

Mini-template:

```text
15-second 16:9 cinematic short. One coherent location, one continuous emotional arc.

[00:00-00:04] Setup: [wide or medium establishing shot]. Camera [slow push/tracking]. Micro-motion [breath, eyes, hands, fabric].
[00:04-00:10] Turn: [action escalates]. Camera [orbit/whip/match cut]. Physical effects [light, particles, reflections].
[00:10-00:15] Payoff: [hero action/final reveal]. Camera [locked or low angle]. Hold final frame for the last 1 second.

Continuity: same character, wardrobe, lighting direction, environment, and object positions.
Negative: no text, logos, extra characters, random camera drift, warping, floating feet.
```

Failure risks:
- if the setup is too slow, the payoff arrives late
- if shot 2 has too many actions, the model blends them

### 3. Single Keyframe Motion

Use when image-to-video is more reliable than storyboard-to-video, or as a fallback after a reference-to-video failure.

Required fields:
- the exact starting image role
- one motion phrase
- camera move
- environmental animation
- no scene changes

Mini-template:

```text
Use @Image1 as the exact starting frame. Create a 5-second 16:9 cinematic image-to-video shot. Keep the same character identity, outfit, pose logic, face, hair, body scale, and environment.

Motion: [one readable action only].
Camera: [slow push / slight handheld drift / locked macro].
Environment: [steam, rain, dust, light flicker, reflections].
Emotion: [one face change].

No new scene, no costume change, no extra subject, no text, no logo, no body warping, no floating feet.
```

Failure risks:
- asking for transformation or multiple scene changes from one image
- long negative lists overpowering the action

### 4. Continuous POV

Use for found footage, bodycam, handheld social clips, or chaotic comedy.

Required fields:
- camera source
- one continuous path
- subject distance and spatial relationship
- diegetic audio if generated
- no impossible cuts

Mini-template:

```text
Single continuous 15-second [bodycam / phone / handheld vlog] POV. No cuts. Camera begins [position], moves [path], and ends [final position].

0-5s: [discover subject].
5-10s: [escalation].
10-15s: [payoff].

Use realistic handheld shake, breathing, autofocus hunting, motion blur, environmental sound, and subject distance. No cinematic crane shots, no impossible cuts, no text, no watermark.
```

Failure risks:
- mixing POV language with impossible third-person shots
- too many named subjects

### 5. Music-Video Performance

Use for LUMINA / Switchlight-like work.

Required fields:
- audio role
- stable member identity and wardrobe
- simplified shot count
- clear choreography motif
- final hero frame

Mini-template:

```text
@Audio1 drives a 15-second 16:9 premium music-video hook. Use @Image1 as [storyboard / stage / wardrobe] reference. Keep the same [single performer / five-member ensemble] identity throughout.

[00:00-00:04] Intro: [mirror/backstage/prep]. Singing mouth, breath, eye tension, fabric motion.
[00:04-00:09] Switch: [hallway/stage threshold/action motif]. Camera [tracking/whip/match cut]. Lights react to gesture.
[00:09-00:15] Hook: [performance formation/final pose]. Repeat motif once, step into final pose, hold last 1 second.

Preserve wardrobe, hairstyle, face, body proportions, member count, stage geography, and lighting progression. No copied choreography, readable logos, text, duplicate members, outfit swaps, random drifting, or melted motion.
```

Failure risks:
- trying to fit a full 12-panel MV into one 15-second run
- asking for too many members plus too many shot changes

### 6. Fashion / Gala Satire

Use for fictionalized news-inspired social sketches.

Required fields:
- fictionalized subjects
- red-carpet geography
- narrator-driven visual beats
- one visual gag that escalates
- safe negative rules for real-person likeness

Mini-template:

```text
15-second 16:9 luxury red-carpet satire, fictional characters only, no real celebrity likeness. Editorial gala lighting, flash photography, velvet ropes, polished marble, absurd fashion details played straight.

[00:00-00:04] Perfect arrival: cameras flash, guests glide past, one impossible accessory crosses frame.
[00:04-00:10] Awkward incident: the pop-star figure and matriarch figure attempt a too-formal side hug; publicists freeze; phones rise.
[00:10-00:15] Internet aftermath: fast match cuts to zoomed phone screens, analysts pointing at elbow angles, final whisper under chandelier light.

Sync visual beats to narration. Keep expressions dry, glamorous, and controlled. No real names, real faces, logos, captions, watermark, defamatory implication, or slapstick mugging.
```

Failure risks:
- using real names or recognizable faces
- overexplaining the joke with visible text

### 7. Macro Detail / ASMR Commercial

Use when the payoff depends on tactile detail or product-like craft.

Required fields:
- macro subject
- tactile materials
- sound cue
- no broad scene shifts

Mini-template:

```text
15-second cinematic macro commercial, shallow depth of field, precise tactile detail.

[00:00-00:05] Macro setup: [hands/object/texture], slow push, tiny particles visible.
[00:05-00:10] Craft action: [cut/pour/repair/press], realistic material reaction and sound.
[00:10-00:15] Quiet payoff: [steam/glow/reflection/reveal], locked final frame.

Preserve object scale and hand continuity. No text, brand logos, impossible material behavior, or abrupt scene jumps.
```

Failure risks:
- mixing macro shot language with wide location action
- asking for unreadable tiny text or labels

### 8. Action Sequence

Use for stunt-like, fight, race, chase, and high-speed material.

Required fields:
- motion continuity
- explicit transition strategy
- physics details
- short final impact

Mini-template:

```text
15-second cinematic action sequence, high-speed but physically readable.

Camera system: [interior close-up -> tracking -> low ground -> overhead], using whip pans, speed ramps, and motion blur to mask cuts.

[00:00-00:03] Tension build: [hands/eyes/body preload].
[00:03-00:07] Launch: [acceleration/charge/jump], environment reacts.
[00:07-00:12] Sustained action: [turns/crossing/orbit], clear subject position.
[00:12-00:15] Impact/final lock: [collision/reveal/pose], hold 0.5 seconds.

No gore unless requested, no stretched limbs, no impossible camera teleporting, no unreadable blur, no random drifting.
```

Failure risks:
- too much speed makes the subject unreadable
- camera changes without spatial anchors

## Prompt Audit Checklist

Before generation:

- Duration and aspect ratio are explicit.
- Timeline blocks add up to the requested duration.
- Each block contains camera, action, detail, and lighting or sound.
- Character continuity is stated once, clearly.
- Reference images have explicit roles.
- The final frame or final hold is specified.
- Negative rules are short and targeted.
- No copyrighted franchise, real-person likeness, or third-party logo language unless deliberately licensed and allowed.

## Gala Satire Plan Using These Patterns

Use the `Fashion / Gala Satire` archetype as the creative base, but produce a 30-45 second final edit from three Seedance clips because individual runs cap around 15 seconds.

### Clip 1: The Perfect Gala

Pattern: three-shot 15s arc.

Shots:
1. 0-4s: luxury gala arrival, fictional guests, impossible handbag with security detail.
2. 4-10s: cameras and publicists glide in controlled choreography.
3. 10-15s: the pop-star figure notices the matriarch figure across the room.

### Clip 2: The Hug Incident

Pattern: three-shot 15s arc with red-carpet satire.

Shots:
1. 0-4s: approach through flashbulbs.
2. 4-10s: awkward formal side hug, played completely straight.
3. 10-15s: publicists freeze, camera lenses zoom, final beat on the elbow angle.

### Clip 3: Internet Aftermath

Pattern: macro/detail plus satire.

Shots:
1. 0-5s: phones replay the moment, no readable UI text.
2. 5-10s: fictional analysts in velvet-lit podcast set gesture over a blurred frame.
3. 10-15s: matriarch adjusts sleeve and delivers final whisper.

Narration should be generated separately with `fal-ai/elevenlabs/tts/eleven-v3`, then assembled with the three video clips using `ffmpeg`.

## A/B Test To Run Later

Compare:

1. Old paragraph prompt: one long narrative block, many negatives, all story beats listed together.
2. Structured timed prompt: format first, three timed blocks, one continuity section, compact negatives.

Audit outputs for beat order, motion coherence, identity consistency, final-frame readability, and fewer model rejections.
