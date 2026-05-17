import axios from "axios";
import getModels from "./models.js";

async function generateCommand(userPrompt) {
  const prompt = `
Convert the text into a shell command.

Rules:
- return only command
- no markdown
- no explanation
- output one line only

User:
${userPrompt}
`;

  const models = await getModels();

  // Use the first available model
  const model = models[0];

  if (!model) {
    throw new Error("No Ollama models found. Run 'ollama pull <model>' to install one.");
  }

  const response = await axios.post("http://localhost:11434/api/generate", {
    model,
    prompt,
    stream: false,
  });

  return response.data.response.trim();
}

export default generateCommand;
