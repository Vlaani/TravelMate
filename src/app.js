const express = require("express");
const path = require("path");

const hotelsRouter = require("../routers/hotelsRouter");

function createApp() {
  const app = express();
  app.use(express.json());

  app.use(express.static(path.join(__dirname, "..", "public")));

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
  });

  app.get("/api", (req, res) => {
    res.json({
      message: "Сервер подбора отелей работает. Используйте POST /hotels/search"
    });
  });

  app.use("/hotels", hotelsRouter);

  return app;
}

module.exports = createApp;

