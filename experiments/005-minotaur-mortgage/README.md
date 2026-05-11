# Experiment 005: The Minotaur Applies For A Mortgage

Absurd Sincere Cinema flagship.

Public hook:

```text
A minotaur applies for a mortgage using his labyrinth as collateral.

Played completely straight.

Seedance 2.0 prompt in the replies.
```

## Goal

Create a 15-second Seedance 2.0 micro-film that feels like a serious financial drama about dignity, shame, and bureaucracy. The premise must be readable in the first frame: an original fictional minotaur trapped inside a mundane brutalist bank.

## Absurd Sincere Gate

- Premise is one sentence: a minotaur applies for a mortgage using his labyrinth as collateral.
- First frame: massive horned client in a too-small chair across from a loan officer.
- Sincere performance: tired eyes, careful hands, restrained posture, no mugging.
- Mundane trap: brutalist bank, fluorescent lights, tiny paperwork, gray carpet.
- Final hold: minotaur alone with a stamped folder, quiet rejection.
- Safety: original fictional creature, no franchise, celebrity, logo, or readable text dependence.

## Creative Rules

Character:

- original fictional minotaur mortgage applicant
- curved horns, tired humanlike eyes, broad shoulders, heavy careful hands
- worn charcoal suit, too-small white shirt, loosened dark tie, scuffed black dress shoes
- quiet shame, dignity, trying to appear composed
- not a warrior, villain, game creature, celebrity, or franchise design

Setting:

- brutalist bank office and lobby
- concrete walls, low acoustic ceiling, fluorescent light grid, frosted glass
- institutional gray carpet, small client chair, heavy desk
- tiny mortgage forms, abstract maze-like property diagram, red stamp mark, closed folder
- no readable text, logos, or brands

## Production Order

1. Run idea audit from `brief.md`.
2. Generate the GPT-Image-2 character sheet with `config.json` using the `image` command.
3. Audit the character sheet.
4. Generate three GPT-Image-2 edit keyframes with the `image-pack` command using the same manifest.
5. Audit the three keyframes.
6. Show all four images for manual approval.
7. Only after approval, dry-run and run the Seedance config.

## Commands

Dry-run character sheet:

```bash
npm run generate -- image --config experiments/005-minotaur-mortgage/config.json --dry-run
```

Generate character sheet:

```bash
npm run generate -- image --config experiments/005-minotaur-mortgage/config.json
```

Generate keyframes from the same manifest:

```bash
npm run generate -- image-pack --config experiments/005-minotaur-mortgage/config.json --manifest outputs/005-minotaur-mortgage/<run-id>/manifest.json
```

Dry-run Seedance after keyframes exist:

```bash
npm run generate -- video --config experiments/005-minotaur-mortgage/config.json --manifest outputs/005-minotaur-mortgage/<run-id>/manifest.json --dry-run
```

Audit examples:

```bash
npm run audit:idea -- --input experiments/005-minotaur-mortgage/brief.md
npm run audit:character -- --input outputs/005-minotaur-mortgage/<run-id>/character-sheet-audit-brief.md
npm run audit:keyframes -- --input outputs/005-minotaur-mortgage/<run-id>/keyframe-audit-brief.md
```
