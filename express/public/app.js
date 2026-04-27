const output = document.querySelector("#output");
const routeLabel = document.querySelector("#route");
const buttons = document.querySelectorAll("button[data-route]");

buttons.forEach((button) => {
  button.addEventListener("click", async () => {
    const route = button.dataset.route;
    routeLabel.textContent = route;
    output.textContent = "Loading...";

    try {
      const startedAt = performance.now();
      const response = await fetch(route);
      const body = await response.json();
      const durationMs = Math.round(performance.now() - startedAt);

      output.textContent = JSON.stringify(
        {
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
