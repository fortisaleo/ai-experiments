# ai-experiments

Daily open-source AI experiments.

The goal is simple: ship one small AI experiment every day, in public, with enough code and notes for other builders to follow along, remix, or reproduce the result.

Each experiment should leave behind something concrete: a runnable script, a config, a generated artifact, a manifest, a launch post, or a writeup.

## Quick Start

Requirements:

- Node.js 20+
- A fal.ai API key

Install dependencies:

```bash
npm install
```

Create `.env`:

```bash
FAL_AI_API_KEY=your_fal_key
```

Preview the default experiment without generating media:

```bash
npm run generate -- --dry-run
```

Run experiment 001:

```bash
npm run generate:001
```

Real generation calls fal.ai models and may use paid credits.

## Experiment 001: Seedance FACS

The first experiment generates facial-performance videos with fal.ai, GPT Image 2, and Seedance 2.0.

1. Generates a cinematic portrait with fal-hosted GPT Image 2.
2. Uses that image as the starting frame for a batch of Seedance 2.0 image-to-video clips.
3. Saves the base image, MP4s, prompts, model IDs, seeds, provider responses, and errors in a reproducible manifest.

The experiment is focused on FACS-style facial performance prompts: subtle action-unit controls, forced smiles, mixed signals, uncanny politeness, and close-up micro-expression details.

Experiment files:

```text
experiments/001-seedance-facs/
  config.json
  content/
    README.md
    launch-post.md
    x-article.md
```

## Commands

Generate the base image and all videos with the default experiment:

```bash
npm run generate
```

Run experiment 001 explicitly:

```bash
npm run generate:001
```

Preview the resolved requests without generating media:

```bash
npm run generate -- --dry-run
```

Generate the base image and all videos:

```bash
npm run generate:image
```

Generate videos from an existing image URL:

```bash
npm run generate:videos -- --image-url "https://example.com/base-image.png"
```

Use a custom experiment config:

```bash
npm run generate -- --config experiments/001-seedance-facs/config.json
```

## Outputs

Generated media is written to:

```text
outputs/<experiment-slug>/<run-id>/
  base-image.png
  manifest.json
  videos/
```

Generated media, provider responses, and secrets are intentionally ignored by Git:

```text
.env
outputs/
node_modules/
dist/
```

## Default Models

- Base image: `openai/gpt-image-2`
- Video: `bytedance/seedance-2.0/image-to-video`

The model IDs live in `experiments/001-seedance-facs/config.json`, so they can be changed without editing code.

## Experiment Structure

New experiments should follow this pattern:

```text
experiments/002-short-slug/
  config.json
  content/
    README.md
    launch-post.md
    x-article.md
```

Outputs should use the matching experiment slug:

```text
outputs/002-short-slug/<run-id>/
```

Each experiment folder contains the source config, launch post, X Article draft, media references, and publishing checklist for that experiment.
