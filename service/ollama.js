import axios from "axios";

async function generateCommand(userPrompt) {
  const { data } = await axios.get("http://localhost:11434/api/tags");
  const model = data.models?.[0]?.name;

  if (!model) throw new Error("No Ollama models found. Run 'ollama pull <model>' first.");

  const prompt = `Convert the following text into a shell command. Return only the command, no explanation, no markdown.\n\n${userPrompt}`;

  const response = await axios.post("http://localhost:11434/api/generate", {
    model,
    prompt,
    stream: false,
  });

  return response.data.response.trim();
}

export default generateCommand;
