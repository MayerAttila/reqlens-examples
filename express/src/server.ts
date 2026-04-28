import cors from "cors";
import express from "express";
import { existsSync, readFileSync } from "node:fs";
import { reqlens } from "@reqlens/node-sdk";

loadDotEnv();

const app = express();

app.use(
  cors({
    origin: process.env.WEB_ORIGIN ?? "http://localhost:5173"
  })
);

app.use(
  reqlens({
    apiKey: process.env.REQLENS_API_KEY ?? "dev_key",
    endpoint: process.env.REQLENS_ENDPOINT ?? "http://localhost:3001/ingest",
    onError: (error) => {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[reqlens]", error);
      }
    }
  })
);

app.get("/ok", (_req, res) => {
  res.json({ ok: true });
});

app.get("/users/:id", (req, res) => {
  res.json({ id: req.params.id });
});

app.get("/error", (_req, res) => {
  res.status(500).json({ error: "demo error" });
});

app.get("/slow", async (_req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 750));
  res.json({ slow: true });
});

const port = Number(process.env.PORT ?? 4000);

app.listen(port, () => {
  console.log(`Reqlens Express API listening on http://localhost:${port}`);
});

function loadDotEnv(path = ".env"): void {
  if (!existsSync(path)) {
    return;
  }

  const lines = readFileSync(path, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, "");

    process.env[key] ??= value;
  }
}
