import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export async function buildGraphFromText(text) {
  const response = await api.post("/ingest/build-graph", {
    text,
  });

  return response.data;
}

export async function getVisualGraph() {
  const response = await api.get("/graph/visual");
  return response.data;
}

export default api;
