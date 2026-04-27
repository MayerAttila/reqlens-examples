import express from "express";
import { reqlens } from "@reqlens/node-sdk";

const app = express();

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
  console.log(`Reqlens Express demo listening on http://localhost:${port}`);
});
