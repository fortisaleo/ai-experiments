# Switchlight Visual Development

Status: visual development source for the 9-panel Seedance storyboard

## Decision

The first generated Switchlight hook clip is not the visual target. It reused the base member portraits too directly and landed as a generic AI stage output. The next Switchlight pass starts with purpose-built keyframes for a premium comeback music video, then compresses that visual development into the canonical 9-panel storyboard in `switchlight-9-panel-storyboard.md`.

## Creative North Star

`Switchlight` should feel like a polished LUMINA comeback MV: backstage nerves become stage power. The world starts in a premium dressing-room and chrome hallway, then switches into a bright performance set with pearl light panels and a reflective black-chrome floor.

This is not a Lumora product ad. No glow-serum bottle, no beauty claims, no UGC framing.

## Identity Rules

- Use Rae, Jia, Sena, Nari, and Yumi from `experiments/003-kpop-idol-beauty-ugc/personalities.json` as exact identity anchors.
- Preserve face, hair identity, skin tone, archetype, and member energy.
- Change only wardrobe, set, lighting, pose, camera angle, and performance blocking.
- Keep coordinated-but-distinct styling: pearl/chrome/black wardrobe family, unique silhouettes per member.

## 12-Frame Pack

1. `group-backstage-mirror` — all five members in a premium dressing-room mirror setup.
2. `rae-center-ready` — Rae calm center close-up, polished comeback leader energy.
3. `jia-jacket-switch` — Jia sharp attitude, chrome jacket adjustment, girl-crush edge.
4. `sena-vocal-light` — Sena soft vocal close-up, pearl light bloom.
5. `nari-dance-count` — Nari marking the first dance count in rehearsal/stage threshold.
6. `yumi-fancam-smile` — Yumi bright fan-cam warmth, hallway light behind her.
7. `group-chrome-hallway` — group walking from backstage toward stage, lights switching on in sequence.
8. `group-stage-wide` — full LUMINA performance set with specific pearl light panels and chrome floor.
9. `hook-hand-gesture` — original light-switch hand gesture, group formation.
10. `step-pose-shine-hit` — clean group hit for "Step, pose, shine."
11. `final-title-frame` — confident group pose for the final Switchlight title moment.
12. `identity-lineup-reference` — clean front-facing lineup for video identity preservation.

## Generate

Dry run:

```bash
npm run generate -- image-pack --config lumina/storyboards/switchlight-image-pack.config.json --dry-run
```

Generate:

```bash
npm run generate -- image-pack --config lumina/storyboards/switchlight-image-pack.config.json
```

Do not run another Seedance video attempt until these images are reviewed. The final Seedance prompt should come from `switchlight-9-panel.config.json`, not the failed hook direction.
