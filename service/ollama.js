import axios from "axios";
import { platform } from "os";

const OS_MAP = { darwin: "macOS", linux: "Linux", win32: "Windows" };
const os = OS_MAP[platform()] ?? platform();
const shell = platform() === "win32" ? "PowerShell" : "bash";

// Commands that are never allowed to run
const BLOCKED = [
  /rm\s+-rf/,
  /rm\s+-fr/,
  /rmdir/,
  /mkfs/,
  /dd\s+if=/,
  /:\(\)\{.*\}/,        // fork bomb
  /chmod\s+-R\s+777/,
  /chown\s+-R/,
  /shutdown/,
  /reboot/,
  /halt/,
  /curl.*\|\s*sh/,      // curl pipe to shell
  /wget.*\|\s*sh/,
  /sudo\s+rm/,
  />\s*\/dev\//,        // writing to devices
];

export function isSafe(command) {
  return !BLOCKED.some((pattern) => pattern.test(command));
}

async function generateCommand(userPrompt) {
  const { data } = await axios.get("http://localhost:11434/api/tags");
  const model = data.models?.[0]?.name;

  if (!model) throw new Error("No Ollama models found. Run 'ollama pull <model>' first.");

  const prompt = `You are a development shell command assistant for ${os} using ${shell}.

Allowed topics: git, npm, yarn, node, file navigation, code editors, docker, build tools, package managers, and general software development tasks.

Rules:
- Output a single shell command only
- No markdown, no backticks, no code blocks, no explanation
- One line only
- Only generate commands related to software development
- Never generate destructive commands like rm -rf, shutdown, reboot, mkfs, dd, fork bombs, or piping curl/wget to shell
- If the request is not development related, respond with exactly: UNSAFE

User request: ${userPrompt}`;

  const response = await axios.post("http://localhost:11434/api/generate", {
    model,
    prompt,
    stream: false,
  });

  const raw = response.data.response.trim();

  // Strip accidental markdown the model may add
  const cleaned = raw
    .replace(/^```[\w]*\n?/m, "")
    .replace(/```$/m, "")
    .replace(/^`|`$/g, "")
    .split("\n")[0]
    .trim();

  return cleaned;
}

export default generateCommand;
