# Absurd Sincere Cinema Audit Agents

These are the review roles for the Seedance content workflow. The Idea Audit Agent is tuned specifically for Absurd Sincere Cinema.

## 1. Idea Audit Agent

Purpose: decide whether a concept deserves production before any image or video generation.

### Inputs

- title
- one-line hook
- visual direction
- proposed first frame
- proposed final hold
- safety/IP notes

### Scoring

| Criterion | Question | Score |
| --- | --- | --- |
| Premise clarity | Can the viewer understand the scene in one sentence? | 1-5 |
| Sincerity score | Can it be played emotionally straight without sketch comedy? | 1-5 |
| Mundane/absurd contrast | Does the setting trap the impossible premise in ordinary reality? | 1-5 |
| First-frame strength | Is the absurdity readable immediately in the feed? | 1-5 |
| Final-hold potential | Can the last second land as a cinematic image? | 1-5 |
| Seedance feasibility | Can Seedance plausibly handle the motion and continuity? | 1-5 |
| IP safety | Is it original and free of celebrity/franchise dependence? | Pass / Revise / Blocked |

### Output

- decision: `greenlight`, `revise`, or `kill`
- sharper one-line hook
- 3-shot Seedance structure
- first-frame recommendation
- final-hold recommendation
- sincerity risk
- safety/IP note

## 2. Storyboard Audit Agent

Purpose: check whether a storyboard gives Seedance a clean visual path.

Review for:

- first-frame clarity
- 3-beat progression
- camera variety
- readable final hold
- no annotation confusion
- no overloaded scene count
- no accidental parody staging

Output:

- decision: `use storyboard`, `simplify to keyframes`, or `revise`
- missing beats
- risky visual clutter
- prompt edits before video generation

## 3. Script Audit Agent

Purpose: tighten narration or dialogue when a concept uses voiceover or spoken lines.

Review for:

- fast hook
- spoken clarity
- sincere tone
- timing fit
- no over-explaining the joke
- no unsafe real names, brands, or franchise cues

Output:

- revised script
- timing map
- lines to cut
- lines needing visual support

## 4. Viral Audit Agent

Purpose: judge whether the post will stop the feed.

Review for:

- one-line shareability
- first-frame power
- quote-post potential
- title strength
- prompt bookmark value
- reputation/IP risk

Output:

- stronger post hook
- title recommendation
- prompt-in-replies recommendation
- thumbnail/first-frame recommendation

## 5. Video Critique Agent

Purpose: decide whether a finished Seedance video is postable.

Review for:

- premise survived generation
- first frame is clear
- performance feels sincere
- motion coherence
- object and character consistency
- final 1-second hold
- visible AI artifacts

Output:

- decision: `post`, `retry`, or `scrap`
- retry prompt edits
- best still/frame to use
- public caption angle
- failure lesson if not postable
