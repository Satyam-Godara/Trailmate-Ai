import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8787;
const OLLAMA_URL = process.env.OLLAMA_URL || "http://127.0.0.1:11434";
const MODEL = process.env.OLLAMA_MODEL || "qwen2.5:3b";

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", async (_req, res) => {
  try {
    const r = await fetch(`${OLLAMA_URL}/api/tags`);
    if (!r.ok) throw new Error("Ollama is not responding");
    const data = await r.json();
    res.json({ ok: true, model: MODEL, installedModels: (data.models || []).map(m => m.name) });
  } catch {
    res.status(503).json({
      ok: false,
      model: MODEL,
      message: "Ollama was not found. Start Ollama and pull the configured model."
    });
  }
});

app.post("/api/plan", async (req, res) => {
  const { activity = "nature walk", minutes = 30, location = "a nearby park", interests = "" } = req.body || {};
  const prompt = `You are TrailMate, a practical outdoor activity guide. Create a safe, screen-light outdoor micro-adventure.
Activity: ${String(activity).slice(0, 100)}
Duration: ${Math.max(10, Math.min(180, Number(minutes) || 30))} minutes
Area: ${String(location).slice(0, 160)}
Interests: ${String(interests).slice(0, 300)}
Return: a short title, one-sentence goal, and 4 numbered steps with approximate minutes. Include one observation challenge that requires looking/listening carefully. Avoid claiming to identify species with certainty. Remind the user to stay on public paths, respect wildlife, and follow local safety guidance. Keep the phone-use instructions minimal. Plain text only.`;

  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: MODEL, prompt, stream: false, options: { temperature: 0.7 } })
    });
    if (!response.ok) throw new Error(`Ollama returned ${response.status}`);
    const data = await response.json();
    res.json({ plan: data.response?.trim() || "No plan was generated. Try again.", model: data.model || MODEL });
  } catch (error) {
    res.status(503).json({
      error: "Could not reach the local AI model.",
      details: "Make sure Ollama is running and the model is installed. See README.md.",
      technical: error.message
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`TrailMate API listening on http://localhost:${PORT}`);
  console.log(`Using Ollama model: ${MODEL}`);
});
