import axios from "axios";

async function getModels() {
  const response = await axios.get("http://localhost:11434/api/tags");
  return response.data.models.map((m) => m.name);
}

export default getModels;
