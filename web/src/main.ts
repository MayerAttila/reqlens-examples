import "./styles.css";

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
const app = document.querySelector<HTMLDivElement>("#app");
const routes = ["/ok", "/users/42", "/slow", "/error"];

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

      <section class="my-10 grid grid-cols-1 gap-3 md:grid-cols-4" aria-label="Test API routes">
        ${routes
          .map(
            (route) => `
              <button
                class="rounded-[18px] border-2 border-stone-950 bg-[#f9f4e5] p-5 font-sans text-sm font-black text-stone-950 shadow-[5px_5px_0_#1d1a16] transition hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[2px_2px_0_#1d1a16]"
                data-route="${route}"
              >
                GET ${route}
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
const buttons = document.querySelectorAll<HTMLButtonElement>("button[data-route]");

buttons.forEach((button) => {
  button.addEventListener("click", async () => {
    const route = button.dataset.route;

    if (!route || !output || !routeLabel) {
      return;
    }

    routeLabel.textContent = route;
    output.textContent = "Loading...";

    try {
      const startedAt = performance.now();
      const response = await fetch(`${apiUrl}${route}`);
      const body = await response.json();
      const durationMs = Math.round(performance.now() - startedAt);

      output.textContent = JSON.stringify(
        {
          apiUrl,
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
