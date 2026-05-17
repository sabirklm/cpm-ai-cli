import axios from "axios";

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

  const response = await axios.post(
    "http://localhost:11434/api/generate",
    {
      model: "gemma3:4b",
      prompt,
      stream: false
    }
  );

  return response.data.response.trim();
}

export default generateCommand;
