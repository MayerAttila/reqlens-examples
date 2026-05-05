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

app.use(express.json());

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

app.get("/demo/get/success", (_req, res) => {
  res.json({ method: "GET", result: "success" });
});

app.get("/demo/get/slow", async (_req, res) => {
  await delay();
  res.json({ method: "GET", result: "slow" });
});

app.get("/demo/get/error", (_req, res) => {
  res.status(500).json({ method: "GET", error: "demo get error" });
});

app.post("/demo/post/success", (req, res) => {
  res.status(201).json({ method: "POST", result: "success", body: req.body });
});

app.post("/demo/post/slow", async (req, res) => {
  await delay();
  res.status(201).json({ method: "POST", result: "slow", body: req.body });
});

app.post("/demo/post/error", (_req, res) => {
  res.status(422).json({ method: "POST", error: "demo post validation error" });
});

app.put("/demo/put/success", (req, res) => {
  res.json({ method: "PUT", result: "success", body: req.body });
});

app.put("/demo/put/slow", async (req, res) => {
  await delay();
  res.json({ method: "PUT", result: "slow", body: req.body });
});

app.put("/demo/put/error", (_req, res) => {
  res.status(409).json({ method: "PUT", error: "demo put conflict" });
});

app.patch("/demo/patch/success", (req, res) => {
  res.json({ method: "PATCH", result: "success", body: req.body });
});

app.patch("/demo/patch/slow", async (req, res) => {
  await delay();
  res.json({ method: "PATCH", result: "slow", body: req.body });
});

app.patch("/demo/patch/error", (_req, res) => {
  res.status(400).json({ method: "PATCH", error: "demo patch bad request" });
});

app.delete("/demo/delete/success", (_req, res) => {
  res.status(204).send();
});

app.delete("/demo/delete/slow", async (_req, res) => {
  await delay();
  res.status(204).send();
});

app.delete("/demo/delete/error", (_req, res) => {
  res.status(403).json({ method: "DELETE", error: "demo delete forbidden" });
});

app.get("/users/:id", (req, res) => {
  res.json({ id: req.params.id });
});

app.post("/users", (req, res) => {
  res.status(201).json({
    created: true,
    user: {
      id: "user_demo_123",
      name: req.body?.name ?? "Demo User"
    }
  });
});

app.put("/users/:id", (req, res) => {
  res.json({
    replaced: true,
    user: {
      id: req.params.id,
      name: req.body?.name ?? "Updated User"
    }
  });
});

app.patch("/users/:id", (req, res) => {
  res.json({
    patched: true,
    id: req.params.id,
    changes: req.body ?? {}
  });
});

app.delete("/users/:id", (req, res) => {
  res.status(204).send();
});

app.post("/validation-error", (_req, res) => {
  res.status(422).json({
    error: "validation failed",
    fields: {
      email: "Invalid email address"
    }
  });
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

function delay(ms = 750): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
