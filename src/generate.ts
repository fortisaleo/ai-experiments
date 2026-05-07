import "dotenv/config";

import { fal } from "@fal-ai/client";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const imageSizeSchema = z.union([
  z.enum(["square_hd", "square", "portrait_4_3", "portrait_16_9", "landscape_4_3", "landscape_16_9"]),
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
  command: "generate" | "image" | "videos";
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

function parseArgs(argv: string[]): CliOptions {
  const args = [...argv];
  let command: CliOptions["command"] = "generate";

  if (args[0] === "image" || args[0] === "videos" || args[0] === "generate") {
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
      video: experiment.video.model
    },
    baseImage: {
      prompt: experiment.baseImage.prompt,
      model: experiment.baseImage.model
    },
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

function getVideoUrl(result: unknown): string {
  const video = (result as { data?: { video?: { url?: string } }; video?: { url?: string } }).data?.video
    ?? (result as { video?: { url?: string } }).video;
  const url = video?.url;
  if (!url) {
    throw new Error("Video generation completed but no video URL was returned.");
  }
  return url;
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
  const outputDir = path.join(repoRoot, "outputs", getExperimentSlug(experiment), runId);
  await mkdir(outputDir, { recursive: true });

  const manifest = options.manifestPath ? await readManifest(options.manifestPath) : createManifest(runId, options, experiment);

  if (options.command === "image") {
    await generateBaseImage(experiment, manifest, outputDir, options.dryRun);
    await saveManifest(manifest, outputDir);
    console.log(`Manifest saved to ${path.join(outputDir, "manifest.json")}`);
    return;
  }

  const imageUrl = options.imageUrl
    ?? manifest.falImageUrl
    ?? manifest.baseImage.imageUrl
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
