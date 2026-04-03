const createApp = require("./src/app");

const PORT = 3000;

const app = createApp();

app.listen(PORT, () => {
  console.log(`Hotel search API started on http://localhost:${PORT}`);
});
