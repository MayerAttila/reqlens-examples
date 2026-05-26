# Reqlens Examples

Local example apps for testing the Reqlens Node SDK, ingest API, and dashboard flow.

The examples package runs:

- Express API with Reqlens middleware
- Vite frontend that triggers demo requests

## Local Setup

Start the Reqlens API first:

```bash
cd ../reqlens-api
npm run dev
```

Then start the examples:

```bash
cd ../reqlens-examples
npm install
cp .env.example .env
npm run dev
```

Services:

- Example API: `http://localhost:4000`
- Example web: `http://localhost:5173`
- Reqlens API: `http://localhost:3001`
- Reqlens dashboard: `http://localhost:3000`

## Environment

```txt
REQLENS_API_KEY=dev_key
REQLENS_ENDPOINT=http://localhost:3001/ingest
PORT=4000
WEB_ORIGIN=http://localhost:5173
VITE_API_URL=http://localhost:4000
```

Use a real project API key from the dashboard, or use the dev key when `REQLENS_AUTO_CREATE_DEV_PROJECT=true` is enabled in the API.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Run Express API and Vite frontend together |
| `npm run dev:api` | Run only the Express API |
| `npm run dev:web` | Run only the Vite frontend |
| `npm run typecheck` | Typecheck example code |

## Demo Routes

The frontend triggers these routes:

| Method | Success | Slow | Error |
| --- | --- | --- | --- |
| `GET` | `/demo/get/success` | `/demo/get/slow` | `/demo/get/error` |
| `POST` | `/demo/post/success` | `/demo/post/slow` | `/demo/post/error` |
| `PUT` | `/demo/put/success` | `/demo/put/slow` | `/demo/put/error` |
| `PATCH` | `/demo/patch/success` | `/demo/patch/slow` | `/demo/patch/error` |
| `DELETE` | `/demo/delete/success` | `/demo/delete/slow` | `/demo/delete/error` |

Legacy test routes are also available:

- `GET /ok`
- `GET /users/:id`
- `POST /users`
- `PUT /users/:id`
- `PATCH /users/:id`
- `DELETE /users/:id`
- `POST /validation-error`
- `GET /error`
- `GET /slow`

## Expected Flow

1. Start `reqlens-api`.
2. Start `reqlens-web`.
3. Start `reqlens-examples`.
4. Trigger demo calls from `http://localhost:5173`.
5. Open the dashboard and inspect Requests, Problems, and Statistics.
