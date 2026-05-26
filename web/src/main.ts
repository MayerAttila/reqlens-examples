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

const methodColors: Record<string, string> = {
  DELETE: "method-delete",
  GET: "method-get",
  PATCH: "method-patch",
  POST: "method-post",
  PUT: "method-put"
};

const statusTone = (status?: number) => {
  if (!status) {
    return "status-muted";
  }

  if (status >= 400) {
    return "status-error";
  }

  return "status-success";
};

if (app) {
  app.innerHTML = `
    <main class="example-shell">
      <header class="topbar">
        <a class="brand" href="/" aria-label="Reqlens example home">
          <span class="brand-mark">R</span>
          <span>Reqlens</span>
        </a>
        <div class="environment-pill">
          <span class="live-dot"></span>
          Example project
        </div>
      </header>

      <section class="workspace-grid">
        <section class="panel route-panel" aria-label="Test API routes">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">Request controls</p>
              <h2>Demo calls</h2>
            </div>
            <span class="count-pill">${requests.length} routes</span>
          </div>

          <div class="route-grid">
            ${requests
              .map(
                (request) => `
                  <button
                    class="route-card ${request.label.toLowerCase()}"
                    data-method="${request.method}"
                    data-path="${request.path}"
                  >
                    <span class="route-topline">
                      <span class="method-pill ${methodColors[request.method]}">${request.method}</span>
                      <span class="state-pill">${request.label}</span>
                    </span>
                    <span class="route-path">${request.path}</span>
                  </button>
                `
              )
              .join("")}
          </div>
        </section>

        <aside class="panel response-panel" aria-live="polite">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">Last response</p>
              <h2 id="route">None yet</h2>
            </div>
            <span id="status" class="status-badge status-muted">Idle</span>
          </div>

          <dl class="result-stats">
            <div>
              <dt>Latency</dt>
              <dd id="duration">-</dd>
            </div>
            <div>
              <dt>Method</dt>
              <dd id="method">-</dd>
            </div>
          </dl>

          <pre id="output" class="response-output">Select a route to send a request.</pre>
        </aside>
      </section>
    </main>
  `;
}

const output = document.querySelector<HTMLPreElement>("#output");
const routeLabel = document.querySelector<HTMLElement>("#route");
const statusLabel = document.querySelector<HTMLElement>("#status");
const durationLabel = document.querySelector<HTMLElement>("#duration");
const methodLabel = document.querySelector<HTMLElement>("#method");
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

    buttons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active", "is-loading");
    routeLabel.textContent = `${method} ${path}`;
    if (methodLabel) {
      methodLabel.textContent = method;
    }
    if (durationLabel) {
      durationLabel.textContent = "-";
    }
    if (statusLabel) {
      statusLabel.className = "status-badge status-muted";
      statusLabel.textContent = "Sending";
    }
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

      if (durationLabel) {
        durationLabel.textContent = `${durationMs} ms`;
      }
      if (statusLabel) {
        statusLabel.className = `status-badge ${statusTone(response.status)}`;
        statusLabel.textContent = String(response.status);
      }
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
      if (statusLabel) {
        statusLabel.className = "status-badge status-error";
        statusLabel.textContent = "Failed";
      }
      if (durationLabel) {
        durationLabel.textContent = "-";
      }
      output.textContent = JSON.stringify({ error: String(error) }, null, 2);
    } finally {
      button.classList.remove("is-loading");
    }
  });
});
