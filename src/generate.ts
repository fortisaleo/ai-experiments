import "dotenv/config";

import { fal } from "@fal-ai/client";
import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { z } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const execFileAsync = promisify(execFile);

const imageSizeSchema = z.union([
  z.enum(["square_hd", "square", "portrait_4_3", "portrait_16_9", "landscape_4_3", "landscape_16_9", "auto"]),
  z.object({
    width: z.number().int().positive(),
    height: z.number().int().positive()
  })
]);

const experimentSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).optional(),
  baseImage: z.object({
    model: z.string().min(1).default("openai/gpt-image-2"),
    prompt: z.string().min(1),
    imageSize: imageSizeSchema.default("portrait_16_9"),
    quality: z.enum(["low", "medium", "high"]).default("high"),
    outputFormat: z.enum(["jpeg", "png", "webp"]).default("png")
  }),
  baseImageCandidates: z.object({
    count: z.number().int().positive().default(5),
    promptTemplate: z.string().min(1),
    subjects: z.array(
      z.object({
        name: z.string().min(1),
        descriptor: z.string().min(1)
      })
    ).min(1)
  }).optional(),
  selectedBaseImage: z.object({
    name: z.string().min(1),
    imageUrl: z.string().url(),
    upscaledImageUrl: z.string().url().optional(),
    localPath: z.string().min(1).optional(),
    upscaledLocalPath: z.string().min(1).optional(),
    notes: z.string().min(1).optional()
  }).optional(),
  baseImageUpscale: z.object({
    model: z.string().min(1).default("fal-ai/topaz/upscale/image"),
    topazModel: z.string().min(1).default("Standard V2"),
    upscaleFactor: z.number().positive().default(2),
    outputFormat: z.enum(["jpeg", "png"]).default("png"),
    subjectDetection: z.enum(["All", "Foreground", "Background"]).default("All"),
    faceEnhancement: z.boolean().default(true),
    faceEnhancementStrength: z.number().min(0).max(1).default(0.8)
  }).optional(),
  music: z.object({
    model: z.string().min(1).default("fal-ai/minimax-music/v2.6"),
    prompt: z.string().min(10),
    lyrics: z.string().min(1).optional(),
    lyricsOptimizer: z.boolean().default(false),
    isInstrumental: z.boolean().default(false),
    audioSetting: z.object({
      sampleRate: z.enum(["16000", "24000", "32000", "44100"]).default("44100"),
      bitrate: z.enum(["32000", "64000", "128000", "256000"]).default("256000"),
      format: z.enum(["mp3", "wav", "pcm"]).default("mp3")
    }).optional(),
    rationale: z.string().min(1).optional()
  }).optional(),
  idolCandidates: z.object({
    model: z.string().min(1).default("openai/gpt-image-2"),
    count: z.number().int().positive().default(5),
    imageSize: imageSizeSchema.default("portrait_16_9"),
    quality: z.enum(["auto", "low", "medium", "high"]).default("high"),
    outputFormat: z.enum(["jpeg", "png", "webp"]).default("png"),
    candidates: z.array(
      z.object({
        name: z.string().min(1),
        archetype: z.string().min(1),
        prompt: z.string().min(1)
      })
    ).min(1)
  }).optional(),
  selectedIdol: z.object({
    name: z.string().min(1),
    candidateName: z.string().min(1).optional(),
    imageUrl: z.string().url(),
    localPath: z.string().min(1).optional(),
    notes: z.string().min(1).optional()
  }).optional(),
  imagePack: z.object({
    model: z.string().min(1).default("openai/gpt-image-2"),
    personalitiesPath: z.string().min(1).optional(),
    imageSize: imageSizeSchema.default("portrait_16_9"),
    quality: z.enum(["auto", "low", "medium", "high"]).default("high"),
    outputFormat: z.enum(["jpeg", "png", "webp"]).default("png"),
    frames: z.array(
      z.object({
        name: z.string().min(1),
        type: z.enum(["storyboard", "lookbook"]),
        imageRefs: z.array(z.string().min(1)).optional(),
        prompt: z.string().min(1)
      })
    ).min(1)
  }).optional(),
  storyboard: z.object({
    title: z.string().min(1),
    prompt: z.string().min(1),
    imageRefs: z.array(z.string().min(1)).default([]),
    imageUrls: z.array(z.string().url()).default([]),
    audioUrl: z.string().url().optional(),
    audioRef: z.string().min(1).default("music")
  }).optional(),
  referenceVideo: z.object({
    model: z.string().min(1).default("bytedance/seedance-2.0/reference-to-video"),
    resolution: z.enum(["480p", "720p"]).default("720p"),
    duration: z.enum(["auto", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"]).default("15"),
    aspectRatio: z.enum(["auto", "21:9", "16:9", "4:3", "1:1", "3:4", "9:16"]).default("9:16"),
    generateAudio: z.boolean().default(true),
    seed: z.number().int().optional()
  }).optional(),
  assembly: z.object({
    enabled: z.boolean().default(true),
    mode: z.enum(["copy-seedance", "mux-music"]).default("copy-seedance"),
    musicVolume: z.number().positive().default(0.7)
  }).optional(),
  memberVideos: z.object({
    personalitiesPath: z.string().min(1).default("experiments/003-kpop-idol-beauty-ugc/personalities.json"),
    imagePack: z.object({
      model: z.string().min(1).default("openai/gpt-image-2/edit"),
      imageSize: imageSizeSchema.default("auto"),
      quality: z.enum(["auto", "low", "medium", "high"]).default("high"),
      outputFormat: z.enum(["jpeg", "png", "webp"]).default("png"),
      frames: z.array(
        z.object({
          name: z.string().min(1),
          promptTemplate: z.string().min(1)
        })
      ).min(1)
    }),
    referenceVideo: z.object({
      model: z.string().min(1).default("bytedance/seedance-2.0/reference-to-video"),
      resolution: z.enum(["480p", "720p"]).default("720p"),
      duration: z.enum(["auto", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"]).default("15"),
      aspectRatio: z.enum(["auto", "21:9", "16:9", "4:3", "1:1", "3:4", "9:16"]).default("9:16"),
      generateAudio: z.boolean().default(true)
    }),
    members: z.array(
      z.object({
        id: z.string().min(1),
        lane: z.string().min(1),
        seed: z.number().int().optional(),
        storyboardPrompt: z.string().min(1)
      })
    ).min(1)
  }).optional(),
  video: z.object({
    model: z.string().min(1).default("bytedance/seedance-2.0/image-to-video"),
    resolution: z.enum(["480p", "720p"]).default("720p"),
    duration: z.enum(["auto", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"]).default("5"),
    aspectRatio: z.enum(["auto", "21:9", "16:9", "4:3", "1:1", "3:4", "9:16"]).default("9:16"),
    generateAudio: z.boolean().default(false)
  }),
  clips: z.array(
    z.object({
      name: z.string().min(1),
      prompt: z.string().min(1),
      seed: z.number().int().optional()
    })
  ).min(1)
});

type Experiment = z.infer<typeof experimentSchema>;

type CliOptions = {
  command: "generate" | "image" | "videos" | "candidates" | "upscale" | "upscale-image-pack" | "music" | "image-pack" | "video" | "assemble" | "members";
  configPath: string;
  dryRun: boolean;
  imageUrl?: string;
  manifestPath?: string;
};

type Manifest = {
  runId: string;
  createdAt: string;
  updatedAt: string;
  dryRun: boolean;
  configPath: string;
  models: {
    image: string;
    video: string;
  };
  baseImage: {
    prompt: string;
    imageUrl?: string;
    localPath?: string;
    model: string;
    providerResult?: unknown;
  };
  selectedBaseImage?: {
    name: string;
    imageUrl: string;
    upscaledImageUrl?: string;
    localPath?: string;
    upscaledLocalPath?: string;
    notes?: string;
  };
  baseImageUpscale?: {
    status: "succeeded" | "failed" | "dry-run";
    sourceImageUrl: string;
    imageUrl?: string;
    localPath?: string;
    providerResult?: unknown;
    error?: string;
  };
  music?: {
    status: "pending" | "succeeded" | "failed" | "dry-run";
    prompt: string;
    lyrics?: string;
    audioUrl?: string;
    localPath?: string;
    model: string;
    providerResult?: unknown;
    error?: string;
  };
  idolCandidates?: Array<{
    name: string;
    archetype: string;
    prompt: string;
    status: "succeeded" | "failed" | "dry-run";
    imageUrl?: string;
    localPath?: string;
    providerResult?: unknown;
    error?: string;
  }>;
  selectedIdol?: {
    name: string;
    candidateName?: string;
    imageUrl: string;
    localPath?: string;
    notes?: string;
  };
  imagePack?: Array<{
    name: string;
    type: "storyboard" | "lookbook";
    prompt: string;
    status: "succeeded" | "failed" | "dry-run";
    imageUrl?: string;
    localPath?: string;
    upscaledImageUrl?: string;
    upscaledLocalPath?: string;
    upscaleStatus?: "succeeded" | "failed" | "dry-run";
    upscaleError?: string;
    upscaleProviderResult?: unknown;
    providerResult?: unknown;
    error?: string;
  }>;
  referenceVideo?: {
    status: "pending" | "succeeded" | "failed" | "dry-run";
    prompt: string;
    videoUrl?: string;
    localPath?: string;
    model: string;
    imageUrls: string[];
    audioUrls?: string[];
    providerResult?: unknown;
    error?: string;
  };
  assembledVideo?: {
    status: "succeeded" | "failed" | "dry-run" | "skipped";
    localPath?: string;
    command?: string;
    error?: string;
  };
  memberVideos?: Array<{
    id: string;
    displayName: string;
    lane: string;
    sourcePortrait: {
      imageUrl: string;
      localPath?: string;
    };
    referenceImages: Array<{
      name: string;
      prompt: string;
      status: "succeeded" | "failed" | "dry-run";
      imageUrl?: string;
      localPath?: string;
      providerResult?: unknown;
      error?: string;
    }>;
    video: {
      prompt: string;
      status: "pending" | "succeeded" | "failed" | "dry-run";
      videoUrl?: string;
      localPath?: string;
      providerResult?: unknown;
      error?: string;
    };
    finalVideo: {
      status: "succeeded" | "failed" | "dry-run";
      localPath?: string;
      command?: string;
      error?: string;
    };
  }>;
  baseImageCandidates?: Array<{
    name: string;
    descriptor: string;
    prompt: string;
    status: "succeeded" | "failed" | "dry-run";
    imageUrl?: string;
    localPath?: string;
    providerResult?: unknown;
    error?: string;
  }>;
  falImageUrl?: string;
  videos: Array<{
    name: string;
    prompt: string;
    seed?: number;
    status: "pending" | "succeeded" | "failed" | "dry-run";
    videoUrl?: string;
    localPath?: string;
    providerResult?: unknown;
    error?: string;
  }>;
  config: Experiment;
  errors: string[];
};

type PersonalityRegistry = {
  groupName: string;
  members: Array<{
    id: string;
    displayName: string;
    localPath?: string;
    imageUrl: string;
    archetype?: string;
    role?: string;
    personality?: string;
    voice?: string;
    bestUse?: string;
  }>;
};

function parseArgs(argv: string[]): CliOptions {
  const args = [...argv];
  let command: CliOptions["command"] = "generate";

  if (
    args[0] === "image"
    || args[0] === "videos"
    || args[0] === "generate"
    || args[0] === "candidates"
    || args[0] === "upscale"
    || args[0] === "upscale-image-pack"
    || args[0] === "music"
    || args[0] === "image-pack"
    || args[0] === "video"
    || args[0] === "assemble"
    || args[0] === "members"
  ) {
    command = args.shift() as CliOptions["command"];
  }

  const options: CliOptions = {
    command,
    configPath: path.join(repoRoot, "experiments/001-seedance-facs/config.json"),
    dryRun: false
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--config") {
      options.configPath = path.resolve(args[++index] ?? "");
    } else if (arg === "--image-url") {
      options.imageUrl = args[++index];
    } else if (arg === "--manifest") {
      options.manifestPath = path.resolve(args[++index] ?? "");
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function configureFal(): void {
  const key = process.env.FAL_AI_API_KEY;
  if (!key) {
    throw new Error("Missing FAL_AI_API_KEY in the environment. Add it to .env before running generation.");
  }

  process.env.FAL_KEY = key;
  fal.config({ credentials: key });
}

async function loadExperiment(configPath: string): Promise<Experiment> {
  const rawConfig = await readFile(configPath, "utf8");
  return experimentSchema.parse(JSON.parse(rawConfig));
}

function createRunId(name: string): string {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `${stamp}-${name}`;
}

function getExperimentSlug(experiment: Experiment): string {
  return experiment.slug ?? experiment.name;
}

function createManifest(runId: string, options: CliOptions, experiment: Experiment): Manifest {
  const now = new Date().toISOString();
  return {
    runId,
    createdAt: now,
    updatedAt: now,
    dryRun: options.dryRun,
    configPath: options.configPath,
    models: {
      image: experiment.baseImage.model,
      video: experiment.referenceVideo?.model ?? experiment.video.model
    },
    baseImage: {
      prompt: experiment.baseImage.prompt,
      model: experiment.baseImage.model,
      imageUrl: experiment.selectedBaseImage?.upscaledImageUrl ?? experiment.selectedBaseImage?.imageUrl,
      localPath: experiment.selectedBaseImage?.upscaledLocalPath ?? experiment.selectedBaseImage?.localPath
    },
    selectedBaseImage: experiment.selectedBaseImage,
    music: experiment.music ? {
      status: "pending",
      prompt: experiment.music.prompt,
      lyrics: experiment.music.lyrics,
      model: experiment.music.model
    } : undefined,
    idolCandidates: [],
    selectedIdol: experiment.selectedIdol,
    imagePack: [],
    referenceVideo: experiment.referenceVideo && experiment.storyboard ? {
      status: "pending",
      prompt: experiment.storyboard.prompt,
      model: experiment.referenceVideo.model,
      imageUrls: [],
      audioUrls: []
    } : undefined,
    memberVideos: [],
    baseImageCandidates: [],
    videos: experiment.clips.map((clip) => ({
      name: clip.name,
      prompt: clip.prompt,
      seed: clip.seed,
      status: "pending"
    })),
    config: experiment,
    errors: []
  };
}

function buildCandidatePrompt(template: string, subject: { name: string; descriptor: string }): string {
  return template
    .replaceAll("{{name}}", subject.name)
    .replaceAll("{{descriptor}}", subject.descriptor);
}

function renderTemplate(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{{${key}}}`, value),
    template
  );
}

async function loadPersonalityRegistry(personalitiesPath: string): Promise<PersonalityRegistry> {
  const resolvedPath = path.resolve(repoRoot, personalitiesPath);
  return JSON.parse(await readFile(resolvedPath, "utf8")) as PersonalityRegistry;
}

async function saveManifest(manifest: Manifest, outputDir: string): Promise<void> {
  manifest.updatedAt = new Date().toISOString();
  await writeFile(path.join(outputDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
}

function getImageUrl(result: unknown): string {
  const images = (result as { data?: { images?: Array<{ url?: string }> }; images?: Array<{ url?: string }> }).data?.images
    ?? (result as { images?: Array<{ url?: string }> }).images;
  const url = images?.[0]?.url;
  if (!url) {
    throw new Error("Image generation completed but no image URL was returned.");
  }
  return url;
}

function getOutputImageUrl(result: unknown): string {
  const image = (result as { data?: { image?: { url?: string } }; image?: { url?: string } }).data?.image
    ?? (result as { image?: { url?: string } }).image;
  const url = image?.url;
  if (url) {
    return url;
  }
  return getImageUrl(result);
}

function getVideoUrl(result: unknown): string {
  const video = (result as { data?: { video?: { url?: string } }; video?: { url?: string } }).data?.video
    ?? (result as { video?: { url?: string } }).video;
  const url = video?.url;
  if (!url) {
    throw new Error("Video generation completed but no video URL was returned.");
  }
  return url;
}

function getAudioUrl(result: unknown): string {
  const audio = (result as { data?: { audio?: { url?: string } }; audio?: { url?: string } }).data?.audio
    ?? (result as { audio?: { url?: string } }).audio;
  const url = audio?.url;
  if (!url) {
    throw new Error("Audio generation completed but no audio URL was returned.");
  }
  return url;
}

function toAspectRatio(imageSize: NonNullable<Experiment["imagePack"]>["imageSize"]): string {
  if (imageSize === "portrait_16_9") return "9:16";
  if (imageSize === "landscape_16_9") return "16:9";
  if (imageSize === "square") return "1:1";
  return "auto";
}

function buildImagePackInput(experiment: Experiment, prompt: string, imageUrls: string[]): Record<string, unknown> {
  if (!experiment.imagePack) {
    throw new Error("This config does not define imagePack.");
  }

  if (experiment.imagePack.model.includes("nano-banana-2")) {
    return {
      prompt,
      ...(imageUrls.length > 0 ? { image_urls: imageUrls } : {}),
      aspect_ratio: toAspectRatio(experiment.imagePack.imageSize),
      output_format: experiment.imagePack.outputFormat,
      num_images: 1,
      resolution: "1K",
      limit_generations: true,
      enable_web_search: false
    };
  }

  return {
    prompt,
    ...(imageUrls.length > 0 ? { image_urls: imageUrls } : {}),
    image_size: experiment.imagePack.imageSize,
    quality: experiment.imagePack.quality,
    num_images: 1,
    output_format: experiment.imagePack.outputFormat
  };
}

async function downloadFile(url: string, destination: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(destination, bytes);
}

function createStatusLogger(prefix: string): (status: { status?: string }) => void {
  let previousStatus: string | undefined;
  return (status) => {
    if (status.status && status.status !== previousStatus) {
      previousStatus = status.status;
      console.log(`${prefix} ${status.status}`);
    }
  };
}

async function generateMusic(experiment: Experiment, manifest: Manifest, outputDir: string, dryRun: boolean): Promise<string | undefined> {
  if (!experiment.music) {
    throw new Error("This config does not define music.");
  }

  const musicDir = path.join(outputDir, "music");
  await mkdir(musicDir, { recursive: true });

  const input = {
    prompt: experiment.music.prompt,
    ...(experiment.music.lyrics === undefined ? {} : { lyrics: experiment.music.lyrics }),
    lyrics_optimizer: experiment.music.lyricsOptimizer,
    is_instrumental: experiment.music.isInstrumental,
    ...(experiment.music.audioSetting === undefined ? {} : {
      audio_setting: {
        sample_rate: experiment.music.audioSetting.sampleRate,
        bitrate: experiment.music.audioSetting.bitrate,
        format: experiment.music.audioSetting.format
      }
    })
  };
  const extension = experiment.music.audioSetting?.format ?? "mp3";
  const localPath = path.join(musicDir, `lumina-lumora-hook.${extension}`);
  manifest.music = {
    status: "pending",
    prompt: experiment.music.prompt,
    lyrics: experiment.music.lyrics,
    model: experiment.music.model
  };

  if (dryRun) {
    console.log("[dry-run] music request", JSON.stringify({ model: experiment.music.model, input }, null, 2));
    manifest.music.status = "dry-run";
    manifest.music.audioUrl = `dry-run://lumina-lumora-hook.${extension}`;
    manifest.music.localPath = localPath;
    return manifest.music.audioUrl;
  }

  try {
    console.log("[music] generating LUMINA Lumora hook");
    const result = await fal.subscribe(experiment.music.model, {
      input,
      logs: true,
      onQueueUpdate: createStatusLogger("[music]")
    });
    const audioUrl = getAudioUrl(result);
    await downloadFile(audioUrl, localPath);
    manifest.music.status = "succeeded";
    manifest.music.audioUrl = audioUrl;
    manifest.music.localPath = localPath;
    manifest.music.providerResult = result;
    return audioUrl;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    manifest.music.status = "failed";
    manifest.music.error = message;
    manifest.errors.push(`music: ${message}`);
    throw error;
  }
}

async function generateBaseImage(experiment: Experiment, manifest: Manifest, outputDir: string, dryRun: boolean): Promise<string | undefined> {
  const input = {
    prompt: experiment.baseImage.prompt,
    image_size: experiment.baseImage.imageSize,
    quality: experiment.baseImage.quality,
    num_images: 1,
    output_format: experiment.baseImage.outputFormat
  };

  if (dryRun) {
    console.log("[dry-run] image request", JSON.stringify({ model: experiment.baseImage.model, input }, null, 2));
    manifest.baseImage.imageUrl = "dry-run://base-image";
    manifest.baseImage.localPath = path.join(outputDir, `base-image.${experiment.baseImage.outputFormat}`);
    return manifest.baseImage.imageUrl;
  }

  const result = await fal.subscribe(experiment.baseImage.model, {
    input,
    logs: true,
    onQueueUpdate: createStatusLogger("[image]")
  });

  const imageUrl = getImageUrl(result);
  const localPath = path.join(outputDir, `base-image.${experiment.baseImage.outputFormat}`);
  await downloadFile(imageUrl, localPath);

  manifest.baseImage.imageUrl = imageUrl;
  manifest.baseImage.localPath = localPath;
  manifest.baseImage.providerResult = result;
  manifest.falImageUrl = imageUrl;
  return imageUrl;
}

async function generateIdolCandidates(experiment: Experiment, manifest: Manifest, outputDir: string, dryRun: boolean): Promise<void> {
  if (!experiment.idolCandidates) {
    await generateBaseImageCandidates(experiment, manifest, outputDir, dryRun);
    return;
  }

  const candidatesDir = path.join(outputDir, "idol-candidates");
  await mkdir(candidatesDir, { recursive: true });
  const candidates = experiment.idolCandidates.candidates.slice(0, experiment.idolCandidates.count);
  manifest.idolCandidates = [];

  for (const [index, candidate] of candidates.entries()) {
    const input = {
      prompt: candidate.prompt,
      image_size: experiment.idolCandidates.imageSize,
      quality: experiment.idolCandidates.quality,
      num_images: 1,
      output_format: experiment.idolCandidates.outputFormat
    };
    const localPath = path.join(
      candidatesDir,
      `${String(index + 1).padStart(2, "0")}-${candidate.name}.${experiment.idolCandidates.outputFormat}`
    );

    if (dryRun) {
      console.log("[dry-run] idol candidate request", JSON.stringify({ model: experiment.idolCandidates.model, input }, null, 2));
      manifest.idolCandidates.push({
        name: candidate.name,
        archetype: candidate.archetype,
        prompt: candidate.prompt,
        status: "dry-run",
        imageUrl: `dry-run://${candidate.name}.${experiment.idolCandidates.outputFormat}`,
        localPath
      });
      continue;
    }

    try {
      console.log(`[idol-candidate] generating ${candidate.name}`);
      const result = await fal.subscribe(experiment.idolCandidates.model, {
        input,
        logs: true,
        onQueueUpdate: createStatusLogger(`[idol-candidate:${candidate.name}]`)
      });
      const imageUrl = getImageUrl(result);
      await downloadFile(imageUrl, localPath);
      manifest.idolCandidates.push({
        name: candidate.name,
        archetype: candidate.archetype,
        prompt: candidate.prompt,
        status: "succeeded",
        imageUrl,
        localPath,
        providerResult: result
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      manifest.idolCandidates.push({
        name: candidate.name,
        archetype: candidate.archetype,
        prompt: candidate.prompt,
        status: "failed",
        error: message
      });
      manifest.errors.push(`${candidate.name}: ${message}`);
      console.error(`[idol-candidate:${candidate.name}] failed: ${message}`);
    }
  }
}

async function generateBaseImageCandidates(experiment: Experiment, manifest: Manifest, outputDir: string, dryRun: boolean): Promise<void> {
  if (!experiment.baseImageCandidates) {
    throw new Error("This config does not define baseImageCandidates.");
  }

  const candidatesDir = path.join(outputDir, "base-candidates");
  await mkdir(candidatesDir, { recursive: true });

  const subjects = experiment.baseImageCandidates.subjects.slice(0, experiment.baseImageCandidates.count);
  manifest.baseImageCandidates = [];

  for (const [index, subject] of subjects.entries()) {
    const prompt = buildCandidatePrompt(experiment.baseImageCandidates.promptTemplate, subject);
    const input = {
      prompt,
      image_size: experiment.baseImage.imageSize,
      quality: experiment.baseImage.quality,
      num_images: 1,
      output_format: experiment.baseImage.outputFormat
    };

    const localPath = path.join(
      candidatesDir,
      `${String(index + 1).padStart(2, "0")}-${subject.name}.${experiment.baseImage.outputFormat}`
    );

    if (dryRun) {
      console.log("[dry-run] candidate image request", JSON.stringify({ model: experiment.baseImage.model, input }, null, 2));
      manifest.baseImageCandidates.push({
        name: subject.name,
        descriptor: subject.descriptor,
        prompt,
        status: "dry-run",
        imageUrl: `dry-run://${subject.name}.${experiment.baseImage.outputFormat}`,
        localPath
      });
      continue;
    }

    try {
      console.log(`[candidate] generating ${subject.name}`);
      const result = await fal.subscribe(experiment.baseImage.model, {
        input,
        logs: true,
        onQueueUpdate: createStatusLogger(`[candidate:${subject.name}]`)
      });
      const imageUrl = getImageUrl(result);
      await downloadFile(imageUrl, localPath);
      manifest.baseImageCandidates.push({
        name: subject.name,
        descriptor: subject.descriptor,
        prompt,
        status: "succeeded",
        imageUrl,
        localPath,
        providerResult: result
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      manifest.baseImageCandidates.push({
        name: subject.name,
        descriptor: subject.descriptor,
        prompt,
        status: "failed",
        error: message
      });
      manifest.errors.push(`${subject.name}: ${message}`);
      console.error(`[candidate:${subject.name}] failed: ${message}`);
    }
  }
}

async function generateImagePack(experiment: Experiment, manifest: Manifest, outputDir: string, dryRun: boolean): Promise<void> {
  if (!experiment.imagePack) {
    throw new Error("This config does not define imagePack.");
  }

  const registry = experiment.imagePack.personalitiesPath
    ? await loadPersonalityRegistry(experiment.imagePack.personalitiesPath)
    : undefined;
  const selectedImageUrl = experiment.selectedIdol?.imageUrl
    ?? manifest.selectedIdol?.imageUrl
    ?? experiment.selectedBaseImage?.upscaledImageUrl
    ?? experiment.selectedBaseImage?.imageUrl
    ?? manifest.selectedBaseImage?.upscaledImageUrl
    ?? manifest.selectedBaseImage?.imageUrl
    ?? manifest.baseImage.imageUrl;
  const hasFrameImageRefs = experiment.imagePack.frames.some((frame) => frame.imageRefs && frame.imageRefs.length > 0);
  const allowsTextOnlyImagePack = experiment.imagePack.model.includes("nano-banana-2");
  if (!selectedImageUrl && !registry && !allowsTextOnlyImagePack && !dryRun) {
    throw new Error("No selectedIdol.imageUrl or selectedBaseImage.imageUrl available. Add a selected identity/reference image before creating the image pack.");
  }
  if (hasFrameImageRefs && !registry) {
    throw new Error("imagePack frame imageRefs require imagePack.personalitiesPath.");
  }

  const imagePackDir = path.join(outputDir, "image-pack");
  await mkdir(imagePackDir, { recursive: true });
  manifest.imagePack = [];

  for (const [index, frame] of experiment.imagePack.frames.entries()) {
    const referencedImageUrls = frame.imageRefs?.map((memberId) => {
      const member = registry?.members.find((candidate) => candidate.id === memberId);
      if (!member) {
        throw new Error(`No personality found for imagePack frame "${frame.name}" imageRef "${memberId}".`);
      }
      return member.imageUrl;
    });
    const imageUrls = referencedImageUrls && referencedImageUrls.length > 0
      ? referencedImageUrls
      : selectedImageUrl
        ? [selectedImageUrl]
        : [];
    const input = buildImagePackInput(experiment, frame.prompt, imageUrls);
    const localPath = path.join(
      imagePackDir,
      `${String(index + 1).padStart(2, "0")}-${frame.type}-${frame.name}.${experiment.imagePack.outputFormat}`
    );

    if (dryRun) {
      console.log("[dry-run] image pack request", JSON.stringify({ model: experiment.imagePack.model, input }, null, 2));
      manifest.imagePack.push({
        name: frame.name,
        type: frame.type,
        prompt: frame.prompt,
        status: "dry-run",
        imageUrl: `dry-run://${frame.name}.${experiment.imagePack.outputFormat}`,
        localPath
      });
      continue;
    }

    try {
      console.log(`[image-pack] generating ${frame.name}`);
      const result = await fal.subscribe(experiment.imagePack.model, {
        input,
        logs: true,
        onQueueUpdate: createStatusLogger(`[image-pack:${frame.name}]`)
      });
      const imageUrl = getImageUrl(result);
      await downloadFile(imageUrl, localPath);
      manifest.imagePack.push({
        name: frame.name,
        type: frame.type,
        prompt: frame.prompt,
        status: "succeeded",
        imageUrl,
        localPath,
        providerResult: result
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      manifest.imagePack.push({
        name: frame.name,
        type: frame.type,
        prompt: frame.prompt,
        status: "failed",
        error: message
      });
      manifest.errors.push(`${frame.name}: ${message}`);
      console.error(`[image-pack:${frame.name}] failed: ${message}`);
    }
  }
}

async function upscaleSelectedBaseImage(experiment: Experiment, manifest: Manifest, outputDir: string, dryRun: boolean): Promise<string> {
  if (!experiment.selectedBaseImage) {
    throw new Error("This config does not define selectedBaseImage.");
  }
  if (!experiment.baseImageUpscale) {
    throw new Error("This config does not define baseImageUpscale.");
  }

  const sourceImageUrl = experiment.selectedBaseImage.imageUrl;
  const input = {
    image_url: sourceImageUrl,
    model: experiment.baseImageUpscale.topazModel,
    upscale_factor: experiment.baseImageUpscale.upscaleFactor,
    output_format: experiment.baseImageUpscale.outputFormat,
    subject_detection: experiment.baseImageUpscale.subjectDetection,
    face_enhancement: experiment.baseImageUpscale.faceEnhancement,
    face_enhancement_strength: experiment.baseImageUpscale.faceEnhancementStrength
  };
  const localPath = path.join(outputDir, `selected-base-upscaled.${experiment.baseImageUpscale.outputFormat}`);

  if (dryRun) {
    const dryRunImageUrl = "dry-run://selected-base-upscaled";
    console.log("[dry-run] upscale request", JSON.stringify({ model: experiment.baseImageUpscale.model, input }, null, 2));
    manifest.baseImageUpscale = {
      status: "dry-run",
      sourceImageUrl,
      imageUrl: dryRunImageUrl,
      localPath
    };
    manifest.baseImage.imageUrl = dryRunImageUrl;
    manifest.baseImage.localPath = localPath;
    return dryRunImageUrl;
  }

  try {
    console.log(`[upscale] enhancing ${experiment.selectedBaseImage.name}`);
    const result = await fal.subscribe(experiment.baseImageUpscale.model, {
      input,
      logs: true,
      onQueueUpdate: createStatusLogger("[upscale]")
    });
    const imageUrl = getOutputImageUrl(result);
    await downloadFile(imageUrl, localPath);
    manifest.baseImageUpscale = {
      status: "succeeded",
      sourceImageUrl,
      imageUrl,
      localPath,
      providerResult: result
    };
    manifest.baseImage.imageUrl = imageUrl;
    manifest.baseImage.localPath = localPath;
    manifest.baseImage.providerResult = result;
    manifest.falImageUrl = imageUrl;
    return imageUrl;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    manifest.baseImageUpscale = {
      status: "failed",
      sourceImageUrl,
      error: message
    };
    manifest.errors.push(`upscale: ${message}`);
    throw error;
  }
}

async function upscaleImagePack(experiment: Experiment, manifest: Manifest, outputDir: string, dryRun: boolean): Promise<void> {
  if (!manifest.imagePack || manifest.imagePack.length === 0) {
    throw new Error("Manifest does not contain imagePack entries.");
  }
  if (!experiment.baseImageUpscale) {
    throw new Error("This config does not define baseImageUpscale.");
  }

  const upscaleDir = path.join(outputDir, "image-pack-upscaled");
  await mkdir(upscaleDir, { recursive: true });

  for (const [index, frame] of manifest.imagePack.entries()) {
    if (frame.status !== "succeeded" || !frame.imageUrl) {
      continue;
    }

    const input = {
      image_url: frame.imageUrl,
      model: experiment.baseImageUpscale.topazModel,
      upscale_factor: experiment.baseImageUpscale.upscaleFactor,
      output_format: experiment.baseImageUpscale.outputFormat,
      subject_detection: experiment.baseImageUpscale.subjectDetection,
      face_enhancement: experiment.baseImageUpscale.faceEnhancement,
      face_enhancement_strength: experiment.baseImageUpscale.faceEnhancementStrength
    };
    const localPath = path.join(
      upscaleDir,
      `${String(index + 1).padStart(2, "0")}-${frame.type}-${frame.name}-topaz.${experiment.baseImageUpscale.outputFormat}`
    );

    if (dryRun) {
      console.log("[dry-run] image-pack upscale request", JSON.stringify({ model: experiment.baseImageUpscale.model, input }, null, 2));
      frame.upscaleStatus = "dry-run";
      frame.upscaledImageUrl = `dry-run://${frame.name}-topaz.${experiment.baseImageUpscale.outputFormat}`;
      frame.upscaledLocalPath = localPath;
      continue;
    }

    try {
      console.log(`[image-pack-upscale] enhancing ${frame.name}`);
      const result = await fal.subscribe(experiment.baseImageUpscale.model, {
        input,
        logs: true,
        onQueueUpdate: createStatusLogger(`[image-pack-upscale:${frame.name}]`)
      });
      const imageUrl = getOutputImageUrl(result);
      await downloadFile(imageUrl, localPath);
      frame.upscaleStatus = "succeeded";
      frame.upscaledImageUrl = imageUrl;
      frame.upscaledLocalPath = localPath;
      frame.upscaleProviderResult = result;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      frame.upscaleStatus = "failed";
      frame.upscaleError = message;
      manifest.errors.push(`${frame.name}: upscale: ${message}`);
      console.error(`[image-pack-upscale:${frame.name}] failed: ${message}`);
    }
  }
}

function resolveStoryboardImageUrls(experiment: Experiment, manifest: Manifest, dryRun: boolean): string[] {
  if (!experiment.storyboard) {
    return [];
  }

  const imagePackUrls = experiment.storyboard.imageRefs
    .map((refName) => manifest.imagePack?.find((frame) => frame.name === refName)?.imageUrl)
    .filter((url): url is string => Boolean(url));

  const selectedUrl = experiment.selectedIdol?.imageUrl
    ?? manifest.selectedIdol?.imageUrl
    ?? experiment.selectedBaseImage?.upscaledImageUrl
    ?? experiment.selectedBaseImage?.imageUrl
    ?? manifest.selectedBaseImage?.upscaledImageUrl
    ?? manifest.selectedBaseImage?.imageUrl
    ?? manifest.baseImage.imageUrl;
  const urls = [...experiment.storyboard.imageUrls, ...(selectedUrl ? [selectedUrl] : []), ...imagePackUrls];

  if (urls.length > 0) {
    return urls.slice(0, 9);
  }
  return dryRun ? ["dry-run://selected-idol.png"] : [];
}

async function generateReferenceVideo(experiment: Experiment, manifest: Manifest, outputDir: string, dryRun: boolean): Promise<string | undefined> {
  if (!experiment.referenceVideo || !experiment.storyboard) {
    throw new Error("This config does not define referenceVideo and storyboard.");
  }

  const videosDir = path.join(outputDir, "reference-video");
  await mkdir(videosDir, { recursive: true });

  const imageUrls = resolveStoryboardImageUrls(experiment, manifest, dryRun);
  const audioUrl = experiment.storyboard.audioUrl ?? manifest.music?.audioUrl;
  if (imageUrls.length === 0) {
    throw new Error("No selected idol or storyboard image pack references available for reference video.");
  }
  const requiresAudioUrl = experiment.referenceVideo.model.includes("seedance") && !experiment.referenceVideo.generateAudio;
  if (!audioUrl && requiresAudioUrl && !dryRun) {
    throw new Error("No generated music audio URL available for reference video. Run the music stage first or provide a manifest with music.audioUrl.");
  }

  const input: Record<string, unknown> = {
    prompt: experiment.storyboard.prompt,
    image_urls: imageUrls,
    resolution: experiment.referenceVideo.resolution,
    duration: experiment.referenceVideo.model.includes("happy-horse")
      ? Number(experiment.referenceVideo.duration)
      : experiment.referenceVideo.duration,
    aspect_ratio: experiment.referenceVideo.aspectRatio,
    ...(experiment.referenceVideo.seed === undefined ? {} : { seed: experiment.referenceVideo.seed })
  };
  if (experiment.referenceVideo.model.includes("kling-video/o3")) {
    delete input.resolution;
    input.start_image_url = imageUrls[1] ?? imageUrls[0];
    input.image_urls = [imageUrls[0]];
    if (imageUrls[1]) {
      input.elements = [
        {
          frontal_image_url: imageUrls[1],
          reference_image_urls: [imageUrls[1]]
        }
      ];
    }
    input.shot_type = "customize";
    input.generate_audio = experiment.referenceVideo.generateAudio;
  } else if (experiment.referenceVideo.model.includes("happy-horse")) {
    input.enable_safety_checker = true;
  } else {
    if (audioUrl) {
      input.audio_urls = [audioUrl];
    } else if (dryRun && requiresAudioUrl) {
      input.audio_urls = ["dry-run://reference-audio.mp3"];
    }
    input.generate_audio = experiment.referenceVideo.generateAudio;
  }
  const localPath = path.join(videosDir, `${experiment.storyboard.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "reference-video"}.mp4`);

  manifest.referenceVideo = {
    status: "pending",
    prompt: experiment.storyboard.prompt,
    model: experiment.referenceVideo.model,
    imageUrls,
    audioUrls: audioUrl ? [audioUrl] : undefined
  };

  if (dryRun) {
    console.log("[dry-run] reference video request", JSON.stringify({ model: experiment.referenceVideo.model, input }, null, 2));
    manifest.referenceVideo.status = "dry-run";
    manifest.referenceVideo.videoUrl = "dry-run://mina-rae-lumora-reference-video.mp4";
    manifest.referenceVideo.localPath = localPath;
    return manifest.referenceVideo.videoUrl;
  }

  try {
    console.log(`[reference-video] generating ${experiment.storyboard.title}`);
    const result = await fal.subscribe(experiment.referenceVideo.model, {
      input,
      logs: true,
      onQueueUpdate: createStatusLogger("[reference-video]")
    });
    const videoUrl = getVideoUrl(result);
    await downloadFile(videoUrl, localPath);
    manifest.referenceVideo.status = "succeeded";
    manifest.referenceVideo.videoUrl = videoUrl;
    manifest.referenceVideo.localPath = localPath;
    manifest.referenceVideo.providerResult = result;
    return videoUrl;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    manifest.referenceVideo.status = "failed";
    manifest.referenceVideo.error = message;
    manifest.errors.push(`reference-video: ${message}`);
    throw error;
  }
}

async function assembleVideo(experiment: Experiment, manifest: Manifest, outputDir: string, dryRun: boolean): Promise<void> {
  if (!experiment.assembly?.enabled) {
    manifest.assembledVideo = { status: "skipped" };
    return;
  }

  const sourceVideoPath = manifest.referenceVideo?.localPath ?? manifest.videos.find((video) => video.localPath)?.localPath;
  if (!sourceVideoPath) {
    throw new Error("No local video path available to assemble.");
  }

  const finalDir = path.join(outputDir, "final");
  await mkdir(finalDir, { recursive: true });
  const finalPath = path.join(finalDir, "mina-rae-lumora-final.mp4");

  if (dryRun) {
    const command = experiment.assembly.mode === "mux-music"
      ? `ffmpeg -i ${sourceVideoPath} -i ${manifest.music?.localPath ?? "music.mp3"} -filter_complex [1:a]volume=${experiment.assembly.musicVolume}[music] -map 0:v:0 -map [music] -shortest ${finalPath}`
      : `ffmpeg -i ${sourceVideoPath} -c copy ${finalPath}`;
    console.log("[dry-run] assembly command", command);
    manifest.assembledVideo = { status: "dry-run", localPath: finalPath, command };
    return;
  }

  try {
    let args: string[];
    if (experiment.assembly.mode === "mux-music") {
      const musicPath = manifest.music?.localPath;
      if (!musicPath) {
        throw new Error("assembly.mode is mux-music but no local music path is available.");
      }
      args = [
        "-y",
        "-i",
        sourceVideoPath,
        "-i",
        musicPath,
        "-filter_complex",
        `[1:a]volume=${experiment.assembly.musicVolume}[music]`,
        "-map",
        "0:v:0",
        "-map",
        "[music]",
        "-shortest",
        "-c:v",
        "copy",
        finalPath
      ];
    } else {
      args = ["-y", "-i", sourceVideoPath, "-c", "copy", finalPath];
    }

    await execFileAsync("ffmpeg", args);
    manifest.assembledVideo = {
      status: "succeeded",
      localPath: finalPath,
      command: `ffmpeg ${args.join(" ")}`
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    manifest.assembledVideo = { status: "failed", error: message };
    manifest.errors.push(`assembly: ${message}`);
    throw error;
  }
}

async function generateMemberVideos(experiment: Experiment, manifest: Manifest, outputDir: string, dryRun: boolean): Promise<void> {
  if (!experiment.memberVideos) {
    throw new Error("This config does not define memberVideos.");
  }
  if (!experiment.music) {
    throw new Error("This config does not define music.");
  }

  const registry = await loadPersonalityRegistry(experiment.memberVideos.personalitiesPath);
  const audioUrl = await generateMusic(experiment, manifest, outputDir, dryRun);
  manifest.memberVideos = [];

  for (const memberConfig of experiment.memberVideos.members) {
    const member = registry.members.find((candidate) => candidate.id === memberConfig.id);
    if (!member) {
      throw new Error(`No personality found for member id "${memberConfig.id}".`);
    }

    const memberDir = path.join(outputDir, "members", member.id);
    const referencesDir = path.join(memberDir, "references");
    await mkdir(referencesDir, { recursive: true });

    const templateValues = {
      groupName: registry.groupName,
      memberId: member.id,
      displayName: member.displayName,
      lane: memberConfig.lane,
      archetype: member.archetype ?? "",
      role: member.role ?? "",
      personality: member.personality ?? "",
      voice: member.voice ?? "",
      bestUse: member.bestUse ?? ""
    };

    const memberEntry: NonNullable<Manifest["memberVideos"]>[number] = {
      id: member.id,
      displayName: member.displayName,
      lane: memberConfig.lane,
      sourcePortrait: {
        imageUrl: member.imageUrl,
        localPath: member.localPath
      },
      referenceImages: [],
      video: {
        prompt: renderTemplate(memberConfig.storyboardPrompt, templateValues),
        status: "pending"
      },
      finalVideo: {
        status: "dry-run"
      }
    };
    manifest.memberVideos.push(memberEntry);

    for (const [index, frame] of experiment.memberVideos.imagePack.frames.entries()) {
      const prompt = renderTemplate(frame.promptTemplate, templateValues);
      const input = {
        prompt,
        image_urls: [member.imageUrl],
        image_size: experiment.memberVideos.imagePack.imageSize,
        quality: experiment.memberVideos.imagePack.quality,
        num_images: 1,
        output_format: experiment.memberVideos.imagePack.outputFormat
      };
      const localPath = path.join(
        referencesDir,
        `${String(index + 1).padStart(2, "0")}-${frame.name}.${experiment.memberVideos.imagePack.outputFormat}`
      );

      if (dryRun) {
        console.log(`[dry-run] member image request ${member.id}:${frame.name}`, JSON.stringify({
          model: experiment.memberVideos.imagePack.model,
          input
        }, null, 2));
        memberEntry.referenceImages.push({
          name: frame.name,
          prompt,
          status: "dry-run",
          imageUrl: `dry-run://${member.id}-${frame.name}.${experiment.memberVideos.imagePack.outputFormat}`,
          localPath
        });
        continue;
      }

      try {
        console.log(`[member-image:${member.id}] generating ${frame.name}`);
        const result = await fal.subscribe(experiment.memberVideos.imagePack.model, {
          input,
          logs: true,
          onQueueUpdate: createStatusLogger(`[member-image:${member.id}:${frame.name}]`)
        });
        const imageUrl = getImageUrl(result);
        await downloadFile(imageUrl, localPath);
        memberEntry.referenceImages.push({
          name: frame.name,
          prompt,
          status: "succeeded",
          imageUrl,
          localPath,
          providerResult: result
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        memberEntry.referenceImages.push({
          name: frame.name,
          prompt,
          status: "failed",
          error: message
        });
        manifest.errors.push(`${member.id}:${frame.name}: ${message}`);
        console.error(`[member-image:${member.id}:${frame.name}] failed: ${message}`);
      }
    }

    const imageUrls = [
      member.imageUrl,
      ...memberEntry.referenceImages
        .map((frame) => frame.imageUrl)
        .filter((url): url is string => Boolean(url))
    ].slice(0, 9);
    const videoInput = {
      prompt: memberEntry.video.prompt,
      image_urls: imageUrls,
      audio_urls: audioUrl ? [audioUrl] : ["dry-run://lumina-lumora-hook.mp3"],
      resolution: experiment.memberVideos.referenceVideo.resolution,
      duration: experiment.memberVideos.referenceVideo.duration,
      aspect_ratio: experiment.memberVideos.referenceVideo.aspectRatio,
      generate_audio: experiment.memberVideos.referenceVideo.generateAudio,
      ...(memberConfig.seed === undefined ? {} : { seed: memberConfig.seed })
    };
    const videoPath = path.join(memberDir, `${member.id}-reference-video.mp4`);
    const finalPath = path.join(memberDir, "final.mp4");

    if (dryRun) {
      console.log(`[dry-run] member reference video request ${member.id}`, JSON.stringify({
        model: experiment.memberVideos.referenceVideo.model,
        input: videoInput
      }, null, 2));
      console.log(`[dry-run] member final output ${finalPath}`);
      memberEntry.video.status = "dry-run";
      memberEntry.video.videoUrl = `dry-run://${member.id}-reference-video.mp4`;
      memberEntry.video.localPath = videoPath;
      memberEntry.finalVideo = {
        status: "dry-run",
        localPath: finalPath,
        command: `ffmpeg -i ${videoPath} -c copy ${finalPath}`
      };
      continue;
    }

    try {
      console.log(`[member-video:${member.id}] generating ${member.displayName}`);
      const result = await fal.subscribe(experiment.memberVideos.referenceVideo.model, {
        input: videoInput,
        logs: true,
        onQueueUpdate: createStatusLogger(`[member-video:${member.id}]`)
      });
      const videoUrl = getVideoUrl(result);
      await downloadFile(videoUrl, videoPath);
      const args = ["-y", "-i", videoPath, "-c", "copy", finalPath];
      await execFileAsync("ffmpeg", args);
      memberEntry.video.status = "succeeded";
      memberEntry.video.videoUrl = videoUrl;
      memberEntry.video.localPath = videoPath;
      memberEntry.video.providerResult = result;
      memberEntry.finalVideo = {
        status: "succeeded",
        localPath: finalPath,
        command: `ffmpeg ${args.join(" ")}`
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      memberEntry.video.status = "failed";
      memberEntry.video.error = message;
      memberEntry.finalVideo = {
        status: "failed",
        localPath: finalPath,
        error: message
      };
      manifest.errors.push(`${member.id}: ${message}`);
      console.error(`[member-video:${member.id}] failed: ${message}`);
    }
  }
}

async function generateVideos(experiment: Experiment, manifest: Manifest, imageUrl: string, outputDir: string, dryRun: boolean): Promise<void> {
  const videosDir = path.join(outputDir, "videos");
  await mkdir(videosDir, { recursive: true });

  for (const [index, clip] of experiment.clips.entries()) {
    const videoEntry = manifest.videos[index];
    const input = {
      prompt: clip.prompt,
      image_url: imageUrl,
      resolution: experiment.video.resolution,
      duration: experiment.video.duration,
      aspect_ratio: experiment.video.aspectRatio,
      generate_audio: experiment.video.generateAudio,
      ...(clip.seed === undefined ? {} : { seed: clip.seed })
    };

    if (dryRun) {
      console.log("[dry-run] video request", JSON.stringify({ model: experiment.video.model, input }, null, 2));
      videoEntry.status = "dry-run";
      videoEntry.videoUrl = `dry-run://${clip.name}.mp4`;
      videoEntry.localPath = path.join(videosDir, `${String(index + 1).padStart(2, "0")}-${clip.name}.mp4`);
      continue;
    }

    try {
      console.log(`[video] generating ${clip.name}`);
      const result = await fal.subscribe(experiment.video.model, {
        input,
        logs: true,
        onQueueUpdate: createStatusLogger(`[video:${clip.name}]`)
      });
      const videoUrl = getVideoUrl(result);
      const localPath = path.join(videosDir, `${String(index + 1).padStart(2, "0")}-${clip.name}.mp4`);
      await downloadFile(videoUrl, localPath);

      videoEntry.status = "succeeded";
      videoEntry.videoUrl = videoUrl;
      videoEntry.localPath = localPath;
      videoEntry.providerResult = result;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      videoEntry.status = "failed";
      videoEntry.error = message;
      manifest.errors.push(`${clip.name}: ${message}`);
      console.error(`[video:${clip.name}] failed: ${message}`);
    }
  }
}

async function readManifest(manifestPath: string): Promise<Manifest> {
  return JSON.parse(await readFile(manifestPath, "utf8")) as Manifest;
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const experiment = await loadExperiment(options.configPath);
  configureFal();

  const runId = createRunId(experiment.name);
  const outputDir = options.manifestPath
    ? path.dirname(options.manifestPath)
    : path.join(repoRoot, "outputs", getExperimentSlug(experiment), runId);
  await mkdir(outputDir, { recursive: true });

  const manifest = options.manifestPath ? await readManifest(options.manifestPath) : createManifest(runId, options, experiment);

  if (options.command === "candidates") {
    await generateIdolCandidates(experiment, manifest, outputDir, options.dryRun);
    await saveManifest(manifest, outputDir);
    console.log(`Candidate manifest saved to ${path.join(outputDir, "manifest.json")}`);
    return;
  }

  if (options.command === "music") {
    await generateMusic(experiment, manifest, outputDir, options.dryRun);
    await saveManifest(manifest, outputDir);
    console.log(`Music manifest saved to ${path.join(outputDir, "manifest.json")}`);
    return;
  }

  if (options.command === "image-pack") {
    await generateImagePack(experiment, manifest, outputDir, options.dryRun);
    await saveManifest(manifest, outputDir);
    console.log(`Image pack manifest saved to ${path.join(outputDir, "manifest.json")}`);
    return;
  }

  if (options.command === "video" && experiment.referenceVideo) {
    await generateReferenceVideo(experiment, manifest, outputDir, options.dryRun);
    await saveManifest(manifest, outputDir);
    console.log(`Reference video manifest saved to ${path.join(outputDir, "manifest.json")}`);
    return;
  }

  if (options.command === "assemble") {
    await assembleVideo(experiment, manifest, outputDir, options.dryRun);
    await saveManifest(manifest, outputDir);
    console.log(`Assembly manifest saved to ${path.join(outputDir, "manifest.json")}`);
    return;
  }

  if (options.command === "members") {
    await generateMemberVideos(experiment, manifest, outputDir, options.dryRun);
    await saveManifest(manifest, outputDir);
    console.log(`Member video manifest saved to ${path.join(outputDir, "manifest.json")}`);
    return;
  }

  if (options.command === "image") {
    await generateBaseImage(experiment, manifest, outputDir, options.dryRun);
    await saveManifest(manifest, outputDir);
    console.log(`Manifest saved to ${path.join(outputDir, "manifest.json")}`);
    return;
  }

  if (options.command === "upscale") {
    await upscaleSelectedBaseImage(experiment, manifest, outputDir, options.dryRun);
    await saveManifest(manifest, outputDir);
    console.log(`Upscale manifest saved to ${path.join(outputDir, "manifest.json")}`);
    return;
  }

  if (options.command === "upscale-image-pack") {
    await upscaleImagePack(experiment, manifest, outputDir, options.dryRun);
    await saveManifest(manifest, outputDir);
    console.log(`Image pack upscale manifest saved to ${path.join(outputDir, "manifest.json")}`);
    return;
  }

  if (options.command === "generate" && experiment.music && experiment.idolCandidates && experiment.imagePack && experiment.referenceVideo) {
    await generateMusic(experiment, manifest, outputDir, options.dryRun);
    await generateIdolCandidates(experiment, manifest, outputDir, options.dryRun);

    if (!experiment.selectedIdol && !options.dryRun) {
      await saveManifest(manifest, outputDir);
      console.log("Generated music and idol candidates. Choose one candidate, add selectedIdol to the config, then run image-pack/video/assemble with --manifest.");
      console.log(`Candidate manifest saved to ${path.join(outputDir, "manifest.json")}`);
      return;
    }

    await generateImagePack(experiment, manifest, outputDir, options.dryRun);
    await generateReferenceVideo(experiment, manifest, outputDir, options.dryRun);
    await assembleVideo(experiment, manifest, outputDir, options.dryRun);
    await saveManifest(manifest, outputDir);
    console.log(`Manifest saved to ${path.join(outputDir, "manifest.json")}`);
    return;
  }

  const imageUrl = options.imageUrl
    ?? manifest.falImageUrl
    ?? manifest.baseImage.imageUrl
    ?? experiment.selectedBaseImage?.upscaledImageUrl
    ?? experiment.selectedBaseImage?.imageUrl
    ?? await generateBaseImage(experiment, manifest, outputDir, options.dryRun);

  if (!imageUrl) {
    throw new Error("No base image URL available. Run image generation first or pass --image-url.");
  }

  if (options.command === "videos" || options.command === "generate") {
    manifest.falImageUrl = imageUrl;
    await generateVideos(experiment, manifest, imageUrl, outputDir, options.dryRun);
  }

  await saveManifest(manifest, outputDir);
  console.log(`Manifest saved to ${path.join(outputDir, "manifest.json")}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
