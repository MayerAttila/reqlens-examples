# reqlens-examples

Example apps for testing Reqlens packages.

Run the Express API and Vite frontend together:

```bash
npm install
npm run dev
```

Open `http://localhost:5173` to use the test frontend.

Services:

- Express API: `http://localhost:4000`
- Vite frontend: `http://localhost:5173`

Routes:

- `GET /demo/get/success`
- `GET /demo/get/slow`
- `GET /demo/get/error`
- `POST /demo/post/success`
- `POST /demo/post/slow`
- `POST /demo/post/error`
- `PUT /demo/put/success`
- `PUT /demo/put/slow`
- `PUT /demo/put/error`
- `PATCH /demo/patch/success`
- `PATCH /demo/patch/slow`
- `PATCH /demo/patch/error`
- `DELETE /demo/delete/success`
- `DELETE /demo/delete/slow`
- `DELETE /demo/delete/error`

Legacy routes:

- `GET /ok`
- `GET /users/:id`
- `POST /users`
- `PUT /users/:id`
- `PATCH /users/:id`
- `DELETE /users/:id`
- `POST /validation-error`
- `GET /error`
- `GET /slow`
