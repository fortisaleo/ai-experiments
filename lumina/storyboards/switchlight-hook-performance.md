# Switchlight Hook Performance

Status: first visual deliverable for the accepted `Switchlight` audio

## Accepted Audio

- Manifest: `outputs/lumina-switchlight/2026-05-08T21-24-08-660Z-switchlight/manifest.json`
- Local audio: `outputs/lumina-switchlight/2026-05-08T21-24-08-660Z-switchlight/music/lumina-lumora-hook.mp3`
- fal.ai audio URL: `https://v3b.fal.media/files/b/0a996ee0/FLnfzZ-lEL-RAFSbzilUO_output.mp3`

## Clip Target

- Title: `Switchlight Hook Performance`
- Duration: 15 seconds
- Aspect ratio: 9:16
- Resolution: 720p
- Model: `bytedance/seedance-2.0/reference-to-video`
- Target section: strongest title hook

## Visual Concept

Full-group chrome stage performance with pearl pink light panels. The movement is original and simple: light-switch hand gesture, step, pose, shine, and a final group hit. It should read as a LUMINA music video hook, not a product ad.

## Member Beats

- Rae: center polish and first camera lock.
- Jia: sharp girl-crush angle and hook attitude.
- Sena: soft vocal close-up during the lift.
- Nari: clean dance count and group movement cue.
- Yumi: bright fan-cam warmth near the final hit.

## Seedance Prompt

```text
@Audio1 is the accepted Switchlight hook by fictional original K-pop group LUMINA. Use the five reference images as identity anchors for Rae, Jia, Sena, Nari, and Yumi. Create a 15-second vertical 9:16 music-video hook performance on a chrome stage with pearl pink light panels. The choreography is original and simple: light-switch hand gesture, step, pose, shine, turn, then a clean final group hit on the title phrase. Rae holds center polish and first camera lock, Jia adds sharp girl-crush attitude, Sena gets a soft vocal close-up, Nari cues the clean dance count, and Yumi gives bright fan-cam warmth near the final hit. Music-video energy, polished camera cuts, no real celebrity likeness, no copied choreography from real groups, no readable logos, no captions, no clinical skincare claims. This should read as a LUMINA group performance, not a product ad.
```

## Run Commands

Dry run:

```bash
npm run generate -- video --config lumina/storyboards/switchlight-hook.config.json --manifest outputs/lumina-switchlight/2026-05-08T21-24-08-660Z-switchlight/switchlight-hook-manifest.json --dry-run
```

Generate:

```bash
npm run generate -- video --config lumina/storyboards/switchlight-hook.config.json --manifest outputs/lumina-switchlight/2026-05-08T21-24-08-660Z-switchlight/switchlight-hook-manifest.json
```

