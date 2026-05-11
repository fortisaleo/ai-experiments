import "dotenv/config";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

type CliOptions = {
  agentPath: string;
  inputPath: string;
  outputPath?: string;
  model: string;
  dryRun: boolean;
  imageUrls: string[];
};

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    agentPath: "",
    inputPath: "",
    model: "deepseek/deepseek-v4-pro",
    dryRun: false,
    imageUrls: []
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--agent") {
      options.agentPath = argv[++index] ?? "";
    } else if (arg === "--input") {
      options.inputPath = argv[++index] ?? "";
    } else if (arg === "--output") {
      options.outputPath = argv[++index] ?? "";
    } else if (arg === "--model") {
      options.model = argv[++index] ?? options.model;
    } else if (arg === "--image-url") {
      options.imageUrls.push(argv[++index] ?? "");
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!options.agentPath) {
    throw new Error("Missing --agent <path>.");
  }
  if (!options.inputPath) {
    throw new Error("Missing --input <path>.");
  }

  return options;
}

function resolveRepoPath(filePath: string): string {
  return path.isAbsolute(filePath) ? filePath : path.join(repoRoot, filePath);
}

function defaultOutputPath(inputPath: string, agentPath: string): string {
  const inputBase = path.basename(inputPath).replace(/\.[^.]+$/, "");
  const agentBase = path.basename(agentPath).replace(/\.[^.]+$/, "");
  return path.join(path.dirname(inputPath), "audits", `${inputBase}-${agentBase}.md`);
}

async function callGateway(model: string, systemPrompt: string, userPrompt: string, imageUrls: string[]): Promise<string> {
  const key = process.env.AI_GATEWAY_API_KEY;
  if (!key) {
    throw new Error("Missing AI_GATEWAY_API_KEY in the environment. Add it to .env before running audits.");
  }
  const userContent = imageUrls.length > 0
    ? [
      { type: "text", text: userPrompt },
      ...imageUrls.map((imageUrl) => ({
        type: "image_url",
        image_url: { url: imageUrl }
      }))
    ]
    : userPrompt;

  const response = await fetch("https://ai-gateway.vercel.sh/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent }
      ]
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`AI Gateway audit failed: ${response.status} ${response.statusText}\n${body}`);
  }

  const payload = await response.json() as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("AI Gateway audit completed without a message content.");
  }
  return content;
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const agentPath = resolveRepoPath(options.agentPath);
  const inputPath = resolveRepoPath(options.inputPath);
  const outputPath = resolveRepoPath(options.outputPath ?? defaultOutputPath(options.inputPath, options.agentPath));

  const [agentPrompt, inputBrief] = await Promise.all([
    readFile(agentPath, "utf8"),
    readFile(inputPath, "utf8")
  ]);

  if (options.dryRun) {
    console.log("[dry-run] audit request", JSON.stringify({
      endpoint: "https://ai-gateway.vercel.sh/v1/chat/completions",
      model: options.model,
      agentPath,
      inputPath,
      outputPath,
      imageUrls: options.imageUrls
    }, null, 2));
    return;
  }

  const audit = await callGateway(options.model, agentPrompt, inputBrief, options.imageUrls);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, audit);
  console.log(`Audit saved to ${outputPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
