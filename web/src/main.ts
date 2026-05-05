import "./styles.css";

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
const app = document.querySelector<HTMLDivElement>("#app");
const requests = [
  { label: "Success", method: "GET", path: "/demo/get/success" },
  { label: "Slow", method: "GET", path: "/demo/get/slow" },
  { label: "Error", method: "GET", path: "/demo/get/error" },
  { body: { name: "Ada Lovelace" }, label: "Success", method: "POST", path: "/demo/post/success" },
  { body: { name: "Slow Ada" }, label: "Slow", method: "POST", path: "/demo/post/slow" },
  { body: { email: "bad-email" }, label: "Error", method: "POST", path: "/demo/post/error" },
  { body: { name: "Grace Hopper" }, label: "Success", method: "PUT", path: "/demo/put/success" },
  { body: { name: "Slow Grace" }, label: "Slow", method: "PUT", path: "/demo/put/slow" },
  { body: { name: "Conflict Grace" }, label: "Error", method: "PUT", path: "/demo/put/error" },
  { body: { role: "admin" }, label: "Success", method: "PATCH", path: "/demo/patch/success" },
  { body: { role: "slow-admin" }, label: "Slow", method: "PATCH", path: "/demo/patch/slow" },
  { body: { role: "" }, label: "Error", method: "PATCH", path: "/demo/patch/error" },
  { label: "Success", method: "DELETE", path: "/demo/delete/success" },
  { label: "Slow", method: "DELETE", path: "/demo/delete/slow" },
  { label: "Error", method: "DELETE", path: "/demo/delete/error" }
] satisfies Array<{
  body?: Record<string, string>;
  label: "Error" | "Slow" | "Success";
  method: "DELETE" | "GET" | "PATCH" | "POST" | "PUT";
  path: string;
}>;

if (app) {
  app.innerHTML = `
    <main class="mx-auto min-h-screen w-[min(960px,calc(100%-32px))] px-4 py-10 text-stone-950 md:py-16">
      <section class="max-w-3xl">
        <p class="font-sans text-xs font-black uppercase tracking-[0.12em] text-red-900">
          Reqlens example
        </p>
        <h1 class="mt-3 max-w-4xl font-serif text-5xl font-black leading-[0.92] tracking-[-0.06em] md:text-8xl">
          Click frontend buttons. Track backend API calls.
        </h1>
        <p class="mt-5 max-w-2xl text-lg leading-8 text-stone-700 md:text-xl">
          This Vite app calls a separate Express API. The Reqlens middleware is
          installed only on the backend, so each API response is reported to the
          ingest service.
        </p>
      </section>

      <section class="my-10 grid grid-cols-1 gap-3 md:grid-cols-3" aria-label="Test API routes">
        ${requests
          .map(
            (request) => `
              <button
                class="rounded-[18px] border-2 border-stone-950 bg-[#f9f4e5] p-5 font-sans text-sm font-black text-stone-950 shadow-[5px_5px_0_#1d1a16] transition hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[2px_2px_0_#1d1a16]"
                data-method="${request.method}"
                data-path="${request.path}"
              >
                <span class="block text-xs uppercase tracking-[0.12em] text-red-900">${request.label}</span>
                <span class="mt-1 block">${request.method}</span>
                <span class="mt-1 block break-all text-xs font-semibold text-stone-700">${request.path}</span>
              </button>
            `
          )
          .join("")}
      </section>

      <section class="grid gap-4 rounded-3xl border-2 border-stone-950 bg-white/55 p-6" aria-live="polite">
        <div>
          <span class="font-sans text-xs font-black uppercase tracking-[0.12em] text-red-900">
            Last request
          </span>
          <strong id="route" class="mt-1 block text-2xl">None yet</strong>
        </div>
        <pre id="output" class="min-h-44 overflow-auto rounded-2xl bg-stone-950 p-5 text-sm text-[#f9f4e5]">Click a route to start.</pre>
      </section>
    </main>
  `;
}

const output = document.querySelector<HTMLPreElement>("#output");
const routeLabel = document.querySelector<HTMLElement>("#route");
const buttons = document.querySelectorAll<HTMLButtonElement>("button[data-method][data-path]");

buttons.forEach((button) => {
  button.addEventListener("click", async () => {
    const method = button.dataset.method;
    const path = button.dataset.path;

    if (!method || !path || !output || !routeLabel) {
      return;
    }

    const request = requests.find(
      (item) => item.method === method && item.path === path
    );

    routeLabel.textContent = `${method} ${path}`;
    output.textContent = "Loading...";

    try {
      const startedAt = performance.now();
      const response = await fetch(`${apiUrl}${path}`, {
        body: request?.body ? JSON.stringify(request.body) : undefined,
        headers: request?.body ? { "content-type": "application/json" } : undefined,
        method
      });
      const body =
        response.status === 204
          ? null
          : await response.json();
      const durationMs = Math.round(performance.now() - startedAt);

      output.textContent = JSON.stringify(
        {
          apiUrl,
          method,
          path,
          status: response.status,
          durationMs,
          body
        },
        null,
        2
      );
    } catch (error) {
      output.textContent = JSON.stringify({ error: String(error) }, null, 2);
    }
  });
});
