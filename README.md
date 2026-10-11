# TrailMate AI 🌿

**Go outside. Get curious.** TrailMate creates short outdoor micro-adventure plans with a locally running open-weight language model. It is designed to make the screen the shortest part of the experience.

## Why this project?

TrailMate fits the Hacktoberfest Open-Source AI Challenge Week 1 theme, **Touch Grass**. The app uses an open-weight model through [Ollama](https://ollama.com/) to suggest real-world activities such as nature walks, birdwatching, gardening, and mindful outdoor breaks.

## Tech stack

- React + Vite frontend
- Node.js + Express API
- Ollama local inference
- Default model: `qwen2.5:3b` (you can change it with `OLLAMA_MODEL`)

## Run locally

Requirements: Node.js 18+ and [Ollama](https://ollama.com/download).

1. Install dependencies:

   ```bash
   npm install
   ```

2. Download the model:

   ```bash
   ollama pull qwen2.5:3b
   ```

3. Start Ollama if it is not already running. In a separate terminal, start the API:

   ```bash
   npm run server
   ```

4. In another terminal, start the frontend:

   ```bash
   npm run dev
   ```

5. Open the local URL printed by Vite (usually `http://localhost:5173`).

The Vite development server proxies `/api` to the API server in the local configuration below. If your setup does not proxy requests, add this to `vite.config.js`:

```js
server: {
  port: 5173,
  proxy: { "/api": "http://localhost:8787" }
}
```

## Configure another Ollama model

```bash
OLLAMA_MODEL=llama3.2:3b npm run server
```

Use a model available in your Ollama installation. Model requirements vary by computer.

## Open innovation

- The inference model can be inspected, replaced, and run on your own machine.
- The prompt is sent to the local Ollama service rather than a hosted commercial AI API.
- No account or app database is required for the MVP.
- The frontend and backend are open for people to modify and self-host.

The first model download requires internet. After the model is downloaded, inference can run locally; this app does not guarantee that every browser asset or future deployment works offline.

## Safety

AI-generated plans may contain errors. Treat them as inspiration, not authoritative trail, weather, wildlife, or medical advice. Check local conditions, use public paths, and respect nature.

## License

MIT — see `LICENSE`.
